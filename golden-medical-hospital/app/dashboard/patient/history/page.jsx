'use client';

import { useEffect, useState } from "react";
import DoctorCard from "@/components/PatientHistory/DoctorCard";
import DoctorModal from "@/components/PatientHistory/DoctorModal";
import DoctorPrescriptionsModal from "@/components/PatientHistory/DoctorPrescriptionsModal";
import { Users, Search, Filter, Sparkles } from "lucide-react";

export default function PatientHistoryPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDoctor, setShowDoctor] = useState(null);
  const [showPrescriptions, setShowPrescriptions] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/patient/doctors");
        const json = await res.json().catch(()=>[]);
        if (!mounted) return;
        setDoctors(Array.isArray(json) ? json : []);
      } catch {
        if (!mounted) return;
        setDoctors([]);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();
    return ()=>{ mounted = false; };
  }, []);

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="min-h-screen bg-linear-to-b from-[#F0F9FF] via-[#E6F4FF] to-[#DCEFFF] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[#0077B6] to-[#00B4D8] flex items-center justify-center shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-[#023E8A] via-[#0077B6] to-[#0096C7] bg-clip-text text-transparent">
                Your Medical History
              </h1>
              <p className="text-gray-600 mt-2">All doctors you have consulted with and their prescriptions</p>
            </div>
          </div>

          {/* Stats and Search */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-8">
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 bg-white rounded-xl border border-[#E1F0FF] shadow-sm">
                <span className="text-sm text-gray-500">Total Doctors:</span>
                <span className="ml-2 text-lg font-bold text-[#023E8A]">{doctors.length}</span>
              </div>
              <div className="px-4 py-2 bg-white rounded-xl border border-[#E1F0FF] shadow-sm">
                <span className="text-sm text-gray-500">Total Prescriptions:</span>
                <span className="ml-2 text-lg font-bold text-[#0077B6]">
                  {doctors.reduce((sum, d) => sum + (d.prescriptionCount || 0), 0)}
                </span>
              </div>
            </div>

            <div className="relative w-full md:w-auto">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder="Search doctors by name, department, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 w-full md:w-96 bg-white border border-[#E1F0FF] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0077B6]/30 focus:border-[#0077B6] transition-all duration-300 shadow-sm"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-[#F0F8FF] text-[#0077B6] text-sm rounded-lg hover:bg-[#E1F0FF] transition-colors duration-300">
                <Filter size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-linear-to-br from-white/80 to-white/40 backdrop-blur-sm rounded-3xl border border-white/60 shadow-xl shadow-[#0077B6]/5 p-6 md:p-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-linear-to-br from-[#F1F9FF] to-[#E1F0FF] flex items-center justify-center mb-6 animate-pulse">
                  <Users className="w-10 h-10 text-[#0077B6] animate-pulse" />
                </div>
                <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-[#00B4D8] animate-ping" />
              </div>
              <h3 className="text-xl font-semibold text-[#023E8A] mb-2">Loading Your Doctors</h3>
              <p className="text-gray-500 max-w-md text-center">
                Fetching your medical history and doctor information...
              </p>
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-24 h-24 rounded-full bg-linear-to-br from-[#F1F9FF] to-[#E1F0FF] flex items-center justify-center mx-auto mb-6">
                <Users className="w-12 h-12 text-[#0077B6]" />
              </div>
              <h3 className="text-2xl font-bold text-[#023E8A] mb-3">No Doctors Found</h3>
              <p className="text-gray-600 max-w-md mx-auto mb-8">
                {searchTerm 
                  ? "No doctors match your search. Try a different search term."
                  : "You haven't consulted with any doctors yet. Your medical history will appear here after your first appointment."
                }
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="px-6 py-3 bg-linear-to-r from-[#0077B6] to-[#0096C7] text-white rounded-xl font-medium hover:shadow-lg hover:shadow-[#0077B6]/30 transition-all duration-300"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-500">
                  Showing {filteredDoctors.length} of {doctors.length} doctors
                </div>
                <div className="text-sm text-[#0077B6] font-medium">
                  Click on a doctor to view details and prescriptions
                </div>
              </div>
              
              <div className="space-y-6">
                {filteredDoctors.map(d => (
                  <DoctorCard
                    key={d.doctorId}
                    doctor={d}
                    onDetails={() => setShowDoctor(d)}
                    onPrescriptions={() => setShowPrescriptions(d)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Your medical history is secure and private. All data is encrypted and protected.
          </p>
        </div>
      </div>

      {showDoctor && <DoctorModal doctor={showDoctor} onClose={() => setShowDoctor(null)} />}
      {showPrescriptions && <DoctorPrescriptionsModal doctor={showPrescriptions} onClose={() => setShowPrescriptions(null)} />}

      {/* Add these styles for animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
    </section>
  );
}