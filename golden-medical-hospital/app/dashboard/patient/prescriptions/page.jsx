"use client";
import React, { useState, useEffect, useMemo } from "react";
import PrescriptionModal from "@/components/Prescriptions/PrescriptionModal";
import PrescriptionCard from "@/components/Prescriptions/PrescriptionCard";
import { 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Pill, 
  Clock,
  Download,
  ChevronDown,
  ChevronUp,
  FileText,
  Stethoscope,
  TrendingUp,
  RefreshCw
} from "lucide-react";

const PrescriptionList = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    dateSort: "newest",
    doctor: "",
    status: "all",
    month: "all"
  });
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    thisMonth: 0
  });

  // Available doctors from prescriptions
  const doctorsList = useMemo(() => {
    const doctors = prescriptions
      .map(p => p.doctorName || p.doctor)
      .filter(Boolean);
    return [...new Set(doctors)];
  }, [prescriptions]);

  // Available months from prescriptions
  const monthsList = useMemo(() => {
    const months = prescriptions.map(p => {
      const date = new Date(p.date || p.appointmentDate);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    });
    return [...new Set(months)].sort().reverse();
  }, [prescriptions]);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  useEffect(() => {
    updateStats();
  }, [prescriptions]);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/patient/prescriptions");
      if (!res.ok) return;
      const data = await res.json();
      setPrescriptions(data);
    } catch (err) {
      console.log("Fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStats = () => {
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    setStats({
      total: prescriptions.length,
      active: prescriptions.filter(p => p.status === 'active' || p.status === 'ongoing').length,
      completed: prescriptions.filter(p => p.status === 'completed' || p.status === 'finished').length,
      thisMonth: prescriptions.filter(p => {
        const prescDate = new Date(p.date || p.appointmentDate);
        return prescDate >= thisMonthStart;
      }).length
    });
  };

  // Filter and sort prescriptions
  const filteredPrescriptions = useMemo(() => {
    let filtered = [...prescriptions];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        (p.doctorName && p.doctorName.toLowerCase().includes(query)) ||
        (p.doctor && p.doctor.toLowerCase().includes(query)) ||
        (p.symptoms && p.symptoms.toLowerCase().includes(query)) ||
        (p.medicines && p.medicines.some(m => 
          m.name && m.name.toLowerCase().includes(query)
        ))
      );
    }

    // Doctor filter
    if (filters.doctor) {
      filtered = filtered.filter(p => 
        (p.doctorName === filters.doctor) || 
        (p.doctor === filters.doctor)
      );
    }

    // Month filter
    if (filters.month !== "all") {
      filtered = filtered.filter(p => {
        const date = new Date(p.date || p.appointmentDate);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        return monthKey === filters.month;
      });
    }

    // Sort by date
    filtered.sort((a, b) => {
      const dateA = new Date(a.date || a.appointmentDate || a._id);
      const dateB = new Date(b.date || b.appointmentDate || b._id);
      return filters.dateSort === "newest" ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [prescriptions, searchQuery, filters]);

  const handleExport = () => {
    // Export functionality
    const dataStr = JSON.stringify(filteredPrescriptions, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `prescriptions-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilters({
      dateSort: "newest",
      doctor: "",
      status: "all",
      month: "all"
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white">
      {/* Header Section */}
      <div className="bg-linear-to-r from-[#0077B6] via-[#0096C7] to-[#00B4D8] text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <div className="flex items-center gap-3 justify-center md:justify-start mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold">Your Prescriptions</h1>
              </div>
              <p className="text-white/90 max-w-2xl">
                Manage and track all your medical prescriptions in one place. 
                View details, download, and organize your healthcare records.
              </p>
            </div>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 bg-white text-[#0077B6] hover:bg-gray-100 font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <Download size={20} />
              Export All
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 -mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-[#0077B6]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Prescriptions</p>
                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              </div>
              <FileText className="w-8 h-8 text-[#0077B6]" />
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-[#00B4D8]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-800">{stats.active}</p>
              </div>
              <Clock className="w-8 h-8 text-[#00B4D8]" />
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-[#0096C7]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-800">{stats.thisMonth}</p>
              </div>
              <Calendar className="w-8 h-8 text-[#0096C7]" />
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-[#023E8A]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Doctors</p>
                <p className="text-2xl font-bold text-gray-800">{doctorsList.length}</p>
              </div>
              <User className="w-8 h-8 text-[#023E8A]" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by doctor name, symptoms, medicines..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0077B6] focus:border-transparent"
              />
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-6 py-3 bg-[#0077B6] text-white rounded-xl hover:bg-[#0096C7] transition-colors"
            >
              <Filter size={20} />
              Filters
              {showFilters ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>

          {/* Advanced Filters (Collapsible) */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Sort by Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar size={16} className="inline mr-2" />
                    Sort by Date
                  </label>
                  <select
                    value={filters.dateSort}
                    onChange={(e) => setFilters({...filters, dateSort: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077B6]"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                </div>

                {/* Filter by Doctor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Stethoscope size={16} className="inline mr-2" />
                    Filter by Doctor
                  </label>
                  <select
                    value={filters.doctor}
                    onChange={(e) => setFilters({...filters, doctor: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077B6]"
                  >
                    <option value="">All Doctors</option>
                    {doctorsList.map((doctor, idx) => (
                      <option key={idx} value={doctor}>{doctor}</option>
                    ))}
                  </select>
                </div>

                {/* Filter by Month */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar size={16} className="inline mr-2" />
                    Filter by Month
                  </label>
                  <select
                    value={filters.month}
                    onChange={(e) => setFilters({...filters, month: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077B6]"
                  >
                    <option value="all">All Months</option>
                    {monthsList.map((month, idx) => {
                      const [year, monthNum] = month.split('-');
                      const monthName = new Date(year, monthNum - 1).toLocaleString('default', { month: 'long' });
                      return (
                        <option key={idx} value={month}>
                          {monthName} {year}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              {/* Clear Filters Button */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 flex items-center gap-2"
                >
                  <RefreshCw size={16} />
                  Clear All Filters
                </button>
              </div>
            </div>
          )}

          {/* Results Summary */}
          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold text-[#0077B6]">{filteredPrescriptions.length}</span> of{" "}
                <span className="font-semibold">{prescriptions.length}</span> prescriptions
              </p>
            </div>
            {searchQuery && (
              <div className="flex items-center gap-2">
                <Search size={16} className="text-gray-500" />
                <span className="text-sm text-gray-600">Search: {searchQuery}</span>
              </div>
            )}
          </div>
        </div>

        {/* Prescriptions Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0077B6] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your prescriptions...</p>
          </div>
        ) : filteredPrescriptions.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {prescriptions.length === 0 ? "No prescriptions available yet" : "No matching prescriptions found"}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              {prescriptions.length === 0 
                ? "Your prescriptions will appear here once prescribed by doctors."
                : "Try adjusting your search or filters to find what you're looking for."}
            </p>
            {prescriptions.length === 0 ? (
              <button
                onClick={fetchPrescriptions}
                className="inline-flex items-center gap-2 bg-[#0077B6] hover:bg-[#0096C7] text-white font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                <RefreshCw size={20} />
                Refresh
              </button>
            ) : (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 bg-[#0077B6] hover:bg-[#0096C7] text-white font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                <RefreshCw size={20} />
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Grid View */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
              {filteredPrescriptions.map((p, index) => (
                <div
                  key={p.id || p._id}
                  className="transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <PrescriptionCard
                    prescription={p}
                    onClick={() => setSelected(p)}
                  />
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-linear-to-r from-[#023E8A] to-[#0077B6] rounded-2xl p-6 text-white">
              <div>
                <h3 className="text-xl font-bold mb-2">Need Help?</h3>
                <p className="text-white/90">Contact your doctor for prescription-related queries</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleExport}
                  className="bg-white text-[#0077B6] hover:bg-gray-100 font-semibold px-6 py-3 rounded-xl transition-colors flex items-center gap-2"
                >
                  <Download size={20} />
                  Export Selected
                </button>
                <button
                  onClick={fetchPrescriptions}
                  className="bg-transparent border border-white text-white hover:bg-white/10 font-semibold px-6 py-3 rounded-xl transition-colors flex items-center gap-2"
                >
                  <RefreshCw size={20} />
                  Refresh
                </button>
              </div>
            </div>
          </>
        )}

        {/* Prescription Modal */}
        {selected && (
          <PrescriptionModal
            prescription={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </div>
    </div>
  );
};

export default PrescriptionList;