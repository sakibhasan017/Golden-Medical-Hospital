'use client';

import { useEffect, useState } from "react";
import PatientModal from "./PatientModal";

export default function DoctorPatients() {
  const [patients, setPatients] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/doctor/patients", { credentials: "include" });
        const body = await res.json().catch(() => null);
        if (!mounted) return;
        if (!res.ok) {
          setErr(body?.message || `Error ${res.status}`);
          setPatients([]);
        } else if (!Array.isArray(body)) {
          setErr("Unexpected response from server");
          setPatients([]);
        } else {
          setPatients(body);
        }
      } catch (e) {
        if (!mounted) return;
        setErr(e.message || "Failed to load");
        setPatients([]);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const filtered = patients.filter(p =>
    String(p.name ?? "").toLowerCase().includes(q.toLowerCase()) ||
    String(p.email ?? "").toLowerCase().includes(q.toLowerCase())
  );

  return (
    <section className="min-h-screen p-6 bg-linear-to-b from-[#E6F8FF] to-[#CAF0F8]">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-extrabold text-[#023E8A]">Patient List</h1>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name or email"
            className="px-4 py-2 rounded-lg border w-72 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading && <div className="col-span-full p-6 bg-white/80 rounded-lg">Loading…</div>}
          {err && <div className="col-span-full p-6 bg-red-50 text-red-700 rounded-lg">{err}</div>}
          {!loading && !err && filtered.length === 0 && (
            <div className="col-span-full p-6 bg-white/80 rounded-lg">No confirmed patients</div>
          )}

          {filtered.map(p => (
            <div
              key={p.id}
              onClick={() => setSelected(p)}
              className="bg-white p-4 rounded-2xl shadow hover:shadow-md transition cursor-pointer flex items-center gap-4"
            >
              <div className="w-16 h-16 rounded-full bg-[#F1F9FF] flex items-center justify-center text-[#0077B6] text-xl font-semibold">
                {p.name ? p.name.split(" ").map(n=>n[0]).slice(0,2).join("") : "P"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[#023E8A] truncate">{p.name}</div>
                <div className="text-sm text-[#0077B6] truncate">{p.email}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {p.preferredDate ? new Date(p.preferredDate).toLocaleDateString() : "—"} • {p.preferredTime || "—"}
                </div>
              </div>
              <div className="text-sm text-gray-500">View</div>
            </div>
          ))}
        </div>
      </div>

      {selected && <PatientModal patient={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
