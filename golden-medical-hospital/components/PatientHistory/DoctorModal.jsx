import React from "react";
import Image from "next/image";
import { X } from "lucide-react";

export default function DoctorModal({ doctor, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-linear-to-br from-white to-[#F8FBFF] rounded-3xl p-8 max-w-2xl w-full relative border border-[#E1F0FF] shadow-2xl shadow-[#0077B6]/10 transform transition-all duration-300 animate-slideUp">
        <button 
          onClick={onClose} 
          className="absolute right-6 top-6 w-10 h-10 rounded-full bg-[#F0F8FF] hover:bg-[#0077B6]/10 flex items-center justify-center text-[#0077B6] hover:text-[#023E8A] transition-all duration-300 group"
        >
          <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>
        
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 rounded-full overflow-hidden bg-linear-to-br from-[#F1F9FF] to-[#E1F0FF] border-4 border-white shadow-lg">
              {doctor.image ? (
                <Image
                  src={doctor.image}
                  alt={doctor.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#0077B6] font-bold text-3xl">
                  {doctor.name?.split(" ").map(n => n[0]).slice(0,2).join("")}
                </div>
              )}
            </div>
            <div className="mt-4 px-4 py-2 bg-linear-to-r from-[#0077B6] to-[#00B4D8] text-white rounded-full text-sm font-semibold shadow-md">
              Specialist
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <div>
              <div className="text-3xl font-bold bg-linear-to-r from-[#023E8A] to-[#0077B6] bg-clip-text text-transparent">
                {doctor.name}
              </div>
              <div className="text-lg font-semibold text-[#0096C7] mt-1">{doctor.department}</div>
              
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#F0F8FF] flex items-center justify-center text-[#0077B6]">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <div className="text-gray-700">{doctor.email}</div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#F0F8FF] flex items-center justify-center text-[#0077B6]">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                  <div className="text-gray-700">{doctor.phone}</div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E1F0FF]">
              <a 
                href={`/find-doctor/${doctor.doctorId}`} 
                className="inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-[#0077B6] to-[#0096C7] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#0077B6]/30 transform hover:-translate-y-0.5 transition-all duration-300 group"
              >
                Open Profile Page
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}