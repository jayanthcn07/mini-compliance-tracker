import React, { useState } from "react";
import { updateTaskStatus } from "../api";

const priorityConfig = {
  High:   { color: "var(--danger)",  bg: "var(--danger)12",  dot: "●" },
  Medium: { color: "var(--warn)",    bg: "var(--warn)12",    dot: "●" },
  Low:    { color: "var(--blue)",    bg: "var(--blue)12",    dot: "●" },
};
const statusConfig = {
  "Pending":     { color: "var(--warn)",   bg: "var(--warn)12",   label: "Pending",     next: "In Progress" },
  "In Progress": { color: "var(--blue)",   bg: "var(--blue)12",   label: "In Progress", next: "Completed" },
  "Completed":   { color: "var(--accent)", bg: "var(--accent)12", label: "Completed",   next: null },
};

export default function TaskCard({ task, onUpdate, index }) {
  const [updating, setUpdating] = useState(false);
  const [hovered, setHovered] = useState(false);

  const now = new Date();
  const due = new Date(task.due_date);
  const isOverdue = task.status !== "Completed" && due < now;
  const daysLeft = Math.ceil((due - now) / 86400000);

  const sc = statusConfig[task.status];
  const pc = priorityConfig[task.priority];

  const advance = async () => {
    if (!sc.next || updating) return;
    setUpdating(true);
    await updateTaskStatus(task._id, sc.next);
    onUpdate();
    setUpdating(false);
  };

  return (
    <div
      onMouseOver={() => setHovered(true)}
      onMouseOut={() => setHovered(false)}
      style={{
        background: hovered ? "var(--surface2)" : "var(--surface)",
        border: `1px solid ${isOverdue ? "rgba(255,107,107,0.3)" : hovered ? "var(--border2)" : "var(--border)"}`,
        borderRadius: "var(--radius-lg)",
        padding: "18px 20px",
        display: "flex", flexDirection: "column", gap: 12,
        transition: "all 0.2s ease",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hovered
          ? isOverdue
            ? "0 8px 32px rgba(255,107,107,0.12)"
            : "0 8px 32px rgba(0,0,0,0.3)"
          : "none",
        animation: `fadeUp 0.35s ease both`,
        animationDelay: `${index * 0.05}s`,
        position: "relative", overflow: "hidden",
        cursor: "default",
      }}
    >
      {/* Overdue glow stripe */}
      {isOverdue && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 2,
          background: "linear-gradient(90deg, transparent, var(--danger), transparent)",
        }} />
      )}

      {/* Top: title + priority */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
        <div style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.4, color: "var(--text)", flex: 1 }}>
          {task.title}
        </div>
        <span style={{
          fontSize: 10, padding: "3px 8px", borderRadius: 20,
          background: pc.bg, color: pc.color,
          border: `1px solid ${pc.color}33`,
          fontFamily: "var(--font-mono)",
          whiteSpace: "nowrap", flexShrink: 0,
          display: "flex", alignItems: "center", gap: 4,
        }}>
          <span style={{ fontSize: 6 }}>{pc.dot}</span>
          {task.priority}
        </span>
      </div>

      {/* Description */}
      {task.description && (
        <div style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.6, }}>
          {task.description}
        </div>
      )}

      {/* Category + overdue badge */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
        <span style={{
          fontSize: 11, background: "var(--surface3)",
          color: "var(--text2)", padding: "3px 10px",
          borderRadius: "var(--radius-sm)",
          border: "1px solid var(--border)",
          fontFamily: "var(--font-mono)",
        }}>{task.category}</span>
        {isOverdue && (
          <span style={{
            fontSize: 11, color: "var(--danger)",
            padding: "3px 10px", borderRadius: "var(--radius-sm)",
            background: "rgba(255,107,107,0.1)",
            border: "1px solid rgba(255,107,107,0.3)",
            fontFamily: "var(--font-mono)",
            display: "flex", alignItems: "center", gap: 4,
          }}>
            <span style={{ animation: "pulse-dot 1.5s infinite" }}>⚠</span>
            Overdue
          </span>
        )}
      </div>

      {/* Due date */}
      <div style={{
        fontSize: 11, color: isOverdue ? "var(--danger)" : "var(--muted)",
        fontFamily: "var(--font-mono)",
        display: "flex", alignItems: "center", gap: 6,
      }}>
        <span>◷</span>
        <span>{due.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
        {!isOverdue && task.status !== "Completed" && daysLeft <= 7 && (
          <span style={{ color: "var(--warn)" }}>· {daysLeft}d left</span>
        )}
        {isOverdue && (
          <span>· {Math.abs(daysLeft)}d ago</span>
        )}
      </div>

      {/* Footer: status + action */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        paddingTop: 12, borderTop: "1px solid var(--border)",
      }}>
        <span style={{
          fontSize: 11, padding: "4px 12px", borderRadius: 20,
          color: sc.color, background: sc.bg,
          border: `1px solid ${sc.color}33`,
          fontFamily: "var(--font-mono)",
        }}>{sc.label}</span>

        {sc.next && (
          <button
            onClick={advance}
            disabled={updating}
            style={{
              fontSize: 11, padding: "5px 14px",
              borderRadius: "var(--radius-sm)",
              background: updating ? "var(--surface3)" : "var(--surface3)",
              border: "1px solid var(--border2)",
              color: updating ? "var(--muted)" : "var(--text)",
              transition: "all 0.15s ease",
              fontFamily: "var(--font-ui)",
              display: "flex", alignItems: "center", gap: 5,
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = "var(--accent)";
              e.currentTarget.style.color = "var(--accent)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = "var(--border2)";
              e.currentTarget.style.color = "var(--text)";
            }}
          >
            {updating ? "…" : `→ ${sc.next}`}
          </button>
        )}

        {!sc.next && (
          <span style={{ fontSize: 16, color: "var(--accent)" }}>✓</span>
        )}
      </div>
    </div>
  );
}