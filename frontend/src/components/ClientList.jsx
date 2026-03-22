import React from "react";

export default function ClientList({ clients, selected, onSelect, loading }) {
  if (loading) return (
    <div style={{ padding: 20, color: "var(--muted)" }}>Loading clients…</div>
  );

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "12px 0" }}>
      <div style={{ padding: "0 20px 8px", fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1 }}>
        Clients ({clients.length})
      </div>
      {clients.map((c) => (
        <button
          key={c._id}
          onClick={() => onSelect(c)}
          style={{
            width: "100%", textAlign: "left", padding: "10px 20px",
            background: selected?._id === c._id ? "var(--surface2)" : "transparent",
            border: "none", borderLeft: selected?._id === c._id ? "2px solid var(--accent)" : "2px solid transparent",
            color: selected?._id === c._id ? "var(--text)" : "var(--muted)",
            transition: "all 0.15s", cursor: "pointer",
          }}
        >
          <div style={{ fontWeight: 500, color: selected?._id === c._id ? "var(--text)" : "inherit" }}>
            {c.company_name}
          </div>
          <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>
            {c.entity_type} · {c.country}
          </div>
        </button>
      ))}
    </div>
  );
}