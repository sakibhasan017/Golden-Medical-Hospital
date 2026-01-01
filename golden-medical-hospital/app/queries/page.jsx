'use client';

import { useState, useEffect } from "react";
import { MessageSquare, Search, Send, Clock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import SendQueryModal from "@/components/SendQuery/SendQueryModal";

export default function PublicQueriesPage() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showSendModal, setShowSendModal] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnsweredQueries();
  }, []);

  const fetchAnsweredQueries = async () => {
    try {
      const res = await fetch('/api/queries/public');
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
    if (!search) return true;
    return query.question.toLowerCase().includes(search.toLowerCase());
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-[#F0F9FF] to-[#E6F4FF]">
      {/* Header Section */}
      <div className="bg-linear-to-r from-[#0077B6] to-[#00B4D8] text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <MessageSquare className="w-10 h-10" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Public Queries</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Browse answered queries from our community. Find answers to common questions or ask your own.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Search and Stats Bar */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-6">
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 bg-white rounded-xl border border-[#E1F0FF] shadow-sm">
                <span className="text-sm text-gray-500">Answered Queries:</span>
                <span className="ml-2 text-lg font-bold text-[#023E8A]">{queries.length}</span>
              </div>
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle size={16} className="text-green-500" />
                <span>All queries are answered by our admin team</span>
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
                className="pl-12 pr-4 py-3 w-full md:w-96 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0077B6]/30 focus:border-[#0077B6] transition-all duration-300 shadow-sm"
              />
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

        {/* Queries List */}
        <div className="mb-12">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 rounded-full bg-[#F1F9FF] flex items-center justify-center mb-6 animate-pulse">
                <Loader2 className="w-8 h-8 text-[#0077B6] animate-spin" />
              </div>
              <p className="text-gray-500">Loading queries...</p>
            </div>
          ) : filteredQueries.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-[#E1F0FF] shadow-sm">
              <div className="w-24 h-24 rounded-full bg-[#F1F9FF] flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="w-12 h-12 text-[#0077B6]" />
              </div>
              <h3 className="text-2xl font-bold text-[#023E8A] mb-3">
                {search ? `No results for "${search}"` : "No Answered Queries Yet"}
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {search 
                  ? "Try a different search term"
                  : "Be the first to ask a question! Our admin team will answer it promptly."
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredQueries.map((query) => (
                <div 
                  key={query._id}
                  className="bg-white rounded-2xl border border-[#E1F0FF] shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                >
                  <div className="p-6">
                    {/* Question */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <MessageSquare size={16} className="text-[#0077B6]" />
                        </div>
                        <span className="text-sm text-gray-500">Question</span>
                      </div>
                      <p className="text-gray-800 font-medium line-clamp-3">
                        {query.question}
                      </p>
                    </div>

                    {/* Answer */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <CheckCircle size={16} className="text-green-600" />
                        </div>
                        <span className="text-sm text-gray-500">Answer</span>
                      </div>
                      <p className="text-gray-700 line-clamp-4">
                        {query.answer}
                      </p>
                    </div>

                    {/* Date */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock size={14} />
                        <span>Answered on {formatDate(query.createdAt)}</span>
                      </div>
                      <span className="px-2 py-1 bg-[#F0F8FF] text-[#0077B6] text-xs font-medium rounded-full">
                        ✓ Answered
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Send Query CTA Section */}
        <div className="bg-linear-to-r from-[#023E8A] to-[#0077B6] rounded-3xl p-8 md:p-12 text-white shadow-xl">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Still have questions?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Can&apos;t find what you&apos;re looking for? Ask our admin team directly. 
              We&apos;re here to help you with any questions you may have.
            </p>
            <button
              onClick={() => setShowSendModal(true)}
              className="inline-flex items-center gap-3 bg-white text-[#0077B6] hover:bg-gray-50 font-semibold text-lg px-8 py-4 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <Send size={20} />
              Send Your Query
            </button>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="flex items-center justify-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>24-48 hour response time</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Secure and confidential</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Answered by expert admins</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Send Query Modal */}
      {showSendModal && (
        <SendQueryModal onClose={() => setShowSendModal(false)} />
      )}
    </div>
  );
}