'use client';

import { useEffect, useState } from "react";
import Image from "next/image";

export default function PatientModal({ patient, onClose }) {
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [err, setErr] = useState(null);

  const pid = patient?.patientId || patient?.id || patient?._id || null;

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoadingProfile(true);
      try {
        if (!pid) throw new Error("No patient id");
        const res = await fetch(`/api/patient/${pid}`, { credentials: "include" });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body?.message || `Error ${res.status}`);
        }
        const data = await res.json();
        if (!mounted) return;
        setProfile(data);
      } catch (e) {
        if (!mounted) return;
        setErr(e.message || "Failed to load profile");
      } finally {
        if (!mounted) return;
        setLoadingProfile(false);
      }
    })();
    return () => { mounted = false; };
  }, [pid]);

  const loadHistory = async () => {
    setLoadingHistory(true);
    try {
      if (!pid) throw new Error("No patient id");
      const res = await fetch(`/api/patient/history/${pid}`, { credentials: "include" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message || `Error ${res.status}`);
      }
      const data = await res.json();
      setHistory(Array.isArray(data) ? data : []);
    } catch (e) {
      setHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-lg overflow-hidden">
        <div className="flex items-center gap-4 p-6 border-b">
          <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
            {profile?.image ? (
              <Image src={profile.image} alt={profile.name} width={80} height={80} className="object-cover" unoptimized />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8V22h19.2v-2.8c0-3.2-6.4-4.8-9.6-4.8z"/>
              </svg>
            )}
          </div>

          <div className="flex-1">
            <div className="text-2xl font-bold text-[#023E8A]">{profile?.name ?? patient.name}</div>
            <div className="text-sm text-[#0077B6]">{profile?.email ?? patient.email}</div>
            <div className="text-sm text-gray-600">Phone: {profile?.phone ?? patient.phone}</div>
          </div>

          <div className="flex gap-2">
            <button onClick={() => { loadHistory(); }} className="px-4 py-2 bg-[#0077B6] text-white rounded-lg">Load History</button>
            <button onClick={onClose} className="px-4 py-2 bg-gray-100 rounded-lg">Close</button>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-[#F8FCFF] p-4 rounded-lg">
            <h4 className="font-semibold text-[#023E8A] mb-2">Patient Details</h4>
            {loadingProfile ? (
              <div>Loading profile…</div>
            ) : profile ? (
              <div className="space-y-2 text-sm text-gray-700">
                <div>Age: <span className="font-medium">{profile.age ?? "—"}</span></div>
                <div>Blood Group: <span className="font-medium">{profile.bloodGroup ?? "—"}</span></div>
                <div>Email: <span className="font-medium">{profile.email}</span></div>
                <div>Phone: <span className="font-medium">{profile.phone}</span></div>
                
              </div>
            ) : (
              <div className="text-sm text-red-600">{err ?? "Profile not found"}</div>
            )}
          </div>

          <div className="bg-white p-4 rounded-lg border">
            <h4 className="font-semibold text-[#023E8A] mb-2">Confirmed Appointments</h4>
            {loadingHistory ? (
              <div>Loading…</div>
            ) : history.length === 0 ? (
              <div className="text-sm text-gray-500">No confirmed appointments</div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {history.map(h => (
                  <div key={h.id} className="p-3 border rounded">
                    <div className="text-sm text-[#023E8A] font-medium">
                      {h.preferredDate ? new Date(h.preferredDate).toLocaleDateString() : "—"}
                    </div>
                    <div className="text-xs text-gray-600">{h.preferredTime || "—"}</div>
                    <div className="text-xs mt-1">{h.symptoms}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
