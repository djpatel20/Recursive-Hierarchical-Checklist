import { useState } from "react";
import type { Task } from "../types/task";
import TaskForm from "./TaskForm";

interface TaskItemProps {
  task: Task;
  onAddTask: (title: string, parentId: string | null) => void;
  onToggleComplete: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

function TaskItem({
  task,
  onAddTask,
  onToggleComplete,
  onDeleteTask,
}: TaskItemProps) {
  const [showSubForm, setShowSubForm] = useState(false);

  const handleAddSubTask = (title: string) => {
    onAddTask(title, task.id);
    setShowSubForm(false);
  };

  return (
    <div style={{ marginTop: "10px" }}>
      <div className="task-row">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggleComplete(task.id)}
        />
        <span
          style={{
            marginLeft: "6px",
            textDecoration: task.completed ? "line-through" : "none",
          }}
        >
          {task.title}
        </span>
        <button
          type="button"
          onClick={() => setShowSubForm((prev) => !prev)}
        >
          Add Subtask
        </button>
        <button type="button" onClick={() => onDeleteTask(task.id)}>
          Delete
        </button>
      </div>

      {showSubForm && (
        <div className="task-children">
          <TaskForm
            onAddTask={handleAddSubTask}
            placeholder="Enter subtask"
            buttonText="Add"
            onCancel={() => setShowSubForm(false)}
          />
        </div>
      )}

      {task.children.length > 0 && (
        <div className="task-children">
          {task.children.map((child) => (
            <TaskItem
              key={child.id}
              task={child}
              onAddTask={onAddTask}
              onToggleComplete={onToggleComplete}
              onDeleteTask={onDeleteTask}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default TaskItem;
