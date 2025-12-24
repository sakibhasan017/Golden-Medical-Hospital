"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

export default function PrescriptionForm({ onCancel, onSaved, appointment }) {
  const [medicines, setMedicines] = useState([
    { name: "", dosage: "", frequency: "", duration: "" },
  ]);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const updateRow = (i, key, value) =>
    setMedicines((m) =>
      m.map((r, idx) => (idx === i ? { ...r, [key]: value } : r))
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/prescriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          appointmentId: appointment.id,
          patientId: appointment.patientId,
          medicines: medicines.filter((m) => m.name.trim()),
          notes,
        }),
      });
      if (!res.ok) throw new Error();
      onSaved(appointment.id);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {medicines.map((m, i) => (
        <div
          key={i}
          className="bg-[#F8FCFF] p-4 rounded-xl border grid gap-3
               grid-cols-1
               md:grid-cols-[minmax(180px,1fr)_110px_130px_110px_40px]"
        >
          <input
            className="h-11 px-3 border rounded-lg w-full"
            placeholder="Medicine"
            value={m.name}
            onChange={(e) => updateRow(i, "name", e.target.value)}
          />

          <input
            className="h-11 px-3 border rounded-lg w-full"
            placeholder="Dosage"
            value={m.dosage}
            onChange={(e) => updateRow(i, "dosage", e.target.value)}
          />

          <input
            className="h-11 px-3 border rounded-lg w-full"
            placeholder="Frequency"
            value={m.frequency}
            onChange={(e) => updateRow(i, "frequency", e.target.value)}
          />

          <input
            className="h-11 px-3 border rounded-lg w-full"
            placeholder="Duration"
            value={m.duration}
            onChange={(e) => updateRow(i, "duration", e.target.value)}
          />

          <button
            type="button"
            onClick={() =>
              setMedicines((meds) => meds.filter((_, idx) => idx !== i))
            }
            className="h-11 w-10 flex items-center justify-center bg-red-100 rounded-lg"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={() =>
          setMedicines((m) => [
            ...m,
            { name: "", dosage: "", frequency: "", duration: "" },
          ])
        }
        className="flex items-center gap-2 text-[#0077B6] font-medium"
      >
        <Plus className="w-5 h-5" /> Add medicine
      </button>

      <textarea
        className="w-full p-3 border rounded-xl min-h-[120px]"
        placeholder="Additional notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <div className="flex flex-col md:flex-row gap-3">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 py-3 bg-linear-to-r from-[#0077B6] to-[#00B4D8] text-white rounded-xl font-semibold"
        >
          {saving ? "Saving…" : "Save Prescription"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 bg-gray-100 rounded-xl"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
