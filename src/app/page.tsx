"use client";

import { useState } from "react";

interface Tool {
  id: string;
  name: string;
  description: string;
  status: "backlog" | "in-progress" | "done";
  priority: "low" | "medium" | "high" | "critical";
  category: string;
  createdAt: Date;
}

const categories = [
  "API Integration",
  "UI Component",
  "Automation",
  "Data Processing",
  "Security",
  "Infrastructure",
  "Testing",
  "Documentation",
];

const priorityColors = {
  low: "bg-blue-500",
  medium: "bg-yellow-500",
  high: "bg-orange-500",
  critical: "bg-red-600",
};

const statusConfig = {
  backlog: { label: "Backlog", color: "bg-slate-600", border: "border-slate-500" },
  "in-progress": { label: "In Progress", color: "bg-cyan-600", border: "border-cyan-500" },
  done: { label: "Done", color: "bg-emerald-600", border: "border-emerald-500" },
};

const initialTools: Tool[] = [
  {
    id: "1",
    name: "Weather API Connector",
    description: "Integrate weather data API for location-based forecasts",
    status: "in-progress",
    priority: "high",
    category: "API Integration",
    createdAt: new Date("2026-04-19"),
  },
  {
    id: "2",
    name: "Dashboard Theme Switcher",
    description: "Add light/dark mode toggle with system preference detection",
    status: "backlog",
    priority: "medium",
    category: "UI Component",
    createdAt: new Date("2026-04-18"),
  },
  {
    id: "3",
    name: "Auto Backup System",
    description: "Schedule automated backups of configuration files",
    status: "backlog",
    priority: "critical",
    category: "Automation",
    createdAt: new Date("2026-04-17"),
  },
  {
    id: "4",
    name: "Log Analyzer",
    description: "Parse and visualize application logs",
    status: "done",
    priority: "medium",
    category: "Data Processing",
    createdAt: new Date("2026-04-15"),
  },
  {
    id: "5",
    name: "API Key Validator",
    description: "Validate and rotate API keys securely",
    status: "in-progress",
    priority: "high",
    category: "Security",
    createdAt: new Date("2026-04-16"),
  },
];

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

export default function MissionControl() {
  const [tools, setTools] = useState<Tool[]>(initialTools);
  const [showModal, setShowModal] = useState(false);
  const [draggedTool, setDraggedTool] = useState<Tool | null>(null);
  const [newTool, setNewTool] = useState<Partial<Tool>>({
    name: "",
    description: "",
    status: "backlog",
    priority: "medium",
    category: categories[0],
  });

  const handleDragStart = (tool: Tool) => {
    setDraggedTool(tool);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (status: Tool["status"]) => {
    if (draggedTool) {
      setTools((prev) =>
        prev.map((t) => (t.id === draggedTool.id ? { ...t, status } : t))
      );
      setDraggedTool(null);
    }
  };

  const handleCreateTool = () => {
    if (!newTool.name) return;
    const tool: Tool = {
      id: generateId(),
      name: newTool.name!,
      description: newTool.description || "",
      status: newTool.status as Tool["status"],
      priority: newTool.priority as Tool["priority"],
      category: newTool.category || categories[0],
      createdAt: new Date(),
    };
    setTools((prev) => [tool, ...prev]);
    setShowModal(false);
    setNewTool({
      name: "",
      description: "",
      status: "backlog",
      priority: "medium",
      category: categories[0],
    });
  };

  const handleDeleteTool = (id: string) => {
    setTools((prev) => prev.filter((t) => t.id !== id));
  };

  const getToolsByStatus = (status: Tool["status"]) =>
    tools.filter((t) => t.status === status);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              🚀 Mission Control
            </h1>
            <p className="text-slate-400 mt-1">Custom Tools Command Center</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 px-6 py-3 rounded-lg font-semibold transition-all shadow-lg shadow-cyan-900/50"
          >
            + New Tool
          </button>
        </div>

        {/* Stats Bar */}
        <div className="flex gap-4 mt-6">
          {(["backlog", "in-progress", "done"] as const).map((status) => {
            const count = getToolsByStatus(status).length;
            const config = statusConfig[status];
            return (
              <div
                key={status}
                className="bg-slate-900/50 border border-slate-800 rounded-lg px-4 py-2 flex items-center gap-2"
              >
                <div className={`w-2 h-2 rounded-full ${config.color}`} />
                <span className="text-slate-300 text-sm">{config.label}</span>
                <span className="bg-slate-800 px-2 py-0.5 rounded text-xs font-mono">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </header>

      {/* Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(["backlog", "in-progress", "done"] as const).map((status) => {
          const config = statusConfig[status];
          const columnTools = getToolsByStatus(status);

          return (
            <div
              key={status}
              className={`bg-slate-900/30 border-2 ${config.border} rounded-xl p-4 min-h-[500px]`}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(status)}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-3 h-3 rounded-full ${config.color}`} />
                <h2 className="text-lg font-semibold">{config.label}</h2>
                <span className="ml-auto text-slate-500 text-sm">
                  {columnTools.length} tools
                </span>
              </div>

              <div className="space-y-3">
                {columnTools.map((tool) => (
                  <div
                    key={tool.id}
                    draggable
                    onDragStart={() => handleDragStart(tool)}
                    className="bg-slate-800/80 border border-slate-700 rounded-lg p-4 cursor-grab hover:border-slate-600 hover:bg-slate-800 transition-all group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-slate-100">
                          {tool.name}
                        </h3>
                        <p className="text-sm text-slate-400 mt-1 line-clamp-2">
                          {tool.description}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteTool(tool.id)}
                        className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium text-white ${priorityColors[tool.priority]}`}
                      >
                        {tool.priority}
                      </span>
                      <span className="text-xs text-slate-500">
                        {tool.category}
                      </span>
                    </div>
                  </div>
                ))}

                {columnTools.length === 0 && (
                  <div className="text-center text-slate-600 py-8 border-2 border-dashed border-slate-800 rounded-lg">
                    Drop tools here
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
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Tool</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={newTool.name}
                  onChange={(e) =>
                    setNewTool((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  placeholder="Tool name..."
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">
                  Description
                </label>
                <textarea
                  value={newTool.description}
                  onChange={(e) =>
                    setNewTool((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500 resize-none"
                  rows={3}
                  placeholder="What does this tool do..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">
                    Priority
                  </label>
                  <select
                    value={newTool.priority}
                    onChange={(e) =>
                      setNewTool((prev) => ({
                        ...prev,
                        priority: e.target.value as Tool["priority"],
                      }))
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-1">
                    Category
                  </label>
                  <select
                    value={newTool.category}
                    onChange={(e) =>
                      setNewTool((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTool}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-lg font-semibold transition-all"
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