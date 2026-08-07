"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useStaffAuth } from "../../lib/useStaffAuth";
import LoginForm from "../components/LoginForm";

const emptyItem = { name: "", description: "", price: "", category: "General" };

export default function AdminPage() {
  const { loading, user, role, signIn, signOut } = useStaffAuth();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyItem);
  const [editingId, setEditingId] = useState(null);
  const [settings, setSettings] = useState(null);

  const loadItems = async () => {
    const { data } = await supabase
      .from("menu_items")
      .select("*")
      .order("category")
      .order("sort_order");
    setItems(data || []);
  };

  useEffect(() => {
    if (!user || role !== "admin") return;
    loadItems();
    supabase
      .from("restaurant_settings")
      .select("*")
      .eq("id", 1)
      .single()
      .then(({ data }) => setSettings(data));
  }, [user, role]);

  const saveItem = async (e) => {
    e.preventDefault();
    const payload = { ...form, price: parseFloat(form.price) };
    if (editingId) {
      await supabase.from("menu_items").update(payload).eq("id", editingId);
    } else {
      await supabase.from("menu_items").insert(payload);
    }
    setForm(emptyItem);
    setEditingId(null);
    loadItems();
  };

  const editItem = (item) => {
    setForm({
      name: item.name,
      description: item.description || "",
      price: item.price,
      category: item.category,
    });
    setEditingId(item.id);
  };

  const deleteItem = async (id) => {
    if (!confirm("Delete this item?")) return;
    await supabase.from("menu_items").delete().eq("id", id);
    loadItems();
  };

  const toggleAvailable = async (item) => {
    await supabase
      .from("menu_items")
      .update({ available: !item.available })
      .eq("id", item.id);
    loadItems();
  };

  const saveSettings = async (e) => {
    e.preventDefault();
    await supabase.from("restaurant_settings").update(settings).eq("id", 1);
    alert("Payment details saved.");
  };

  if (loading) return <p className="p-8 bg-ink text-cream min-h-screen">Loading...</p>;
  if (!user) return <LoginForm label="Admin login" onSubmit={signIn} />;
  if (role !== "admin")
    return (
      <p className="p-8 bg-ink text-cream min-h-screen">
        This account doesn't have admin access.{" "}
        <button onClick={signOut} className="underline text-gold">
          Sign out
        </button>
      </p>
    );

  const inputClass =
    "bg-ink border border-gold/30 text-cream placeholder-cream/40 rounded-lg px-3 py-2 focus:outline-none focus:border-gold";

  return (
    <main className="min-h-screen p-4 max-w-2xl mx-auto bg-ink">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Unveil" className="w-9" />
          <h1 className="text-2xl font-display text-gold tracking-wide">Admin</h1>
        </div>
        <button onClick={signOut} className="text-sm text-cream/40 underline hover:text-cream/70">
          Sign out
        </button>
      </div>

      <form onSubmit={saveItem} className="bg-charcoal border border-gold/15 rounded-xl p-4 flex flex-col gap-2 mb-6">
        <h2 className="font-display text-gold tracking-wide">{editingId ? "Edit item" : "Add menu item"}</h2>
        <input
          className={inputClass}
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          className={inputClass}
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <div className="flex gap-2">
          <input
            className={`${inputClass} flex-1`}
            placeholder="Price"
            type="number"
            step="0.01"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />
          <input
            className={`${inputClass} flex-1`}
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
          />
        </div>
        <div className="flex gap-2">
          <button className="bg-gold text-ink rounded-lg px-4 py-2 font-medium hover:bg-gold-light transition">
            {editingId ? "Save changes" : "Add item"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setForm(emptyItem);
                setEditingId(null);
              }}
              className="text-cream/50 underline hover:text-cream/80"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="flex flex-col gap-2 mb-8">
        {items.map((item) => (
          <div key={item.id} className="bg-charcoal border border-gold/15 rounded-xl p-3 flex justify-between items-center">
            <div>
              <p className="font-medium text-cream">
                {item.name}{" "}
                {!item.available && <span className="text-xs text-wine-bright">(hidden)</span>}
              </p>
              <p className="text-xs text-cream/40">{item.category} — ₦{Number(item.price).toLocaleString()}</p>
            </div>
            <div className="flex gap-2 text-sm">
              <button onClick={() => toggleAvailable(item)} className="underline text-gold hover:text-gold-light">
                {item.available ? "Hide" : "Show"}
              </button>
              <button onClick={() => editItem(item)} className="underline text-cream/70 hover:text-cream">
                Edit
              </button>
              <button onClick={() => deleteItem(item.id)} className="underline text-wine-bright hover:text-red-400">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {settings && (
        <form onSubmit={saveSettings} className="bg-charcoal border border-gold/15 rounded-xl p-4 flex flex-col gap-2">
          <h2 className="font-display text-gold tracking-wide">Payment details (shown on printed receipts)</h2>
          <input
            className={inputClass}
            placeholder="Restaurant name"
            value={settings.restaurant_name || ""}
            onChange={(e) => setSettings({ ...settings, restaurant_name: e.target.value })}
          />
          <input
            className={inputClass}
            placeholder="Bank name"
            value={settings.bank_name || ""}
            onChange={(e) => setSettings({ ...settings, bank_name: e.target.value })}
          />
          <input
            className={inputClass}
            placeholder="Account name"
            value={settings.account_name || ""}
            onChange={(e) => setSettings({ ...settings, account_name: e.target.value })}
          />
        <input
            className={inputClass}
            placeholder="Restaurant name"
            value={settings.restaurant_name || ""}
            onChange={(e) => setSettings({ ...settings, restaurant_name: e.target.value })}
          />
          <input
            className={inputClass}
            placeholder="Business address"
            value={settings.address || ""}
            onChange={(e) => setSettings({ ...settings, address: e.target.value })}
          />
          <input
            className={inputClass}
            placeholder="Extra note (e.g. 'Please pay before leaving')"
            value={settings.extra_note || ""}
            onChange={(e) => setSettings({ ...settings, extra_note: e.target.value })}
          />
          <button className="bg-gold text-ink rounded-lg px-4 py-2 self-start font-medium hover:bg-gold-light transition">
            Save payment details
          </button>
        </form>
      )}
    </main>
  );
}