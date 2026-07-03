"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const taskSchema = z.object({
  title: z.string().trim().min(2, "Task title is too short"),
  projectId: z.string().uuid("Invalid project id")
});

export async function addTask(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const parsed = taskSchema.safeParse({
    title: formData.get("title"),
    projectId: formData.get("projectId")
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid task input");
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
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

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
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

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
