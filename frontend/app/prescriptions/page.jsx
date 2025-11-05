'use client';
import React, { useState } from 'react';
import PrescriptionModal from '@/components/Prescriptions/PrescriptionModal';
import PrescriptionCard from '@/components/Prescriptions/PrescriptionCard';

const samplePrescriptions = [
  {
    id: 1,
    doctor: 'Dr. Ahsan Rahman',
    date: '2025-10-12',
    department: 'Cardiology',
    summary: 'Follow-up for chest pain and ECG review.',
    medicines: [
      { name: 'Aspirin 75mg', dosage: '1 tablet daily' },
      { name: 'Atorvastatin 20mg', dosage: '1 tablet at night' },
    ],
    notes: 'Continue medication for 30 days and recheck lipid profile.',
  },
  {
    id: 2,
    doctor: 'Dr. Nusrat Alam',
    date: '2025-09-08',
    department: 'Neurology',
    summary: 'Migraine management review.',
    medicines: [
      { name: 'Propranolol 10mg', dosage: '2 times daily' },
      { name: 'Paracetamol 500mg', dosage: 'as needed' },
    ],
    notes: 'Maintain headache diary and follow up after 15 days.',
  },
];

const PrescriptionList = () => {
  const [selected, setSelected] = useState(null);

  return (
    <section className="min-h-screen bg-[linear-gradient(to_bottom,#CAF0F8,#ADE8F4,#90E0EF)] py-16 px-6 md:px-20 font-merriweather text-[#03045E]">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-[#023E8A] text-center mb-10">
          Your Prescriptions
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {samplePrescriptions.map((p) => (
            <PrescriptionCard
              key={p.id}
              prescription={p}
              onClick={() => setSelected(p)}
            />
          ))}
        </div>

        {selected && (
          <PrescriptionModal
            prescription={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </div>
    </section>
  );
};

export default PrescriptionList;
