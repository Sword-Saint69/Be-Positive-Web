"use client";

import React, { useState, useEffect, type FormEvent } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import Loading from "../Loading";

function generatePassword(length = 8): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let pass = "";
  for (let i = 0; i < length; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass;
}

type FormData = {
  name: string;
  phone: string;
  bloodGroup: string;
  panchayath: string;
  ward: string;
};

export default function UserForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    bloodGroup: "",
    panchayath: "",
    ward: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);

  const DEFAULT_PANCHAYATHS = [
    "ഹരിപ്പാട്", "ചെപ്പാട്", "കൃഷ്ണപുരം", "കണ്ടല്ലൂർ",
    "ചിങ്ങോലി", "കാർത്തികപ്പള്ളി", "തൃക്കുന്നപ്പുഴ", "വീയപുരം",
  ];
  const DEFAULT_WARDS = Array.from({ length: 15 }, (_, i) => (i + 1).toString());

  const [panchayaths, setPanchayaths] = useState<string[]>(DEFAULT_PANCHAYATHS);
  const [wards, setWards] = useState<string[]>(DEFAULT_WARDS);
  const [fetchingConfig, setFetchingConfig] = useState(true);

  // Fetch panchayaths and wards from Firestore
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const panchSnap = await getDoc(doc(db, "config", "panchayaths"));
        const wardSnap = await getDoc(doc(db, "config", "wards"));

        if (panchSnap.exists()) {
          setPanchayaths(panchSnap.data().names || DEFAULT_PANCHAYATHS);
        }
        if (wardSnap.exists()) {
          setWards(wardSnap.data().numbers || DEFAULT_WARDS);
        }
      } catch {
        // Keep defaults, silently ignore
      } finally {
        setFetchingConfig(false);
      }
    };

    fetchConfig();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getInputStyle = (): React.CSSProperties => ({
    width: "100%",
    background: "#F8FAFC",
    border: "1px solid #E2E8F0",
    borderRadius: "10px",
    padding: "13px 14px",
    color: "#0F172A",
    fontFamily: "'Chilanka', sans-serif",
    fontSize: "14px",
    appearance: "none" as const,
    outline: "none",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
    transition: "all .15s ease",
  });

  const getSelectStyle = (): React.CSSProperties => ({
    width: "100%",
    background: "#F8FAFC",
    border: "1px solid #E2E8F0",
    borderRadius: "10px",
    padding: "13px 14px",
    color: "#0F172A",
    fontFamily: "'Chilanka', sans-serif",
    fontSize: "14px",
    appearance: "none" as const,
    outline: "none",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
    transition: "all .15s ease",
    backgroundImage:
      "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' fill='none' stroke='%2364748B' stroke-width='2'><path d='M2 4l5 5 5-5'/></svg>\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 14px center",
  });

  const validateForm = (): string | null => {
    if (formData.name.trim().length < 3) return "പേര് കുറഞ്ഞത് 3 അക്ഷരമെങ്കിലും വേണം.";
    if (!/^\d{10}$/.test(formData.phone.trim())) return "ഫോൺ നമ്പർ 10 അക്കമുള്ളതായിരിക്കണം.";
    if (!formData.bloodGroup) return "ദയവായി ബ്ലഡ് ഗ്രൂപ്പ് തിരഞ്ഞെടുക്കുക.";
    if (!formData.panchayath) return "ദയവായി പഞ്ചായത്ത് തിരഞ്ഞെടുക്കുക.";
    if (!formData.ward) return "ദയവായി വാർഡ് തിരഞ്ഞെടുക്കുക.";
    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);
    setGeneratedPassword(null);

    try {
      const password = generatePassword(8);

      await addDoc(collection(db, "users"), {
        ...formData,
        password,
        createdAt: serverTimestamp(),
      });

      setGeneratedPassword(password);
      setSuccess(true);
      setFormData({ name: "", phone: "", bloodGroup: "", panchayath: "", ward: "" });
    } catch {
      setError("ഉപയോക്താവിനെ സേവ് ചെയ്യാൻ സാധിച്ചില്ല. വീണ്ടും ശ്രമിക്കുക.");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingConfig) {
    return null;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#F1F5F9",
        fontFamily: "'Chilanka', sans-serif",
        padding: "40px 16px",
      }}
    >
      <style>{`
        .form-input-field:focus, .form-select-field:focus {
          border-color: #0D9488 !important;
          box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.2) !important;
        }
      `}</style>
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          background: "#FFFFFF",
          borderRadius: "20px",
          padding: "36px 36px 28px",
          boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.01)",
          border: "1px solid #E2E8F0",
        }}
      >
        <h1
          style={{
            margin: 0,
            textAlign: "center",
            fontSize: "26px",
            fontWeight: 800,
            color: "#0F172A",
            letterSpacing: "-0.5px",
          }}
        >
          രജിസ്ട്രേഷൻ
        </h1>
        <p
          style={{
            textAlign: "center",
            color: "#64748B",
            fontSize: "14px",
            margin: "8px 0 28px",
          }}
        >
          രജിസ്റ്റർ ചെയ്യുന്നതിനായി വിവരങ്ങൾ നൽകുക
        </p>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div style={{ marginBottom: "18px" }}>
            <label
              htmlFor="field-name"
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: 600,
                color: "#334155",
                marginBottom: "6px",
              }}
            >
              പേര്
            </label>
            <input
              id="field-name"
              type="text"
              name="name"
              placeholder="പേര് നൽകുക"
              required
              value={formData.name}
              onChange={handleChange}
              className="form-input-field"
              style={getInputStyle()}
            />
          </div>

          {/* Phone Number */}
          <div style={{ marginBottom: "18px" }}>
            <label
              htmlFor="field-phone"
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: 600,
                color: "#334155",
                marginBottom: "6px",
              }}
            >
              ഫോൺ നമ്പർ
            </label>
            <input
              id="field-phone"
              type="tel"
              name="phone"
              placeholder="ഫോൺ നമ്പർ നൽകുക"
              required
              value={formData.phone}
              onChange={handleChange}
              className="form-input-field"
              style={getInputStyle()}
            />
          </div>

          {/* Blood Group */}
          <div style={{ marginBottom: "18px" }}>
            <label
              htmlFor="field-bloodGroup"
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: 600,
                color: "#334155",
                marginBottom: "6px",
              }}
            >
              ബ്ലഡ് ഗ്രൂപ്പ്
            </label>
            <select
              id="field-bloodGroup"
              name="bloodGroup"
              required
              value={formData.bloodGroup}
              onChange={handleChange}
              className="form-select-field"
              style={getSelectStyle()}
            >
              <option value="" disabled>
                ബ്ലഡ് ഗ്രൂപ്പ് തിരഞ്ഞെടുക്കുക
              </option>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) => (
                <option key={group} value={group} style={{ background: "#FFFFFF", color: "#0F172A" }}>
                  {group}
                </option>
              ))}
            </select>
          </div>

          {/* Panchayath */}
          <div style={{ marginBottom: "18px" }}>
            <label
              htmlFor="field-panchayath"
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: 600,
                color: "#334155",
                marginBottom: "6px",
              }}
            >
              പഞ്ചായത്ത്
            </label>
            <select
              id="field-panchayath"
              name="panchayath"
              required
              value={formData.panchayath}
              onChange={handleChange}
              className="form-select-field"
              style={getSelectStyle()}
            >
              <option value="" disabled>
                പഞ്ചായത്ത് തിരഞ്ഞെടുക്കുക
              </option>
              {panchayaths.map((p) => (
                <option key={p} value={p} style={{ background: "#FFFFFF", color: "#0F172A" }}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Ward */}
          <div style={{ marginBottom: "18px" }}>
            <label
              htmlFor="field-ward"
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: 600,
                color: "#334155",
                marginBottom: "6px",
              }}
            >
              വാർഡ്
            </label>
            <select
              id="field-ward"
              name="ward"
              required
              value={formData.ward}
              onChange={handleChange}
              className="form-select-field"
              style={getSelectStyle()}
            >
              <option value="" disabled>
                വാർഡ് തിരഞ്ഞെടുക്കുക
              </option>
              {wards.map((w) => (
                <option key={w} value={w} style={{ background: "#FFFFFF", color: "#0F172A" }}>
                  {w}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <p style={{ color: "#EF4444", fontSize: "13px", marginBottom: "12px" }}>{error}</p>
          )}

          {success && generatedPassword && (
            <div
              style={{
                background: "#F0FDF4",
                border: "1px solid #86EFAC",
                borderRadius: "10px",
                padding: "14px",
                marginBottom: "18px",
                textAlign: "center",
              }}
            >
              <p style={{ color: "#166534", fontSize: "14px", fontWeight: 700, margin: "0 0 6px" }}>
                രജിസ്ട്രേഷൻ വിജയകരമായി പൂർത്തിയായി!
              </p>
              <p style={{ color: "#475569", fontSize: "13px", margin: "0 0 8px" }}>
                നിങ്ങളുടെ പാസ്‌വേഡ്:
              </p>
              <p
                style={{
                  color: "#0F172A",
                  fontSize: "20px",
                  fontWeight: 800,
                  letterSpacing: "2px",
                  margin: 0,
                  fontFamily: "monospace",
                }}
              >
                {generatedPassword}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              marginTop: "8px",
              padding: "14px",
              borderRadius: "10px",
              border: "none",
              background: "linear-gradient(180deg, #0D9488 0%, #0F766E 100%)",
              color: "#FFFFFF",
              fontSize: "16px",
              fontWeight: 700,
              cursor: "pointer",
              transition: "filter .15s ease",
              fontFamily: "inherit",
              boxShadow: "0 4px 12px rgba(13, 148, 136, 0.25)",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.filter = "brightness(1.08)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.filter = "brightness(1)";
            }}
          >
            {loading ? "സമർപ്പിക്കുന്നു..." : "സമർപ്പിക്കുക"}
          </button>
        </form>
      </div>
    </div>
  );
}

