export type Project = {
  id: string;
  owner_id: string;
  name: string;
  created_at: string;
};

export type Task = {
  id: string;
  project_id: string;
  owner_id: string;
  title: string;
  status: "open" | "done";
  created_at: string;
};
