"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

export default function QrPage() {
  const [url, setUrl] = useState(
    typeof window !== "undefined" ? `${window.location.origin}/menu` : ""
  );

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-2xl font-display text-clay">Table QR Code</h1>
      <input
        className="border border-ink/20 rounded-lg px-3 py-2 w-full max-w-sm"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <div className="bg-white p-4 rounded-xl">
        <QRCodeSVG value={url} size={240} />
      </div>
      <p className="text-ink/50 text-sm">Print this and place it on each table.</p>
    </main>
  );
}