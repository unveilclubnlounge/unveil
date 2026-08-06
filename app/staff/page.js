"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useStaffAuth } from "../../lib/useStaffAuth";
import LoginForm from "../components/LoginForm";
import Receipt from "../components/Receipt";

export default function StaffPage() {
  const { loading, user, role, signIn, signOut } = useStaffAuth();
  const [orders, setOrders] = useState([]);
  const [itemsByOrder, setItemsByOrder] = useState({});
  const [settings, setSettings] = useState(null);
  const [printing, setPrinting] = useState(null); // order id being printed

  useEffect(() => {
    if (!user) return;

    const loadOrders = async () => {
      const { data: orderData } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      setOrders(orderData || []);

      const { data: itemData } = await supabase
        .from("order_items")
        .select("*")
        .in("order_id", (orderData || []).map((o) => o.id));
      const grouped = {};
      (itemData || []).forEach((it) => {
        grouped[it.order_id] = [...(grouped[it.order_id] || []), it];
      });
      setItemsByOrder(grouped);
    };

    const loadSettings = async () => {
      const { data } = await supabase
        .from("restaurant_settings")
        .select("*")
        .eq("id", 1)
        .single();
      setSettings(data);
    };

    loadOrders();
    loadSettings();

    const channel = supabase
      .channel("orders-live")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        (payload) => {
          setOrders((prev) => [payload.new, ...prev]);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "orders" },
        (payload) => {
          setOrders((prev) =>
            prev.map((o) => (o.id === payload.new.id ? payload.new : o))
          );
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "order_items" },
        (payload) => {
          setItemsByOrder((prev) => ({
            ...prev,
            [payload.new.order_id]: [
              ...(prev[payload.new.order_id] || []),
              payload.new,
            ],
          }));
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [user]);

  const updateStatus = async (id, status) => {
    await supabase.from("orders").update({ status }).eq("id", id);
  };

  const handlePrint = async (order) => {
    setPrinting(order.id);
    setTimeout(async () => {
      window.print();
      await supabase.from("orders").update({ printed: true }).eq("id", order.id);
      setPrinting(null);
    }, 150);
  };

  if (loading) return <p className="p-8">Loading...</p>;
  if (!user) return <LoginForm label="Staff login" onSubmit={signIn} />;

  const printingOrder = orders.find((o) => o.id === printing);

  return (
    <main className="min-h-screen p-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4 no-print">
        <h1 className="text-2xl font-display text-clay">Live Orders</h1>
        <button onClick={signOut} className="text-sm text-ink/50 underline">
          Sign out
        </button>
      </div>

      <div className="flex flex-col gap-3 no-print">
        {orders.length === 0 && (
          <p className="text-ink/50">No orders yet — they'll appear here in real time.</p>
        )}
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">
                  Table {order.table_number}{" "}
                  {order.customer_name && `— ${order.customer_name}`}
                </p>
                <p className="text-xs text-ink/50">
                  {new Date(order.created_at).toLocaleTimeString()}
                </p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-moss/10 text-moss capitalize">
                {order.status}
              </span>
            </div>

            <ul className="text-sm mt-2 text-ink/80">
              {(itemsByOrder[order.id] || []).map((it) => (
                <li key={it.id}>
                  {it.quantity}x {it.name}
                </li>
              ))}
            </ul>

            <p className="font-display text-clay mt-2">
              ₦{Number(order.total).toLocaleString()}
            </p>

            <div className="flex gap-2 mt-3 flex-wrap">
              <button
                onClick={() => handlePrint(order)}
                className="px-3 py-1.5 bg-ink text-cream rounded-lg text-sm"
              >
                {order.printed ? "Reprint" : "Print receipt"}
              </button>
              <select
                value={order.status}
                onChange={(e) => updateStatus(order.id, e.target.value)}
                className="px-2 py-1.5 border border-ink/20 rounded-lg text-sm"
              >
                <option value="new">New</option>
                <option value="preparing">Preparing</option>
                <option value="served">Served</option>
                <option value="paid">Paid</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {printingOrder && (
        <Receipt
          order={printingOrder}
          items={itemsByOrder[printingOrder.id] || []}
          settings={settings}
        />
      )}
    </main>
  );
}