import { useState } from "react";
import type { Task } from "./types/task";
import TaskForm from "./components/TaskForm";
import TaskItem from "./components/TaskItem";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = (title: string, parentId: string | null = null) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      parentsId: parentId,
      childrenId: null,
      completed: false,
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const deleteTask = (taskId: string) => {
    setTasks((prevTasks) => {
      const deletedIds = new Set([taskId]);
      let foundChild = true;

      while (foundChild) {
        foundChild = false;
        prevTasks.forEach((task) => {
          if (
            task.parentsId &&
            deletedIds.has(task.parentsId) &&
            !deletedIds.has(task.id)
          ) {
            deletedIds.add(task.id);
            foundChild = true;
          }
        });
      }

      return prevTasks.filter((task) => !deletedIds.has(task.id));
    });
  };

  const toggleTask = (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  return (
    <div className="container">
      <h1>Task Manager</h1>
      <TaskForm onAddTask={(title) => addTask(title)} />
      <div>
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onAdd={addTask}
            onToggleComplete={toggleTask}
            onDelete={deleteTask}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
