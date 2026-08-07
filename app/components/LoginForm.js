"use client";

import { useState } from "react";

export default function LoginForm({ onSubmit, label }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const { error } = await onSubmit(email, password);
    if (error) setError(error.message);
    setBusy(false);
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center p-8 bg-ink"
      style={{
        backgroundImage:
          "linear-gradient(rgba(13,11,9,0.85), rgba(13,11,9,0.9)), url(/hero.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-charcoal border border-gold/30 rounded-xl p-8 shadow-[0_0_40px_rgba(0,0,0,0.6)] w-full max-w-sm flex flex-col gap-3"
      >
        <img src="/logo.png" alt="Unveil" className="w-24 mx-auto mb-1" />
        <h1 className="text-xl font-display text-gold text-center mb-2 tracking-wide">
          {label}
        </h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-ink border border-gold/30 text-cream placeholder-cream/40 rounded-lg px-3 py-2 focus:outline-none focus:border-gold"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-ink border border-gold/30 text-cream placeholder-cream/40 rounded-lg px-3 py-2 focus:outline-none focus:border-gold"
          required
        />
        {error && <p className="text-sm text-wine-bright">{error}</p>}
        <button
          disabled={busy}
          className="bg-gold text-ink font-medium rounded-lg py-2 mt-2 disabled:opacity-50 hover:bg-gold-light transition"
        >
          {busy ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}