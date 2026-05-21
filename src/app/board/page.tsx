"use client";

import { useState } from "react";

type Category =
  | "Vendor Outreach"
  | "Technical"
  | "Content & Social"
  | "Business Plan"
  | "Email Sequences"
  | "Events";

type Status = "todo" | "in-progress" | "waiting" | "done";

interface Task {
  id: string;
  title: string;
  description: string;
  category: Category;
  status: Status;
  createdAt: string;
}

const CATEGORY_COLORS: Record<Category, string> = {
  "Vendor Outreach": "bg-amber-900/30 border-amber-700",
  "Technical": "bg-blue-900/30 border-blue-700",
  "Content & Social": "bg-purple-900/30 border-purple-700",
  "Business Plan": "bg-emerald-900/30 border-emerald-700",
  "Email Sequences": "bg-cyan-900/30 border-cyan-700",
  Events: "bg-orange-900/30 border-orange-700",
};

const STATUS_CONFIG: Record<Status, { label: string; color: string; border: string }> = {
  "todo": { label: "To Do", color: "bg-slate-700", border: "border-slate-600" },
  "in-progress": { label: "In Progress", color: "bg-blue-700", border: "border-blue-600" },
  "waiting": { label: "Waiting on Response", color: "bg-amber-700", border: "border-amber-600" },
  "done": { label: "Done / Live", color: "bg-emerald-700", border: "border-emerald-600" },
};

const INITIAL_TASKS: Task[] = [
  // Vendor Outreach
  {
    id: "v1",
    title: "K2 Coolers — Send outreach email",
    description: "Short-form email drafted. Customize and send to K2 partnership team.",
    category: "Vendor Outreach",
    status: "waiting",
    createdAt: "2026-05-20",
  },
  {
    id: "v2",
    title: "Carhartt — Follow up after front desk call",
    description: "Call Carhartt commercial/industrial team. Get email for partnership outreach.",
    category: "Vendor Outreach",
    status: "todo",
    createdAt: "2026-05-20",
  },
  {
    id: "v3",
    title: "Wolverine — Send outreach email",
    description: "Short-form email drafted in vendor-emails-short.md. Send when ready.",
    category: "Vendor Outreach",
    status: "todo",
    createdAt: "2026-05-20",
  },
  {
    id: "v4",
    title: "Red Wing — Send outreach email",
    description: "Short-form email drafted. Send with partnership proposal.",
    category: "Vendor Outreach",
    status: "todo",
    createdAt: "2026-05-20",
  },
  {
    id: "v5",
    title: "CFN — Send outreach email",
    description: "Cash Fuel Network. Short-form email drafted. Send.",
    category: "Vendor Outreach",
    status: "todo",
    createdAt: "2026-05-20",
  },
  {
    id: "v6",
    title: "Telehealth — Teladoc outreach",
    description: "Email Teladoc for group/association pricing inquiry.",
    category: "Vendor Outreach",
    status: "todo",
    createdAt: "2026-05-21",
  },
  {
    id: "v7",
    title: "Telehealth — Sesame Care outreach",
    description: "Email Sesame Care for direct-pay group benefit inquiry.",
    category: "Vendor Outreach",
    status: "todo",
    createdAt: "2026-05-21",
  },
  // Technical
  {
    id: "t1",
    title: "Fix email queue processor for Cloudflare Pages",
    description: "Current queue processor uses fs writes — won't work on serverless. Need to migrate to Resend automation or cron.",
    category: "Technical",
    status: "todo",
    createdAt: "2026-05-21",
  },
  {
    id: "t2",
    title: "Set up Resend nurture sequence automation",
    description: "Wire up 3-day and 7-day emails via Resend sequences API instead of manual queue processor.",
    category: "Technical",
    status: "todo",
    createdAt: "2026-05-21",
  },
  {
    id: "t3",
    title: "Stripe integration for membership payments",
    description: "Set up Stripe for $20/month standard and $100/month founding membership. Stripe Connect for referral payouts.",
    category: "Technical",
    status: "todo",
    createdAt: "2026-05-21",
  },
  {
    id: "t4",
    title: "Build member dashboard / login area",
    description: "NextAuth.js for member auth. Member portal with deals, investment dashboard, referral tracking.",
    category: "Technical",
    status: "todo",
    createdAt: "2026-05-21",
  },
  // Content & Social
  {
    id: "c1",
    title: "Content Creator — Rick and the Boss",
    description: "DM outreach for affiliate partnership. Creators drive members, earn commission.",
    category: "Content & Social",
    status: "todo",
    createdAt: "2026-05-20",
  },
  {
    id: "c2",
    title: "Content Creator — Per Diem OnlyFans",
    description: "DM outreach for affiliate partnership.",
    category: "Content & Social",
    status: "todo",
    createdAt: "2026-05-20",
  },
  {
    id: "c3",
    title: "Facebook Trade Personalities outreach",
    description: "Identify and DM Facebook personalities with large trade worker followings.",
    category: "Content & Social",
    status: "todo",
    createdAt: "2026-05-20",
  },
  // Business Plan
  {
    id: "b1",
    title: "Finalize BCU Business Plan",
    description: "Review and finalize business-plan.md before sharing with Jason's contact this week.",
    category: "Business Plan",
    status: "in-progress",
    createdAt: "2026-05-20",
  },
  {
    id: "b2",
    title: "Build one-pager pitch deck",
    description: "Create condensed pitch deck for tailgate events and cold outreach.",
    category: "Business Plan",
    status: "todo",
    createdAt: "2026-05-20",
  },
  // Email Sequences
  {
    id: "e1",
    title: "Email Nurture — Welcome email live",
    description: "Jason reviewed and approved emails in email-nurture.md. API route deployed.",
    category: "Email Sequences",
    status: "done",
    createdAt: "2026-05-21",
  },
  {
    id: "e2",
    title: "Email Nurture — 3-day follow up",
    description: "Drafted as 'What's BCU Actually Building?' in email-nurture.md. Sent via queue processor.",
    category: "Email Sequences",
    status: "todo",
    createdAt: "2026-05-21",
  },
  {
    id: "e3",
    title: "Email Nurture — 7-day founding push",
    description: "Drafted as 'Founding Member Push' in email-nurture.md. Sent via queue processor.",
    category: "Email Sequences",
    status: "todo",
    createdAt: "2026-05-21",
  },
  // Events
  {
    id: "ev1",
    title: "Schedule tailgate city events",
    description: "Lake Charles, Sulphur, Texas City, Beaumont, Port Arthur, Pascagoula, Galveston.",
    category: "Events",
    status: "todo",
    createdAt: "2026-05-20",
  },
];

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

export default function BoardPage() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [showModal, setShowModal] = useState(false);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: "",
    description: "",
    category: "Vendor Outreach",
    status: "todo",
  });

  const handleDragStart = (task: Task) => setDraggedTask(task);
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleDrop = (status: Status) => {
    if (draggedTask) {
      setTasks((prev) =>
        prev.map((t) => (t.id === draggedTask.id ? { ...t, status } : t))
      );
      setDraggedTask(null);
    }
  };

  const handleCreateTask = () => {
    if (!newTask.title) return;
    const task: Task = {
      id: generateId(),
      title: newTask.title!,
      description: newTask.description || "",
      category: newTask.category as Category,
      status: newTask.status as Status,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setTasks((prev) => [task, ...prev]);
    setShowModal(false);
    setNewTask({ title: "", description: "", category: "Vendor Outreach", status: "todo" });
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const getTasksByStatus = (status: Status) => tasks.filter((t) => t.status === status);

  const STATUSES: Status[] = ["todo", "in-progress", "waiting", "done"];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4">
      {/* Header */}
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-400">BCU Mission Board</h1>
          <p className="text-slate-400 text-sm mt-1">Tracking everything BCU</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-500 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all"
        >
          + Add Task
        </button>
      </header>

      {/* Board */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {STATUSES.map((status) => {
          const config = STATUS_CONFIG[status];
          const columnTasks = getTasksByStatus(status);

          return (
            <div
              key={status}
              className={`bg-slate-900/50 border-2 ${config.border} rounded-xl p-3 min-h-[500px]`}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(status)}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-2.5 h-2.5 rounded-full ${config.color}`} />
                <h2 className="text-sm font-semibold">{config.label}</h2>
                <span className="ml-auto text-slate-500 text-xs">{columnTasks.length}</span>
              </div>

              <div className="space-y-2">
                {columnTasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={() => handleDragStart(task)}
                    className={`bg-slate-800/80 border ${CATEGORY_COLORS[task.category].split(" ")[1]} border-${CATEGORY_COLORS[task.category].split(" ")[0]} rounded-lg p-3 cursor-grab hover:border-slate-600 hover:bg-slate-800 transition-all group`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-sm text-slate-100">{task.title}</h3>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">{task.description}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity ml-1 text-xs"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${CATEGORY_COLORS[task.category]}`}>
                        {task.category}
                      </span>
                    </div>
                  </div>
                ))}

                {columnTasks.length === 0 && (
                  <div className="text-center text-slate-700 py-8 text-xs border-2 border-dashed border-slate-800 rounded-lg">
                    Drop tasks here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Add New Task</h2>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Title</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                  placeholder="Task title..."
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 resize-none"
                  rows={2}
                  placeholder="What needs to happen..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Category</label>
                  <select
                    value={newTask.category}
                    onChange={(e) => setNewTask((prev) => ({ ...prev, category: e.target.value as Category }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                  >
                    {(Object.keys(CATEGORY_COLORS) as Category[]).map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Status</label>
                  <select
                    value={newTask.status}
                    onChange={(e) => setNewTask((prev) => ({ ...prev, status: e.target.value as Status }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTask}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold text-sm transition-all"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}