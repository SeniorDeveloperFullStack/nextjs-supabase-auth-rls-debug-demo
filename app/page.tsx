import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <section className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl items-center gap-8 rounded-lg border border-white/80 bg-white/80 p-6 shadow-2xl shadow-slate-900/10 backdrop-blur lg:grid-cols-[0.95fr_1.05fr] lg:p-10">
        <div>
          <p className="text-sm font-bold uppercase text-rose-600">FashionOps Studio</p>
          <h1 className="mt-5 max-w-3xl text-5xl font-bold leading-tight text-slate-950 sm:text-6xl">
            A protected SaaS dashboard for fashion studio operations.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Built as a real-world Next.js and Supabase portfolio project with Auth, protected routes, user-owned records, and PostgreSQL Row Level Security behind every project and task.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={user ? "/dashboard" : "/login"}
              className="rounded-lg bg-slate-950 px-5 py-3 text-center font-semibold text-white shadow-lg shadow-slate-950/10 transition hover:bg-slate-800"
            >
              {user ? "Open dashboard" : "Try the dashboard"}
            </Link>
            <a
              href="https://supabase.com/docs/guides/database/postgres/row-level-security"
              className="rounded-lg border border-stone-300 bg-white px-5 py-3 text-center font-semibold text-slate-900 transition hover:border-rose-300 hover:bg-rose-50"
              target="_blank"
              rel="noreferrer"
            >
              RLS reference
            </a>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-slate-950 p-5 text-white shadow-xl shadow-slate-900/20 sm:col-span-2">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-slate-300">Live workspace</p>
                <h2 className="mt-1 text-2xl font-bold">Spring Capsule Launch</h2>
              </div>
              <span className="rounded-full bg-emerald-300 px-3 py-1 text-xs font-bold text-emerald-950">Protected</span>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-white/10 p-4">
                <p className="text-3xl font-bold">12</p>
                <p className="text-sm text-slate-300">campaign tasks</p>
              </div>
              <div className="rounded-lg bg-white/10 p-4">
                <p className="text-3xl font-bold">4</p>
                <p className="text-sm text-slate-300">client profiles</p>
              </div>
              <div className="rounded-lg bg-white/10 p-4">
                <p className="text-3xl font-bold">86%</p>
                <p className="text-sm text-slate-300">ready</p>
              </div>
            </div>
          </div>
          <div className="h-56 rounded-lg bg-[linear-gradient(135deg,#fb7185,#f8fafc_52%,#14b8a6)] shadow-lg" />
          <div className="h-56 rounded-lg bg-[linear-gradient(135deg,#0f172a,#e2e8f0_58%,#f59e0b)] shadow-lg" />
        </div>
      </section>
    </main>
  );
}