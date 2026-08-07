import "./globals.css";

export const metadata = {
  title: "Unveil Club 'n' Bar",
  description: "Scan, order, enjoy.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-ink text-cream font-body">{children}</body>
    </html>
  );
}