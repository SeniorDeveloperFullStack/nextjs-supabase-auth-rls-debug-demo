import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen px-6 py-12">
      <section className="mx-auto max-w-4xl rounded-3xl border border-slate-700 bg-slate-900/70 p-8 shadow-xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
          Debug Demo
        </p>
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-white">
          Next.js + Supabase Auth/RLS Launch-Readiness Demo
        </h1>
        <p className="mb-6 max-w-2xl text-lg leading-8 text-slate-300">
          A focused proof project for debugging existing Supabase apps: cookie-based auth,
          user-owned records, protected dashboard routes, and Row Level Security policies that
          prevent users from reading or changing each other&apos;s data.
        </p>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-700 bg-slate-950 p-4">
            <h2 className="font-semibold text-white">Auth Flow</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Login/signup, callback handling, route protection, and sign-out.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-700 bg-slate-950 p-4">
            <h2 className="font-semibold text-white">RLS Policies</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Select, insert, update, and delete policies scoped to auth.uid().
            </p>
          </div>
          <div className="rounded-2xl border border-slate-700 bg-slate-950 p-4">
            <h2 className="font-semibold text-white">Query Debugging</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Correct filters, ownership checks, error display, and stable server actions.
            </p>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <Link
            href={user ? "/dashboard" : "/login"}
            className="rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            {user ? "Open dashboard" : "Try login"}
          </Link>
          <a
            href="https://supabase.com/docs/guides/database/postgres/row-level-security"
            className="rounded-xl border border-slate-600 px-5 py-3 font-semibold text-slate-200 transition hover:bg-slate-800"
            target="_blank"
            rel="noreferrer"
          >
            RLS reference
          </a>
        </div>
      </section>
    </main>
  );
}
