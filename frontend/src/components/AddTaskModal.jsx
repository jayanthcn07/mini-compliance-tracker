import React, { useState } from "react";
import { createTask } from "../api";

const CATEGORIES = ["Tax Filing", "Audit", "Payroll", "Legal", "Regulatory", "Other"];
const PRIORITIES = ["Low", "Medium", "High"];

export default function AddTaskModal({ clientId, onClose, onCreated }) {
  const [form, setForm] = useState({
    title: "", description: "", category: "Other",
    due_date: "", priority: "Medium",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      setError("Failed to create task.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", background: "var(--surface2)", border: "1px solid var(--border)",
    color: "var(--text)", borderRadius: "var(--radius)", padding: "8px 12px",
    outline: "none",
  };
  const labelStyle = { fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6, display: "block" };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "#000000cc",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
    }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: "var(--surface)", borderRadius: 12, border: "1px solid var(--border)",
        padding: 28, width: 440, display: "flex", flexDirection: "column", gap: 18,
      }}>
        <div style={{ fontFamily: "var(--font-serif)", fontSize: 20, fontWeight: 600 }}>Add Task</div>

        {error && <div style={{ color: "var(--danger)", fontSize: 12 }}>{error}</div>}

        <div>
          <label style={labelStyle}>Title *</label>
          <input style={inputStyle} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Q2 GST Filing" />
        </div>
        <div>
          <label style={labelStyle}>Description</label>
          <textarea style={{ ...inputStyle, resize: "vertical", minHeight: 70 }}
            value={form.description} onChange={(e) => set("description", e.target.value)} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
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
        <div>
          <label style={labelStyle}>Due Date *</label>
          <input type="date" style={inputStyle} value={form.due_date} onChange={(e) => set("due_date", e.target.value)} />
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{
            padding: "8px 18px", background: "transparent", border: "1px solid var(--border)",
            color: "var(--muted)", borderRadius: "var(--radius)",
          }}>Cancel</button>
          <button onClick={submit} disabled={loading} style={{
            padding: "8px 18px", background: "var(--accent)", border: "none",
            color: "#0f0f0f", borderRadius: "var(--radius)", fontWeight: 500,
          }}>{loading ? "Saving…" : "Add Task"}</button>
        </div>
      </div>
    </div>
  );
}