"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import Loading from "../ui/Loading";
import { Play, Pause } from "lucide-react";

type User = {
  id: string;
  name: string;
  phone: string;
  bloodGroup: string;
  panchayath: string;
  ward: string;
  password: string;
  createdAt?: Timestamp;
};

export default function AdminPanel() {
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const [newPanchayath, setNewPanchayath] = useState("");
  const [newWard, setNewWard] = useState("");
  const [configMsg, setConfigMsg] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setAudio(new Audio("/assets/Fernando Alonso.mp3"));
  }, []);

  const togglePlay = () => {
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const deleteUser = async (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      await deleteDoc(doc(db, "users", id));
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  // Fetch users
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as User));
        setUsers(data);
      } catch {
        setConfigMsg("Failed to load users.");
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  const savePanchayaths = async () => {
    if (!newPanchayath.trim()) {
      setConfigMsg("Please enter panchayaths.");
      return;
    }
    try {
      const names = newPanchayath
        .split(",")
        .map((n) => n.trim())
        .filter(Boolean);
      await setDoc(doc(db, "config", "panchayaths"), { names });
      setConfigMsg("Panchayaths saved successfully!");
      setNewPanchayath("");
    } catch {
      setConfigMsg("Failed to save panchayaths.");
    }
  };

  const saveWards = async () => {
    if (!newWard.trim()) {
      setConfigMsg("Please enter wards.");
      return;
    }
    try {
      const numbers = newWard
        .split(",")
        .map((n) => n.trim())
        .filter(Boolean);
      await setDoc(doc(db, "config", "wards"), { numbers });
      setConfigMsg("Wards saved successfully!");
      setNewWard("");
    } catch {
      setConfigMsg("Failed to save wards.");
    }
  };

  const cardStyle: React.CSSProperties = {
    background: "#141417",
    borderRadius: "16px",
    padding: "24px",
    marginBottom: "24px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "#1C1C21",
    border: "none",
    borderRadius: "10px",
    padding: "12px 14px",
    color: "#EDEDEF",
    fontFamily: "inherit",
    fontSize: "14px",
    outline: "none",
    marginBottom: "12px",
    boxSizing: "border-box",
  };

  const btnStyle: React.CSSProperties = {
    padding: "12px 24px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(180deg, #4FD1C5 0%, #2C7A73 100%)",
    color: "#0C1416",
    fontSize: "14px",
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
  };

  const tableStyle: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "13px",
  };

  const thStyle: React.CSSProperties = {
    textAlign: "left",
    padding: "12px",
    color: "#8A8A92",
    fontWeight: 600,
    borderBottom: "1px solid #2A2A2F",
  };

  const tdStyle: React.CSSProperties = {
    padding: "12px",
    color: "#EDEDEF",
    borderBottom: "1px solid #2A2A2F",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0A0A0C",
        fontFamily: "'Sora', 'Segoe UI', Arial, sans-serif",
        padding: "40px 16px",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap"
        rel="stylesheet"
      />
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1
            style={{
              margin: "0 0 8px",
              fontSize: "32px",
              fontWeight: 800,
              color: "#FFFFFF",
              letterSpacing: "-0.5px",
            }}
          >
            Admin Panel
          </h1>
          <button
            onClick={togglePlay}
            style={{
              background: "none",
              border: "none",
              color: isPlaying ? "#4FD1C5" : "#8A8A92",
              cursor: "pointer",
            }}
          >
            {isPlaying ? <Pause size={32} /> : <Play size={32} />}
          </button>
        </div>
        <p style={{ color: "#8A8A92", fontSize: "14px", marginBottom: "32px" }}>
          Manage configurations and view registered users
        </p>

        {/* Config Section */}
        {isOffline && (
          <div style={{ ...cardStyle, background: "#ef444420", border: "1px solid #ef4444" }}>
            <p style={{ color: "#ef4444", margin: 0 }}>You are currently offline. Changes will not be saved.</p>
          </div>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          <div style={cardStyle}>
            <h2 style={{ margin: "0 0 16px", fontSize: "18px", color: "#4FD1C5" }}>
              Panchayaths
            </h2>
            <p style={{ color: "#8A8A92", fontSize: "12px", marginBottom: "12px" }}>
              Enter comma-separated names
            </p>
            <input
              type="text"
              placeholder="e.g. Haripad, Cheppad, Krishnapuram"
              value={newPanchayath}
              onChange={(e) => setNewPanchayath(e.target.value)}
              style={inputStyle}
            />
            <button onClick={savePanchayaths} style={btnStyle}>
              Save Panchayaths
            </button>
          </div>

          <div style={cardStyle}>
            <h2 style={{ margin: "0 0 16px", fontSize: "18px", color: "#4FD1C5" }}>
              Wards
            </h2>
            <p style={{ color: "#8A8A92", fontSize: "12px", marginBottom: "12px" }}>
              Enter comma-separated numbers
            </p>
            <input
              type="text"
              placeholder="e.g. 1, 2, 3, 4, 5"
              value={newWard}
              onChange={(e) => setNewWard(e.target.value)}
              style={inputStyle}
            />
            <button onClick={saveWards} style={btnStyle}>
              Save Wards
            </button>
          </div>
        </div>

        {configMsg && (
          <p
            style={{
              color: configMsg.includes("success") ? "#4FD1C5" : "#ef4444",
              fontSize: "13px",
              marginBottom: "24px",
            }}
          >
            {configMsg}
          </p>
        )}

        {/* Users Table */}
        <div style={cardStyle}>
          <h2 style={{ margin: "0 0 16px", fontSize: "18px", color: "#4FD1C5" }}>
            Registered Users
          </h2>
          {loadingUsers ? (
            <Loading />
          ) : users.length === 0 ? (
            <p style={{ color: "#8A8A92" }}>No users registered yet.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Name</th>
                    <th style={thStyle}>Phone</th>
                    <th style={thStyle}>Blood Group</th>
                    <th style={thStyle}>Panchayath</th>
                    <th style={thStyle}>Ward</th>
                    <th style={thStyle}>Password</th>
                    <th style={thStyle}>Registered</th>
                    <th style={thStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td style={tdStyle}>{u.name}</td>
                      <td style={tdStyle}>{u.phone}</td>
                      <td style={tdStyle}>{u.bloodGroup}</td>
                      <td style={tdStyle}>{u.panchayath}</td>
                      <td style={tdStyle}>{u.ward}</td>
                      <td
                        style={{
                          ...tdStyle,
                          fontFamily: "monospace",
                          letterSpacing: "1px",
                          color: "#4FD1C5",
                        }}
                      >
                        {u.password}
                      </td>
                      <td style={tdStyle}>
                        {u.createdAt
                          ? u.createdAt.toDate().toLocaleString()
                          : "N/A"}
                      </td>
                      <td style={tdStyle}>
                        <button
                          onClick={() => deleteUser(u.id)}
                          style={{
                            background: "#ef4444",
                            color: "white",
                            border: "none",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "12px",
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
