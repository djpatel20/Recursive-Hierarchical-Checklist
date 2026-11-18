export interface Task {
  id: string;
  title: string;
  parentsId: string | null;
  childrenId: string | null;
  completed: boolean;
}
