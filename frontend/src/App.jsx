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
    getClients().then(setClients).finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh", position: "relative", zIndex: 1 }}>
      {/* Ambient background glow */}
      <div style={{
        position: "fixed", top: -200, left: -200, width: 600, height: 600,
        background: "radial-gradient(circle, rgba(0,212,170,0.04) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} />
      <div style={{
        position: "fixed", bottom: -200, right: -100, width: 500, height: 500,
        background: "radial-gradient(circle, rgba(116,185,255,0.03) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} />

      {/* Sidebar */}
      <aside style={{
        width: 272,
        background: "var(--surface)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        position: "relative",
        zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{
          padding: "28px 24px 24px",
          borderBottom: "1px solid var(--border)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: "linear-gradient(135deg, var(--accent), #00b4d8)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, boxShadow: "0 0 12px rgba(0,212,170,0.3)",
            }}>⬡</div>
            <div style={{ fontFamily: "var(--font-ui)", fontWeight: 800, fontSize: 16, letterSpacing: "-0.3px" }}>
              LedgersCFO
            </div>
          </div>
          <div style={{
            fontSize: 11, color: "var(--muted)", fontFamily: "var(--font-mono)",
            letterSpacing: "0.05em", paddingLeft: 38,
          }}>
            compliance tracker
          </div>
        </div>

        <ClientList clients={clients} selected={selected} onSelect={setSelected} loading={loading} />

        {/* Footer */}
        <div style={{
          padding: "16px 24px", borderTop: "1px solid var(--border)",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <div style={{
            width: 6, height: 6, borderRadius: "50%",
            background: "var(--accent)",
            animation: "pulse-dot 2s ease infinite",
            boxShadow: "0 0 6px var(--accent)",
          }} />
          <span style={{ fontSize: 11, color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
            {clients.length} clients loaded
          </span>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative", zIndex: 1 }}>
        {selected ? (
          <>
            <StatsBar client={selected} />
            <TaskList client={selected} />
          </>
        ) : (
          <div style={{
            flex: 1, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 16,
            animation: "fadeIn 0.5s ease",
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: 20,
              background: "var(--surface2)",
              border: "1px solid var(--border2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 28, marginBottom: 8,
            }}>📋</div>
            <div style={{
              fontFamily: "var(--font-serif)", fontSize: 28,
              fontStyle: "italic", color: "var(--text2)",
            }}>
              Select a client
            </div>
            <div style={{ fontSize: 13, color: "var(--muted)", maxWidth: 280, textAlign: "center", lineHeight: 1.7 }}>
              Choose a client from the sidebar to view and manage their compliance tasks
            </div>
            <div style={{
              marginTop: 8, display: "flex", gap: 6, alignItems: "center",
              fontSize: 11, color: "var(--muted)", fontFamily: "var(--font-mono)",
            }}>
              <span style={{
                padding: "2px 8px", background: "var(--surface2)",
                border: "1px solid var(--border)", borderRadius: 4,
              }}>←</span>
              <span>from the sidebar</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}