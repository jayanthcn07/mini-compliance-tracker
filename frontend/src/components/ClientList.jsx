import React, { useState } from "react";

const entityColors = {
  "LLC": "var(--accent)",
  "Corporation": "var(--blue)",
  "Partnership": "var(--purple)",
  "Sole Proprietorship": "var(--warn)",
  "Other": "var(--muted)",
};

export default function ClientList({ clients, selected, onSelect, loading }) {
  const [search, setSearch] = useState("");

  const filtered = clients.filter((c) =>
    c.company_name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div style={{ flex: 1, padding: 24 }}>
      {[...Array(4)].map((_, i) => (
        <div key={i} style={{
          height: 56, borderRadius: "var(--radius)", marginBottom: 8,
          background: "linear-gradient(90deg, var(--surface2) 25%, var(--surface3) 50%, var(--surface2) 75%)",
          backgroundSize: "200% 100%",
          animation: `shimmer 1.5s infinite ${i * 0.1}s`,
        }} />
      ))}
    </div>
  );

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Search */}
      <div style={{ padding: "16px 16px 8px" }}>
        <div style={{ position: "relative" }}>
          <span style={{
            position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)",
            color: "var(--muted)", fontSize: 12, pointerEvents: "none",
          }}>⌕</span>
          <input
            placeholder="Search clients…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%", background: "var(--surface2)",
              border: "1px solid var(--border)", color: "var(--text)",
              borderRadius: "var(--radius-sm)", padding: "7px 10px 7px 28px",
              outline: "none", transition: "border-color 0.2s",
            }}
            onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
            onBlur={(e) => e.target.style.borderColor = "var(--border)"}
          />
        </div>
      </div>

      {/* Label */}
      <div style={{
        padding: "8px 20px 6px",
        fontSize: 10, color: "var(--muted)",
        fontFamily: "var(--font-mono)",
        textTransform: "uppercase", letterSpacing: "0.1em",
      }}>
        Clients / {filtered.length}
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 8px 8px" }}>
        {filtered.map((c, i) => {
          const isSelected = selected?._id === c._id;
          return (
            <button
              key={c._id}
              onClick={() => onSelect(c)}
              style={{
                width: "100%", textAlign: "left",
                padding: "10px 12px",
                background: isSelected ? "var(--surface3)" : "transparent",
                border: "1px solid transparent",
                borderColor: isSelected ? "var(--border2)" : "transparent",
                borderRadius: "var(--radius)",
                marginBottom: 2,
                color: "var(--text)",
                transition: "all 0.15s ease",
                display: "flex", alignItems: "center", gap: 10,
                animation: `fadeUp 0.3s ease both`,
                animationDelay: `${i * 0.04}s`,
              }}
              onMouseOver={(e) => { if (!isSelected) e.currentTarget.style.background = "var(--surface2)"; }}
              onMouseOut={(e) => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
            >
              {/* Avatar */}
              <div style={{
                width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                background: `linear-gradient(135deg, ${entityColors[c.entity_type] || "var(--muted)"}22, ${entityColors[c.entity_type] || "var(--muted)"}44)`,
                border: `1px solid ${entityColors[c.entity_type] || "var(--muted)"}33`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700, color: entityColors[c.entity_type] || "var(--muted)",
              }}>
                {c.company_name.charAt(0)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontWeight: 600, fontSize: 13,
                  color: isSelected ? "var(--text)" : "var(--text2)",
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>
                  {c.company_name}
                </div>
                <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 1 }}>
                  {c.country} · {c.entity_type}
                </div>
              </div>
              {isSelected && (
                <div style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--accent)", flexShrink: 0 }} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}