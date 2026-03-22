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
  const overdue = tasks.filter((t) => t.status !== "Completed" && new Date(t.due_date) < now).length;
  const pct = total ? Math.round((completed / total) * 100) : 0;

  const stats = [
    { label: "Total Tasks", value: total, color: "var(--text)", icon: "◈" },
    { label: "Pending", value: pending, color: "var(--warn)", icon: "◎" },
    { label: "Completed", value: completed, color: "var(--accent)", icon: "◉" },
    { label: "Overdue", value: overdue, color: "var(--danger)", icon: "⚠" },
  ];

  return (
    <div style={{
      background: "var(--surface)",
      borderBottom: "1px solid var(--border)",
      padding: "20px 28px",
      animation: "fadeUp 0.3s ease",
    }}>
      {/* Client header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: "linear-gradient(135deg, var(--accent)22, var(--accent)44)",
          border: "1px solid var(--accent)33",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16, fontWeight: 700, color: "var(--accent)",
        }}>
          {client.company_name.charAt(0)}
        </div>
        <div>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 20, fontStyle: "italic", lineHeight: 1.2 }}>
            {client.company_name}
          </div>
          <div style={{ fontSize: 11, color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
            {client.entity_type} · {client.country}
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginLeft: "auto", textAlign: "right" }}>
          <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 6, fontFamily: "var(--font-mono)" }}>
            completion rate
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 120, height: 4, background: "var(--surface3)",
              borderRadius: 2, overflow: "hidden",
            }}>
              <div style={{
                height: "100%", width: `${pct}%`,
                background: "linear-gradient(90deg, var(--accent), #00b4d8)",
                borderRadius: 2, transition: "width 0.6s ease",
              }} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--accent)", fontFamily: "var(--font-mono)" }}>
              {pct}%
            </span>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {stats.map((s, i) => (
          <div key={s.label} style={{
            background: "var(--surface2)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            padding: "14px 16px",
            display: "flex", alignItems: "center", gap: 12,
            animation: `fadeUp 0.3s ease both`,
            animationDelay: `${i * 0.06}s`,
            transition: "border-color 0.2s",
          }}
            onMouseOver={(e) => e.currentTarget.style.borderColor = `${s.color}44`}
            onMouseOut={(e) => e.currentTarget.style.borderColor = "var(--border)"}
          >
            <div style={{
              fontSize: 18, color: s.color,
              width: 32, height: 32,
              background: `${s.color}12`,
              borderRadius: 8,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: s.color, lineHeight: 1, fontFamily: "var(--font-mono)" }}>
                {s.value}
              </div>
              <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 3, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {s.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}