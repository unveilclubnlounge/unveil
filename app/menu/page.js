"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function MenuPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState({});
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
      setLoading(false);
    };
    load();

    // Live-refresh if admin adds, edits, hides, or removes an item while
    // a customer already has this page open.
    const channel = supabase
      .channel("menu-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "menu_items" },
        () => load()
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
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
      <main className="min-h-screen flex flex-col items-center justify-center p-8 text-center gap-3 bg-ink">
        <img src="/logo.png" alt="Unveil" className="w-20 mb-2" />
        <h1 className="text-2xl font-display text-gold">Order sent!</h1>
        <p className="text-cream/60">
          Table {tableNumber} — your order is on its way to the bar.
        </p>
        <button
          onClick={() => setConfirmed(null)}
          className="mt-4 px-5 py-2.5 bg-gold text-ink rounded-lg font-medium hover:bg-gold-light transition"
        >
          Order more
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-40 bg-ink">
      <header className="p-6 text-center border-b border-gold/20">
        <img src="/logo.png" alt="Unveil Club 'n' Bar" className="w-40 mx-auto mb-3" />
        <p className="text-gold/80 text-sm tracking-wide mb-2">
          Good Music... Great People.... Unforgettable Experience....
        </p>
        <h1 className="text-3xl font-display text-gold tracking-wide">Menu</h1>
        <p className="text-cream/50 text-sm mt-1">Tap items to add to your order</p>
      </header>

      <div className="p-4 max-w-xl mx-auto flex flex-col gap-2">
        <input
          className="bg-charcoal border border-gold/30 text-cream placeholder-cream/40 rounded-lg px-3 py-2 focus:outline-none focus:border-gold"
          placeholder="Table number *"
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
        />
        <input
          className="bg-charcoal border border-gold/30 text-cream placeholder-cream/40 rounded-lg px-3 py-2 focus:outline-none focus:border-gold"
          placeholder="Your name (optional)"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
      </div>

      {loading && (
        <div className="max-w-xl mx-auto px-4 mt-8 flex flex-col gap-6 animate-pulse">
          {[0, 1].map((section) => (
            <div key={section}>
              <div className="h-4 w-28 bg-gold/20 rounded mb-3 mx-auto" />
              <div className="flex flex-col gap-2">
                {[0, 1, 2].map((row) => (
                  <div
                    key={row}
                    className="bg-charcoal border border-gold/15 rounded-xl p-3 h-16"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && categories.map((cat) => (
        <section key={cat} className="max-w-xl mx-auto px-4 mt-8">
          <div className="unveil-divider mb-3">
            <span className="dot" />
            <h2 className="text-lg font-display text-gold tracking-wide whitespace-nowrap px-1">
              {cat}
            </h2>
            <span className="dot" />
          </div>
          <div className="flex flex-col gap-2">
            {items
              .filter((i) => i.category === cat)
              .map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-charcoal border border-gold/15 rounded-xl p-3"
                >
                  <div>
                    <p className="font-medium text-cream">{item.name}</p>
                    {item.description && (
                      <p className="text-xs text-cream/45">{item.description}</p>
                    )}
                    <p className="text-sm text-gold mt-1">
                      ₦{Number(item.price).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {cart[item.id] ? (
                      <>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="w-7 h-7 rounded-full bg-cream/10 text-cream"
                        >
                          −
                        </button>
                        <span className="w-4 text-center text-cream">{cart[item.id]}</span>
                      </>
                    ) : null}
                    <button
                      onClick={() => addToCart(item.id)}
                      className="w-7 h-7 rounded-full bg-gold text-ink font-medium hover:bg-gold-light transition"
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
        <div className="fixed bottom-0 left-0 right-0 bg-charcoal border-t border-gold/30 p-4">
          <div className="max-w-xl mx-auto flex items-center justify-between">
            <div>
              <p className="text-sm text-cream/50">
                {cartLines.reduce((n, l) => n + l.qty, 0)} item(s)
              </p>
              <p className="font-display text-lg text-gold">
                ₦{total.toLocaleString()}
              </p>
            </div>
            <button
              disabled={placing}
              onClick={placeOrder}
              className="px-5 py-2.5 bg-wine-bright text-cream rounded-lg font-medium disabled:opacity-50 hover:bg-wine transition"
            >
              {placing ? "Placing..." : "Place order"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}