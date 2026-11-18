export interface Task {
  id: string;
  title: string;
  parentId: string | null;
  completed: boolean;
  children: Task[];
}
