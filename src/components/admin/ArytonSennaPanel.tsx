"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { RefreshCw, Search } from "lucide-react";
import BentoGrid from "../kokonutui/bento-grid";
import { Toolbar } from "../kokonutui/toolbar";
import ActionSearchBar from "../kokonutui/action-search-bar";
import Loading from "../ui/Loading";

type Donor = {
  id: string;
  name: string;
  phone: string;
  bloodGroup: string;
  panchayath: string;
  ward: string;
  lastDonationDate?: Timestamp;
  status: 'pending' | 'verified' | 'rejected';
};

type BloodRequest = {
  id: string;
  hospital: string;
  patient: string;
  bloodGroup: string;
  urgency: 'low' | 'medium' | 'high';
  status: 'pending' | 'matched' | 'fulfilled' | 'expired';
};

export default function ArytonSennaPanel() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching data from Firebase...");
        const donorsSnap = await getDocs(collection(db, "users"));
        const requestsSnap = await getDocs(collection(db, "requests"));
        
        console.log("Donors fetched:", donorsSnap.size);
        console.log("Requests fetched:", requestsSnap.size);
        
        setDonors(donorsSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Donor)));
        setRequests(requestsSnap.docs.map((d) => ({ id: d.id, ...d.data() } as BloodRequest)));
      } catch (error) {
        console.error("Error fetching data from Firebase:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Loading />;

  return (
    <div style={{ padding: "40px", background: "#0A0A0C", minHeight: "100vh", color: "#EDEDEF", fontFamily: "'Sora', sans-serif" }}>
      <h1 style={{ fontSize: "32px", fontWeight: 800, marginBottom: "32px" }}>Aryton Senna Admin Panel</h1>
      
      {/* Reports Section */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ fontSize: "24px", marginBottom: "16px", color: "#4FD1C5" }}>Reports</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
          <div style={{ background: "#1A1A1D", padding: "20px", borderRadius: "12px" }}>
            <h3 style={{ color: "#A0AEC0", marginBottom: "8px" }}>Total Donors</h3>
            <p style={{ fontSize: "32px", fontWeight: 700 }}>{donors.length}</p>
          </div>
          <div style={{ background: "#1A1A1D", padding: "20px", borderRadius: "12px" }}>
            <h3 style={{ color: "#A0AEC0", marginBottom: "8px" }}>Total Requests</h3>
            <p style={{ fontSize: "32px", fontWeight: 700 }}>{requests.length}</p>
          </div>
          <div style={{ background: "#1A1A1D", padding: "20px", borderRadius: "12px" }}>
            <h3 style={{ color: "#A0AEC0", marginBottom: "8px" }}>Fulfillment Rate</h3>
            <p style={{ fontSize: "32px", fontWeight: 700 }}>
              {requests.length > 0 
                ? Math.round((requests.filter(r => r.status === 'fulfilled').length / requests.length) * 100) + "%" 
                : "0%"}
            </p>
          </div>
        </div>
      </section>

      {/* Blood Request Management */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ fontSize: "24px", marginBottom: "16px", color: "#4FD1C5" }}>Blood Request Management</h2>
        <Toolbar 
          items={[
            { id: "refresh", title: "Refresh", icon: RefreshCw },
            { id: "filter", title: "Filter", icon: Search },
          ]}
          onSelect={(id) => {
            if (id === "refresh") window.location.reload();
          }}
        />
        <ActionSearchBar 
          actions={requests.map(r => ({
            id: r.id,
            label: `${r.patient} - ${r.hospital}`,
            icon: <span style={{ fontSize: "12px" }}>🩸</span>,
            description: r.bloodGroup,
          }))}
        />
      </section>

      {/* Donor Management */}
      <section>
        <h2 style={{ fontSize: "24px", marginBottom: "16px", color: "#4FD1C5" }}>Donor Management</h2>
        {/* Donor management content */}
      </section>
    </div>
  );
}
