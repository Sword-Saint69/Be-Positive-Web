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
    "Haripad", "Cheppad", "Krishnapuram", "Kandarappally",
    "Chingoli", "Karthikappally", "Thrikkunnapuzha", "Veeyapuram",
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
    background: "#1C1C21",
    border: "none",
    borderRadius: "10px",
    padding: "13px 14px",
    color: "#EDEDEF",
    fontFamily: "inherit",
    fontSize: "14px",
    appearance: "none" as const,
    outline: "none",
    boxShadow: "0 0 0 1px transparent",
    transition: "box-shadow .15s ease",
  });

  const getSelectStyle = (): React.CSSProperties => ({
    width: "100%",
    background: "#1C1C21",
    border: "none",
    borderRadius: "10px",
    padding: "13px 14px",
    color: "#EDEDEF",
    fontFamily: "inherit",
    fontSize: "14px",
    appearance: "none" as const,
    outline: "none",
    boxShadow: "0 0 0 1px transparent",
    transition: "box-shadow .15s ease",
    backgroundImage:
      "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' fill='none' stroke='%238FA1A6' stroke-width='2'><path d='M2 4l5 5 5-5'/></svg>\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 14px center",
  });

  const validateForm = (): string | null => {
    if (formData.name.trim().length < 3) return "Name must be at least 3 characters long.";
    if (!/^\d{10}$/.test(formData.phone.trim())) return "Phone number must be 10 digits.";
    if (!formData.bloodGroup) return "Please select a blood group.";
    if (!formData.panchayath) return "Please select a panchayath.";
    if (!formData.ward) return "Please select a ward.";
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
      setError("Failed to save user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingConfig) {
    return <Loading duration={0} inline={true} />;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0A0A0C",
        fontFamily: "'Sora', 'Segoe UI', Arial, sans-serif",
        padding: "40px 16px",
      }}
    >
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap" rel="stylesheet" />
      <style>{`
        .form-input-field:focus, .form-select-field:focus {
          box-shadow: 0 0 0 1.5px #4FD1C5 !important;
        }
      `}</style>
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          background: "#141417",
          borderRadius: "20px",
          padding: "36px 36px 28px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}
      >
        <h1
          style={{
            margin: 0,
            textAlign: "center",
            fontSize: "28px",
            fontWeight: 800,
            color: "#EDEDEF",
            letterSpacing: "-0.5px",
          }}
        >
          User Registration
        </h1>
        <p
          style={{
            textAlign: "center",
            color: "#8A8A92",
            fontSize: "13px",
            margin: "8px 0 28px",
          }}
        >
          Fill in your details to register
        </p>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div style={{ marginBottom: "18px" }}>
            <label
              htmlFor="field-name"
              style={{
                display: "block",
                fontSize: "13px",
                color: "#8A8A92",
                marginBottom: "6px",
              }}
            >
              Name
            </label>
            <input
              id="field-name"
              type="text"
              name="name"
              placeholder="Enter your name"
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
                fontSize: "13px",
                color: "#8A8A92",
                marginBottom: "6px",
              }}
            >
              Phone Number
            </label>
            <input
              id="field-phone"
              type="tel"
              name="phone"
              placeholder="Enter phone number"
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
                fontSize: "13px",
                color: "#8A8A92",
                marginBottom: "6px",
              }}
            >
              Blood Group
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
                Select blood group
              </option>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) => (
                <option key={group} value={group} style={{ background: "#1C1C21", color: "#EDEDEF" }}>
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
                fontSize: "13px",
                color: "#8A8A92",
                marginBottom: "6px",
              }}
            >
              Panchayath
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
                Select panchayath
              </option>
              {panchayaths.map((p) => (
                <option key={p} value={p} style={{ background: "#1C1C21", color: "#EDEDEF" }}>
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
                fontSize: "13px",
                color: "#8A8A92",
                marginBottom: "6px",
              }}
            >
              Ward
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
                Select ward
              </option>
              {wards.map((w) => (
                <option key={w} value={w} style={{ background: "#1C1C21", color: "#EDEDEF" }}>
                  {w}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <p style={{ color: "#ef4444", fontSize: "13px", marginBottom: "12px" }}>{error}</p>
          )}

          {success && generatedPassword && (
            <div
              style={{
                background: "#0C1416",
                border: "1px solid #4FD1C5",
                borderRadius: "10px",
                padding: "14px",
                marginBottom: "18px",
                textAlign: "center",
              }}
            >
              <p style={{ color: "#4FD1C5", fontSize: "13px", fontWeight: 600, margin: "0 0 6px" }}>
                Registration Successful!
              </p>
              <p style={{ color: "#8A8A92", fontSize: "12px", margin: "0 0 8px" }}>
                Your generated password:
              </p>
              <p
                style={{
                  color: "#EDEDEF",
                  fontSize: "18px",
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
              background: "linear-gradient(180deg, #4FD1C5 0%, #2C7A73 100%)",
              color: "#0C1416",
              fontSize: "15px",
              fontWeight: 700,
              cursor: "pointer",
              transition: "filter .15s ease",
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.filter = "brightness(1.08)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.filter = "brightness(1)";
            }}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
