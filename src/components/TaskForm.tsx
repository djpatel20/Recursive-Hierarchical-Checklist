import { useState } from "react";

function TaskForm({ onAddTask }: { onAddTask: (title: string) => void }) {
  const [title, setTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    {
      e.preventDefault();

      if (title.trim() === "") return;
      onAddTask(title.trim());
      setTitle("");
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter task title"
      />
      <button type="submit">Add Task</button>
    </form>
  );
}
export default TaskForm;
