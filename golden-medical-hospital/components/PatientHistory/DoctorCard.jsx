import React from "react";
import Image from "next/image";
import { User, Mail, Phone, FileText } from "lucide-react";

export default function DoctorCard({ doctor, onDetails, onPrescriptions }) {
  const initials = doctor.name
    ? doctor.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
    : "DR";

  return (
    <div className="group bg-linear-to-r from-white to-[#FAFDFF] rounded-2xl p-6 flex gap-6 items-center border border-[#E1F0FF] hover:border-[#0077B6]/40 hover:shadow-xl hover:shadow-[#0077B6]/10 transition-all duration-500 hover:-translate-y-1">
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-linear-to-br from-[#F1F9FF] to-[#E1F0FF] flex items-center justify-center text-[#0077B6] font-bold text-2xl shadow-inner overflow-hidden">
          {doctor.image ? (
            <Image
              src={doctor.image}
              alt={doctor.name}
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          ) : (
            initials
          )}
        </div>
        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-linear-to-br from-[#00B4D8] to-[#0077B6] rounded-full flex items-center justify-center text-white shadow-lg">
          <User size={16} />
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-xl font-bold bg-linear-to-r from-[#023E8A] to-[#0077B6] bg-clip-text text-transparent group-hover:from-[#03045E] group-hover:to-[#023E8A] transition-all duration-300">
            {doctor.name}
          </h3>
          <span className="px-3 py-1 bg-[#F0F8FF] text-[#0077B6] text-xs font-semibold rounded-full">
            {doctor.department}
          </span>
        </div>
        
        <div className="space-y-2 mb-4">
          {doctor.email && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail size={14} className="text-[#0077B6]" />
              <span>{doctor.email}</span>
            </div>
          )}
          {doctor.phone && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone size={14} className="text-[#0077B6]" />
              <span>{doctor.phone}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-linear-to-r from-[#F0F8FF] to-[#E8F4FF] rounded-lg">
            <FileText size={14} className="text-[#0077B6]" />
            <span className="text-sm font-semibold text-[#023E8A]">
              {doctor.prescriptionCount} Prescriptions
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col gap-3">
        <button
          onClick={onDetails}
          className="px-6 py-3 rounded-xl bg-linear-to-r from-[#F0F8FF] to-[#E8F4FF] text-[#0077B6] font-medium hover:from-[#E1F0FF] hover:to-[#D4E7FF] hover:shadow-md hover:text-[#023E8A] transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg flex items-center gap-2 justify-center min-w-40"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Doctor Details
        </button>
        <button
          onClick={onPrescriptions}
          className="px-6 py-3 rounded-xl bg-linear-to-r from-[#0077B6] to-[#0096C7] text-white font-medium hover:from-[#0096C7] hover:to-[#00B4D8] hover:shadow-lg hover:shadow-[#0077B6]/30 transform hover:-translate-y-0.5 transition-all duration-300 group-hover:scale-105 flex items-center gap-2 justify-center min-w-40"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          View Prescriptions
        </button>
      </div>
    </div>
  );
}