"use client"

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Package, Stethoscope } from "lucide-react";

export default function HealthCheckPackages() {
  const [healthchecks, setHealthchecks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHealthchecks() {
      try {
        const res = await fetch(`/api/health-check`, {
          cache: "no-store",
        });

        if (!res.ok) {
          console.error("Failed to fetch healthcheck packages");
          return [];
        }

        const data = await res.json();
        setHealthchecks(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching healthcheck packages:", error);
        setHealthchecks([]);
      } finally {
        setLoading(false);
      }
    }

    fetchHealthchecks();
  }, []);

  const limitedHealthchecks = healthchecks.slice(0, 4);

  if (loading) {
    return (
      <section className="bg-linear-to-b from-[#CAF0F8] to-[#ADE8F4] py-16 px-6 md:px-20 font-merriweather text-[#03045E]">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-[#023E8A] mb-4">
            Health Check Packages
          </h2>
          <div className="w-24 h-1 bg-[#0077B6] mx-auto mb-10 rounded-full"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex flex-col h-full bg-white rounded-2xl border border-[#E1F0FF] shadow-md p-6 animate-pulse"
              >
                <div className="h-6 bg-gray-300 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/3 mb-6"></div>
                <div className="h-16 bg-gray-300 rounded mb-4"></div>
                <div className="h-10 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-linear-to-b from-[#CAF0F8] to-[#ADE8F4] py-16 px-6 md:px-20 font-merriweather text-[#03045E]">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-[#023E8A] mb-4">
          Health Check Packages
        </h2>
        <div className="w-24 h-1 bg-[#0077B6] mx-auto mb-10 rounded-full"></div>

        {limitedHealthchecks.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Healthcheck Packages Available</h3>
            <p className="text-gray-500">Check back soon for our health screening packages.</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-12">
              <p className="text-gray-600 max-w-2xl mx-auto">
                Select a package to view detailed information about included tests and pricing
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {limitedHealthchecks.map((healthcheck) => {
                // Extract short description (first 80 characters)
                const shortDescription = healthcheck.description && healthcheck.description.length > 80 
                  ? `${healthcheck.description.substring(0, 80)}...` 
                  : healthcheck.description || "No description available";

                return (
                  <div
                    key={healthcheck._id}
                    className="flex flex-col h-full bg-white rounded-2xl border border-[#E1F0FF] shadow-md hover:shadow-xl hover:border-[#0077B6]/30 transition-all duration-300 overflow-hidden group hover:scale-[1.02]"
                  >
                    <div className="p-6 grow">
                      {/* Title and Tests Count */}
                      <div className="mb-4">
                        <h3 className="text-lg font-bold text-[#023E8A] mb-2 line-clamp-2">
                          {healthcheck.title}
                        </h3>
                        <div className="flex items-center justify-start">
                          <span className="px-3 py-1 bg-blue-50 text-blue-800 text-xs font-medium rounded-full">
                            <span className="flex items-center gap-1">
                              <Stethoscope size={12} />
                              {healthcheck.tests?.length || 0} tests
                            </span>
                          </span>
                        </div>
                      </div>

                      {/* Description under the title */}
                      <p className="text-sm text-gray-600 mb-4 min-h-[60px] line-clamp-3">
                        {shortDescription}
                      </p>

                      {/* Price at the bottom */}
                      <div className="mt-auto">
                        <div className="text-xs text-gray-500 mb-1">Starting from</div>
                        <div className="text-xl font-bold text-[#0077B6]">
                          ৳{healthcheck.price || "N/A"}
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Button */}
                    <div className="px-6 pb-6 pt-0">
                      <Link
                        href={`/health-checks/${healthcheck._id}`}
                        className="block w-full text-center py-3 bg-linear-to-r from-[#0077B6] to-[#0096C7] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#0077B6]/30 transition-all duration-300"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* View All Packages Link - Only show if there are more than 4 packages */}
            {healthchecks.length > 4 && (
              <div className="mt-12 text-center">
                <Link
                  href="/health-checks"
                  className="inline-flex items-center gap-2 bg-[#0077B6] hover:bg-[#023E8A] text-white font-semibold py-3 px-8 rounded-full text-lg transition-all duration-300 hover:shadow-lg hover:scale-105"
                >
                  View All {healthchecks.length} Packages
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}