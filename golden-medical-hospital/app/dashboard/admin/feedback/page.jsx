'use client';

import { useState, useEffect } from "react";
import { MessageSquare, Search, User, Calendar, Filter, ChevronDown, X, Eye, UserCheck, Loader2, AlertCircle } from "lucide-react";

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [dateFilter, setDateFilter] = useState("all"); // all, today, week, month
  const [showFilters, setShowFilters] = useState(false);
  const [expandedFeedback, setExpandedFeedback] = useState(null);

  useEffect(() => {
    fetchFeedbacks();
    fetchDoctors();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const res = await fetch('/api/admin/feedback', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch feedbacks');
      const data = await res.json();
      setFeedbacks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await fetch('/api/admin/doctors', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setDoctors(data);
      }
    } catch (err) {
      console.error('Failed to fetch doctors:', err);
    }
  };

  const filterFeedbacks = () => {
    let filtered = [...feedbacks];

    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(feedback => 
        feedback.doctor?.name?.toLowerCase().includes(searchLower) ||
        feedback.patient?.name?.toLowerCase().includes(searchLower) ||
        feedback.patient?.email?.toLowerCase().includes(searchLower) ||
        feedback.message?.toLowerCase().includes(searchLower)
      );
    }

    // Filter by selected doctor
    if (selectedDoctor) {
      filtered = filtered.filter(feedback => 
        feedback.doctor?._id === selectedDoctor ||
        feedback.doctorId?.toString() === selectedDoctor
      );
    }

    // Filter by date
    const now = new Date();
    if (dateFilter === 'today') {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      filtered = filtered.filter(feedback => 
        new Date(feedback.createdAt) >= today
      );
    } else if (dateFilter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(feedback => 
        new Date(feedback.createdAt) >= weekAgo
      );
    } else if (dateFilter === 'month') {
      const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      filtered = filtered.filter(feedback => 
        new Date(feedback.createdAt) >= monthAgo
      );
    }

    return filtered;
  };

  const filteredFeedbacks = filterFeedbacks();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / (3600000 * 24));

    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return formatDate(dateString);
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedDoctor("");
    setDateFilter("all");
  };

  const getDoctorName = (doctorId) => {
    if (!doctorId) return "Unknown Doctor";
    const doctor = doctors.find(d => d._id === doctorId || d.doctorId === doctorId);
    return doctor?.name || "Unknown Doctor";
  };

  const toggleFeedbackExpansion = (feedbackId) => {
    setExpandedFeedback(expandedFeedback === feedbackId ? null : feedbackId);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-[#F0F9FF] to-[#E6F4FF] p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[#0077B6] to-[#00B4D8] flex items-center justify-center shadow-lg">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-[#023E8A] via-[#0077B6] to-[#0096C7] bg-clip-text text-transparent">
                Patient Feedbacks
              </h1>
              <p className="text-gray-600 mt-2">Review and manage patient feedback for all doctors</p>
            </div>
          </div>

          {/* Search and Filters Bar */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              <div className="relative flex-1 max-w-lg">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Search size={20} />
                </div>
                <input
                  type="text"
                  placeholder="Search feedbacks by doctor, patient, or message..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-12 pr-4 py-3 w-full bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0077B6]/30 focus:border-[#0077B6] transition-all duration-300 shadow-sm"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                >
                  <Filter size={16} />
                  Filters
                  <ChevronDown size={16} className={`transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
                </button>
                
                {(search || selectedDoctor || dateFilter !== 'all') && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-300"
                  >
                    <X size={14} />
                    Clear Filters
                  </button>
                )}
              </div>
            </div>

            {/* Advanced Filters Panel */}
            {showFilters && (
              <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Doctor Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filter by Doctor
                    </label>
                    <div className="relative">
                      <select
                        value={selectedDoctor}
                        onChange={(e) => setSelectedDoctor(e.target.value)}
                        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077B6]/30 focus:border-[#0077B6] transition-all duration-300"
                      >
                        <option value="">All Doctors</option>
                        {doctors.map(doctor => (
                          <option key={doctor._id || doctor.doctorId} value={doctor._id || doctor.doctorId}>
                            {doctor.name} - {doctor.department}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Date Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filter by Date
                    </label>
                    <div className="flex items-center gap-2">
                      {['all', 'today', 'week', 'month'].map(option => (
                        <button
                          key={option}
                          onClick={() => setDateFilter(option)}
                          className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                            dateFilter === option
                              ? 'bg-[#0077B6] text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {option === 'all' && 'All Time'}
                          {option === 'today' && 'Today'}
                          {option === 'week' && 'This Week'}
                          {option === 'month' && 'This Month'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 mb-6">
            <div className="px-4 py-2 bg-white rounded-xl border border-[#E1F0FF] shadow-sm">
              <span className="text-sm text-gray-500">Total Feedbacks:</span>
              <span className="ml-2 text-lg font-bold text-[#023E8A]">{feedbacks.length}</span>
            </div>
            <div className="px-4 py-2 bg-white rounded-xl border border-[#E1F0FF] shadow-sm">
              <span className="text-sm text-gray-500">Filtered:</span>
              <span className="ml-2 text-lg font-bold text-[#0077B6]">{filteredFeedbacks.length}</span>
            </div>
            <div className="px-4 py-2 bg-white rounded-xl border border-[#E1F0FF] shadow-sm">
              <span className="text-sm text-gray-500">Unique Doctors:</span>
              <span className="ml-2 text-lg font-bold text-[#0096C7]">
                {[...new Set(feedbacks.map(f => f.doctorId?.toString()))].filter(Boolean).length}
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            <div className="flex items-center gap-2">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-2xl border border-[#E1F0FF] shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="w-16 h-16 rounded-full bg-linear-to-br from-[#F1F9FF] to-[#E1F0FF] flex items-center justify-center mb-6 animate-pulse">
                <Loader2 className="w-8 h-8 text-[#0077B6] animate-spin" />
              </div>
              <p className="text-gray-500">Loading feedbacks...</p>
            </div>
          ) : filteredFeedbacks.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-24 h-24 rounded-full bg-linear-to-br from-[#F1F9FF] to-[#E1F0FF] flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="w-12 h-12 text-[#0077B6]" />
              </div>
              <h3 className="text-2xl font-bold text-[#023E8A] mb-3">
                {search || selectedDoctor || dateFilter !== 'all' ? "No Matching Feedbacks" : "No Feedbacks Found"}
              </h3>
              <p className="text-gray-600 max-w-md mx-auto mb-8">
                {search || selectedDoctor || dateFilter !== 'all' 
                  ? "Try adjusting your filters or search term"
                  : "No patient feedbacks have been submitted yet."
                }
              </p>
              {(search || selectedDoctor || dateFilter !== 'all') && (
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-linear-to-r from-[#0077B6] to-[#0096C7] text-white rounded-xl font-medium hover:shadow-lg hover:shadow-[#0077B6]/30 transition-all duration-300"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredFeedbacks.map((feedback) => (
                <div
                  key={feedback._id}
                  className="p-6 hover:bg-gray-50/50 transition-colors duration-300"
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left Column - Doctor & Patient Info */}
                    <div className="lg:w-1/3">
                      <div className="space-y-4">
                        {/* Doctor Info */}
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-full bg-linear-to-br from-[#F1F9FF] to-[#E1F0FF] flex items-center justify-center text-[#0077B6] font-semibold">
                            {feedback.doctor?.name?.charAt(0) || 'D'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-[#023E8A] truncate">
                                Dr. {feedback.doctor?.name || getDoctorName(feedback.doctorId)}
                              </h4>
                              <span className="px-2 py-1 bg-[#F0F8FF] text-[#0077B6] text-xs font-medium rounded-full">
                                Doctor
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 truncate">
                              {feedback.doctor?.department || 'General Medicine'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {feedback.doctor?.email || 'No email'}
                            </p>
                          </div>
                        </div>

                        {/* Patient Info */}
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#F1F9FF] to-[#E1F0FF] flex items-center justify-center text-[#0096C7] font-semibold">
                            {feedback.patient?.name?.charAt(0) || 'P'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h5 className="font-medium text-gray-900 truncate">
                                {feedback.patient?.name || 'Anonymous Patient'}
                              </h5>
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                                Patient
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 truncate">
                              {feedback.patient?.email || 'No email'}
                            </p>
                          </div>
                        </div>

                        {/* Date Info */}
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar size={14} />
                          <span>{getRelativeTime(feedback.createdAt)}</span>
                          <span className="mx-2">•</span>
                          <span>{formatDate(feedback.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Feedback Message */}
                    <div className="lg:w-2/3">
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-semibold text-gray-900 flex items-center gap-2">
                            <MessageSquare size={16} />
                            Patient Feedback
                          </h5>
                          <button
                            onClick={() => toggleFeedbackExpansion(feedback._id)}
                            className="text-sm text-[#0077B6] hover:text-[#023E8A] flex items-center gap-1"
                          >
                            <Eye size={14} />
                            {expandedFeedback === feedback._id ? 'Show Less' : 'Show More'}
                          </button>
                        </div>
                        
                        <div className="text-gray-700">
                          {expandedFeedback === feedback._id ? (
                            <div className="whitespace-pre-wrap">{feedback.message}</div>
                          ) : (
                            <div className="line-clamp-3">{feedback.message}</div>
                          )}
                        </div>
                      </div>

                      {/* Feedback Metadata */}
                      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <UserCheck size={14} />
                            <span>Patient ID: {feedback.patientId?.toString().slice(-8) || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User size={14} />
                            <span>Doctor ID: {feedback.doctorId?.toString().slice(-8) || 'N/A'}</span>
                          </div>
                        </div>
                        <div className="text-xs">
                          Feedback ID: {feedback._id?.toString().slice(-8)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary Footer */}
        {!loading && filteredFeedbacks.length > 0 && (
          <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
            <div>
              Showing {filteredFeedbacks.length} of {feedbacks.length} feedbacks
              {selectedDoctor && (
                <span className="ml-4">
                  • Filtered by: Dr. {doctors.find(d => d._id === selectedDoctor || d.doctorId === selectedDoctor)?.name}
                </span>
              )}
            </div>
            <div>
              Sorted by: Most Recent
            </div>
          </div>
        )}
      </div>
    </div>
  );
}