import React from "react";
import Link from "next/link";
import { Package, DollarSign, CheckCircle, ArrowLeft, Phone } from "lucide-react";

async function getHealthcheck(id) {
  try {
    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      }/api/health-check/${id}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      throw new Error("Failed to fetch healthcheck package");
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching healthcheck package:", error);
    return null;
  }
}

export default async function HealthcheckDetailsPage({ params }) {
  if (params && typeof params.then === "function") {
    params = await params;
  }

  const healthcheck = await getHealthcheck(params.id);

  if (!healthcheck) {
    return (
      <div className="min-h-screen bg-linear-to-b from-[#F0F9FF] to-[#E6F4FF] flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-[#023E8A] mb-4">
            Package Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The healthcheck package you are looking for does not exist.
          </p>
          <Link
            href="/health-checks"
            className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-[#0077B6] to-[#0096C7] text-white rounded-xl font-medium hover:shadow-lg hover:shadow-[#0077B6]/30 transition-all duration-300"
          >
            <ArrowLeft size={20} />
            Back to Packages
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-[#F0F9FF] to-[#E6F4FF]">
      {/* Hero Section */}
      <div className="bg-linear-to-r from-[#0077B6] to-[#00B4D8] text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/healthchecks"
                className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors duration-300"
              >
                <ArrowLeft size={20} />
                Back to All Packages
              </Link>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {healthcheck.title}
              </h1>
              <p className="text-xl text-white/90 max-w-3xl">
                {healthcheck.description}
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center">
                <Package className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Package Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Price Card */}
            <div className="bg-white rounded-2xl p-6 border border-[#E1F0FF] shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">Package Price</div>
                  <div className="text-4xl font-bold text-[#0077B6] mt-2">
                    ৳{healthcheck.price}
                  </div>
                  <div className="text-sm text-gray-600 mt-2">
                    Inclusive of all tests and professional fees
                  </div>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl">
                  <DollarSign className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Included Tests */}
            <div className="bg-white rounded-2xl p-6 border border-[#E1F0FF] shadow-sm">
              <h2 className="text-2xl font-bold text-[#023E8A] mb-6">
                Included Tests
              </h2>
              <div className="space-y-4">
                {healthcheck.tests.map((test, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-blue-50/50 transition-colors duration-300"
                  >
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0 mt-0.5">
                      <CheckCircle size={14} />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{test}</div>
                    </div>
                    <div className="text-sm text-gray-500">Test #{index + 1}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Package Information */}
            <div className="bg-white rounded-2xl p-6 border border-[#E1F0FF] shadow-sm">
              <h2 className="text-2xl font-bold text-[#023E8A] mb-6">
                Package Information
              </h2>
              <div className="space-y-4 text-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Package ID</div>
                    <div className="font-mono text-gray-800">{healthcheck._id?.slice(-8)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Total Tests</div>
                    <div className="text-lg font-semibold text-[#0077B6]">
                      {healthcheck.tests.length} diagnostic tests
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-500 mb-2">Full Description</div>
                  <p className="text-gray-700 leading-relaxed">{healthcheck.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact & Actions */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-linear-to-br from-[#F8FCFF] to-white rounded-2xl p-6 border border-[#E1F0FF] shadow-sm">
              <h3 className="text-xl font-bold text-[#023E8A] mb-4">
                Book This Package
              </h3>
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <Phone size={20} />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Contact for Booking</div>
                      <div className="text-lg font-semibold text-blue-700">
                        +880-2-8620999
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    Call our healthcheck coordinator to book this package
                  </div>
                </div>

                <div className="space-y-3">
                  
                  <Link
                    href="/health-checks"
                    className="block w-full text-center py-3 border border-[#0077B6] text-[#0077B6] font-semibold rounded-xl hover:bg-blue-50 transition-all duration-300"
                  >
                    View Other Packages
                  </Link>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-2xl p-6 border border-[#E1F0FF] shadow-sm">
              <h3 className="text-lg font-semibold text-[#023E8A] mb-4">
                Package Benefits
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-gray-700">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs mt-0.5">
                    ✓
                  </div>
                  <span>Comprehensive health assessment</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs mt-0.5">
                    ✓
                  </div>
                  <span>Early detection of health issues</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs mt-0.5">
                    ✓
                  </div>
                  <span>Personalized health report</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs mt-0.5">
                    ✓
                  </div>
                  <span>Doctor consultation included</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs mt-0.5">
                    ✓
                  </div>
                  <span>Follow-up recommendations</span>
                </li>
              </ul>
            </div>

            {/* Assistance Section */}
            <div className="bg-white rounded-2xl p-6 border border-[#E1F0FF] shadow-sm">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-[#023E8A] mb-2">
                  For assistance and more information
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Please call
                </p>
                <div className="text-xl font-bold text-blue-700">
                  +880-2-8620999
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Available 8:00 AM - 10:00 PM, 7 days a week
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-12 text-center">
          <Link
            href="/health-checks"
            className="inline-flex items-center gap-2 px-8 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300"
          >
            <ArrowLeft size={20} />
            Back to All Packages
          </Link>
        </div>
      </div>

      {/* Footer Section */}
      <div className="bg-linear-to-r from-[#023E8A] to-[#0077B6] text-white py-12 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Take Charge of Your Health?
          </h3>
          <p className="text-lg text-white/90 mb-6">
            Book your comprehensive health checkup today and get a detailed 
            health analysis from our expert medical team.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              <span>Comprehensive Health Packages</span>
            </div>
            <div className="h-4 w-px bg-white/30 hidden sm:block"></div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>Advanced Diagnostic Facilities</span>
            </div>
            <div className="h-4 w-px bg-white/30 hidden sm:block"></div>
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              <span>24/7 Health Consultation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}