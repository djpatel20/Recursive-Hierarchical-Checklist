import type { Task } from "../types/task";

import TaskForm from "./TaskForm";

interface TaskItemProps {
  task: Task;
  onAddTask: (taskId: string, title: string) => void;
  onToggleComplete: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

function TaskItem({
  task,
  onAddTask,
  onToggleComplete,
  onDeleteTask,
}: TaskItemProps) {
  return (
    <div style={{ marginLeft: "20px", marginTop: "15px" }}>
      <div>
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggleComplete(task.id)}
        />
        <span
          style={{ textDecoration: task.completed ? "line-through" : "none" }}
        >
          {task.title}
        </span>
        <button onClick={() => onDeleteTask(task.id)}>Delete</button>
      </div>
      <TaskForm onAddTask={(title) => onAddTask(task.id, title)} />

      {task.childrenId.map((childId) => (
        <TaskItem
          key={childId}
          task={childId}
          onAddTask={onAddTask}
          onToggleComplete={onToggleComplete}
          onDeleteTask={onDeleteTask}
        />
      ))}
    </div>
  );
}
export default TaskItem;
