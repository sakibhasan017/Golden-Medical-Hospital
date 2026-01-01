'use client';

import React, { useState } from "react";
import { X, Send, Loader2 } from "lucide-react";

const SendQuery = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!question.trim()) {
      setError("Please enter your question");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: question.trim() }),
      });

      if (res.ok) {
        setSuccess(true);
        setQuestion("");
        setTimeout(() => {
          setIsModalOpen(false);
          setSuccess(false);
        }, 2000);
      } else {
        const data = await res.json();
        setError(data.message || "Failed to send query");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Main Component */}
      <section className="bg-linear-to-r from-[#ADE8F4] via-[#90E0EF] to-[#CAF0F8] py-12 px-6 md:px-20 font-merriweather text-[#03045E]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h2 className="text-2xl md:text-4xl font-bold text-[#023E8A] mb-3">
              Ask Golden Medical
            </h2>
            <p className="text-base md:text-lg text-[#03045E]">
              Looking for world-class care? We are here to support you.
            </p>
          </div>
          <div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 bg-[#0077B6] hover:bg-[#00B4D8] text-white font-semibold text-lg py-3 px-8 rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
            >
              <Send size={20} />
              Send Query
            </button>
          </div>
        </div>
      </section>

      {/* Query Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-md mx-auto border border-[#E1F0FF] shadow-xl shadow-[#0077B6]/10 animate-slideUp">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#E1F0FF]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#F0F8FF] flex items-center justify-center text-[#0077B6]">
                    <Send size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#023E8A]">Send Query to Admin</h3>
                    <p className="text-sm text-gray-500">We&apos;ll respond within 24 hours</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {success ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-semibold text-[#023E8A] mb-2">Query Sent Successfully!</h4>
                  <p className="text-gray-600">Our admin team will review your question and respond soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Question
                    </label>
                    <textarea
                      value={question}
                      onChange={(e) => {
                        setQuestion(e.target.value);
                        setError("");
                      }}
                      placeholder="Type your question or concern here..."
                      className="w-full h-40 p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0077B6]/30 focus:border-[#0077B6] resize-none transition-all duration-300"
                      maxLength={1000}
                    />
                    <div className="flex justify-between items-center mt-2">
                      <div className="text-sm text-gray-500">
                        {question.length}/1000 characters
                      </div>
                      {error && (
                        <div className="text-sm text-red-600">{error}</div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 px-4 py-3 bg-[#0077B6] hover:bg-[#0096C7] text-white font-medium rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send size={18} />
                          Send Query
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-[#E1F0FF] bg-gray-50/50 rounded-b-2xl">
              <div className="text-sm text-gray-500">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span>Typically responds within 24 hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span>All queries are confidential and secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Animation Styles */}
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
    </>
  );
};

export default SendQuery;