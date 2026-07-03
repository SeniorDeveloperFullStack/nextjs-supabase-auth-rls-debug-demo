import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Project, Task } from "@/lib/types";
import { addTask, deleteTask, signOut, toggleTask } from "./actions";

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

  const firstProject = projects?.[0];

  const { data: tasks, error: taskError } = firstProject
    ? await supabase
        .from("tasks")
        .select("id, project_id, owner_id, title, status, created_at")
        .eq("owner_id", user.id)
        .eq("project_id", firstProject.id)
        .order("created_at", { ascending: false })
        .returns<Task[]>()
    : { data: [], error: null };

  return (
    <main className="min-h-screen px-6 py-10">
      <section className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col justify-between gap-4 rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-xl md:flex-row md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
              Protected Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-bold text-white">User-owned tasks</h1>
            <p className="mt-2 text-slate-400">
              Signed in as <span className="font-semibold text-slate-200">{user.email}</span>
            </p>
          </div>
          <form action={signOut}>
            <button className="rounded-xl border border-slate-600 px-5 py-3 font-semibold text-slate-200 transition hover:bg-slate-800">
              Sign out
            </button>
          </form>
        </div>

        {(projectError || taskError) && (
          <div className="mb-6 rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-100">
            <p className="font-semibold">Database error</p>
            <p>{projectError?.message ?? taskError?.message}</p>
            <p className="mt-2 text-red-200/80">
              This is usually caused by missing RLS policies, missing grants, or incorrect table names.
            </p>
          </div>
        )}

        {!firstProject ? (
          <div className="rounded-3xl border border-amber-500/40 bg-amber-500/10 p-6 text-amber-100">
            No project was created for this user. Check the profile/project trigger in supabase/schema.sql.
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
            <aside className="rounded-3xl border border-slate-700 bg-slate-900 p-6">
              <h2 className="text-xl font-bold text-white">Current project</h2>
              <p className="mt-3 rounded-2xl border border-slate-700 bg-slate-950 p-4 text-slate-300">
                {firstProject.name}
              </p>
              <div className="mt-6 rounded-2xl border border-cyan-400/30 bg-cyan-400/10 p-4 text-sm leading-6 text-cyan-100">
                RLS safety check: every query also filters by owner_id, and the database policies enforce
                auth.uid() = owner_id even if a client-side bug happens.
              </div>
            </aside>

            <section className="rounded-3xl border border-slate-700 bg-slate-900 p-6">
              <h2 className="text-xl font-bold text-white">Tasks</h2>
              <form action={addTask} className="mt-4 flex flex-col gap-3 md:flex-row">
                <input type="hidden" name="projectId" value={firstProject.id} />
                <input
                  name="title"
                  placeholder="Add a launch task..."
                  className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none ring-cyan-400 transition focus:ring-2"
                />
                <button className="rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300">
                  Add task
                </button>
              </form>

              <div className="mt-6 space-y-3">
                {tasks?.length ? (
                  tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex flex-col gap-3 rounded-2xl border border-slate-700 bg-slate-950 p-4 md:flex-row md:items-center md:justify-between"
                    >
                      <div>
                        <p className="font-semibold text-white">{task.title}</p>
                        <p className="mt-1 text-sm text-slate-500">Status: {task.status}</p>
                      </div>
                      <div className="flex gap-2">
                        <form action={toggleTask.bind(null, task.id, task.status === "done" ? "open" : "done")}>
                          <button className="rounded-lg border border-slate-600 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800">
                            {task.status === "done" ? "Reopen" : "Mark done"}
                          </button>
                        </form>
                        <form action={deleteTask.bind(null, task.id)}>
                          <button className="rounded-lg border border-red-500/40 px-3 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-500/10">
                            Delete
                          </button>
                        </form>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="rounded-2xl border border-slate-700 bg-slate-950 p-4 text-slate-400">
                    No tasks yet. Add one to test insert policies.
                  </p>
                )}
              </div>
            </section>
          </div>
        )}
      </section>
    </main>
  );
}
