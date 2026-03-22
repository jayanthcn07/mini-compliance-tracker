import React, { useState, useEffect } from "react";
import { createTask } from "../api";

const CATEGORIES = ["Tax Filing", "Audit", "Payroll", "Legal", "Regulatory", "Other"];
const PRIORITIES = ["Low", "Medium", "High"];

export default function AddTaskModal({ clientId, onClose, onCreated }) {
  const [form, setForm] = useState({
    title: "", description: "", category: "Other", due_date: "", priority: "Medium",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.title.trim() || !form.due_date) {
      setError("Title and due date are required.");
      return;
    }
    setLoading(true);
    try {
      await createTask({ ...form, client_id: clientId });
      onCreated();
      onClose();
    } catch {
      setError("Failed to create task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    background: "var(--surface2)",
    border: "1px solid var(--border)",
    color: "var(--text)",
    borderRadius: "var(--radius)",
    padding: "10px 14px",
    outline: "none",
    transition: "border-color 0.2s",
    lineHeight: 1.5,
  };
  const labelStyle = {
    fontSize: 11, color: "var(--muted)",
    textTransform: "uppercase", letterSpacing: "0.08em",
    marginBottom: 6, display: "block",
    fontFamily: "var(--font-mono)",
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0,
        background: "rgba(8,12,18,0.85)",
        backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 100, animation: "fadeIn 0.2s ease",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border2)",
        borderRadius: "var(--radius-lg)",
        padding: 32, width: 460,
        boxShadow: "var(--shadow-lg)",
        animation: "fadeUp 0.25s ease",
        display: "flex", flexDirection: "column", gap: 20,
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontStyle: "italic" }}>
              New Task
            </div>
            <div style={{ fontSize: 11, color: "var(--muted)", fontFamily: "var(--font-mono)", marginTop: 2 }}>
              Press Esc to cancel
            </div>
          </div>
          <button onClick={onClose} style={{
            background: "var(--surface2)", border: "1px solid var(--border)",
            color: "var(--muted)", width: 32, height: 32, borderRadius: 8,
            fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.15s",
          }}
            onMouseOver={(e) => { e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.borderColor = "var(--border2)"; }}
            onMouseOut={(e) => { e.currentTarget.style.color = "var(--muted)"; e.currentTarget.style.borderColor = "var(--border)"; }}
          >✕</button>
        </div>

        {error && (
          <div style={{
            fontSize: 12, color: "var(--danger)", padding: "10px 14px",
            background: "rgba(255,107,107,0.08)", border: "1px solid rgba(255,107,107,0.2)",
            borderRadius: "var(--radius-sm)",
          }}>{error}</div>
        )}

        {/* Title */}
        <div>
          <label style={labelStyle}>Title *</label>
          <input
            style={inputStyle} value={form.title} autoFocus
            onChange={(e) => set("title", e.target.value)}
            placeholder="e.g. Q2 GST Filing"
            onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
            onBlur={(e) => e.target.style.borderColor = "var(--border)"}
          />
        </div>

        {/* Description */}
        <div>
          <label style={labelStyle}>Description</label>
          <textarea
            style={{ ...inputStyle, resize: "vertical", minHeight: 80 }}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Optional details…"
            onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
            onBlur={(e) => e.target.style.borderColor = "var(--border)"}
          />
        </div>

        {/* Category + Priority */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div>
            <label style={labelStyle}>Category</label>
            <select style={inputStyle} value={form.category} onChange={(e) => set("category", e.target.value)}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Priority</label>
            <select style={inputStyle} value={form.priority} onChange={(e) => set("priority", e.target.value)}>
              {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>
        </div>

        {/* Due Date */}
        <div>
          <label style={labelStyle}>Due Date *</label>
          <input
            type="date" style={inputStyle} value={form.due_date}
            onChange={(e) => set("due_date", e.target.value)}
            onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
            onBlur={(e) => e.target.style.borderColor = "var(--border)"}
          />
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", paddingTop: 4 }}>
          <button onClick={onClose} style={{
            padding: "10px 20px", background: "transparent",
            border: "1px solid var(--border)", color: "var(--text2)",
            borderRadius: "var(--radius)", transition: "all 0.15s",
          }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = "var(--border2)"; e.currentTarget.style.color = "var(--text)"; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text2)"; }}
          >Cancel</button>
          <button onClick={submit} disabled={loading} style={{
            padding: "10px 24px", background: loading ? "var(--accent2)" : "var(--accent)",
            border: "none", color: "#080c12",
            borderRadius: "var(--radius)", fontWeight: 700,
            transition: "all 0.15s ease",
            boxShadow: "0 0 16px rgba(0,212,170,0.25)",
          }}
            onMouseOver={(e) => { if (!loading) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 0 24px rgba(0,212,170,0.4)"; }}}
            onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 0 16px rgba(0,212,170,0.25)"; }}
          >
            {loading ? "Creating…" : "Create Task"}
          </button>
        </div>
      </div>
    </div>
  );
}