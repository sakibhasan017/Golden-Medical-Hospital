import React from 'react';

function formatDate(d) {
  if (!d) return '—';
  const dt = new Date(d);
  if (isNaN(dt)) return String(d);
  return dt.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function PrescriptionCard({ prescription, onClick }) {
  const dateStr = formatDate(prescription.date ?? prescription.appointmentDate ?? prescription._id);
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white/80 backdrop-blur-md rounded-2xl shadow-md p-6 hover:shadow-lg hover:scale-[1.02] transition duration-300"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-[#023E8A] mb-1">{prescription.doctor}</h2>
          <p className="text-[#0077B6] mb-1">{prescription.department}</p>
          <p className="text-sm text-[#03045E]/80 italic">{prescription.summary}</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Date</div>
          <div className="text-sm font-medium text-[#023E8A]">{dateStr}</div>
        </div>
      </div>
    </div>
  );
}
