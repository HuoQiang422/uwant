export interface MainTask {
  taskId: number;
  description: string;
  category: string;
  priority: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  contactPerson: string;
  implementPerson: string;
  remark: string;
}

export interface SubTask {
  subTaskId: number;
  mainTaskId: number;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  implementPerson: string;
  remark: string;
}

export interface DemandTaskItem {
  mainTask: MainTask;
  subTasks: SubTask[];
}
