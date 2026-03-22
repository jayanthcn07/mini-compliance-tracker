import React, { useState, useEffect, useCallback } from "react";
import { getTasks } from "../api";
import TaskCard from "./TaskCard";
import AddTaskModal from "./AddTaskModal";

const STATUSES = ["", "Pending", "In Progress", "Completed"];
const CATEGORIES = ["", "Tax Filing", "Audit", "Payroll", "Legal", "Regulatory", "Other"];

export default function TaskList({ client }) {
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({ status: "", category: "" });
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    getTasks(client._id, filters)
      .then(setTasks)
      .finally(() => setLoading(false));
  }, [client._id, filters]);

  useEffect(() => { load(); }, [load]);

  const filtered = tasks.filter((t) =>
    search === "" ||
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.description?.toLowerCase().includes(search.toLowerCase())
  );

  const selectStyle = {
    background: "var(--surface2)", border: "1px solid var(--border)",
    color: "var(--text)", borderRadius: "var(--radius)", padding: "6px 10px",
    outline: "none", cursor: "pointer",
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Header */}
      <div style={{
        padding: "16px 24px", borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
      }}>
        <div style={{ fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 600, marginRight: "auto" }}>
          {client.company_name}
        </div>
        <input
          placeholder="Search tasks…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ ...selectStyle, width: 180 }}
        />
        <select style={selectStyle} value={filters.status}
          onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}>
          {STATUSES.map((s) => <option key={s} value={s}>{s || "All Statuses"}</option>)}
        </select>
        <select style={selectStyle} value={filters.category}
          onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c || "All Categories"}</option>)}
        </select>
        <button
          onClick={() => setShowAdd(true)}
          style={{
            background: "var(--accent)", color: "#0f0f0f", border: "none",
            borderRadius: "var(--radius)", padding: "7px 16px", fontWeight: 500,
          }}>
          + Add Task
        </button>
      </div>

      {/* Task Grid */}
      <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
        {loading ? (
          <div style={{ color: "var(--muted)" }}>Loading tasks…</div>
        ) : filtered.length === 0 ? (
          <div style={{ color: "var(--muted)" }}>No tasks found.</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
            {filtered.map((task) => (
              <TaskCard key={task._id} task={task} onUpdate={load} />
            ))}
          </div>
        )}
      </div>

      {showAdd && (
        <AddTaskModal
          clientId={client._id}
          onClose={() => setShowAdd(false)}
          onCreated={load}
        />
      )}
    </div>
  );
}