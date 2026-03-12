"use client";

import { useState, useEffect, useCallback } from "react";
import { Task, TaskStatus, StatusFilter } from "@/lib/types";
import { loadTasks, saveTasks } from "@/lib/storage";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";

const filters: { label: string; value: StatusFilter }[] = [
  { label: "All", value: "all" },
  { label: "Todo", value: "todo" },
  { label: "In Progress", value: "in-progress" },
  { label: "Done", value: "done" },
];

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTasks(loadTasks());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      saveTasks(tasks);
    }
  }, [tasks, mounted]);

  const filteredTasks =
    filter === "all" ? tasks : tasks.filter((t) => t.status === filter);

  const handleAdd = useCallback(
    (title: string, description: string) => {
      if (editingTask) {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === editingTask.id ? { ...t, title, description } : t
          )
        );
        setEditingTask(null);
      } else {
        const newTask: Task = {
          id: crypto.randomUUID(),
          title,
          description,
          status: "todo",
          createdAt: new Date().toISOString(),
        };
        setTasks((prev) => [newTask, ...prev]);
      }
    },
    [editingTask]
  );

  const handleStatusChange = useCallback(
    (id: string, status: TaskStatus) => {
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    },
    []
  );

  const handleDelete = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  if (!mounted) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-center mb-8">Task Manager</h1>
        <div className="text-center text-gray-400 py-12">Loading...</div>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Task Manager</h1>

      <div className="mb-6">
        <TaskForm
          editingTask={editingTask}
          onSubmit={handleAdd}
          onCancel={() => setEditingTask(null)}
        />
      </div>

      <div className="flex gap-2 mb-6">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === f.value
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            {f.label}
            {f.value === "all"
              ? ` (${tasks.length})`
              : ` (${tasks.filter((t) => t.status === f.value).length})`}
          </button>
        ))}
      </div>

      <TaskList
        tasks={filteredTasks}
        onStatusChange={handleStatusChange}
        onEdit={setEditingTask}
        onDelete={handleDelete}
      />
    </main>
  );
}
