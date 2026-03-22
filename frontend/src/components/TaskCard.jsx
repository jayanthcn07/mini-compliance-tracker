import React from "react";
import { updateTaskStatus } from "../api";

const priorityColor = { High: "var(--danger)", Medium: "var(--warn)", Low: "var(--blue)" };
const statusColors = {
  "Pending": "var(--warn)",
  "In Progress": "var(--blue)",
  "Completed": "var(--accent)",
};
const NEXT_STATUS = {
  "Pending": "In Progress",
  "In Progress": "Completed",
  "Completed": null,
};

export default function TaskCard({ task, onUpdate }) {
  const now = new Date();
  const due = new Date(task.due_date);
  const isOverdue = task.status !== "Completed" && due < now;

  const advance = async () => {
    const next = NEXT_STATUS[task.status];
    if (!next) return;
    await updateTaskStatus(task._id, next);
    onUpdate();
  };

  return (
    <div style={{
      background: "var(--surface)",
      border: `1px solid ${isOverdue ? "var(--danger)" : "var(--border)"}`,
      borderRadius: "var(--radius)",
      padding: 16,
      display: "flex",
      flexDirection: "column",
      gap: 10,
      boxShadow: isOverdue ? "0 0 0 1px var(--danger)20" : "none",
      transition: "border-color 0.2s",
    }}>
      {/* Top row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <div style={{ fontWeight: 500, color: "var(--text)", lineHeight: 1.4 }}>{task.title}</div>
        <span style={{
          fontSize: 10, padding: "2px 8px", borderRadius: 20,
          background: `${priorityColor[task.priority]}18`,
          color: priorityColor[task.priority],
          border: `1px solid ${priorityColor[task.priority]}40`,
          whiteSpace: "nowrap", flexShrink: 0,
        }}>
          {task.priority}
        </span>
      </div>

      {task.description && (
        <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>{task.description}</div>
      )}

      {/* Meta */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <span style={{
          fontSize: 11, background: "var(--surface2)", color: "var(--muted)",
          padding: "2px 8px", borderRadius: 4,
        }}>{task.category}</span>
        {isOverdue && (
          <span style={{
            fontSize: 11, color: "var(--danger)",
            padding: "2px 8px", borderRadius: 4,
            background: "var(--danger)15", border: "1px solid var(--danger)40",
          }}>⚠ Overdue</span>
        )}
      </div>

      {/* Due date */}
      <div style={{ fontSize: 11, color: isOverdue ? "var(--danger)" : "var(--muted)" }}>
        Due: {due.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
      </div>

      {/* Footer */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
        <span style={{
          fontSize: 11, padding: "3px 10px", borderRadius: 20,
          color: statusColors[task.status],
          background: `${statusColors[task.status]}18`,
          border: `1px solid ${statusColors[task.status]}40`,
        }}>{task.status}</span>

        {NEXT_STATUS[task.status] && (
          <button
            onClick={advance}
            style={{
              fontSize: 11, padding: "4px 12px", borderRadius: 4,
              background: "var(--surface2)", border: "1px solid var(--border)",
              color: "var(--text)", transition: "background 0.15s",
            }}
            onMouseOver={(e) => e.target.style.background = "var(--border)"}
            onMouseOut={(e) => e.target.style.background = "var(--surface2)"}
          >
            → {NEXT_STATUS[task.status]}
          </button>
        )}
      </div>
    </div>
  );
}