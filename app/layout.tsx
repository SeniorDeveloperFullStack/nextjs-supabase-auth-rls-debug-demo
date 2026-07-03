import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FashionOps Studio",
  description: "A polished Next.js + Supabase Auth/RLS SaaS dashboard for fashion studio operations."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}