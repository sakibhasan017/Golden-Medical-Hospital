import React from 'react';

const PrescriptionCard = ({ prescription, onClick }) => (
  <div
    onClick={onClick}
    className="cursor-pointer bg-white/80 backdrop-blur-md rounded-2xl shadow-md p-6 hover:shadow-lg hover:scale-[1.02] transition duration-300"
  >
    <h2 className="text-xl font-semibold text-[#023E8A] mb-2">
      {prescription.doctor}
    </h2>
    <p className="text-[#0077B6] mb-1">{prescription.department}</p>
    <p className="text-sm text-[#03045E]/80 mb-2">
      Date: {prescription.date}
    </p>
    <p className="text-[#03045E]/70 text-sm italic">
      {prescription.summary}
    </p>
  </div>
);

export default PrescriptionCard;
