export type TaskStatus =
  | "pending"
  | "in_progress"
  | "completed";

export interface ICreateTaskRequest {
  title: string;
  description?: string;
  status?: TaskStatus;
  dueDate?: string;
}

export interface IUpdateTaskRequest {
  title?: string;   
  description?: string;
  status?: TaskStatus;
  dueDate?: string | null;
}

export interface ITaskResponseData {
  task: {
    id: number;
    title: string;
    description: string | null;
    status: TaskStatus;
    dueDate: Date | null;
  };
}

export interface IGetTasksQuery {
  status?: TaskStatus;
  page?: string;
  limit?: string;
}