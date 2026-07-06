import Image from "next/image";
import { redirect } from "next/navigation";
import {
  CalendarCheck,
  CheckCircle2,
  ClipboardList,
  Images,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  UsersRound
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "@/components/login-form";

const heroBadges = ["Private studio data", "Campaign-ready workflows", "Model booking clarity"];

const previewTrustCards = [
  {
    title: "Supabase Auth",
    detail: "Secure studio access",
    Icon: KeyRound
  },
  {
    title: "RLS Protected Data",
    detail: "Owner-scoped records",
    Icon: ShieldCheck
  }
];

const bottomFeatures = [
  { label: "Auth", Icon: KeyRound },
  { label: "RLS Security", Icon: LockKeyhole },
  { label: "Campaigns", Icon: Images },
  { label: "Bookings", Icon: CalendarCheck },
  { label: "Tasks", Icon: ClipboardList },
  { label: "Models", Icon: UsersRound }
];

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070b13] text-[#fffaf0]">
      <Image
        src="/images/studio-bg.jpg"
        alt="Fashion studio campaign workspace"
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-32"
      />
      <div className="absolute inset-0 bg-[linear-gradient(116deg,rgba(7,11,19,0.98)_0%,rgba(7,11,19,0.9)_48%,rgba(45,36,26,0.72)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-[linear-gradient(0deg,rgba(7,11,19,1),rgba(7,11,19,0))]" />

      <section className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-[#d9b979]/50 bg-[#fffaf0]/10 text-[#f8dca8] backdrop-blur">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
            </div>
            <p className="truncate text-sm font-semibold uppercase text-[#f8dca8]">FashionOps Studio</p>
          </div>
          <span className="hidden rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-[#fffaf0]/80 backdrop-blur sm:inline-flex">
            Secure fashion SaaS workspace
          </span>
        </header>

        <div className="grid flex-1 gap-10 py-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:gap-14 lg:py-12">
          <section className="flex flex-col justify-center lg:min-h-[38rem]">
            <p className="inline-flex w-fit rounded-full border border-[#d9b979]/40 bg-[#d9b979]/12 px-4 py-2 text-sm font-semibold text-[#f8dca8] backdrop-blur">
              Premium creative operations
            </p>
            <h1 className="mt-7 text-5xl font-bold leading-[1.02] text-[#fffaf0] sm:text-6xl lg:text-7xl">
              FashionOps Studio
            </h1>
            <h2 className="mt-5 text-3xl font-semibold text-[#f4a3a8] sm:text-4xl">
              Creative operations dashboard
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-[#f7ead7]">
              Manage campaigns, bookings, model profiles, and studio workflows from one secure Supabase workspace.
            </p>

            <div className="mt-8 flex max-w-xl flex-wrap gap-3">
              {heroBadges.map((badge) => (
                <span key={badge} className="rounded-full border border-white/12 bg-white/9 px-4 py-2 text-sm font-semibold text-[#fffaf0]/86 backdrop-blur">
                  {badge}
                </span>
              ))}
            </div>
          </section>

          <section className="mx-auto flex w-full max-w-[40rem] flex-col gap-5 lg:mx-0 lg:justify-self-end">
            <div className="rounded-lg border border-white/12 bg-[#0c111d]/88 p-4 shadow-2xl shadow-black/35 backdrop-blur sm:p-5">
              <div className="overflow-hidden rounded-lg border border-white/10 bg-[#111827]">
                <div className="relative h-[22rem] sm:h-[25rem] lg:h-[28rem]">
                  <Image
                    src="/images/auth-hero.jpg"
                    alt="Fashion campaign dashboard preview"
                    fill
                    priority
                    sizes="(min-width: 1024px) 40rem, 100vw"
                    className="object-cover opacity-88"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,11,19,0.82),rgba(7,11,19,0.22)_55%,rgba(7,11,19,0.74))]" />

                  <div className="absolute inset-x-4 bottom-4 rounded-lg border border-white/15 bg-[#070b13]/78 p-4 backdrop-blur sm:inset-x-5 sm:bottom-5 sm:p-5">
                    <p className="text-sm text-[#f8dca8]">Featured campaign</p>
                    <h3 className="mt-1 text-2xl font-bold text-white sm:text-3xl">Spring Capsule Launch</h3>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {previewTrustCards.map((feature) => (
                  <PreviewFeature key={feature.title} title={feature.title} detail={feature.detail} icon={feature.Icon} />
                ))}
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <PreviewMetric value="12" label="campaign tasks" />
                <PreviewMetric value="4" label="client profiles" />
                <PreviewMetric value="9" label="booking holds" />
              </div>
            </div>

            <div className="mx-auto w-full max-w-[30rem] rounded-lg border border-[#e8d9bf] bg-[#fffaf0] p-5 text-[#111827] shadow-2xl shadow-black/25 sm:p-7">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-[#9a6b33]">Studio access</p>
                  <h3 className="mt-1 text-2xl font-bold">Sign in or create an account</h3>
                </div>
                <CheckCircle2 className="h-6 w-6 shrink-0 text-[#10b981]" aria-hidden="true" />
              </div>
              <LoginForm />
              <p className="mt-5 text-xs leading-6 text-[#756855]">
                Supabase Auth protects access; Row Level Security keeps each studio workspace scoped to its owner.
              </p>
            </div>
          </section>
        </div>

        <div className="grid gap-2 border-t border-white/10 pt-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {bottomFeatures.map((feature) => {
            const Icon = feature.Icon;

            return (
              <div key={feature.label} className="flex min-w-0 items-center gap-3 rounded-lg border border-white/10 bg-white/8 px-3 py-3 text-sm font-semibold text-[#fffaf0]/88 backdrop-blur">
                <Icon className="h-4 w-4 shrink-0 text-[#d9b979]" aria-hidden="true" />
                <span className="truncate">{feature.label}</span>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}

function PreviewFeature({ title, detail, icon: Icon }: { title: string; detail: string; icon: LucideIcon }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-[#fffaf0]/10 p-4 text-[#fffaf0]">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#fffaf0] text-[#b8893d]">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="font-semibold">{title}</p>
        <p className="mt-1 text-sm text-[#f7ead7]/70">{detail}</p>
      </div>
    </div>
  );
}

function PreviewMetric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/8 p-4">
      <p className="text-3xl font-bold text-[#fffaf0]">{value}</p>
      <p className="mt-1 text-sm text-[#f7ead7]/70">{label}</p>
    </div>
  );
}