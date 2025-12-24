'use client';

import { useEffect, useState } from "react";
import PrescriptionForm from "./PrescriptionForm";
import { UserCircle2, FilePenLine } from "lucide-react";

export default function DoctorPrescriptionsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/doctor/appointments/no-prescription", { credentials: "include" });
        const body = await res.json().catch(() => null);
        if (!mounted) return;
        setAppointments(Array.isArray(body) ? body : []);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const open = (appt) => {
    setSelected(appt);
    setShowForm(false);
  };

  const onSaved = (id) => {
    setAppointments(a => a.filter(x => String(x.id) !== String(id)));
    setSelected(null);
    setShowForm(false);
  };

  return (
    <section className="min-h-screen bg-linear-to-br from-[#E0F7FF] via-[#F7FBFF] to-[#ECFEFF] p-4 md:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">

        <div className="lg:col-span-1 space-y-4">
          <h1 className="text-xl font-bold text-[#023E8A]">
            Pending Prescriptions
          </h1>

          {loading && (
            <div className="p-4 bg-white rounded-xl shadow text-gray-500">
              Loading…
            </div>
          )}

          {!loading && appointments.length === 0 && (
            <div className="p-4 bg-white rounded-xl shadow text-gray-500">
              No appointments
            </div>
          )}

          {appointments.map(a => (
            <div
              key={a.id}
              onClick={() => open(a)}
              className={`p-4 rounded-xl cursor-pointer transition border
                ${selected?.id === a.id
                  ? "bg-[#E6F8FF] border-[#48CAE4]"
                  : "bg-white border-transparent hover:border-[#90E0EF] shadow"}
              `}
            >
              <div className="flex items-center gap-3">
                <UserCircle2 className="w-9 h-9 text-[#90E0EF]" />
                <div className="min-w-0">
                  <div className="font-semibold text-[#023E8A] truncate">
                    {a.name}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {a.preferredDate ? new Date(a.preferredDate).toLocaleDateString() : "—"} • {a.preferredTime || "—"}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT – Prescription panel (larger) */}
        <aside className="lg:col-span-3 bg-white rounded-3xl shadow-xl p-5 md:p-8">
          {!selected && (
            <div className="text-center text-gray-400 mt-24">
              Select an appointment to write prescription
            </div>
          )}

          {selected && (
            <>
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                <UserCircle2 className="w-14 h-14 text-[#90E0EF]" />
                <div className="flex-1">
                  <div className="text-xl font-bold text-[#023E8A]">{selected.name}</div>
                  <div className="text-sm text-[#0077B6]">{selected.email}</div>
                  <div className="text-sm text-gray-600">{selected.phone}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-[#F8FCFF] p-4 rounded-xl border">
                  <div className="text-xs text-gray-500">Date & Time</div>
                  <div className="font-medium text-[#03045E]">
                    {selected.preferredDate ? new Date(selected.preferredDate).toLocaleDateString() : "—"} • {selected.preferredTime}
                  </div>
                </div>

                <div className="bg-[#F8FCFF] p-4 rounded-xl border">
                  <div className="text-xs text-gray-500">Symptoms</div>
                  <div className="text-sm text-[#03045E] line-clamp-3">
                    {selected.symptoms}
                  </div>
                </div>
              </div>

              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full md:w-auto px-6 py-3 rounded-xl bg-linear-to-r from-[#0077B6] to-[#00B4D8] text-white font-semibold"
                >
                  Write Prescription
                </button>
              )}

              {showForm && (
                <div className="mt-6">
                  <PrescriptionForm
                    appointment={selected}
                    onCancel={() => setShowForm(false)}
                    onSaved={onSaved}
                  />
                </div>
              )}
            </>
          )}
        </aside>
      </div>
    </section>
  );
}
