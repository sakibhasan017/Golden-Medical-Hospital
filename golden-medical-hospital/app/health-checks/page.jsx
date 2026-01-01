import React from "react";
import Link from "next/link";
import { Package, DollarSign, Stethoscope } from "lucide-react";

async function getHealthchecks() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/health-check`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Failed to fetch healthcheck packages");
      return [];
    }

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching healthcheck packages:", error);
    return [];
  }
}

export default async function HealthchecksPage() {
  const healthchecks = await getHealthchecks();

  return (
    <div className="min-h-screen bg-linear-to-b from-[#F0F9FF] to-[#E6F4FF]">
      {/* Hero Section */}
      <div className="bg-linear-to-r from-[#0077B6] to-[#00B4D8] text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="text-center">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Health Checkup Packages</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Comprehensive health screening packages tailored to your needs. 
              Choose from our range of diagnostic and preventive health checkups.
            </p>
          </div>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {healthchecks.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Healthcheck Packages Available</h3>
            <p className="text-gray-500">Check back soon for our health screening packages.</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#023E8A] mb-4">Our Packages</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Select a package to view detailed information about included tests and pricing
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {healthchecks.map((healthcheck) => {
                // Extract short description (first 100 characters)
                const shortDescription = healthcheck.description.length > 100 
                  ? `${healthcheck.description.substring(0, 100)}...` 
                  : healthcheck.description;

                return (
                  <div
                    key={healthcheck._id}
                    className="bg-white rounded-2xl border border-[#E1F0FF] shadow-sm hover:shadow-xl hover:border-[#0077B6]/30 transition-all duration-300 overflow-hidden group"
                  >
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-[#023E8A] mb-2">
                            {healthcheck.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                              <span className="flex items-center gap-1">
                                <Stethoscope size={12} />
                                {healthcheck.tests.length} tests
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 mb-6">{shortDescription}</p>

                      {/* Price */}
                      <div className="mb-6">
                        <div className="text-sm text-gray-500 mb-1">Starting from</div>
                        <div className="text-2xl font-bold text-[#0077B6]">
                          ৳{healthcheck.price}
                        </div>
                      </div>

                      {/* Action Button */}
                      <Link
                        href={`/health-checks/${healthcheck._id}`}
                        className="block w-full text-center py-3 bg-linear-to-r from-[#0077B6] to-[#0096C7] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#0077B6]/30 transition-all duration-300 group-hover:scale-[1.02]"
                      >
                        See Package Details
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-linear-to-r from-[#023E8A] to-[#0077B6] text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">Need Help Choosing a Package?</h3>
          <p className="text-lg text-white/90 mb-8">
            Our healthcare advisors can help you select the right health checkup package 
            based on your age, lifestyle, and medical history.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <Package className="w-6 h-6" />
              <span className="text-lg">Comprehensive Health Assessments</span>
            </div>
            <div className="h-4 w-px bg-white/30 hidden sm:block"></div>
            <div className="flex items-center gap-2">
              <Stethoscope className="w-6 h-6" />
              <span className="text-lg">Advanced Diagnostic Tests</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}