"use client";
import React from "react";
import { FaTimes, FaDownload, FaExpand } from "react-icons/fa";

function formatDate(d) {
  if (!d) return "—";
  const dt = new Date(d);
  if (isNaN(dt)) return String(d);
  return dt.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function renderMedicineLine(m) {
  if (!m) return "";

  // When object
  if (typeof m === "object") {
    const dose = m.dosage || m.dose || null;
    const freq = m.frequency || m.freq || null;
    const dur = m.duration || m.days || null;

    // If dosage is written in format "3•3•1" => convert
    if (dose && typeof dose === "string" && dose.includes("•")) {
      const [d, f, du] = dose.split("•").map((s) => s.trim());
      return `Dose: ${d ?? "-"} | Frequency: ${
        f ?? "-"
      } times/day | Duration: ${du ?? "-"} days`;
    }

    // When individual fields exist normally
    return [
      dose ? `Dose: ${dose}` : null,
      freq ? `Frequency: ${freq} times/day` : null,
      dur ? `Duration: ${dur} days` : null,
    ]
      .filter(Boolean)
      .join(" | ");
  }

  // If plain string "3•3•1"
  if (typeof m === "string" && m.includes("•")) {
    const [d, f, du] = m.split("•").map((x) => x.trim());
    return `Dose: ${d ?? "-"} | Frequency: ${f ?? "-"} times/day | Duration: ${
      du ?? "-"
    } days`;
  }

  return m;
}

export default function PrescriptionModal({ prescription, onClose }) {
  const meds = Array.isArray(prescription.medicines)
    ? prescription.medicines
    : [];

  const handleDownload = () => {
    const lines = [];
    lines.push(`Doctor: ${prescription.doctor ?? "—"}`);
    lines.push(`Department: ${prescription.department ?? "—"}`);
    lines.push(
      `Date: ${formatDate(prescription.date ?? prescription.appointmentDate)}`
    );
    lines.push("");
    lines.push(`Summary: ${prescription.summary ?? ""}`);
    lines.push("");
    lines.push("Medicines:");
    meds.forEach((m, i) => {
      lines.push(`${i + 1}. ${renderMedicineLine(m)}`);
    });
    lines.push("");
    lines.push(`Notes: ${prescription.notes ?? ""}`);

    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `Prescription_${prescription.id ?? Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleFullScreen = () => {
    const modal = document.getElementById("modal-content");
    if (modal?.requestFullscreen) modal.requestFullscreen();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div
        id="modal-content"
        className="bg-white rounded-2xl shadow-xl p-6 max-w-2xl w-full relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-red-600 hover:text-red-800"
        >
          <FaTimes size={18} />
        </button>

        <div className="mb-3">
          <h2 className="text-2xl font-bold text-[#023E8A]">
            {prescription.doctor}
          </h2>
          <div className="text-sm text-[#0077B6]">
            {prescription.department}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Date:{" "}
            {formatDate(prescription.date ?? prescription.appointmentDate)}
          </div>
        </div>

        <div className="mb-4">
          <div className="font-semibold text-[#03045E] mb-2">Summary</div>
          <div className="text-sm text-[#03045E]/80">
            {prescription.summary}
          </div>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold text-[#023E8A] mb-2">Medicines</h3>
          <ul className="list-disc ml-6 space-y-2 text-[#03045E]/80">
            {meds.length === 0 && <li>No medicines listed</li>}
            {meds.map((m, i) => (
              <li key={i} className="text-sm">
                <span className="font-semibold text-[#023E8A]">
                  {m.name || "Medicine"}
                </span>
                <div className="text-xs mt-1 text-gray-700 bg-gray-100 p-2 rounded-md">
                  {renderMedicineLine(m)}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <strong>Notes:</strong>
          <div className="text-sm text-[#03045E]/80 mt-1">
            {prescription.notes ?? "—"}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={handleDownload}
            className="bg-[#0077B6] text-white px-4 py-2 rounded-lg hover:bg-[#00B4D8] flex items-center gap-2"
          >
            <FaDownload /> Download
          </button>

          <button
            onClick={handleFullScreen}
            className="bg-[#0096C7] text-white px-4 py-2 rounded-lg hover:bg-[#00B4D8] flex items-center gap-2"
          >
            <FaExpand /> Full Screen
          </button>
        </div>
      </div>
    </div>
  );
}
