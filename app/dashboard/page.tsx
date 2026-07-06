import Image from "next/image";
import { redirect } from "next/navigation";
import {
  CalendarCheck,
  CheckCircle2,
  ClipboardList,
  Images,
  Layers3,
  Plus,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserRound
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Project, Task } from "@/lib/types";
import { addProject, addTask, deleteTask, signOut, toggleTask } from "./actions";

const campaignImages = ["/images/campaign-1.jpg", "/images/campaign-2.jpg", "/images/campaign-3.jpg"];

const clientProfiles = [
  {
    name: "Mara Ellis",
    role: "Creative director",
    focus: "Runway styling",
    image: "/images/model-1.jpg",
    status: "Available"
  },
  {
    name: "Noor Atelier",
    role: "Client account",
    focus: "Capsule launch",
    image: "/images/model-2.jpg",
    status: "Reviewing"
  },
  {
    name: "Kai Moreno",
    role: "Booking lead",
    focus: "Model shortlist",
    image: "/images/model-3.jpg",
    status: "Booked"
  }
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(value));
}

type DashboardPageProps = {
  searchParams?: Promise<{ taskError?: string | string[] }>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams;
  const taskValidationError = Array.isArray(params?.taskError) ? params.taskError[0] : params?.taskError;
  const supabase = await createClient();
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { data: projects, error: projectError } = await supabase
    .from("projects")
    .select("id, owner_id, name, created_at")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: true })
    .returns<Project[]>();

  const { data: tasks, error: taskError } = await supabase
    .from("tasks")
    .select("id, project_id, owner_id, title, status, created_at")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false })
    .returns<Task[]>();

  const projectList = projects ?? [];
  const taskList = tasks ?? [];
  const openTasks = taskList.filter((task) => task.status === "open");
  const completedTasks = taskList.filter((task) => task.status === "done");
  const completionRate = taskList.length ? Math.round((completedTasks.length / taskList.length) * 100) : 0;
  const projectNames = Object.fromEntries(projectList.map((project) => [project.id, project.name]));
  const recentActivity = [...taskList, ...projectList]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 6);

  return (
    <main className="min-h-screen bg-[#070b13] px-4 py-5 text-[#111827] sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl">
        <header className="mb-5 flex flex-col justify-between gap-4 rounded-lg border border-white/10 bg-[#0c111d]/92 p-5 text-[#fffaf0] shadow-2xl shadow-black/20 backdrop-blur md:flex-row md:items-center">
          <div className="flex items-start gap-4">
            <div className="grid h-11 w-11 place-items-center rounded-lg border border-[#d9b979]/50 bg-[#fffaf0]/10 text-[#f8dca8]">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase text-[#d9b979]">FashionOps Studio</p>
              <h1 className="mt-1 text-3xl font-bold sm:text-4xl">Creative operations dashboard</h1>
              <p className="mt-2 text-sm text-[#f7ead7]/72">
                Signed in as <span className="font-semibold text-[#fffaf0]">{user.email}</span>
              </p>
            </div>
          </div>
          <form action={signOut}>
            <button className="rounded-lg border border-[#d9b979]/50 bg-[#fffaf0] px-5 py-3 text-sm font-semibold text-[#111827] shadow-sm transition hover:bg-[#f3dcae]">
              Sign out
            </button>
          </form>
        </header>

        {(projectError || taskError) && (
          <div className="mb-5 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-900">
            <p className="font-semibold">Database error</p>
            <p>{projectError?.message ?? taskError?.message}</p>
            <p className="mt-2 text-red-800">Check table grants, RLS policies, and Supabase environment values.</p>
          </div>
        )}

        {taskValidationError ? (
          <div className="mb-5 rounded-lg border border-[#d9b979] bg-[#fff7e6] p-4 text-sm text-[#6b441d]">
            <p className="font-semibold">Could not add task</p>
            <p>{taskValidationError}</p>
          </div>
        ) : null}

        <section className="relative mb-6 min-h-[32rem] overflow-hidden rounded-lg border border-white/10 bg-[#111827] text-[#fffaf0] shadow-2xl shadow-black/25">
          <Image
            src="/images/studio-bg.jpg"
            alt="Fashion studio campaign banner"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-82"
          />
          <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(7,11,19,0.96)_0%,rgba(7,11,19,0.72)_46%,rgba(7,11,19,0.28)_100%)]" />
          <div className="relative z-10 grid min-h-[32rem] gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_27rem] lg:p-10">
            <div className="flex max-w-3xl flex-col justify-end pb-2">
              <p className="inline-flex w-fit rounded-full border border-[#d9b979]/40 bg-[#d9b979]/12 px-4 py-2 text-sm font-semibold text-[#f8dca8] backdrop-blur">
                Featured campaign
              </p>
              <h2 className="mt-5 text-5xl font-bold leading-[1.02] sm:text-6xl">Spring Capsule Launch</h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[#f7ead7]">
                Track campaign milestones, model bookings, client deliverables, and studio tasks from one protected Supabase workspace.
              </p>
              <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
                <HeroStat label="Campaigns" value={projectList.length.toString()} />
                <HeroStat label="Open tasks" value={openTasks.length.toString()} />
                <HeroStat label="Completed" value={`${completionRate}%`} />
              </div>
            </div>

            <div className="self-end rounded-lg border border-white/15 bg-[#fffaf0]/12 p-5 shadow-2xl shadow-black/20 backdrop-blur-md">
              <p className="text-sm font-semibold text-[#f8dca8]">Studio readiness</p>
              <div className="mt-3 flex items-end justify-between gap-4">
                <p className="text-6xl font-bold">{completionRate}%</p>
                <ShieldCheck className="mb-2 h-9 w-9 text-[#10b981]" aria-hidden="true" />
              </div>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/20">
                <div className="h-full rounded-full bg-[#10b981]" style={{ width: `${completionRate}%` }} />
              </div>
              <p className="mt-4 text-sm text-[#f7ead7]/75">
                {completedTasks.length} of {taskList.length} client deliverables completed
              </p>
              <div className="mt-5 grid grid-cols-3 gap-2">
                {campaignImages.map((image, index) => (
                  <div key={image} className="relative h-24 overflow-hidden rounded-lg border border-white/10 bg-white/10">
                    <Image src={image} alt={`Campaign preview ${index + 1}`} fill sizes="9rem" className="object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Active Campaigns" value={projectList.length.toString()} detail="Creative projects" accent="bg-[#d9b979]" icon={Images} />
          <MetricCard label="Pending Bookings" value={clientProfiles.filter((profile) => profile.status !== "Booked").length.toString()} detail="Model and client holds" accent="bg-[#f4a3a8]" icon={CalendarCheck} />
          <MetricCard label="Open Tasks" value={openTasks.length.toString()} detail="Studio tasks" accent="bg-[#07111f]" icon={ClipboardList} />
          <MetricCard label="Completed Work" value={completedTasks.length.toString()} detail="Client deliverables" accent="bg-[#10b981]" icon={CheckCircle2} />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.16fr_0.84fr]">
          <section className="space-y-6">
            <div className="rounded-lg border border-[#eadfce] bg-[#fffaf0] p-5 shadow-xl shadow-black/10">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <p className="text-sm font-semibold uppercase text-[#9a6b33]">Campaigns</p>
                  <h2 className="mt-1 text-3xl font-bold text-[#111827]">Creative project pipeline</h2>
                </div>
                <form action={addProject} className="flex flex-col gap-2 sm:min-w-80 sm:flex-row">
                  <input
                    name="name"
                    placeholder="New campaign name"
                    className="min-w-0 flex-1 rounded-lg border border-[#e7d8c2] bg-white px-3 py-2 text-sm outline-none ring-[#f4a3a8]/40 focus:border-[#d9b979] focus:ring-4"
                  />
                  <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#07111f] px-4 py-2 text-sm font-semibold text-[#fffaf0] transition hover:bg-[#162033]">
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    Add campaign
                  </button>
                </form>
              </div>

              <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {projectList.length ? (
                  projectList.map((project, index) => {
                    const projectTasks = taskList.filter((task) => task.project_id === project.id);
                    const done = projectTasks.filter((task) => task.status === "done").length;
                    const progress = projectTasks.length ? Math.round((done / projectTasks.length) * 100) : 0;
                    const image = campaignImages[index % campaignImages.length];

                    return (
                      <article key={project.id} className="overflow-hidden rounded-lg border border-[#eadfce] bg-white shadow-lg shadow-[#07111f]/8">
                        <div className="relative h-64 bg-[#e7d8c2]">
                          {/* Replace the generated placeholder JPGs in /public/images with licensed campaign photography when available. */}
                          <Image src={image} alt={`${project.name} campaign image`} fill sizes="(min-width: 1280px) 24vw, (min-width: 768px) 45vw, 100vw" className="object-cover" />
                          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(7,11,19,0.72),rgba(7,11,19,0.08)_55%)]" />
                          <span className="absolute left-3 top-3 rounded-full bg-[#fffaf0]/92 px-3 py-1 text-xs font-bold text-[#111827] shadow-sm">
                            {progress}% ready
                          </span>
                          <div className="absolute bottom-3 left-3 right-3 text-[#fffaf0]">
                            <h3 className="text-xl font-bold">{project.name}</h3>
                            <p className="mt-1 text-sm text-[#f7ead7]">Opened {formatDate(project.created_at)}</p>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="h-2 overflow-hidden rounded-full bg-[#eadfce]">
                            <div className="h-full rounded-full bg-[#07111f]" style={{ width: `${progress}%` }} />
                          </div>
                          <div className="mt-3 flex justify-between text-sm text-[#5f5446]">
                            <span>{projectTasks.length} studio tasks</span>
                            <span>{done} complete</span>
                          </div>
                        </div>
                      </article>
                    );
                  })
                ) : (
                  <p className="rounded-lg border border-[#d9b979] bg-[#fff7e6] p-4 text-sm text-[#6b441d] md:col-span-2 xl:col-span-3">
                    No campaign was created for this user. Check the profile/project trigger in supabase/schema.sql.
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-lg border border-[#eadfce] bg-[#fffaf0] p-5 shadow-xl shadow-black/10">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <p className="text-sm font-semibold uppercase text-[#9a6b33]">Studio tasks</p>
                  <h2 className="mt-1 text-3xl font-bold text-[#111827]">Client deliverables</h2>
                </div>
                {projectList.length ? (
                  <form action={addTask} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                    <select
                      name="projectId"
                      required
                      className="rounded-lg border border-[#e7d8c2] bg-white px-3 py-2 text-sm outline-none ring-[#f4a3a8]/40 focus:border-[#d9b979] focus:ring-4"
                      defaultValue={projectList[0]?.id}
                    >
                      {projectList.map((project) => (
                        <option key={project.id} value={project.id}>
                          {project.name}
                        </option>
                      ))}
                    </select>
                    <input
                      name="title"
                      placeholder="Add deliverable"
                      required
                      minLength={2}
                      className="rounded-lg border border-[#e7d8c2] bg-white px-3 py-2 text-sm outline-none ring-[#f4a3a8]/40 focus:border-[#d9b979] focus:ring-4"
                    />
                    <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#b73b54] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#9f2f46]">
                      <Plus className="h-4 w-4" aria-hidden="true" />
                      Add task
                    </button>
                  </form>
                ) : null}
              </div>

              <div className="mt-5 space-y-3">
                {taskList.length ? (
                  taskList.map((task) => (
                    <article key={task.id} className="flex flex-col gap-3 rounded-lg border border-[#eadfce] bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-semibold text-[#111827]">{task.title}</p>
                        <p className="mt-1 text-sm text-[#756855]">
                          {projectNames[task.project_id] ?? "Creative project"} - {formatDate(task.created_at)}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${task.status === "done" ? "bg-[#dff8ed] text-[#05603a]" : "bg-[#fff1f2] text-[#9f2f46]"}`}>
                          {task.status === "done" ? "Completed" : "Open"}
                        </span>
                        <form action={toggleTask.bind(null, task.id, task.status === "done" ? "open" : "done")}>
                          <button className="inline-flex items-center gap-1.5 rounded-lg border border-[#e7d8c2] bg-[#fffaf0] px-3 py-1 text-xs font-semibold text-[#111827] transition hover:bg-[#f8ead0]">
                            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                            {task.status === "done" ? "Reopen" : "Mark done"}
                          </button>
                        </form>
                        <form action={deleteTask.bind(null, task.id)}>
                          <button className="inline-flex items-center gap-1.5 rounded-lg border border-[#f2b9c1] bg-white px-3 py-1 text-xs font-semibold text-[#9f2f46] transition hover:bg-[#fff1f2]">
                            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                            Delete
                          </button>
                        </form>
                      </div>
                    </article>
                  ))
                ) : (
                  <p className="rounded-lg border border-[#eadfce] bg-white p-4 text-sm text-[#5f5446]">
                    Add your first studio task to begin the client deliverables checklist.
                  </p>
                )}
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-lg border border-[#eadfce] bg-[#fffaf0] p-5 shadow-xl shadow-black/10">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase text-[#9a6b33]">Model profiles</p>
                  <h2 className="mt-1 text-2xl font-bold text-[#111827]">Talent and client roster</h2>
                </div>
                <UserRound className="h-6 w-6 text-[#b8893d]" aria-hidden="true" />
              </div>
              <div className="mt-4 grid gap-3">
                {clientProfiles.map((profile) => (
                  <article key={profile.name} className="grid grid-cols-[6.5rem_1fr] gap-3 rounded-lg border border-[#eadfce] bg-white p-3 shadow-sm">
                    <div className="relative h-28 overflow-hidden rounded-lg bg-[#e7d8c2]">
                      {/* Replace model placeholder JPGs in /public/images with licensed profile photography before production use. */}
                      <Image src={profile.image} alt={`${profile.name} profile image`} fill sizes="7rem" className="object-cover" />
                    </div>
                    <div className="min-w-0 self-center">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="truncate font-semibold text-[#111827]">{profile.name}</h3>
                        <span className="shrink-0 rounded-full bg-[#f8ead0] px-2 py-1 text-[0.68rem] font-bold text-[#6b441d]">
                          {profile.status}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-[#756855]">{profile.role}</p>
                      <p className="mt-2 text-sm font-medium text-[#2d241a]">{profile.focus}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-white/10 bg-[#0c111d] p-5 text-[#fffaf0] shadow-xl shadow-black/20">
              <p className="text-sm font-semibold uppercase text-[#f4a3a8]">Booking desk</p>
              <h2 className="mt-2 text-3xl font-bold">Casting and client holds</h2>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {campaignImages.map((image, index) => (
                  <div key={image} className="relative h-36 overflow-hidden rounded-lg border border-white/10 bg-white/10">
                    <Image src={image} alt={`Campaign booking preview ${index + 1}`} fill sizes="10rem" className="object-cover" />
                  </div>
                ))}
              </div>
              <p className="mt-5 text-sm leading-6 text-[#f7ead7]/72">
                Bookings, campaign approvals, and client deliverables stay connected to the same protected Supabase data model.
              </p>
            </div>

            <div className="rounded-lg border border-[#eadfce] bg-[#fffaf0] p-5 shadow-xl shadow-black/10">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold uppercase text-[#9a6b33]">Recent activity</p>
                <Layers3 className="h-5 w-5 text-[#b8893d]" aria-hidden="true" />
              </div>
              <div className="mt-4 space-y-3">
                {recentActivity.length ? (
                  recentActivity.map((item) => {
                    const isTask = "status" in item;
                    return (
                      <div key={`${isTask ? "task" : "project"}-${item.id}`} className="rounded-lg border-l-4 border-[#f4a3a8] bg-white px-4 py-3 shadow-sm">
                        <p className="text-sm font-semibold text-[#111827]">
                          {isTask ? item.title : item.name}
                        </p>
                        <p className="mt-1 text-xs text-[#756855]">
                          {isTask ? "Studio task updated" : "Campaign created"} - {formatDate(item.created_at)}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-[#756855]">No recent activity yet.</p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/12 bg-white/10 p-4 backdrop-blur">
      <p className="text-3xl font-bold text-[#fffaf0]">{value}</p>
      <p className="mt-1 text-sm text-[#f7ead7]/72">{label}</p>
    </div>
  );
}

function MetricCard({ label, value, detail, accent, icon: Icon }: { label: string; value: string; detail: string; accent: string; icon: LucideIcon }) {
  return (
    <article className="rounded-lg border border-[#eadfce] bg-[#fffaf0] p-5 shadow-xl shadow-black/10">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className={`h-2 w-16 rounded-full ${accent}`} />
        <Icon className="h-5 w-5 text-[#9a6b33]" aria-hidden="true" />
      </div>
      <p className="text-sm font-semibold uppercase text-[#756855]">{label}</p>
      <p className="mt-2 text-4xl font-bold text-[#111827]">{value}</p>
      <p className="mt-1 text-sm text-[#756855]">{detail}</p>
    </article>
  );
}