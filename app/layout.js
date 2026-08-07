import "./globals.css";

export const metadata = {
  title: "Unveil Club 'n' Bar",
  description: "Good Music. Great People. Unforgettable Experience.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-ink text-cream font-body">{children}</body>
    </html>
  );
}