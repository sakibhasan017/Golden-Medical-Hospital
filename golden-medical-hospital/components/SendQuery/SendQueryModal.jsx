'use client';

import { useState } from "react";
import { X, Send, Loader2, AlertCircle, User } from "lucide-react";
import { signIn, useSession } from "next-auth/react";

export default function SendQueryModal({ onClose }) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const isLoadingSession = status === "loading";

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      // If not authenticated, prompt login
      signIn();
      return;
    }

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
        credentials: "include"
      });

      if (res.ok) {
        setSuccess(true);
        setQuestion("");
        setTimeout(() => {
          onClose();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md mx-auto border border-[#E1F0FF] shadow-xl shadow-[#0077B6]/10">
        {/* Modal Header */}
        <div className="p-6 border-b border-[#E1F0FF]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#F0F8FF] flex items-center justify-center text-[#0077B6]">
                <Send size={20} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#023E8A]">Send Query to Admin</h3>
                <p className="text-sm text-gray-500">We&apos;ll respond within 24-48 hours</p>
              </div>
            </div>
            <button
              onClick={onClose}
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
          ) : !isAuthenticated && !isLoadingSession ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4">
                <User size={24} className="text-yellow-600" />
              </div>
              <h4 className="text-xl font-semibold text-[#023E8A] mb-2">Sign In Required</h4>
              <p className="text-gray-600 mb-6">
                You need to be signed in to send a query. This helps us keep track of your questions and provide personalized responses.
              </p>
              <button
                onClick={() => signIn()}
                className="w-full px-4 py-3 bg-[#0077B6] hover:bg-[#0096C7] text-white font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                Sign In to Continue
              </button>
              <button
                onClick={onClose}
                className="w-full mt-3 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors duration-300"
              >
                Cancel
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* User Info (if logged in) */}
              {isAuthenticated && session.user && (
                <div className="mb-4 p-3 bg-[#F8FCFF] rounded-lg border border-[#E1F0FF]">
                  <div className="text-sm text-gray-500 mb-1">Sending as:</div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#F1F9FF] flex items-center justify-center text-[#0077B6] text-sm font-semibold">
                      {session.user.name?.charAt(0) || "U"}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{session.user.name}</div>
                      <div className="text-xs text-gray-500">{session.user.email}</div>
                    </div>
                  </div>
                </div>
              )}

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
                    <div className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {error}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || isLoadingSession}
                  className="flex-1 px-4 py-3 bg-[#0077B6] hover:bg-[#0096C7] text-white font-medium rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : isLoadingSession ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Checking...
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
              <span>Typically responds within 24-48 hours</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>All queries are confidential and secure</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}