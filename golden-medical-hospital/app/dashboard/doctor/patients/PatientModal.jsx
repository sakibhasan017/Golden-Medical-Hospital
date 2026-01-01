'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, Calendar, Clock, User, FileText, Phone, Mail, Activity, Loader2, ChevronRight } from "lucide-react";

function PrescriptionModal({ prescription, onClose }) {
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden border border-[#E1F0FF] shadow-2xl shadow-[#0077B6]/10">
        <div className="sticky top-0 bg-white border-b border-[#E1F0FF] p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#F0F8FF] flex items-center justify-center text-[#0077B6]">
              <FileText size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#023E8A]">Prescription Details</h3>
              <p className="text-sm text-gray-500">
                {prescription.appointment?.preferredDate 
                  ? new Date(prescription.appointment.preferredDate).toLocaleDateString()
                  : prescription.dateIssued
                  ? new Date(prescription.dateIssued).toLocaleDateString()
                  : "No Date"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-[#F0F8FF] hover:bg-[#0077B6]/10 flex items-center justify-center text-[#0077B6] hover:text-[#023E8A] transition-all duration-300"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Appointment Info */}
          {prescription.appointment && (
            <div className="mb-8 p-6 bg-[#F8FCFF] rounded-xl border border-[#E1F0FF]">
              <h4 className="font-semibold text-[#023E8A] mb-4 flex items-center gap-2">
                <Calendar size={18} />
                Appointment Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Date</div>
                  <div className="font-medium text-[#0077B6]">
                    {prescription.appointment.preferredDate 
                      ? new Date(prescription.appointment.preferredDate).toLocaleDateString()
                      : "Not specified"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Time</div>
                  <div className="font-medium text-[#0077B6]">
                    {prescription.appointment.preferredTime || "Not specified"}
                  </div>
                </div>
                {prescription.appointment.symptoms && (
                  <div className="md:col-span-2">
                    <div className="text-sm text-gray-500 mb-1">Symptoms Reported</div>
                    <div className="text-gray-700 bg-white p-3 rounded-lg border">
                      {prescription.appointment.symptoms}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Medicines Section */}
          <div className="mb-8">
            <h4 className="font-semibold text-[#023E8A] mb-4 flex items-center gap-2">
              <Activity size={18} />
              Prescribed Medicines
            </h4>
            {prescription.medicines && prescription.medicines.length > 0 ? (
              <div className="space-y-3">
                {prescription.medicines.map((medicine, index) => (
                  <div 
                    key={index} 
                    className="p-4 bg-white rounded-xl border border-[#E1F0FF] hover:border-[#0077B6]/30 transition-all duration-300"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-[#023E8A]">{medicine.name}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          Dosage: {medicine.dosage} • Frequency: {medicine.frequency} • Duration: {medicine.duration}
                        </div>
                        {medicine.instructions && (
                          <div className="text-sm text-gray-700 mt-2">
                            Instructions: {medicine.instructions}
                          </div>
                        )}
                      </div>
                      {medicine.quantity && (
                        <div className="px-3 py-1 bg-[#F0F8FF] text-[#0077B6] text-sm font-medium rounded-full">
                          {medicine.quantity}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 bg-[#F8FCFF] rounded-xl">
                No medicines prescribed
              </div>
            )}
          </div>

          {/* Additional Notes */}
          {prescription.notes && (
            <div className="mb-8">
              <h4 className="font-semibold text-[#023E8A] mb-3">Doctor&apos;s Notes</h4>
              <div className="p-4 bg-[#F8FCFF] rounded-xl border border-[#E1F0FF]">
                <div className="text-gray-700 whitespace-pre-wrap">
                  {prescription.notes}
                </div>
              </div>
            </div>
          )}

          {/* Prescription Meta */}
          <div className="pt-6 border-t border-[#E1F0FF]">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div>
                <span className="font-medium text-[#0077B6]">Prescription ID:</span> {prescription.id?.slice(-8) || "N/A"}
              </div>
              <div>
                <span className="font-medium text-[#0077B6]">Issued:</span>{" "}
                {prescription.dateIssued ? new Date(prescription.dateIssued).toLocaleDateString() : "N/A"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PatientModal({ patient, onClose }) {
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [err, setErr] = useState(null);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [prescriptionsLoading, setPrescriptionsLoading] = useState({});
  const [expandedAppointments, setExpandedAppointments] = useState({});

  const pid = patient?.patientId || patient?.id || patient?._id || null;

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoadingProfile(true);
      try {
        if (!pid) throw new Error("No patient id");
        const res = await fetch(`/api/patient/${pid}`, { credentials: "include" });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body?.message || `Error ${res.status}`);
        }
        const data = await res.json();
        if (!mounted) return;
        setProfile(data);
      } catch (e) {
        if (!mounted) return;
        setErr(e.message || "Failed to load profile");
      } finally {
        if (!mounted) return;
        setLoadingProfile(false);
      }
    })();
    return () => { mounted = false; };
  }, [pid]);

  const loadHistory = async () => {
    setLoadingHistory(true);
    try {
      if (!pid) throw new Error("No patient id");
      const res = await fetch(`/api/patient/history/${pid}`, { credentials: "include" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message || `Error ${res.status}`);
      }
      const data = await res.json();
      setHistory(Array.isArray(data) ? data : []);
    } catch (e) {
      setHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  const loadPrescriptionsForAppointment = async (appointmentId) => {
    setPrescriptionsLoading(prev => ({ ...prev, [appointmentId]: true }));
    try {
      const res = await fetch(`/api/prescription/appointment/${appointmentId}`, { 
        credentials: "include" 
      });
      if (res.ok) {
        const data = await res.json();
        setPrescriptions(prev => {
          const existing = prev.filter(p => p.appointmentId !== appointmentId);
          return [...existing, data];
        });
      }
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
    } finally {
      setPrescriptionsLoading(prev => ({ ...prev, [appointmentId]: false }));
      setExpandedAppointments(prev => ({ ...prev, [appointmentId]: true }));
    }
  };

  const toggleAppointmentExpansion = (appointmentId) => {
    if (!expandedAppointments[appointmentId] && !prescriptions.find(p => p.appointmentId === appointmentId)) {
      loadPrescriptionsForAppointment(appointmentId);
    } else {
      setExpandedAppointments(prev => ({ 
        ...prev, 
        [appointmentId]: !prev[appointmentId] 
      }));
    }
  };

  const getPrescriptionForAppointment = (appointmentId) => {
    return prescriptions.find(p => p.appointmentId === appointmentId);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="absolute inset-0 bg-black/40" 
          onClick={onClose}
        />
        
        {/* Main Modal */}
        <div className="relative bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden border border-[#E1F0FF] shadow-2xl">
          {/* Header */}
          <div className="bg-white border-b border-[#E1F0FF] p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-[#F1F9FF] border-4 border-white shadow-lg overflow-hidden">
                  {profile?.image ? (
                    <Image 
                      src={profile.image} 
                      alt={profile.name} 
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                      unoptimized 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#0077B6] font-bold text-3xl">
                      {profile?.name?.split(" ").map(n => n[0]).slice(0,2).join("") || "P"}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-[#023E8A]">
                    {profile?.name ?? patient.name}
                  </h2>
                  <p className="text-lg text-[#0096C7]">{profile?.email ?? patient.email}</p>
                  
                  <div className="flex items-center gap-4">
                    {profile?.phone && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone size={16} />
                        <span>{profile.phone}</span>
                      </div>
                    )}
                    {profile?.email && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail size={16} />
                        <span>{profile.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-[#F0F8FF] hover:bg-[#0077B6]/10 flex items-center justify-center text-[#0077B6] hover:text-[#023E8A] transition-all duration-300"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Patient Details */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl p-6 border border-[#E1F0FF] shadow-sm">
                  <h3 className="text-lg font-semibold text-[#023E8A] mb-4 flex items-center gap-2">
                    <User size={20} />
                    Patient Details
                  </h3>
                  
                  {loadingProfile ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 text-[#0077B6] animate-spin" />
                    </div>
                  ) : profile ? (
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Age</div>
                        <div className="font-medium text-[#0077B6]">{profile.age ?? "Not specified"}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Blood Group</div>
                        <div className="font-medium text-[#0077B6]">{profile.bloodGroup ?? "Not specified"}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Email</div>
                        <div className="font-medium text-[#0077B6] truncate">{profile.email}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Phone</div>
                        <div className="font-medium text-[#0077B6]">{profile.phone ?? "Not specified"}</div>
                      </div>
                      {profile.gender && (
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Gender</div>
                          <div className="font-medium text-[#0077B6]">{profile.gender}</div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-red-500">
                      {err ?? "Profile not found"}
                    </div>
                  )}
                </div>

                {/* Load History Button */}
                <button
                  onClick={loadHistory}
                  disabled={loadingHistory}
                  className="w-full mt-4 px-6 py-3 bg-[#0077B6] text-white font-semibold rounded-xl hover:bg-[#0096C7] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loadingHistory ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <Calendar size={20} />
                      Load Appointment History
                    </>
                  )}
                </button>
              </div>

              {/* Medical History Section */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl p-6 border border-[#E1F0FF]">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-[#023E8A] flex items-center gap-2">
                      <Calendar size={20} />
                      Appointment History
                    </h3>
                    <div className="text-sm text-gray-500">
                      {history.length} appointment{history.length !== 1 ? 's' : ''}
                    </div>
                  </div>

                  {loadingHistory ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center">
                        <Loader2 className="w-12 h-12 text-[#0077B6] animate-spin mx-auto mb-4" />
                        <p className="text-gray-500">Loading appointment history...</p>
                      </div>
                    </div>
                  ) : history.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 rounded-full bg-[#F1F9FF] flex items-center justify-center mx-auto mb-4">
                        <Calendar size={24} className="text-[#0077B6]" />
                      </div>
                      <h4 className="text-lg font-semibold text-[#023E8A] mb-2">No Appointments Found</h4>
                      <p className="text-gray-500 max-w-md mx-auto">
                        Click &quot;Load Appointment History&quot; to view patient&apos;s appointment records.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {history.map((item) => {
                        const prescription = getPrescriptionForAppointment(item.id);
                        const isLoading = prescriptionsLoading[item.id];
                        const isExpanded = expandedAppointments[item.id];
                        
                        return (
                          <div
                            key={item.id}
                            className="bg-white rounded-xl border border-[#E1F0FF] overflow-hidden"
                          >
                            {/* Appointment Header */}
                            <div 
                              className="p-4 cursor-pointer hover:bg-[#F8FCFF] transition-colors duration-300"
                              onClick={() => toggleAppointmentExpansion(item.id)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-lg bg-[#F1F9FF] flex items-center justify-center text-[#0077B6]">
                                    <Calendar size={20} />
                                  </div>
                                  <div>
                                    <div className="font-semibold text-[#023E8A]">
                                      {item.preferredDate ? new Date(item.preferredDate).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                      }) : "No Date"}
                                    </div>
                                    {item.preferredTime && (
                                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                        <Clock size={14} />
                                        {item.preferredTime}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                  {prescription ? (
                                    <span className="px-3 py-1 bg-[#F0F8FF] text-[#0077B6] text-sm font-medium rounded-full">
                                      Prescribed
                                    </span>
                                  ) : (
                                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
                                      No Prescription
                                    </span>
                                  )}
                                  <ChevronRight 
                                    size={20} 
                                    className={`text-gray-400 transition-transform duration-300 ${
                                      isExpanded ? 'rotate-90' : ''
                                    }`}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Expanded Content */}
                            {isExpanded && (
                              <div className="border-t border-[#E1F0FF] p-4">
                                {isLoading ? (
                                  <div className="flex items-center justify-center py-4">
                                    <Loader2 className="w-6 h-6 text-[#0077B6] animate-spin" />
                                  </div>
                                ) : (
                                  <div className="space-y-4">
                                    {/* Symptoms */}
                                    {item.symptoms && (
                                      <div>
                                        <div className="text-sm font-medium text-gray-500 mb-2">Symptoms</div>
                                        <div className="text-gray-700 bg-[#F8FCFF] p-3 rounded-lg">
                                          {item.symptoms}
                                        </div>
                                      </div>
                                    )}

                                    {/* Prescription */}
                                    {prescription ? (
                                      <div>
                                        <div className="flex items-center justify-between mb-3">
                                          <div className="text-sm font-medium text-gray-500">Prescription</div>
                                          <button
                                            onClick={() => setSelectedPrescription(prescription)}
                                            className="px-4 py-2 bg-[#0077B6] text-white text-sm font-medium rounded-lg hover:bg-[#0096C7] transition-colors duration-300"
                                          >
                                            View Details
                                          </button>
                                        </div>
                                        {prescription.medicines && prescription.medicines.length > 0 ? (
                                          <div className="space-y-2">
                                            {prescription.medicines.slice(0, 2).map((medicine, idx) => (
                                              <div key={idx} className="text-sm text-gray-700">
                                                • {medicine.name} - {medicine.dosage}
                                              </div>
                                            ))}
                                            {prescription.medicines.length > 2 && (
                                              <div className="text-sm text-gray-500">
                                                + {prescription.medicines.length - 2} more medicines
                                              </div>
                                            )}
                                          </div>
                                        ) : (
                                          <div className="text-sm text-gray-500">No medicines prescribed</div>
                                        )}
                                      </div>
                                    ) : (
                                      <div className="text-center py-4 text-gray-500 text-sm">
                                        No prescription found for this appointment
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Prescription Modal */}
      {selectedPrescription && (
        <PrescriptionModal
          prescription={selectedPrescription}
          onClose={() => setSelectedPrescription(null)}
        />
      )}
    </>
  );
}