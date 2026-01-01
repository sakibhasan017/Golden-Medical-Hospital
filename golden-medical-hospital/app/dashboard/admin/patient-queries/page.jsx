'use client';

import { useState, useEffect } from "react";
import { MessageSquare, CheckCircle, Clock, Search, Send, Loader2, AlertCircle, ChevronRight, Trash2, AlertTriangle } from "lucide-react";

export default function AdminPatientQueriesPage() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [answer, setAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [queryToDelete, setQueryToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      const res = await fetch('/api/admin/queries', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch queries');
      const data = await res.json();
      setQueries(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredQueries = queries.filter(query => {
    if (search) {
      return query.question.toLowerCase().includes(search.toLowerCase());
    }
    
    if (filter === 'pending') return !query.answer || query.answer.trim() === '';
    if (filter === 'answered') return query.answer && query.answer.trim() !== '';
    return true;
  });

  const handleSubmitAnswer = async () => {
    if (!answer.trim() || !selectedQuery) return;
    
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/queries/${selectedQuery._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ answer: answer.trim() })
      });

      if (!res.ok) throw new Error('Failed to submit answer');
      
      const updatedQueries = queries.map(q => 
        q._id === selectedQuery._id 
          ? { ...q, answer: answer.trim() }
          : q
      );
      setQueries(updatedQueries);
      setSelectedQuery(prev => ({ ...prev, answer: answer.trim() }));
      setAnswer("");
      
      alert('Answer submitted successfully!');
    } catch (err) {
      alert('Failed to submit answer: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteQuery = async (queryId) => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/queries/${queryId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Failed to delete query');
      
      // Remove from state
      const updatedQueries = queries.filter(q => q._id !== queryId);
      setQueries(updatedQueries);
      
      // If the deleted query was selected, clear selection
      if (selectedQuery && selectedQuery._id === queryId) {
        setSelectedQuery(null);
        setAnswer("");
      }
      
      alert('Query deleted successfully!');
      setShowDeleteConfirm(false);
      setQueryToDelete(null);
    } catch (err) {
      alert('Failed to delete query: ' + err.message);
    } finally {
      setDeleting(false);
    }
  };

  const openDeleteConfirm = (query, e) => {
    e.stopPropagation(); // Prevent triggering the query selection
    setQueryToDelete(query);
    setShowDeleteConfirm(true);
  };

  const getStatusBadge = (query) => {
    const isAnswered = query.answer && query.answer.trim() !== '';
    
    if (isAnswered) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
          <CheckCircle size={12} />
          Answered
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium">
          <Clock size={12} />
          Pending
        </span>
      );
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Patient Queries</h1>
                <p className="text-gray-600 mt-2">Manage and respond to patient queries</p>
              </div>
            </div>

            {/* Stats and Filters */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      filter === 'all' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    All ({queries.length})
                  </button>
                  <button
                    onClick={() => setFilter('pending')}
                    className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                      filter === 'pending' 
                        ? 'bg-yellow-500 text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Clock size={16} />
                    Pending ({queries.filter(q => !q.answer || q.answer.trim() === '').length})
                  </button>
                  <button
                    onClick={() => setFilter('answered')}
                    className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                      filter === 'answered' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <CheckCircle size={16} />
                    Answered ({queries.filter(q => q.answer && q.answer.trim() !== '').length})
                  </button>
                </div>
              </div>

              <div className="relative w-full md:w-auto">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Search size={20} />
                </div>
                <input
                  type="text"
                  placeholder="Search queries..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-12 pr-4 py-3 w-full md:w-96 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <div className="flex items-center gap-2">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-500">Loading queries...</p>
              </div>
            ) : filteredQueries.length === 0 ? (
              <div className="text-center py-24">
                <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-6">
                  <MessageSquare className="w-12 h-12 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {search ? `No results for "${search}"` : "No Queries Found"}
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  {search 
                    ? "Try a different search term"
                    : "No queries have been submitted yet."
                  }
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 min-h-[600px]">
                {/* Left Column: Queries List */}
                <div className="lg:col-span-1 border-r border-gray-200 overflow-y-auto max-h-[600px]">
                  <div className="divide-y divide-gray-100">
                    {filteredQueries.map((query) => (
                      <div
                        key={query._id}
                        onClick={() => {
                          setSelectedQuery(query);
                          setAnswer(query.answer || "");
                        }}
                        className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedQuery?._id === query._id ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-gray-700 line-clamp-2 mb-2">
                              {query.question}
                            </div>
                          </div>
                          <ChevronRight 
                            size={20} 
                            className={`text-gray-400 ${
                              selectedQuery?._id === query._id ? 'text-blue-600' : ''
                            }`}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-500">
                            {new Date(query.createdAt).toLocaleDateString()}
                          </div>
                          {getStatusBadge(query)}
                        </div>

                        {/* Delete button in list item */}
                        <div className="mt-2 flex justify-end">
                          <button
                            onClick={(e) => openDeleteConfirm(query, e)}
                            className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1 px-2 py-1 hover:bg-red-50 rounded"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Column: Query Details and Answer Form */}
                <div className="lg:col-span-2 p-6">
                  {selectedQuery ? (
                    <div className="space-y-6">
                      {/* Query Header with Delete Button */}
                      <div className="pb-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold text-gray-900">Query Details</h3>
                            {getStatusBadge(selectedQuery)}
                          </div>
                          <button
                            onClick={() => openDeleteConfirm(selectedQuery, { stopPropagation: () => {} })}
                            className="text-red-600 hover:text-red-800 flex items-center gap-2 px-3 py-2 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 size={16} />
                            Delete Query
                          </button>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Submitted on {new Date(selectedQuery.createdAt).toLocaleString()}
                        </p>
                      </div>

                      {/* Question */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3">Question:</h4>
                        <div className="text-gray-700 whitespace-pre-wrap bg-white p-4 rounded border">
                          {selectedQuery.question}
                        </div>
                      </div>

                      {/* Answer Form */}
                      <div className="bg-white rounded-lg p-6 border border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                          <Send size={20} />
                          {selectedQuery.answer ? 'Update Answer' : 'Write Answer'}
                        </h4>
                        
                        <div className="mb-4">
                          <textarea
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="Type your response here..."
                            className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                          />
                          <div className="flex justify-between items-center mt-2">
                            <div className="text-sm text-gray-500">
                              {answer.length} characters
                            </div>
                            {selectedQuery.answer && (
                              <div className="text-sm text-green-600 font-medium">
                                ✓ Already answered
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedQuery(null);
                              setAnswer("");
                            }}
                            className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSubmitAnswer}
                            disabled={submitting || !answer.trim() || answer === selectedQuery.answer}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                          >
                            {submitting ? (
                              <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Submitting...
                              </>
                            ) : (
                              <>
                                <Send size={18} />
                                {selectedQuery.answer ? 'Update Answer' : 'Submit Answer'}
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Existing Answer (if any) */}
                      {selectedQuery.answer && (
                        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                          <h4 className="font-medium text-green-800 mb-3">Current Answer:</h4>
                          <div className="text-green-800 whitespace-pre-wrap bg-white p-4 rounded border border-green-100">
                            {selectedQuery.answer}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full py-24">
                      <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center mb-6">
                        <MessageSquare className="w-12 h-12 text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">Select a Query</h3>
                      <p className="text-gray-600 max-w-md text-center">
                        Click on a query from the list to view details and respond to it.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg w-full max-w-md mx-auto border border-gray-200 shadow-xl">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Query</h3>
                  <p className="text-sm text-gray-500 mt-1">This action cannot be undone</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-gray-700 mb-2">
                  Are you sure you want to delete this query?
                </p>
                {queryToDelete && (
                  <div className="bg-gray-50 p-3 rounded border text-sm text-gray-600">
                    <div className="font-medium mb-1">Query:</div>
                    <div className="line-clamp-3">{queryToDelete.question}</div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setQueryToDelete(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteQuery(queryToDelete._id)}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={18} />
                      Delete Query
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}