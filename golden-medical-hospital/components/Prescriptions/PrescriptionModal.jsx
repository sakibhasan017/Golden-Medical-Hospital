'use client';
import React from 'react';
import { FaTimes, FaDownload, FaExpand } from 'react-icons/fa';

const PrescriptionModal = ({ prescription, onClose }) => {
  const handleDownload = () => {
    const element = document.createElement('a');
    const content = `
      Doctor: ${prescription.doctor}
      Department: ${prescription.department}
      Date: ${prescription.date}

      Summary: ${prescription.summary}

      Medicines:
      ${prescription.medicines
        .map((m) => `- ${m.name}: ${m.dosage}`)
        .join('\n')}

      Notes: ${prescription.notes}
    `;
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `Prescription_${prescription.id}.txt`;
    document.body.appendChild(element);
    element.click();
  };

  const handleFullScreen = () => {
    const modal = document.getElementById('modal-content');
    if (modal.requestFullscreen) modal.requestFullscreen();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div
        id="modal-content"
        className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full relative animate-fadeIn"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-red-600 hover:text-red-800"
        >
          <FaTimes size={20} />
        </button>

        <h2 className="text-2xl font-bold text-[#023E8A] mb-2">
          {prescription.doctor}
        </h2>
        <p className="text-[#0077B6] mb-1">{prescription.department}</p>
        <p className="text-sm text-[#03045E]/70 mb-4">
          Date: {prescription.date}
        </p>

        <p className="font-semibold text-[#03045E] mb-2">
          Summary: {prescription.summary}
        </p>

        <div className="mb-4">
          <h3 className="font-semibold text-[#023E8A] mb-1">Medicines:</h3>
          <ul className="list-disc ml-6 text-[#03045E]/80">
            {prescription.medicines.map((m, i) => (
              <li key={i}>
                {m.name} — <span className="italic">{m.dosage}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-[#03045E]/80 mb-6">
          <strong>Notes:</strong> {prescription.notes}
        </p>

        <div className="flex justify-between items-center">
          <button
            onClick={handleDownload}
            className="bg-[#0077B6] text-white px-4 py-2 rounded-lg hover:bg-[#00B4D8] transition duration-300 flex items-center gap-2"
          >
            <FaDownload /> Download
          </button>
          <button
            onClick={handleFullScreen}
            className="bg-[#0096C7] text-white px-4 py-2 rounded-lg hover:bg-[#00B4D8] transition duration-300 flex items-center gap-2"
          >
            <FaExpand /> Full Screen
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionModal;
