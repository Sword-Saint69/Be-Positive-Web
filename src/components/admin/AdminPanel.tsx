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
    if (confirm("ഈ ഉപയോക്താവിനെ നീക്കം ചെയ്യാൻ ആഗ്രഹിക്കുന്നുണ്ടോ?")) {
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
        setConfigMsg("ഉപയോക്താക്കളുടെ വിവരം ലഭിച്ചില്ല.");
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  const savePanchayaths = async () => {
    if (!newPanchayath.trim()) {
      setConfigMsg("ദയവായി പഞ്ചായത്തുകൾ നൽകുക.");
      return;
    }
    try {
      const names = newPanchayath
        .split(",")
        .map((n) => n.trim())
        .filter(Boolean);
      await setDoc(doc(db, "config", "panchayaths"), { names });
      setConfigMsg("പഞ്ചായത്തുകൾ വിജയകരമായി സേവ് ചെയ്തു!");
      setNewPanchayath("");
    } catch {
      setConfigMsg("പഞ്ചായത്തുകൾ സേവ് ചെയ്യാൻ സാധിച്ചില്ല.");
    }
  };

  const saveWards = async () => {
    if (!newWard.trim()) {
      setConfigMsg("ദയവായി വാർഡുകൾ നൽകുക.");
      return;
    }
    try {
      const numbers = newWard
        .split(",")
        .map((n) => n.trim())
        .filter(Boolean);
      await setDoc(doc(db, "config", "wards"), { numbers });
      setConfigMsg("വാർഡുകൾ വിജയകരമായി സേവ് ചെയ്തു!");
      setNewWard("");
    } catch {
      setConfigMsg("വാർഡുകൾ സേവ് ചെയ്യാൻ സാധിച്ചില്ല.");
    }
  };

  const cardStyle: React.CSSProperties = {
    background: "#FFFFFF",
    borderRadius: "16px",
    padding: "24px",
    marginBottom: "24px",
    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.01)",
    border: "1px solid #E2E8F0",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "#F8FAFC",
    border: "1px solid #CBD5E1",
    borderRadius: "10px",
    padding: "12px 14px",
    color: "#0F172A",
    fontFamily: "'Chilanka', sans-serif",
    fontSize: "14px",
    outline: "none",
    marginBottom: "12px",
    boxSizing: "border-box",
  };

  const btnStyle: React.CSSProperties = {
    padding: "12px 24px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(180deg, #0D9488 0%, #0F766E 100%)",
    color: "#FFFFFF",
    fontSize: "14px",
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "'Chilanka', sans-serif",
    boxShadow: "0 4px 12px rgba(13, 148, 136, 0.2)",
  };

  const tableStyle: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "14px",
    fontFamily: "'Chilanka', sans-serif",
  };

  const thStyle: React.CSSProperties = {
    textAlign: "left",
    padding: "12px",
    color: "#475569",
    fontWeight: 700,
    borderBottom: "2px solid #E2E8F0",
    background: "#F8FAFC",
  };

  const tdStyle: React.CSSProperties = {
    padding: "12px",
    color: "#0F172A",
    borderBottom: "1px solid #E2E8F0",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F1F5F9",
        fontFamily: "'Chilanka', sans-serif",
        padding: "40px 16px",
      }}
    >
      {loadingUsers ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
          }}
        >
          <Loading />
        </div>
      ) : (
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h1
              style={{
                margin: "0 0 8px",
                fontSize: "30px",
                fontWeight: 800,
                color: "#0F172A",
                letterSpacing: "-0.5px",
              }}
            >
              അഡ്മിൻ പാനൽ
            </h1>
            <button
              onClick={togglePlay}
              style={{
                background: "none",
                border: "none",
                color: isPlaying ? "#0D9488" : "#64748B",
                cursor: "pointer",
              }}
            >
              {isPlaying ? <Pause size={32} /> : <Play size={32} />}
            </button>
          </div>
          <p style={{ color: "#64748B", fontSize: "14px", marginBottom: "32px" }}>
            ക്രമീകരണങ്ങൾ നിയന്ത്രിക്കുകയും രജിസ്റ്റർ ചെയ്ത ഉപയോക്താക്കളെ കാണുകയും ചെയ്യുക
          </p>

          {/* Config Section */}
          {isOffline && (
            <div style={{ ...cardStyle, background: "#FEF2F2", border: "1px solid #FCA5A5" }}>
              <p style={{ color: "#DC2626", margin: 0 }}>നിങ്ങൾ ഇപ്പോൾ ഓഫ്ലൈനിലാണ്. മാറ്റങ്ങൾ സേവ് ആകില്ല.</p>
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
            <div style={cardStyle}>
              <h2 style={{ margin: "0 0 16px", fontSize: "18px", color: "#0D9488" }}>
                പഞ്ചായത്തുകൾ
              </h2>
              <p style={{ color: "#64748B", fontSize: "13px", marginBottom: "12px" }}>
                കോമ ഇട്ട് വേർതിരിച്ച് പഞ്ചായത്ത് പേരുകൾ നൽകുക
              </p>
              <input
                type="text"
                placeholder="ഉദാ: ഹരിപ്പാട്, ചെപ്പാട്, കൃഷ്ണപുരം"
                value={newPanchayath}
                onChange={(e) => setNewPanchayath(e.target.value)}
                style={inputStyle}
              />
              <button onClick={savePanchayaths} style={btnStyle}>
                പഞ്ചായത്തുകൾ സേവ് ചെയ്യുക
              </button>
            </div>

            <div style={cardStyle}>
              <h2 style={{ margin: "0 0 16px", fontSize: "18px", color: "#0D9488" }}>
                വാർഡുകൾ
              </h2>
              <p style={{ color: "#64748B", fontSize: "13px", marginBottom: "12px" }}>
                കോമ ഇട്ട് വേർതിരിച്ച് വാർഡ് നമ്പറുകൾ നൽകുക
              </p>
              <input
                type="text"
                placeholder="ഉദാ: 1, 2, 3, 4, 5"
                value={newWard}
                onChange={(e) => setNewWard(e.target.value)}
                style={inputStyle}
              />
              <button onClick={saveWards} style={btnStyle}>
                വാർഡുകൾ സേവ് ചെയ്യുക
              </button>
            </div>
          </div>

          {configMsg && (
            <p
              style={{
                color: configMsg.includes("വിജയകരമായി") ? "#0D9488" : "#DC2626",
                fontSize: "14px",
                marginBottom: "24px",
              }}
            >
              {configMsg}
            </p>
          )}

          {/* Users Table */}
          <div style={cardStyle}>
            <h2 style={{ margin: "0 0 16px", fontSize: "18px", color: "#0D9488" }}>
              രജിസ്റ്റർ ചെയ്ത ഉപയോക്താക്കൾ
            </h2>
            {users.length === 0 ? (
              <p style={{ color: "#64748B" }}>രജിസ്റ്റർ ചെയ്ത ഉപയോക്താക്കൾ ആരുമില്ല.</p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={thStyle}>പേര്</th>
                      <th style={thStyle}>ഫോൺ നമ്പർ</th>
                      <th style={thStyle}>ബ്ലഡ് ഗ്രൂപ്പ്</th>
                      <th style={thStyle}>പഞ്ചായത്ത്</th>
                      <th style={thStyle}>വാർഡ്</th>
                      <th style={thStyle}>പാസ്‌വേഡ്</th>
                      <th style={thStyle}>രജിസ്റ്റർ ചെയ്ത തീയതി</th>
                      <th style={thStyle}>നടപടികൾ</th>
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
                            color: "#0D9488",
                            fontWeight: 700,
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
                              background: "#EF4444",
                              color: "white",
                              border: "none",
                              padding: "6px 12px",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontSize: "13px",
                              fontFamily: "'Chilanka', sans-serif",
                            }}
                          >
                            ഡിലീറ്റ്
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
      )}
    </div>
  );
}

