'use client';

import { useState, useEffect } from "react";
import { Send, Loader2, Search, User, MessageSquare, AlertCircle, CheckCircle } from "lucide-react";

export default function PatientFeedbackPage() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [message, setMessage] = useState("");
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await fetch('/api/patient/doctors', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch doctors');
      const data = await res.json();
      setDoctors(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingDoctors(false);
    }
  };

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedDoctor) {
      setError("Please select a doctor");
      return;
    }
    
    if (!message.trim()) {
      setError("Please write your feedback message");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          doctorId: selectedDoctor.doctorId,
          message: message.trim()
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to submit feedback');
      }

      setSuccess(true);
      setMessage("");
      setSelectedDoctor(null);
      
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-[#F0F9FF] to-[#E6F4FF] p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[#0077B6] to-[#00B4D8] flex items-center justify-center shadow-lg">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-[#023E8A] via-[#0077B6] to-[#0096C7] bg-clip-text text-transparent">
                Share Your Feedback
              </h1>
              <p className="text-gray-600 mt-2">Help us improve by sharing your experience with our doctors</p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-800">Feedback Submitted Successfully!</h3>
                <p className="text-green-700 text-sm">Thank you for sharing your experience. Your feedback helps us improve our services.</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <div>
                <h3 className="font-semibold text-red-800">Error</h3>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-2xl border border-[#E1F0FF] shadow-sm overflow-hidden">
          <div className="p-6 md:p-8">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Select Doctor */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-[#023E8A] mb-4 flex items-center gap-2">
                  <User size={20} />
                  Step 1: Select a Doctor
                </h3>
                
                <div className="mb-4">
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <Search size={20} />
                    </div>
                    <input
                      type="text"
                      placeholder="Search doctors by name or department..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-12 pr-4 py-3 w-full bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0077B6]/30 focus:border-[#0077B6] transition-all duration-300"
                    />
                  </div>
                </div>

                {loadingDoctors ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 text-[#0077B6] animate-spin" />
                  </div>
                ) : filteredDoctors.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                      <User className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500">
                      {searchTerm 
                        ? `No doctors found for "${searchTerm}"`
                        : "No doctors available. You can only give feedback to doctors you have consulted with."
                      }
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto p-2">
                    {filteredDoctors.map((doctor) => (
                      <div
                        key={doctor.doctorId}
                        onClick={() => setSelectedDoctor(doctor)}
                        className={`p-4 border rounded-xl cursor-pointer transition-all duration-300 ${
                          selectedDoctor?.doctorId === doctor.doctorId
                            ? 'border-[#0077B6] bg-blue-50'
                            : 'border-gray-200 hover:border-[#0077B6]/50 hover:bg-blue-50/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-linear-to-br from-[#F1F9FF] to-[#E1F0FF] flex items-center justify-center text-[#0077B6] font-semibold">
                            {doctor.name?.charAt(0) || 'D'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900 truncate">
                              {doctor.name}
                            </div>
                            <div className="text-sm text-gray-600 truncate">
                              {doctor.department}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {selectedDoctor && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-[#023E8A]">Selected Doctor:</div>
                        <div className="text-gray-700">{selectedDoctor.name}</div>
                        <div className="text-sm text-gray-600">{selectedDoctor.department}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedDoctor(null)}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Change
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Step 2: Feedback Message */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-[#023E8A] mb-4 flex items-center gap-2">
                  <MessageSquare size={20} />
                  Step 2: Write Your Feedback
                </h3>
                
                <div>
                  <textarea
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      setError(null);
                    }}
                    placeholder="Share your experience with the doctor. What did you like? How can they improve?"
                    className="w-full h-48 p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0077B6]/30 focus:border-[#0077B6] resize-none transition-all duration-300"
                    maxLength={2000}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <div className="text-sm text-gray-500">
                      {message.length}/2000 characters
                    </div>
                    <div className="text-sm text-gray-500">
                      Be specific and constructive
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDoctor(null);
                    setMessage("");
                    setError(null);
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-300"
                >
                  Clear Form
                </button>
                <button
                  type="submit"
                  disabled={submitting || !selectedDoctor || !message.trim()}
                  className="flex-1 px-6 py-3 bg-linear-to-r from-[#0077B6] to-[#0096C7] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#0077B6]/30 transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting Feedback...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Submit Feedback
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Tips Section */}
          <div className="border-t border-[#E1F0FF] bg-gray-50/50 p-6 rounded-b-2xl">
            <h4 className="font-semibold text-[#023E8A] mb-3">Tips for Great Feedback:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[#0077B6] text-xs">
                  ✓
                </div>
                <span>Be specific about your experience</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[#0077B6] text-xs">
                  ✓
                </div>
                <span>Focus on both positive aspects and areas for improvement</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[#0077B6] text-xs">
                  ✓
                </div>
                <span>Keep your feedback respectful and professional</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[#0077B6] text-xs">
                  ✓
                </div>
                <span>Your feedback is anonymous to the doctor</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Your feedback helps us maintain high-quality healthcare services and improve patient experiences.
            All feedback is reviewed for quality and may be shared anonymously with the medical team.
          </p>
        </div>
      </div>
    </div>
  );
}