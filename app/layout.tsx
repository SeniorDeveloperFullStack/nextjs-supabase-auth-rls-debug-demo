import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Supabase Auth/RLS Debug Demo",
  description: "Next.js + Supabase proof project for auth, RLS, and query debugging."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
