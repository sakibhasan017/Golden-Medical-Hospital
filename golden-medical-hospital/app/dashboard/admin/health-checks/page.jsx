'use client';

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Save, X, Package, Loader2, AlertCircle, CheckCircle, DollarSign } from "lucide-react";

export default function AdminHealthchecksPage() {
  const [healthchecks, setHealthchecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tests: [''],
    price: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchHealthchecks();
  }, []);

  const fetchHealthchecks = async () => {
    try {
      const res = await fetch('/api/health-check', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch healthcheck packages');
      const data = await res.json();
      setHealthchecks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    
    // Validate form
    if (!formData.title.trim() || !formData.description.trim() || !formData.price) {
      setError("Please fill in all required fields");
      setSubmitting(false);
      return;
    }
    
    // Filter out empty tests
    const filteredTests = formData.tests.filter(test => test.trim() !== '');
    if (filteredTests.length === 0) {
      setError("Please add at least one test");
      setSubmitting(false);
      return;
    }
    
    try {
      const url = editingId 
        ? `/api/health-check/${editingId}`
        : '/api/health-check';
      
      const method = editingId ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          tests: filteredTests,
          price: Number(formData.price)
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to save healthcheck package');
      }

      setSuccess(editingId 
        ? 'Healthcheck package updated successfully!'
        : 'Healthcheck package created successfully!'
      );
      
      fetchHealthchecks();
      resetForm();
      
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (healthcheck) => {
    setEditingId(healthcheck._id);
    setFormData({
      title: healthcheck.title,
      description: healthcheck.description,
      tests: [...healthcheck.tests, ''], // Add empty field for new test
      price: healthcheck.price.toString()
    });
    
    // Scroll to form
    document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this healthcheck package? This action cannot be undone.')) {
      try {
        const res = await fetch(`/api/health-check/${id}`, {
          method: 'DELETE',
          credentials: 'include'
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || 'Failed to delete healthcheck package');
        }

        setHealthchecks(prev => prev.filter(h => h._id !== id));
        setSuccess('Healthcheck package deleted successfully!');
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      tests: [''],
      price: ''
    });
    setEditingId(null);
  };

  const handleAddTestField = () => {
    setFormData(prev => ({
      ...prev,
      tests: [...prev.tests, '']
    }));
  };

  const handleRemoveTestField = (index) => {
    if (formData.tests.length === 1) return;
    
    setFormData(prev => ({
      ...prev,
      tests: prev.tests.filter((_, i) => i !== index)
    }));
  };

  const handleTestChange = (index, value) => {
    const newTests = [...formData.tests];
    newTests[index] = value;
    setFormData(prev => ({
      ...prev,
      tests: newTests
    }));
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-[#F0F9FF] to-[#E6F4FF] p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[#0077B6] to-[#00B4D8] flex items-center justify-center shadow-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-[#023E8A] via-[#0077B6] to-[#0096C7] bg-clip-text text-transparent">
                Manage Healthcheck Packages
              </h1>
              <p className="text-gray-600 mt-2">Create and manage health screening packages</p>
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
                {editingId ? 'Edit Healthcheck Package' : 'Create New Healthcheck Package'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Package Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0077B6]/30 focus:border-[#0077B6] transition-all duration-300"
                    placeholder="e.g., Comprehensive Health Checkup"
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
                    placeholder="Describe this healthcheck package..."
                    required
                  />
                </div>

                {/* Tests */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Included Tests *
                    </label>
                    <button
                      type="button"
                      onClick={handleAddTestField}
                      className="text-sm text-[#0077B6] hover:text-[#023E8A] font-medium"
                    >
                      + Add Test
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {formData.tests.map((test, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={test}
                          onChange={(e) => handleTestChange(index, e.target.value)}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0077B6]/30 focus:border-[#0077B6] transition-all duration-300"
                          placeholder={`Test ${index + 1}`}
                          required={index === 0}
                        />
                        {formData.tests.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveTestField(index)}
                            className="px-4 py-3 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-xl transition-colors duration-200"
                          >
                            <Trash2 size={20} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (BDT) *
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <DollarSign className="text-gray-400 w-5 h-5" />
                    </div>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0077B6]/30 focus:border-[#0077B6] transition-all duration-300"
                      placeholder="e.g., 5000"
                      min="0"
                      step="0.01"
                      required
                    />
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
                        {editingId ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      <>
                        {editingId ? (
                          <>
                            <Save size={20} />
                            Update Package
                          </>
                        ) : (
                          <>
                            <Plus size={20} />
                            Create Package
                          </>
                        )}
                      </>
                    )}
                  </button>
                  
                  {editingId && (
                    <button
                      type="button"
                      onClick={resetForm}
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
                  <div className="text-sm text-gray-500">Total Packages</div>
                  <div className="text-2xl font-bold text-[#023E8A]">{healthchecks.length}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">Average Price</div>
                  <div className="text-2xl font-bold text-[#0077B6]">
                    {healthchecks.length > 0 
                      ? `৳${Math.round(healthchecks.reduce((sum, h) => sum + h.price, 0) / healthchecks.length)}`
                      : '৳0'}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">Total Tests</div>
                  <div className="text-2xl font-bold text-[#0096C7]">
                    {healthchecks.reduce((sum, h) => sum + h.tests.length, 0)}
                  </div>
                </div>
              </div>
            </div>

            {/* Info Panel */}
            <div className="bg-white rounded-2xl border border-[#E1F0FF] shadow-sm p-6">
              <h3 className="text-lg font-semibold text-[#023E8A] mb-4">How to Create Packages</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[#0077B6] text-xs mt-0.5">
                    1
                  </div>
                  <span>Enter a unique package title that clearly describes the healthcheck</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[#0077B6] text-xs mt-0.5">
                    2
                  </div>
                  <span>Provide detailed description of what the package includes</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[#0077B6] text-xs mt-0.5">
                    3
                  </div>
                  <span>List all tests included in the package (add multiple tests as needed)</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[#0077B6] text-xs mt-0.5">
                    4
                  </div>
                  <span>Set an appropriate price in Bangladeshi Taka (BDT)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Healthcheck Packages List */}
        <div className="mt-8 bg-white rounded-2xl border border-[#E1F0FF] shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[#E1F0FF]">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#023E8A]">All Healthcheck Packages</h2>
              <div className="text-sm text-gray-500">
                Showing {healthchecks.length} packages
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="p-12 text-center">
              <Loader2 className="w-12 h-12 text-[#0077B6] animate-spin mx-auto mb-4" />
              <p className="text-gray-500">Loading healthcheck packages...</p>
            </div>
          ) : healthchecks.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Packages Yet</h3>
              <p className="text-gray-500">Create your first healthcheck package using the form above.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {healthchecks.map((healthcheck) => (
                <div key={healthcheck._id} className="p-6 hover:bg-gray-50/50 transition-colors duration-300">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-[#023E8A]">{healthcheck.title}</h3>
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 bg-[#F0F8FF] text-[#0077B6] text-xs font-medium rounded-full">
                            {healthcheck.tests.length} tests
                          </span>
                          <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                            ৳{healthcheck.price}
                          </span>
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                            ID: {healthcheck._id?.slice(-8)}
                          </span>
                          {editingId === healthcheck._id && (
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                              Editing...
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{healthcheck.description}</p>
                      
                      {/* Tests Preview */}
                      <div className="mt-4">
                        <div className="text-sm text-gray-500 mb-2">Included Tests:</div>
                        <div className="flex flex-wrap gap-2">
                          {healthcheck.tests.slice(0, 5).map((test, idx) => (
                            <div key={idx} 
                              className="px-3 py-1.5 bg-[#F8FCFF] border border-[#E1F0FF] text-[#0077B6] text-xs font-medium rounded-lg">
                              {test}
                            </div>
                          ))}
                          {healthcheck.tests.length > 5 && (
                            <div className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg">
                              +{healthcheck.tests.length - 5} more
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="ml-4 flex gap-2">
                      <button
                        onClick={() => handleEdit(healthcheck)}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-300"
                        title="Edit package"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(healthcheck._id)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-300"
                        title="Delete package"
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