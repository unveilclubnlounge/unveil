import "./globals.css";

export const metadata = {
  title: "Lounge Menu",
  description: "Scan, order, enjoy.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-cream text-ink font-body">{children}</body>
    </html>
  );
}