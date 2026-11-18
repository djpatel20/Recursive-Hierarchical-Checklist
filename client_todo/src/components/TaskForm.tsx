import { useState } from "react";

interface TaskFormProps {
  onAddTask: (title: string) => void;
  placeholder?: string;
  buttonText?: string;
  onCancel?: () => void;
}

function TaskForm({
  onAddTask,
  placeholder = "Enter task title",
  buttonText = "Add Task",
  onCancel,
}: TaskFormProps) {
  const [title, setTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (title.trim() === "") return;
    onAddTask(title.trim());
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "6px" }}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={placeholder}
      />
      <button type="submit" style={{ marginLeft: "6px" }}>
        {buttonText}
      </button>
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          style={{ marginLeft: "6px" }}
        >
          Cancel
        </button>
      )}
    </form>
  );
}

export default TaskForm;
