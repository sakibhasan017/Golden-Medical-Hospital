'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FileText, 
  Shield, 
  Clock,
  Package,
  Stethoscope,
  AlertCircle
} from 'lucide-react';

export default function OnlineReportPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/online-report');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      setTimeout(() => {
        setReports([]);
        setLoading(false);
      }, 1000);
    }
  }, [session, status]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-[#F0F9FF] to-[#E6F4FF] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#0077B6] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const getRoleDisplay = (role) => {
    switch(role) {
      case 'patient': return 'Patient';
      case 'doctor': return 'Doctor';
      case 'admin': return 'Administrator';
      default: return 'User';
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-[#F0F9FF] to-[#E6F4FF]">
      {/* Hero Section */}
      <div className="bg-linear-to-r from-[#0077B6] to-[#00B4D8] text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="text-center">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Online Medical Reports</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Access your medical reports anytime, anywhere. View and download your health checkup results securely.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Welcome Message */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-[#023E8A] mb-2">
                Welcome, {session.user.name || 'User'}!
              </h2>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  {getRoleDisplay(session.user.role)}
                </span>
                <p className="text-gray-600">
                  Your health reports are stored securely and are accessible 24/7.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-4 py-2 rounded-full">
              <Shield size={16} />
              <span>Secure & Encrypted</span>
            </div>
          </div>
        </div>

        {/* Information for Patients */}
        {session.user.role === 'patient' && (
          <div className="bg-linear-to-r from-[#023E8A] to-[#0077B6] rounded-2xl p-6 mb-8 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="text-2xl font-bold mb-2">How to Get Your Report</h3>
                <p className="text-white/90">
                  After completing a health check package, your report will automatically appear here within 24-48 hours.
                </p>
              </div>
              <Link
                href="/health-checks"
                className="bg-white text-[#0077B6] hover:bg-gray-100 font-semibold py-3 px-6 rounded-xl transition duration-300"
              >
                <span className="flex items-center gap-2">
                  <Package size={18} />
                  Book Health Check
                </span>
              </Link>
            </div>
          </div>
        )}

        {/* Reports Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-[#023E8A]">Medical Reports</h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock size={16} />
              <span>Reports appear automatically after tests</span>
            </div>
          </div>

          {/* No Reports Message */}
          <div className="text-center py-16 bg-white rounded-2xl shadow-md">
            <div className="max-w-md mx-auto">
              <AlertCircle className="w-20 h-20 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-700 mb-4">
                {session.user.role === 'patient' 
                  ? "You don't have any medical reports yet"
                  : "No reports available"}
              </h3>
              
              <p className="text-gray-600 mb-8">
                {session.user.role === 'patient' 
                  ? "After you complete a health check package, your report will automatically appear here. You'll be able to view and download it securely."
                  : "Medical reports are only available for patients who have completed health check packages."}
              </p>

              {session.user.role === 'patient' && (
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Stethoscope className="w-5 h-5 text-[#0077B6]" />
                      <h4 className="font-bold text-[#023E8A]">How it works:</h4>
                    </div>
                    <ol className="text-left space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="w-6 h-6 bg-blue-100 text-[#0077B6] rounded-full flex items-center justify-center text-sm">1</span>
                        <span>Book and complete a health check package</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-6 h-6 bg-blue-100 text-[#0077B6] rounded-full flex items-center justify-center text-sm">2</span>
                        <span>Our lab processes your tests (24-48 hours)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-6 h-6 bg-blue-100 text-[#0077B6] rounded-full flex items-center justify-center text-sm">3</span>
                        <span>Doctor reviews and finalizes the report</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-6 h-6 bg-blue-100 text-[#0077B6] rounded-full flex items-center justify-center text-sm">4</span>
                        <span>Report appears automatically in this section</span>
                      </li>
                    </ol>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      href="/health-checks"
                      className="inline-block bg-linear-to-r from-[#0077B6] to-[#0096C7] text-white font-semibold py-3 px-8 rounded-xl hover:shadow-lg transition duration-300"
                    >
                      Browse Health Packages
                    </Link>
                    <Link
                      href={`/dashboard/${session.user.role}`}
                      className="inline-block border border-[#0077B6] text-[#0077B6] font-semibold py-3 px-8 rounded-xl hover:bg-blue-50 transition duration-300"
                    >
                      Go to Dashboard
                    </Link>
                  </div>
                </div>
              )}

              {session.user.role !== 'patient' && (
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <FileText className="w-5 h-5 text-[#0077B6]" />
                      <h4 className="font-bold text-[#023E8A]">Information:</h4>
                    </div>
                    <p className="text-gray-700 text-left">
                      As a {getRoleDisplay(session.user.role).toLowerCase()}, you can access patient reports through your dashboard. 
                      Patients will see their reports here after completing health check packages.
                    </p>
                  </div>
                  <Link
                    href={session.user.role === 'admin' ? '/dashboard/admin' : '/dashboard/doctor'}
                    className="inline-block bg-linear-to-r from-[#0077B6] to-[#0096C7] text-white font-semibold py-3 px-8 rounded-xl hover:shadow-lg transition duration-300"
                  >
                    Go to Dashboard
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Information Section */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-2xl font-bold text-[#023E8A] mb-4">About Online Reports</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-[#0077B6]" />
              </div>
              <h4 className="font-bold text-[#023E8A] mb-2">Secure & Private</h4>
              <p className="text-gray-600 text-sm">
                All reports are encrypted and accessible only to you and your authorized doctors.
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-[#0077B6]" />
              </div>
              <h4 className="font-bold text-[#023E8A] mb-2">Available 24/7</h4>
              <p className="text-gray-600 text-sm">
                Access your reports anytime from any device with internet connection.
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-[#0077B6]" />
              </div>
              <h4 className="font-bold text-[#023E8A] mb-2">Automatic Updates</h4>
              <p className="text-gray-600 text-sm">
                Reports appear automatically after test completion, no need to request.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}