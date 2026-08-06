import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-3xl font-display text-clay">Lounge Ordering System</h1>
      <p className="text-ink/70 max-w-sm">
        Customers should scan the QR code straight to{" "}
        <code className="bg-ink/10 px-1 rounded">/menu</code>. Staff and admin
        use the links below.
      </p>
      <div className="flex gap-4 mt-4">
        <Link href="/menu" className="px-4 py-2 bg-clay text-cream rounded-lg">
          Customer Menu
        </Link>
        <Link href="/staff" className="px-4 py-2 bg-moss text-cream rounded-lg">
          Staff Dashboard
        </Link>
        <Link href="/admin" className="px-4 py-2 bg-gold text-ink rounded-lg">
          Admin
        </Link>
      </div>
    </main>
  );
}