import Image from "next/image";
import { redirect } from "next/navigation";
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

export default async function DashboardPage() {
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
    <main className="min-h-screen px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-col justify-between gap-4 rounded-2xl border border-white/80 bg-white/90 p-5 shadow-xl shadow-slate-900/5 backdrop-blur md:flex-row md:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-rose-600">FashionOps Studio</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Creative operations dashboard</h1>
            <p className="mt-2 text-sm text-slate-600">
              Signed in as <span className="font-semibold text-slate-900">{user.email}</span>
            </p>
          </div>
          <form action={signOut}>
            <button className="rounded-xl border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-slate-400 hover:bg-stone-50">
              Sign out
            </button>
          </form>
        </header>

        {(projectError || taskError) && (
          <div className="mb-6 rounded-2xl border border-red-300 bg-red-50 p-4 text-sm text-red-900">
            <p className="font-semibold">Database error</p>
            <p>{projectError?.message ?? taskError?.message}</p>
            <p className="mt-2 text-red-800">Check table grants, RLS policies, and Supabase environment values.</p>
          </div>
        )}

        <section className="relative mb-6 overflow-hidden rounded-[1.75rem] bg-slate-950 text-white shadow-2xl shadow-slate-950/20">
          <Image
            src="/images/studio-bg.jpg"
            alt="Fashion studio campaign banner"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/55 to-slate-950/10" />
          <div className="relative z-10 grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_24rem] lg:p-10">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-rose-100">Featured campaign</p>
              <h2 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">Spring Capsule Launch</h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-100/90">
                Track campaign milestones, model bookings, client deliverables, and studio tasks from one protected Supabase workspace.
              </p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/15 p-5 backdrop-blur-md">
              <p className="text-sm text-white/75">Studio readiness</p>
              <p className="mt-2 text-5xl font-bold">{completionRate}%</p>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/20">
                <div className="h-full rounded-full bg-rose-300" style={{ width: `${completionRate}%` }} />
              </div>
              <p className="mt-4 text-sm text-white/75">{completedTasks.length} of {taskList.length} client deliverables completed</p>
            </div>
          </div>
        </section>

        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Active Campaigns" value={projectList.length.toString()} detail="Creative projects" accent="bg-slate-950" />
          <MetricCard label="Pending Bookings" value={clientProfiles.filter((profile) => profile.status !== "Booked").length.toString()} detail="Model and client holds" accent="bg-sky-500" />
          <MetricCard label="Open Tasks" value={openTasks.length.toString()} detail="Studio tasks" accent="bg-rose-500" />
          <MetricCard label="Completed Work" value={completedTasks.length.toString()} detail="Client deliverables" accent="bg-emerald-500" />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <section className="space-y-6">
            <div className="rounded-2xl border border-white/80 bg-white/90 p-5 shadow-lg shadow-slate-900/5">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">Campaigns</p>
                  <h2 className="mt-1 text-2xl font-bold">Creative project pipeline</h2>
                </div>
                <form action={addProject} className="flex flex-col gap-2 sm:min-w-80 sm:flex-row">
                  <input
                    name="name"
                    placeholder="New campaign name"
                    className="min-w-0 flex-1 rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm outline-none ring-rose-300 focus:border-rose-300 focus:ring-4"
                  />
                  <button className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
                    Add campaign
                  </button>
                </form>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {projectList.length ? (
                  projectList.map((project, index) => {
                    const projectTasks = taskList.filter((task) => task.project_id === project.id);
                    const done = projectTasks.filter((task) => task.status === "done").length;
                    const progress = projectTasks.length ? Math.round((done / projectTasks.length) * 100) : 0;
                    const image = campaignImages[index % campaignImages.length];

                    return (
                      <article key={project.id} className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
                        <div className="relative h-44 bg-stone-200">
                          {/* Replace the generated placeholder JPGs in /public/images with licensed campaign photography when available. */}
                          <Image src={image} alt={`${project.name} campaign image`} fill sizes="(min-width: 1280px) 24vw, (min-width: 768px) 45vw, 100vw" className="object-cover" />
                          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-slate-950 shadow-sm">
                            {progress}% ready
                          </span>
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-slate-950">{project.name}</h3>
                          <p className="mt-1 text-sm text-slate-500">Opened {formatDate(project.created_at)}</p>
                          <div className="mt-4 h-2 overflow-hidden rounded-full bg-stone-200">
                            <div className="h-full rounded-full bg-slate-950" style={{ width: `${progress}%` }} />
                          </div>
                          <div className="mt-3 flex justify-between text-sm text-slate-600">
                            <span>{projectTasks.length} studio tasks</span>
                            <span>{done} complete</span>
                          </div>
                        </div>
                      </article>
                    );
                  })
                ) : (
                  <p className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 md:col-span-2 xl:col-span-3">
                    No campaign was created for this user. Check the profile/project trigger in supabase/schema.sql.
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-white/80 bg-white/90 p-5 shadow-lg shadow-slate-900/5">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">Studio tasks</p>
                  <h2 className="mt-1 text-2xl font-bold">Client deliverables</h2>
                </div>
                {projectList.length ? (
                  <form action={addTask} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                    <select
                      name="projectId"
                      className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm outline-none ring-rose-300 focus:border-rose-300 focus:ring-4"
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
                      className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm outline-none ring-rose-300 focus:border-rose-300 focus:ring-4"
                    />
                    <button className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700">
                      Add task
                    </button>
                  </form>
                ) : null}
              </div>

              <div className="mt-5 space-y-3">
                {taskList.length ? (
                  taskList.map((task) => (
                    <article key={task.id} className="flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-semibold text-slate-950">{task.title}</p>
                        <p className="mt-1 text-sm text-slate-500">
                          {projectNames[task.project_id] ?? "Creative project"} - {formatDate(task.created_at)}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${task.status === "done" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                          {task.status === "done" ? "Completed" : "Open"}
                        </span>
                        <form action={toggleTask.bind(null, task.id, task.status === "done" ? "open" : "done")}>
                          <button className="rounded-lg border border-stone-300 bg-white px-3 py-1 text-xs font-semibold text-slate-800 transition hover:bg-stone-50">
                            {task.status === "done" ? "Reopen" : "Mark done"}
                          </button>
                        </form>
                        <form action={deleteTask.bind(null, task.id)}>
                          <button className="rounded-lg border border-red-200 bg-white px-3 py-1 text-xs font-semibold text-red-700 transition hover:bg-red-50">
                            Delete
                          </button>
                        </form>
                      </div>
                    </article>
                  ))
                ) : (
                  <p className="rounded-2xl border border-stone-200 bg-stone-50 p-4 text-sm text-slate-600">
                    Add your first studio task to begin the client deliverables checklist.
                  </p>
                )}
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-white/80 bg-white/90 p-5 shadow-lg shadow-slate-900/5">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">Model profiles</p>
              <div className="mt-4 grid gap-3">
                {clientProfiles.map((profile) => (
                  <article key={profile.name} className="grid grid-cols-[5.5rem_1fr] gap-3 rounded-2xl border border-stone-200 bg-white p-3">
                    <div className="relative h-24 overflow-hidden rounded-xl bg-stone-200">
                      {/* Replace model placeholder JPGs in /public/images with licensed profile photography before production use. */}
                      <Image src={profile.image} alt={`${profile.name} profile image`} fill sizes="6rem" className="object-cover" />
                    </div>
                    <div className="min-w-0 self-center">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="truncate font-semibold text-slate-950">{profile.name}</h3>
                        <span className="shrink-0 rounded-full bg-stone-100 px-2 py-1 text-[0.68rem] font-bold text-slate-600">
                          {profile.status}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-500">{profile.role}</p>
                      <p className="mt-2 text-sm font-medium text-slate-800">{profile.focus}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/80 bg-slate-950 p-5 text-white shadow-lg shadow-slate-900/10">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-rose-200">Booking desk</p>
              <h2 className="mt-2 text-2xl font-bold">Casting and client holds</h2>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {campaignImages.map((image, index) => (
                  <div key={image} className="relative h-28 overflow-hidden rounded-xl bg-white/10">
                    <Image src={image} alt={`Campaign booking preview ${index + 1}`} fill sizes="8rem" className="object-cover" />
                  </div>
                ))}
              </div>
              <p className="mt-5 text-sm leading-6 text-slate-300">
                Bookings, campaign approvals, and client deliverables stay connected to the same protected Supabase data model.
              </p>
            </div>

            <div className="rounded-2xl border border-white/80 bg-white/90 p-5 shadow-lg shadow-slate-900/5">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">Recent activity</p>
              <div className="mt-4 space-y-3">
                {recentActivity.length ? (
                  recentActivity.map((item) => {
                    const isTask = "status" in item;
                    return (
                      <div key={`${isTask ? "task" : "project"}-${item.id}`} className="border-l-2 border-rose-300 pl-3">
                        <p className="text-sm font-semibold text-slate-950">
                          {isTask ? item.title : item.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {isTask ? "Studio task updated" : "Campaign created"} - {formatDate(item.created_at)}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-slate-500">No recent activity yet.</p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function MetricCard({ label, value, detail, accent }: { label: string; value: string; detail: string; accent: string }) {
  return (
    <article className="rounded-2xl border border-white/80 bg-white/90 p-5 shadow-lg shadow-slate-900/5">
      <div className={`mb-5 h-2 w-14 rounded-full ${accent}`} />
      <p className="text-sm font-bold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-slate-950">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{detail}</p>
    </article>
  );
}