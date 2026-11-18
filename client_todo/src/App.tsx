import { useEffect, useState } from "react";
import type { Task } from "./types/task";
import TaskForm from "./components/TaskForm";
import TaskItem from "./components/TaskItem";
import "./App.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/tasks";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const getTasks = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setTasks(data);
      } catch (error) {
        console.log("Error fetching tasks", error);
      }
    };

    getTasks();
  }, []);

  const addTask = async (title: string, parentId: string | null = null) => {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, parentId }),
      });

      const data = await res.json();
      setTasks(data.tasks);
    } catch (error) {
      console.log("Error adding task", error);
    }
  };

  const toggleTask = async (taskId: string) => {
    try {
      const res = await fetch(`${API_URL}/${taskId}/toggle`, {
        method: "PATCH",
      });

      const data = await res.json();
      setTasks(data.tasks);
    } catch (error) {
      console.log("Error updating task", error);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const res = await fetch(`${API_URL}/${taskId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      setTasks(data.tasks);
    } catch (error) {
      console.log("Error deleting task", error);
    }
  };

  return (
    <div className="container">
      <h1>Recursive Hierarchical Checklist</h1>

      <TaskForm onAddTask={(title) => addTask(title, null)} />

      {tasks.length === 0 ? (
        <p>No tasks yet.</p>
      ) : (
        tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onAddTask={addTask}
            onToggleComplete={toggleTask}
            onDeleteTask={deleteTask}
          />
        ))
      )}
    </div>
  );
}

export default App;
