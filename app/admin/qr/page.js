"use client";

import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function QrPage() {
  const [url, setUrl] = useState("");

  useEffect(() => {
    const origin = window.location.origin;
    const isPreview =
      origin.includes("github.dev") ||
      origin.includes("localhost") ||
      origin.includes("127.0.0.1");
    setUrl(isPreview ? "" : `${origin}/menu`);
  }, []);

  const download = () => {
    const canvas = document.getElementById("table-qr");
    const link = document.createElement("a");
    link.download = "unveil-table-qr.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const isPreviewUrl =
    url.includes("github.dev") || url.includes("localhost") || url.includes("127.0.0.1");

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 p-8 bg-ink">
      <img src="/logo.png" alt="Unveil" className="w-20" />
      <h1 className="text-2xl font-display text-gold tracking-wide">Table QR Code</h1>

      <input
        className="bg-charcoal border border-gold/30 text-cream placeholder-cream/40 rounded-lg px-3 py-2 w-full max-w-sm focus:outline-none focus:border-gold"
        placeholder="https://your-live-site.vercel.app/menu"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      {isPreviewUrl && (
        <p className="text-wine-bright text-sm max-w-sm text-center">
          This looks like a Codespaces or local preview link — phones can't
          scan into it. Paste your live Vercel URL above instead (e.g.{" "}
          <span className="text-gold">https://unveil.vercel.app/menu</span>).
        </p>
      )}

      {url && !isPreviewUrl && (
        <>
          <div className="bg-cream p-4 rounded-xl">
            <QRCodeCanvas id="table-qr" value={url} size={240} />
          </div>
          <button
            onClick={download}
            className="px-5 py-2.5 bg-gold text-ink rounded-lg font-medium hover:bg-gold-light transition"
          >
            Download QR (PNG)
          </button>
        </>
      )}

      <p className="text-cream/40 text-sm text-center max-w-sm">
        Print the downloaded PNG and place it on each table. One code works
        for every table — customers type their table number when ordering.
      </p>
    </main>
  );
}