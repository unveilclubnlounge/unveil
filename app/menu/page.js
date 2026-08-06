"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function MenuPage() {
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState({}); // { itemId: qty }
  const [tableNumber, setTableNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [placing, setPlacing] = useState(false);
  const [confirmed, setConfirmed] = useState(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("menu_items")
        .select("*")
        .eq("available", true)
        .order("category", { ascending: true })
        .order("sort_order", { ascending: true });
      setItems(data || []);
    };
    load();
  }, []);

  const categories = [...new Set(items.map((i) => i.category))];

  const addToCart = (id) =>
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const removeFromCart = (id) =>
    setCart((c) => {
      const next = { ...c };
      if (next[id] > 1) next[id] -= 1;
      else delete next[id];
      return next;
    });

  const cartLines = Object.entries(cart).map(([id, qty]) => {
    const item = items.find((i) => i.id === id);
    return { item, qty };
  });
  const total = cartLines.reduce((sum, l) => sum + l.item.price * l.qty, 0);

  const placeOrder = async () => {
    if (!tableNumber.trim()) {
      alert("Please enter your table number.");
      return;
    }
    if (cartLines.length === 0) return;
    setPlacing(true);

    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        table_number: tableNumber.trim(),
        customer_name: customerName.trim() || null,
        total,
      })
      .select()
      .single();

    if (error || !order) {
      alert("Something went wrong placing your order. Please try again.");
      setPlacing(false);
      return;
    }

    const orderItems = cartLines.map((l) => ({
      order_id: order.id,
      menu_item_id: l.item.id,
      name: l.item.name,
      price: l.item.price,
      quantity: l.qty,
    }));
    await supabase.from("order_items").insert(orderItems);

    setConfirmed(order.id);
    setCart({});
    setPlacing(false);
  };

  if (confirmed) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-8 text-center gap-3">
        <h1 className="text-2xl font-display text-moss">Order sent!</h1>
        <p className="text-ink/70">
          Table {tableNumber} — your order is on its way to the kitchen.
        </p>
        <button
          onClick={() => setConfirmed(null)}
          className="mt-4 px-4 py-2 bg-clay text-cream rounded-lg"
        >
          Order more
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-40">
      <header className="p-6 text-center border-b border-ink/10">
        <img src="/logo.png" alt="Unveil" className="w-16 mx-auto mb-2" />
        <h1 className="text-3xl font-display text-clay">Menu</h1>
        <p className="text-ink/60 text-sm mt-1">Tap items to add to your order</p>
      </header>

      <div className="p-4 max-w-xl mx-auto flex flex-col gap-2">
        <input
          className="border border-ink/20 rounded-lg px-3 py-2 bg-white"
          placeholder="Table number *"
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
        />
        <input
          className="border border-ink/20 rounded-lg px-3 py-2 bg-white"
          placeholder="Your name (optional)"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
      </div>

      {categories.map((cat) => (
        <section key={cat} className="max-w-xl mx-auto px-4 mt-6">
          <h2 className="text-lg font-display text-moss mb-2">{cat}</h2>
          <div className="flex flex-col gap-2">
            {items
              .filter((i) => i.category === cat)
              .map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-white rounded-xl p-3 shadow-sm"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    {item.description && (
                      <p className="text-xs text-ink/50">{item.description}</p>
                    )}
                    <p className="text-sm text-clay mt-1">
                      ₦{Number(item.price).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {cart[item.id] ? (
                      <>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="w-7 h-7 rounded-full bg-ink/10"
                        >
                          −
                        </button>
                        <span className="w-4 text-center">{cart[item.id]}</span>
                      </>
                    ) : null}
                    <button
                      onClick={() => addToCart(item.id)}
                      className="w-7 h-7 rounded-full bg-clay text-cream"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </section>
      ))}

      {cartLines.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-ink text-cream p-4">
          <div className="max-w-xl mx-auto flex items-center justify-between">
            <div>
              <p className="text-sm text-cream/70">
                {cartLines.reduce((n, l) => n + l.qty, 0)} item(s)
              </p>
              <p className="font-display text-lg">
                ₦{total.toLocaleString()}
              </p>
            </div>
            <button
              disabled={placing}
              onClick={placeOrder}
              className="px-5 py-2 bg-gold text-ink rounded-lg font-medium disabled:opacity-50"
            >
              {placing ? "Placing..." : "Place order"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}