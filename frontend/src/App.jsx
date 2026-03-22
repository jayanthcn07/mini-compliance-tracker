import React, { useState, useEffect } from "react";
import { getClients } from "./api";
import ClientList from "./components/ClientList";
import TaskList from "./components/TaskList";
import StatsBar from "./components/StatsBar";

export default function App() {
  const [clients, setClients] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getClients()
      .then(setClients)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside style={{
        width: 260, background: "var(--surface)", borderRight: "1px solid var(--border)",
        display: "flex", flexDirection: "column", flexShrink: 0,
      }}>
        <div style={{ padding: "28px 20px 20px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 600, color: "var(--accent)", letterSpacing: "-0.5px" }}>
            LedgersCFO
          </div>
          <div style={{ color: "var(--muted)", fontSize: 11, marginTop: 4 }}>Compliance Tracker</div>
        </div>
        <ClientList
          clients={clients}
          selected={selected}
          onSelect={setSelected}
          loading={loading}
        />
      </aside>

      {/* Main */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {selected ? (
          <>
            <StatsBar client={selected} />
            <TaskList client={selected} />
          </>
        ) : (
          <div style={{
            flex: 1, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 12, color: "var(--muted)"
          }}>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: 32, fontStyle: "italic", color: "var(--border)" }}>
              Select a client
            </div>
            <div style={{ fontSize: 12 }}>Choose a client from the sidebar to view their tasks</div>
          </div>
        )}
      </main>
    </div>
  );
}