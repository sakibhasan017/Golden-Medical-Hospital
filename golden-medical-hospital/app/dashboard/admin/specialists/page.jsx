'use client';

import { useState, useEffect, useMemo } from "react";
import { Plus, Edit, Trash2, Users, Phone, Loader2, AlertCircle, CheckCircle, Search, UserX, Building } from "lucide-react";

export default function AdminSpecialistsPage() {
  const [specialists, setSpecialists] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null); // Track which specialist is being edited
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    contact: '',
    assignedDoctors: [] // Array of doctor IDs
  });
  const [doctorSearch, setDoctorSearch] = useState('');
  const [showDoctorDropdown, setShowDoctorDropdown] = useState(false);

  useEffect(() => {
    fetchSpecialists();
    fetchAllDoctors();
  }, []);

  const fetchSpecialists = async () => {
    try {
      const res = await fetch('/api/specialists', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch specialists');
      const data = await res.json();
      setSpecialists(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch ALL doctors from the new endpoint
  const fetchAllDoctors = async () => {
    try {
      const res = await fetch('/api/doctors/all', { credentials: 'include' });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch doctors');
      }
      
      const data = await res.json();
      setDoctors(data);
    } catch (err) {
      console.error('Failed to fetch doctors:', err);
      setError(`Failed to load doctors: ${err.message}. Please make sure the /api/doctors/all endpoint exists.`);
    } finally {
      setLoadingDoctors(false);
    }
  };

  // Get unique departments from all doctors
  const uniqueDepartments = useMemo(() => {
    const departments = doctors
      .map(doctor => doctor.department)
      .filter(Boolean)
      .filter(dept => dept !== "Not specified");
    return [...new Set(departments)].sort();
  }, [doctors]);

  // Filter doctors based on search term
  const filteredDoctors = useMemo(() => {
    if (!doctorSearch.trim()) {
      // Show all doctors that aren't already assigned
      return doctors.filter(doctor => 
        !formData.assignedDoctors.includes(doctor._id)
      );
    }
    
    const searchTerm = doctorSearch.toLowerCase();
    return doctors.filter(doctor => {
      const isAssigned = formData.assignedDoctors.includes(doctor._id);
      if (isAssigned) return false;
      
      // Search in department, name, and specialization
      return (
        doctor.department?.toLowerCase().includes(searchTerm) ||
        doctor.name?.toLowerCase().includes(searchTerm) ||
        doctor.specialization?.toLowerCase().includes(searchTerm)
      );
    });
  }, [doctorSearch, doctors, formData.assignedDoctors]);

  // Get assigned doctor objects for display
  const assignedDoctorObjects = useMemo(() => {
    return doctors.filter(doctor => 
      formData.assignedDoctors.includes(doctor._id)
    );
  }, [formData.assignedDoctors, doctors]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    
    if (!formData.title.trim() || !formData.description.trim() || !formData.contact.trim()) {
      setError("Please fill in all required fields");
      setSubmitting(false);
      return;
    }
    
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        contact: formData.contact,
        doctorList: formData.assignedDoctors // Array of doctor ObjectId strings
      };
      
      console.log("Creating specialist with payload:", payload);
      
      const res = await fetch('/api/specialists', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to create specialist');
      }

      setSuccess(`Specialist created successfully with ${formData.assignedDoctors.length} assigned doctors!`);
      fetchSpecialists();
      
      // Reset form
      setFormData({ 
        title: '', 
        description: '', 
        contact: '',
        assignedDoctors: [] 
      });
      setDoctorSearch('');
      setShowDoctorDropdown(false);
      
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (specialist) => {
    setEditingId(specialist._id);
    setFormData({
      title: specialist.title,
      description: specialist.description,
      contact: specialist.contact,
      assignedDoctors: specialist.doctorList?.map(doc => doc._id) || []
    });
    
    // Scroll to form
    document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      contact: '',
      assignedDoctors: []
    });
    setDoctorSearch('');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    
    if (!formData.title.trim() || !formData.description.trim() || !formData.contact.trim()) {
      setError("Please fill in all required fields");
      setSubmitting(false);
      return;
    }
    
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        contact: formData.contact,
        doctorList: formData.assignedDoctors
      };
      
      console.log("Updating specialist with payload:", payload);
      
      const res = await fetch(`/api/specialists/${editingId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to update specialist');
      }

      setSuccess(`Specialist updated successfully with ${formData.assignedDoctors.length} assigned doctors!`);
      fetchSpecialists();
      setEditingId(null);
      
      // Reset form
      setFormData({ 
        title: '', 
        description: '', 
        contact: '',
        assignedDoctors: [] 
      });
      setDoctorSearch('');
      setShowDoctorDropdown(false);
      
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this specialist? This action cannot be undone.')) {
      try {
        const res = await fetch(`/api/specialists/${id}`, {
          method: 'DELETE',
          credentials: 'include'
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || 'Failed to delete specialist');
        }

        setSpecialists(prev => prev.filter(s => s._id !== id));
        setSuccess('Specialist deleted successfully!');
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleAssignDoctor = (doctorId) => {
    if (!formData.assignedDoctors.includes(doctorId)) {
      setFormData(prev => ({
        ...prev,
        assignedDoctors: [...prev.assignedDoctors, doctorId]
      }));
      setDoctorSearch('');
      setShowDoctorDropdown(false);
    }
  };

  const handleRemoveDoctor = (doctorId) => {
    setFormData(prev => ({
      ...prev,
      assignedDoctors: prev.assignedDoctors.filter(id => id !== doctorId)
    }));
  };

  const getAssignedDoctorsCount = (specialist) => {
    return specialist.doctorList?.length || 0;
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-[#F0F9FF] to-[#E6F4FF] p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[#0077B6] to-[#00B4D8] flex items-center justify-center shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-[#023E8A] via-[#0077B6] to-[#0096C7] bg-clip-text text-transparent">
                Manage Specialists
              </h1>
              <p className="text-gray-600 mt-2">Create and manage medical specialty departments</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-800">Success!</h3>
                <p className="text-green-700 text-sm">{success}</p>
              </div>
            </div>
          </div>
        )}

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Create/Edit Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-[#E1F0FF] shadow-sm p-6">
              <h2 className="text-xl font-bold text-[#023E8A] mb-6">
                {editingId ? 'Edit Specialist' : 'Create New Specialist'}
              </h2>
              
              <form onSubmit={editingId ? handleUpdate : handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specialist Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0077B6]/30 focus:border-[#0077B6] transition-all duration-300"
                    placeholder="e.g., Cardiology Care Centre"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full h-32 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0077B6]/30 focus:border-[#0077B6] resize-none transition-all duration-300"
                    placeholder="Describe this specialty department..."
                    required
                  />
                </div>

                {/* Contact */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Hotline *
                  </label>
                  <input
                    type="text"
                    value={formData.contact}
                    onChange={(e) => setFormData({...formData, contact: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0077B6]/30 focus:border-[#0077B6] transition-all duration-300"
                    placeholder="e.g., +1 (555) 123-4567"
                    required
                  />
                </div>

                {/* Assign Doctors */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assign Doctors
                  </label>
                  
                  {/* Quick Department Suggestions */}
                  {uniqueDepartments.length > 0 && doctorSearch.length === 0 && showDoctorDropdown && (
                    <div className="mb-3">
                      <div className="text-xs font-medium text-gray-500 mb-2">Quick departments:</div>
                      <div className="flex flex-wrap gap-2">
                        {uniqueDepartments.slice(0, 5).map(dept => (
                          <button
                            key={dept}
                            type="button"
                            onClick={() => {
                              setDoctorSearch(dept);
                            }}
                            className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg transition-colors duration-200 flex items-center gap-1"
                          >
                            <Building size={12} />
                            {dept}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Search Input */}
                  <div className="relative mb-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        value={doctorSearch}
                        onChange={(e) => {
                          setDoctorSearch(e.target.value);
                          setShowDoctorDropdown(true);
                        }}
                        onFocus={() => setShowDoctorDropdown(true)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0077B6]/30 focus:border-[#0077B6] transition-all duration-300"
                        placeholder="Search doctors by department or name..."
                      />
                    </div>
                    
                    {/* Doctor Dropdown */}
                    {showDoctorDropdown && (
                      <>
                        <div 
                          className="fixed inset-0 z-10"
                          onClick={() => setShowDoctorDropdown(false)}
                        />
                        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                          {loadingDoctors ? (
                            <div className="p-4 text-center">
                              <Loader2 className="w-5 h-5 animate-spin mx-auto text-gray-400" />
                            </div>
                          ) : filteredDoctors.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                              {doctorSearch.trim() 
                                ? 'No doctors found in this department'
                                : 'No doctors available or all doctors are already assigned'}
                            </div>
                          ) : (
                            <>
                              <div className="px-4 py-2 bg-gray-50 border-b text-xs font-medium text-gray-500">
                                {doctorSearch.trim() 
                                  ? `Doctors in "${doctorSearch}" department (${filteredDoctors.length})`
                                  : `All Doctors (${filteredDoctors.length})`}
                              </div>
                              {filteredDoctors.map(doctor => (
                                <div
                                  key={doctor._id}
                                  onClick={() => handleAssignDoctor(doctor._id)}
                                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-200"
                                >
                                  <div className="font-medium text-gray-900">Dr. {doctor.name}</div>
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Building size={12} />
                                    <span className="font-medium">{doctor.department || "No department"}</span>
                                    {doctor.specialization && doctor.specialization !== "Not specified" && (
                                      <>
                                        <span className="text-gray-300">•</span>
                                        <span>{doctor.specialization}</span>
                                      </>
                                    )}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">{doctor.email}</div>
                                </div>
                              ))}
                            </>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Assigned Doctors List */}
                  <div className="space-y-3">
                    {assignedDoctorObjects.length > 0 ? (
                      <>
                        <div className="text-sm font-medium text-gray-700 mb-2">
                          Assigned Doctors ({assignedDoctorObjects.length})
                        </div>
                        <div className="space-y-2">
                          {assignedDoctorObjects.map(doctor => (
                            <div 
                              key={doctor._id}
                              className="flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-lg"
                            >
                              <div>
                                <div className="font-medium text-blue-900">Dr. {doctor.name}</div>
                                <div className="flex items-center gap-2 text-sm text-blue-700">
                                  <Building size={12} />
                                  <span>{doctor.department || "No department"}</span>
                                  {doctor.specialization && doctor.specialization !== "Not specified" && (
                                    <>
                                      <span className="text-blue-300">•</span>
                                      <span>{doctor.specialization}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveDoctor(doctor._id)}
                                className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors duration-200"
                                title="Remove doctor"
                              >
                                <UserX size={18} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="p-4 text-center border border-dashed border-gray-300 rounded-xl">
                        <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">No doctors assigned yet</p>
                        <p className="text-gray-400 text-xs mt-1">
                          Click the search field to see all doctors or type a department name
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit & Cancel Buttons */}
                <div className="pt-4 flex gap-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-6 py-3 bg-linear-to-r from-[#0077B6] to-[#0096C7] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#0077B6]/30 transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {editingId ? 'Updating Specialist...' : 'Creating Specialist...'}
                      </>
                    ) : (
                      <>
                        {editingId ? (
                          <>
                            <Edit size={20} />
                            Update Specialist
                          </>
                        ) : (
                          <>
                            <Plus size={20} />
                            Create Specialist
                          </>
                        )}
                      </>
                    )}
                  </button>
                  
                  {editingId && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Stats & Info */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="bg-white rounded-2xl border border-[#E1F0FF] shadow-sm p-6">
              <h3 className="text-lg font-semibold text-[#023E8A] mb-4">Statistics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">Total Specialists</div>
                  <div className="text-2xl font-bold text-[#023E8A]">{specialists.length}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">Total Doctors Available</div>
                  <div className="text-2xl font-bold text-[#0077B6]">{doctors.length}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">Unique Departments</div>
                  <div className="text-2xl font-bold text-[#0096C7]">
                    {uniqueDepartments.length}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">Doctors to Assign</div>
                  <div className="text-2xl font-bold text-[#00B4D8]">
                    {formData.assignedDoctors.length}
                  </div>
                </div>
              </div>
            </div>

            {/* Info Panel */}
            <div className="bg-white rounded-2xl border border-[#E1F0FF] shadow-sm p-6">
              <h3 className="text-lg font-semibold text-[#023E8A] mb-4">How to Assign Doctors</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[#0077B6] text-xs mt-0.5">
                    1
                  </div>
                  <span><strong>Click the search field</strong> to see all available doctors</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[#0077B6] text-xs mt-0.5">
                    2
                  </div>
                  <span><strong>Type a department name</strong> (e.g., Cardiology, Neurology) to filter doctors by their department</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[#0077B6] text-xs mt-0.5">
                    3
                  </div>
                  <span><strong>Click on a doctor</strong> from the dropdown to assign them to this specialist</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[#0077B6] text-xs mt-0.5">
                    4
                  </div>
                  <span><strong>Assign multiple doctors</strong> from the same or different departments</span>
                </div>
              </div>
            </div>

            {/* Quick Department List */}
            {uniqueDepartments.length > 0 && (
              <div className="bg-white rounded-2xl border border-[#E1F0FF] shadow-sm p-6">
                <h3 className="text-lg font-semibold text-[#023E8A] mb-4">Available Departments</h3>
                <div className="space-y-2">
                  {uniqueDepartments.slice(0, 10).map(dept => (
                    <div key={dept} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{dept}</span>
                      </div>
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                        {doctors.filter(d => d.department === dept).length} doctors
                      </span>
                    </div>
                  ))}
                  {uniqueDepartments.length > 10 && (
                    <div className="text-center text-sm text-gray-500 pt-2">
                      + {uniqueDepartments.length - 10} more departments
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Specialists List */}
        <div className="mt-8 bg-white rounded-2xl border border-[#E1F0FF] shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[#E1F0FF]">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#023E8A]">All Specialists</h2>
              <div className="text-sm text-gray-500">
                Showing {specialists.length} specialist departments
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="p-12 text-center">
              <Loader2 className="w-12 h-12 text-[#0077B6] animate-spin mx-auto mb-4" />
              <p className="text-gray-500">Loading specialists...</p>
            </div>
          ) : specialists.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Specialists Yet</h3>
              <p className="text-gray-500">Create your first specialist department using the form above.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {specialists.map((specialist) => (
                <div key={specialist._id} className="p-6 hover:bg-gray-50/50 transition-colors duration-300">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-[#023E8A]">{specialist.title}</h3>
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 bg-[#F0F8FF] text-[#0077B6] text-xs font-medium rounded-full">
                            {getAssignedDoctorsCount(specialist)} doctors
                          </span>
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                            ID: {specialist._id?.slice(-8)}
                          </span>
                          {editingId === specialist._id && (
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                              Editing...
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{specialist.description}</p>
                      
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2 text-gray-500">
                          <Phone size={14} />
                          <span>{specialist.contact}</span>
                        </div>
                      </div>

                      {/* Assigned Doctors Preview */}
                      {specialist.doctorList && specialist.doctorList.length > 0 && (
                        <div className="mt-4">
                          <div className="text-sm text-gray-500 mb-2">Assigned Doctors:</div>
                          <div className="flex flex-wrap gap-2">
                            {specialist.doctorList.slice(0, 5).map((doctor, idx) => (
                              <div key={doctor._id || idx} 
                                className="px-3 py-1.5 bg-[#F8FCFF] border border-[#E1F0FF] text-[#0077B6] text-xs font-medium rounded-lg">
                                Dr. {doctor.name}
                                {doctor.department && (
                                  <span className="text-[#0096C7] ml-1">({doctor.department})</span>
                                )}
                              </div>
                            ))}
                            {getAssignedDoctorsCount(specialist) > 5 && (
                              <div className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg">
                                +{getAssignedDoctorsCount(specialist) - 5} more
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="ml-4 flex gap-2">
                      <button
                        onClick={() => handleEdit(specialist)}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-300"
                        title="Edit specialist"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(specialist._id)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-300"
                        title="Delete specialist"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}