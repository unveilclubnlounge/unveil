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
        backgroundImage: "linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.75)), url(/hero.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white/95 rounded-xl p-6 shadow-lg w-full max-w-sm flex flex-col gap-3"
      >
        <img src="/logo.png" alt="Unveil" className="w-20 mx-auto mb-1" />
        <h1 className="text-xl font-display text-clay text-center mb-2">{label}</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-ink/20 rounded-lg px-3 py-2"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-ink/20 rounded-lg px-3 py-2"
          required
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          disabled={busy}
          className="bg-clay text-cream rounded-lg py-2 mt-2 disabled:opacity-50"
        >
          {busy ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}