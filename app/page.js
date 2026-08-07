import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-8 text-center bg-ink">
      <img src="/logo.png" alt="Unveil Club 'n' Bar" className="w-40 drop-shadow-[0_0_25px_rgba(201,164,76,0.35)]" />
      <div>
        <h1 className="text-4xl font-display text-gold tracking-wide">
          Unveil Club &apos;n&apos; Bar
        </h1>
        <div className="unveil-divider w-64 mx-auto my-3">
          <span className="dot" />
        </div>
        <p className="text-cream/60 max-w-sm">
          Customers should scan the QR code straight to{" "}
          <code className="bg-gold/10 text-gold px-1 rounded">/menu</code>.
          Staff and admin use the links below.
        </p>
      </div>
      <div className="flex gap-4 mt-2 flex-wrap justify-center">
        <Link
          href="/menu"
          className="px-5 py-2.5 bg-gold text-ink font-medium rounded-lg hover:bg-gold-light transition"
        >
          Customer Menu
        </Link>
        <Link
          href="/staff"
          className="px-5 py-2.5 border border-gold text-gold rounded-lg hover:bg-gold/10 transition"
        >
          Staff Dashboard
        </Link>
        <Link
          href="/admin"
          className="px-5 py-2.5 border border-wine-bright text-wine-bright rounded-lg hover:bg-wine-bright/10 transition"
        >
          Admin
        </Link>
      </div>
    </main>
  );
}