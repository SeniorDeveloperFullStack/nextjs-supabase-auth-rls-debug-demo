import Image from "next/image";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "@/components/login-form";

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <section className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl overflow-hidden rounded-[1.75rem] border border-white/70 bg-white shadow-2xl shadow-slate-950/15 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="relative hidden min-h-[44rem] overflow-hidden bg-slate-950 text-white lg:block">
          <Image
            src="/images/auth-hero.jpg"
            alt="Fashion studio campaign planning visual"
            fill
            priority
            sizes="(min-width: 1024px) 56vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/15 via-slate-950/20 to-slate-950/80" />
          <div className="absolute inset-x-8 top-8 flex items-center justify-between">
            <p className="text-sm font-bold uppercase tracking-[0.25em]">FashionOps Studio</p>
            <span className="rounded-full border border-white/35 bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md">
              Secure SaaS workspace
            </span>
          </div>
          <div className="absolute bottom-8 left-8 right-8">
            <div className="max-w-lg rounded-2xl border border-white/20 bg-white/15 p-6 shadow-2xl backdrop-blur-md">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-100">Creative operations</p>
              <h1 className="mt-4 text-5xl font-bold leading-tight">
                Run bookings, campaigns, and client work from one studio desk.
              </h1>
              <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
                <div className="rounded-xl bg-white/15 p-3">
                  <p className="text-2xl font-bold">24</p>
                  <p className="text-white/75">deliverables</p>
                </div>
                <div className="rounded-xl bg-white/15 p-3">
                  <p className="text-2xl font-bold">9</p>
                  <p className="text-white/75">bookings</p>
                </div>
                <div className="rounded-xl bg-white/15 p-3">
                  <p className="text-2xl font-bold">98%</p>
                  <p className="text-white/75">secure</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center bg-[radial-gradient(circle_at_top_right,rgba(244,63,94,0.12),transparent_24rem)] px-6 py-10 sm:px-10 lg:px-14">
          <div className="w-full max-w-md">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-rose-600">FashionOps Studio</p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-950">Welcome to your studio</h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Manage campaigns, bookings, and creative workflows in one secure studio dashboard.
            </p>
            <div className="mt-8 rounded-2xl border border-stone-200 bg-white/90 p-5 shadow-xl shadow-slate-950/10 backdrop-blur sm:p-6">
              <LoginForm />
            </div>
            <p className="mt-5 text-xs leading-6 text-slate-500">
              Supabase Auth protects the workspace; RLS keeps every project and studio task scoped to its owner.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}