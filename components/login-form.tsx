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
    <div className="space-y-4">
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-300">Email</span>
        <input
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none ring-cyan-400 transition focus:ring-2"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-300">Password</span>
        <input
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none ring-cyan-400 transition focus:ring-2"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Minimum 6 characters"
        />
      </label>

      {message ? (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          {message}
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          disabled={isPending}
          onClick={() => handleSubmit("sign-in")}
          className="rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-60"
        >
          Sign in
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={() => handleSubmit("sign-up")}
          className="rounded-xl border border-slate-600 px-4 py-3 font-semibold text-slate-200 transition hover:bg-slate-800 disabled:opacity-60"
        >
          Sign up
        </button>
      </div>
    </div>
  );
}
