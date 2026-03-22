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
    getTasks(client._id, filters).then(setTasks).finally(() => setLoading(false));
  }, [client._id, filters]);

  useEffect(() => { load(); }, [load]);

  const filtered = tasks.filter((t) =>
    search === "" ||
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.description?.toLowerCase().includes(search.toLowerCase())
  );

  const now = new Date();
  const overdueCount = filtered.filter((t) => t.status !== "Completed" && new Date(t.due_date) < now).length;

  const selectStyle = {
    background: "var(--surface2)",
    border: "1px solid var(--border)",
    color: "var(--text2)",
    borderRadius: "var(--radius-sm)",
    padding: "7px 10px",
    outline: "none",
    cursor: "pointer",
    transition: "border-color 0.2s, color 0.2s",
    fontFamily: "var(--font-ui)",
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Toolbar */}
      <div style={{
        padding: "16px 28px",
        borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
        background: "var(--bg2)",
      }}>
        {/* Search */}
        <div style={{ position: "relative", flex: 1, minWidth: 180 }}>
          <span style={{
            position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)",
            color: "var(--muted)", fontSize: 13, pointerEvents: "none",
          }}>⌕</span>
          <input
            placeholder="Search tasks…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              ...selectStyle, width: "100%", paddingLeft: 30,
              color: "var(--text)",
            }}
            onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
            onBlur={(e) => e.target.style.borderColor = "var(--border)"}
          />
        </div>

        <select style={selectStyle} value={filters.status}
          onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}>
          {STATUSES.map((s) => <option key={s} value={s}>{s || "All Statuses"}</option>)}
        </select>

        <select style={selectStyle} value={filters.category}
          onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c || "All Categories"}</option>)}
        </select>

        {overdueCount > 0 && (
          <div style={{
            fontSize: 11, padding: "6px 12px",
            background: "var(--danger)15",
            border: "1px solid var(--danger)33",
            borderRadius: "var(--radius-sm)",
            color: "var(--danger)",
            fontFamily: "var(--font-mono)",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <span style={{ animation: "pulse-dot 1.5s infinite" }}>⚠</span>
            {overdueCount} overdue
          </div>
        )}

        <button
          onClick={() => setShowAdd(true)}
          style={{
            background: "var(--accent)", color: "#080c12",
            border: "none", borderRadius: "var(--radius-sm)",
            padding: "8px 18px", fontWeight: 700,
            fontSize: 13, letterSpacing: "-0.2px",
            transition: "all 0.15s ease",
            display: "flex", alignItems: "center", gap: 6,
            boxShadow: "0 0 16px rgba(0,212,170,0.2)",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "var(--accent2)";
            e.currentTarget.style.boxShadow = "0 0 24px rgba(0,212,170,0.35)";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "var(--accent)";
            e.currentTarget.style.boxShadow = "0 0 16px rgba(0,212,170,0.2)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> Add Task
        </button>
      </div>

      {/* Task count */}
      <div style={{
        padding: "10px 28px",
        fontSize: 11, color: "var(--muted)",
        fontFamily: "var(--font-mono)",
        borderBottom: "1px solid var(--border)",
        background: "var(--bg2)",
      }}>
        {loading ? "Loading…" : `${filtered.length} task${filtered.length !== 1 ? "s" : ""}`}
        {(filters.status || filters.category || search) && " · filtered"}
      </div>

      {/* Grid */}
      <div style={{ flex: 1, overflowY: "auto", padding: 28 }}>
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{
                height: 160, borderRadius: "var(--radius-lg)",
                background: "linear-gradient(90deg, var(--surface) 25%, var(--surface2) 50%, var(--surface) 75%)",
                backgroundSize: "200% 100%",
                animation: `shimmer 1.5s infinite ${i * 0.1}s`,
              }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            height: "100%", display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 12, color: "var(--muted)",
          }}>
            <div style={{ fontSize: 32 }}>◈</div>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: 20, fontStyle: "italic" }}>No tasks found</div>
            <div style={{ fontSize: 12 }}>Try adjusting your filters</div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
            {filtered.map((task, i) => (
              <TaskCard key={task._id} task={task} onUpdate={load} index={i} />
            ))}
          </div>
        )}
      </div>

      {showAdd && (
        <AddTaskModal clientId={client._id} onClose={() => setShowAdd(false)} onCreated={load} />
      )}
    </div>
  );
}