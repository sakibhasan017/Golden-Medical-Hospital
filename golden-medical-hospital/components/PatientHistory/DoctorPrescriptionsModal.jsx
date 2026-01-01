import React, { useEffect, useState } from "react";
import PrescriptionModal from "@/components/Prescriptions/PrescriptionModal";
import { X, Calendar, Clock, FileText, Loader2, AlertCircle } from "lucide-react";

export default function DoctorPrescriptionsModal({ doctor, onClose }) {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(
          `/api/patient/doctor-prescriptions/${doctor.doctorId}`
        );
        const json = await res.json().catch(() => []);
        if (!mounted) return;
        setPrescriptions(Array.isArray(json) ? json : []);
      } catch {
        if (!mounted) return;
        setPrescriptions([]);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [doctor.doctorId]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-auto animate-fadeIn">
      <div className="bg-linear-to-br from-white to-[#F8FBFF] rounded-3xl p-8 max-w-4xl w-full relative border border-[#E1F0FF] shadow-2xl shadow-[#0077B6]/10 mt-12 mb-12 transform transition-all duration-300 animate-slideUp">
        <button
          onClick={onClose}
          className="absolute right-6 top-6 w-10 h-10 rounded-full bg-[#F0F8FF] hover:bg-[#0077B6]/10 flex items-center justify-center text-[#0077B6] hover:text-[#023E8A] transition-all duration-300 group"
        >
          <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>
        
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-linear-to-br from-[#F1F9FF] to-[#E1F0FF] flex items-center justify-center text-[#0077B6]">
              <FileText size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold bg-linear-to-r from-[#023E8A] to-[#0077B6] bg-clip-text text-transparent">
                {`${doctor.name}'s Prescriptions`}
              </h3>
              <p className="text-sm text-gray-500 mt-1">All medical prescriptions from this doctor</p>
            </div>
          </div>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-linear-to-br from-[#F1F9FF] to-[#E1F0FF] flex items-center justify-center mb-4 animate-pulse">
              <Loader2 className="w-8 h-8 text-[#0077B6] animate-spin" />
            </div>
            <p className="text-gray-500">Loading prescriptions...</p>
          </div>
        )}

        {!loading && prescriptions.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-linear-to-br from-[#F1F9FF] to-[#E1F0FF] flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-10 h-10 text-[#0077B6]" />
            </div>
            <h4 className="text-xl font-semibold text-[#023E8A] mb-2">No Prescriptions Found</h4>
            <p className="text-gray-500 max-w-md mx-auto">
              You do not have any prescriptions from {doctor.name} yet. 
              All future prescriptions will appear here.
            </p>
          </div>
        )}

        <div className="grid gap-4">
          {prescriptions.map((p) => (
            <div 
              key={p.id} 
              className="group bg-linear-to-r from-white to-[#FAFDFF] rounded-2xl p-6 border border-[#E1F0FF] hover:border-[#0077B6]/40 hover:shadow-lg hover:shadow-[#0077B6]/5 transition-all duration-300 cursor-pointer"
              onClick={() => setSelected(p)}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[#F1F9FF] to-[#E1F0FF] flex items-center justify-center text-[#0077B6]">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-[#023E8A]">
                        {p.appointment?.preferredDate
                          ? new Date(p.appointment.preferredDate).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                          : p.dateIssued
                          ? new Date(p.dateIssued).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                          : "No Date"}
                      </div>
                      {p.appointment?.preferredTime && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                          <Clock size={14} />
                          {p.appointment.preferredTime}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {(p.appointment?.symptoms || p.notes) && (
                    <div className="pl-16">
                      <div className="text-sm text-gray-500 mb-1">Notes & Symptoms</div>
                      <div className="text-gray-700 line-clamp-2">
                        {p.appointment?.symptoms || p.notes}
                      </div>
                    </div>
                  )}
                </div>
                
                <button 
                  className="px-5 py-2.5 rounded-xl bg-linear-to-r from-[#0077B6] to-[#0096C7] text-white font-medium hover:shadow-lg hover:shadow-[#0077B6]/30 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 group-hover:scale-105"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected(p);
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-[#E1F0FF]">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <FileText size={16} />
              <span>{prescriptions.length} total prescriptions</span>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#F0F8FF] text-[#0077B6] hover:bg-[#E1F0FF] transition-colors duration-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {selected && (
        <PrescriptionModal
          prescription={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}