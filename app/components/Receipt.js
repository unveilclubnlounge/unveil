"use client";

export default function Receipt({ order, items, settings }) {
  if (!order) return null;

  const createdAt = new Date(order.created_at).toLocaleString();

  return (
    <div id="receipt" className="bg-white p-4 w-[300px] mx-auto text-ink font-mono text-sm">
     <div className="text-center mb-2">
        <p className="font-bold text-base">{settings?.restaurant_name || "Lounge"}</p>
        <p className="text-xs">{settings?.address || "Nos 8 Agbo Akpmolafe, Unity Estate, Abule Odun, Lagos, Nigeria."}</p>
        <p className="text-xs">{createdAt}</p>
      </div>
      <hr className="border-dashed border-ink my-2" />
      <p>Table: {order.table_number}</p>
      {order.customer_name && <p>Name: {order.customer_name}</p>}
      <p>Order #: {order.id.slice(0, 8).toUpperCase()}</p>
      <hr className="border-dashed border-ink my-2" />
      {items.map((it) => (
        <div key={it.id} className="flex justify-between">
          <span>
            {it.quantity}x {it.name}
          </span>
          <span>₦{(it.price * it.quantity).toLocaleString()}</span>
        </div>
      ))}
      <hr className="border-dashed border-ink my-2" />
      <div className="flex justify-between font-bold">
        <span>TOTAL</span>
        <span>₦{Number(order.total).toLocaleString()}</span>
      </div>
      <hr className="border-dashed border-ink my-2" />
      <div className="text-xs">
        <p className="font-bold">Pay by transfer:</p>
        <p>Bank: {settings?.bank_name || "—"}</p>
        <p>Account name: {settings?.account_name || "—"}</p>
        <p>Account number: {settings?.account_number || "—"}</p>
        {settings?.extra_note && <p className="mt-1">{settings.extra_note}</p>}
      </div>
      <p className="text-center text-xs mt-3">Thank you!</p>
    </div>
  );
}