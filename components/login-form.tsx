"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowRight, UserPlus } from "lucide-react";
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
        <span className="mb-2 block text-sm font-semibold text-[#2d241a]">Email</span>
        <input
          className="w-full rounded-lg border border-[#e7d8c2] bg-[#fffaf0] px-4 py-3.5 text-[#111827] shadow-sm outline-none ring-[#f4a3a8]/40 transition placeholder:text-[#9a8b77] focus:border-[#d9b979] focus:bg-white focus:ring-4"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="studio@example.com"
          autoComplete="email"
          required
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-[#2d241a]">Password</span>
        <input
          className="w-full rounded-lg border border-[#e7d8c2] bg-[#fffaf0] px-4 py-3.5 text-[#111827] shadow-sm outline-none ring-[#f4a3a8]/40 transition placeholder:text-[#9a8b77] focus:border-[#d9b979] focus:bg-white focus:ring-4"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Minimum 6 characters"
          autoComplete="current-password"
          minLength={6}
          required
        />
      </label>

      {message ? (
        <div role="alert" className="flex gap-3 rounded-lg border border-[#f4a3a8] bg-[#fff1f2] px-4 py-3 text-sm text-[#8f1d2c] shadow-sm">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p>{message}</p>
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          disabled={isPending}
          onClick={() => handleSubmit("sign-in")}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#07111f] px-5 py-3.5 font-semibold text-[#fffaf0] shadow-lg shadow-[#07111f]/20 transition hover:bg-[#162033] disabled:opacity-60"
        >
          {isPending ? (
            "Working..."
          ) : (
            <>
              <span>Sign in</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={() => handleSubmit("sign-up")}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#d9b979] bg-[#f8ead0] px-5 py-3.5 font-semibold text-[#2d241a] shadow-sm transition hover:bg-[#f3dcae] disabled:opacity-60"
        >
          {isPending ? (
            "Working..."
          ) : (
            <>
              <UserPlus className="h-4 w-4" aria-hidden="true" />
              <span>Create account</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}