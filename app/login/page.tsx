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
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <section className="w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900 p-8 shadow-xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
          Supabase Auth
        </p>
        <h1 className="mb-2 text-3xl font-bold text-white">Sign in or create an account</h1>
        <p className="mb-6 leading-7 text-slate-400">
          Use any email/password after running the SQL setup in Supabase.
        </p>
        <LoginForm />
      </section>
    </main>
  );
}
