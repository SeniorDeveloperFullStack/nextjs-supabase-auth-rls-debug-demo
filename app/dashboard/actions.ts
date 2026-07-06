"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const projectSchema = z.object({
  name: z.string().trim().min(2, "Project name is too short")
});

const taskSchema = z.object({
  title: z.string().trim().min(2, "Task title is too short"),
  projectId: z.string().uuid("Invalid project id")
});

async function getSignedInUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  return { supabase, user };
}

export async function addProject(formData: FormData) {
  const { supabase, user } = await getSignedInUser();
  const parsed = projectSchema.safeParse({ name: formData.get("name") });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid project input");
  }

  const { error } = await supabase.from("projects").insert({
    name: parsed.data.name,
    owner_id: user.id
  });

  if (error) {
    throw new Error(`Could not add project: ${error.message}`);
  }

  revalidatePath("/dashboard");
}

export async function addTask(formData: FormData) {
  const { supabase, user } = await getSignedInUser();
  const parsed = taskSchema.safeParse({
    title: formData.get("title"),
    projectId: formData.get("projectId")
  });

  if (!parsed.success) {
    redirect("/dashboard?taskError=Task%20titles%20need%20at%20least%202%20characters.");
  }

  const { error } = await supabase.from("tasks").insert({
    title: parsed.data.title,
    project_id: parsed.data.projectId,
    owner_id: user.id,
    status: "open"
  });

  if (error) {
    throw new Error(`Could not add task: ${error.message}`);
  }

  revalidatePath("/dashboard");
}

export async function toggleTask(taskId: string, nextStatus: "open" | "done") {
  const { supabase, user } = await getSignedInUser();

  const { error } = await supabase
    .from("tasks")
    .update({ status: nextStatus })
    .eq("id", taskId)
    .eq("owner_id", user.id);

  if (error) {
    throw new Error(`Could not update task: ${error.message}`);
  }

  revalidatePath("/dashboard");
}

export async function deleteTask(taskId: string) {
  const { supabase, user } = await getSignedInUser();

  const { error } = await supabase.from("tasks").delete().eq("id", taskId).eq("owner_id", user.id);

  if (error) {
    throw new Error(`Could not delete task: ${error.message}`);
  }

  revalidatePath("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}