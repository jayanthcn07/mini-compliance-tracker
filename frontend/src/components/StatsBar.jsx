import React, { useEffect, useState } from "react";
import { getTasks } from "../api";

export default function StatsBar({ client }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    getTasks(client._id).then(setTasks);
  }, [client._id]);

  const now = new Date();
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "Completed").length;
  const pending = tasks.filter((t) => t.status === "Pending").length;
  const overdue = tasks.filter(
    (t) => t.status !== "Completed" && new Date(t.due_date) < now
  ).length;

  const stats = [
    { label: "Total", value: total, color: "var(--text)" },
    { label: "Pending", value: pending, color: "var(--warn)" },
    { label: "Completed", value: completed, color: "var(--accent)" },
    { label: "Overdue", value: overdue, color: "var(--danger)" },
  ];

  return (
    <div style={{
      display: "flex", gap: 0, borderBottom: "1px solid var(--border)",
      background: "var(--surface)",
    }}>
      {stats.map((s) => (
        <div key={s.label} style={{
          flex: 1, padding: "16px 24px",
          borderRight: "1px solid var(--border)",
        }}>
          <div style={{ fontSize: 24, fontFamily: "var(--font-serif)", fontWeight: 600, color: s.color }}>
            {s.value}
          </div>
          <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1 }}>
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}