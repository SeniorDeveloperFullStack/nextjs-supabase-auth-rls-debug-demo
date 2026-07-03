"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(mode: "sign-in" | "sign-up") {
    setMessage(null);

    if (!email || !password) {
      setMessage("Enter an email and password first.");
      return;
    }

    const supabase = createClient();
    const authCall =
      mode === "sign-in"
        ? supabase.auth.signInWithPassword({ email, password })
        : supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/auth/callback`
            }
          });

    const { error } = await authCall;

    if (error) {
      setMessage(error.message);
      return;
    }

    startTransition(() => {
      router.refresh();
      router.push("/dashboard");
    });
  }

  return (
    <div className="space-y-5">
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-slate-700">Email</span>
        <input
          className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-slate-950 shadow-sm outline-none ring-rose-300 transition placeholder:text-slate-400 focus:border-rose-300 focus:ring-4"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="studio@example.com"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-slate-700">Password</span>
        <input
          className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-slate-950 shadow-sm outline-none ring-rose-300 transition placeholder:text-slate-400 focus:border-rose-300 focus:ring-4"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Minimum 6 characters"
        />
      </label>

      {message ? (
        <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {message}
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          disabled={isPending}
          onClick={() => handleSubmit("sign-in")}
          className="rounded-lg bg-slate-950 px-4 py-3 font-semibold text-white shadow-lg shadow-slate-950/10 transition hover:bg-slate-800 disabled:opacity-60"
        >
          Sign in
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={() => handleSubmit("sign-up")}
          className="rounded-lg border border-stone-300 bg-white px-4 py-3 font-semibold text-slate-900 shadow-sm transition hover:border-rose-300 hover:bg-rose-50 disabled:opacity-60"
        >
          Create account
        </button>
      </div>
    </div>
  );
}