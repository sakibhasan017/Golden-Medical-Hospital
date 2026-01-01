"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Phone, Mail, User, Award, Clock, Calendar, Loader2, ArrowLeft } from "lucide-react";
import Image from "next/image";

export default function SpecialistPage({ params }) {
  const [specialist, setSpecialist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getSpecialist(id) {
      try {
        const res = await fetch(`/api/specialists/${id}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("Specialist not found");
          }
          throw new Error("Failed to fetch specialist");
        }

        const data = await res.json();
        setSpecialist(data);
      } catch (error) {
        console.error("Error fetching specialist:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    async function fetchData() {
      if (params && typeof params.then === "function") {
        const resolvedParams = await params;
        getSpecialist(resolvedParams.id);
      } else {
        getSpecialist(params.id);
      }
    }

    fetchData();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-[#F0F9FF] to-[#E6F4FF] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-[#0077B6] animate-spin mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#023E8A] mb-2">Loading Specialist...</h1>
          <p className="text-gray-600">Please wait while we fetch the details</p>
        </div>
      </div>
    );
  }

  if (error || !specialist) {
    return (
      <div className="min-h-screen bg-linear-to-b from-[#F0F9FF] to-[#E6F4FF] flex items-center justify-center">
        <div className="text-center max-w-md">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-[#023E8A] mb-4">
            Specialist Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            {error || "The specialist you are looking for does not exist."}
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-[#0077B6] to-[#0096C7] text-white rounded-xl font-medium hover:shadow-lg hover:shadow-[#0077B6]/30 transition-all duration-300"
          >
            <ArrowLeft size={20} />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Success: Render the specialist page
  return (
    <div className="min-h-screen bg-linear-to-b from-[#F0F9FF] to-[#E6F4FF]">
      {/* Hero Section */}
      <div className="bg-linear-to-r from-[#0077B6] to-[#00B4D8] text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {specialist.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Specialist Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white rounded-2xl p-6 border border-[#E1F0FF] shadow-sm">
              <h2 className="text-2xl font-bold text-[#023E8A] mb-4">
                About This Department
              </h2>
              <div className="text-gray-700 space-y-4">
                {specialist.description ? (
                  <p className="text-lg">{specialist.description}</p>
                ) : (
                  <>
                    <p className="text-lg">
                      Our {specialist.title} department is dedicated to
                      providing exceptional medical care with the latest
                      technology and treatment methods.
                    </p>
                    <p>
                      We combine expert knowledge with compassionate care to
                      ensure the best possible outcomes for our patients.
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Doctors List */}
            <div className="bg-white rounded-2xl p-6 border border-[#E1F0FF] shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#023E8A]">
                  Our Doctors
                </h2>
                <div className="text-sm text-gray-500">
                  {specialist.doctorList?.length || 0} specialist doctors
                </div>
              </div>

              {specialist.doctorList && specialist.doctorList.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {specialist.doctorList.map((doctor) => (
                    <div
                      key={doctor._id}
                      className="bg-linear-to-r from-white to-[#FAFDFF] rounded-xl p-6 border border-[#E1F0FF] hover:border-[#0077B6]/40 hover:shadow-lg hover:shadow-[#0077B6]/10 transition-all duration-300"
                    >
                      <div className="flex items-start gap-4">
                        {/* Profile Picture */}
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-100 relative">
                          {doctor.image ? (
                            <Image
                              src={doctor.image}
                              alt={`Dr. ${doctor.name}`}
                              fill
                              sizes="64px"
                              className="object-cover"
                              priority={false}
                            />
                          ) : (
                            <div className="w-full h-full bg-linear-to-br from-[#0077B6] to-[#00B4D8] flex items-center justify-center text-white font-bold text-xl">
                              {doctor.name
                                ?.split(" ")
                                .map((n) => n[0])
                                .slice(0, 2)
                                .join("") || "DR"}
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-xl font-bold text-[#023E8A] mb-1">
                                Dr. {doctor.name}
                              </h3>
                              <div className="text-sm text-gray-600">
                                {doctor.specialization ||
                                  doctor.department ||
                                  "Medical Specialist"}
                              </div>
                            </div>
                            {/* Book Appointment Button */}
                            <Link
                              href={`/appointment/${doctor._id}`}
                              className="flex items-center gap-1 px-4 py-2 bg-linear-to-r from-[#0077B6] to-[#0096C7] text-white text-sm font-medium rounded-lg hover:shadow-md hover:shadow-[#0077B6]/30 transition-all duration-300 whitespace-nowrap"
                            >
                              <Calendar size={14} />
                              Book Now
                            </Link>
                          </div>

                          {/* Doctor Details */}
                          <div className="space-y-2 text-sm">
                            {doctor.experience && (
                              <div className="flex items-center gap-2 text-gray-700">
                                <Award size={14} />
                                <span>
                                  {doctor.experience}{" "}
                                  {doctor.experience === 1 ? "year" : "years"}{" "}
                                  experience
                                </span>
                              </div>
                            )}

                            {doctor.email && (
                              <div className="flex items-center gap-2 text-gray-700">
                                <Mail size={14} />
                                <span className="truncate">{doctor.email}</span>
                              </div>
                            )}

                            {doctor.phone && (
                              <div className="flex items-center gap-2 text-gray-700">
                                <Phone size={14} />
                                <span>{doctor.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    No Doctors Assigned
                  </h3>
                  <p className="text-gray-500">
                    Doctors will be added to this department soon.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Contact & Info */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-linear-to-br from-[#F8FCFF] to-white rounded-2xl p-6 border border-[#E1F0FF] shadow-sm">
              <h3 className="text-xl font-bold text-[#023E8A] mb-4">
                Contact Information
              </h3>

              <div className="space-y-4">
                {/* Hotline */}
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <Phone size={20} />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Hotline</div>
                      <div className="text-lg font-semibold text-blue-700">
                        {specialist.contact || "+1 (555) 123-4567"}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    24/7 emergency service available
                  </div>
                </div>

                {/* Department Hours */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                      <Clock size={20} />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">
                        Department Hours
                      </div>
                      <div className="font-semibold text-gray-800">
                        Mon - Sun: 8AM - 10PM
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    Emergency services available 24/7
                  </div>
                </div>
              </div>
            </div>

            {/* Services Offered */}
            <div className="bg-white rounded-2xl p-6 border border-[#E1F0FF] shadow-sm">
              <h3 className="text-lg font-semibold text-[#023E8A] mb-4">
                Services Offered
              </h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-700">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs">
                    ✓
                  </div>
                  <span>Comprehensive Diagnosis</span>
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs">
                    ✓
                  </div>
                  <span>Advanced Treatment Options</span>
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs">
                    ✓
                  </div>
                  <span>Follow-up Care</span>
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs">
                    ✓
                  </div>
                  <span>Emergency Services</span>
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs">
                    ✓
                  </div>
                  <span>Patient Education</span>
                </li>
              </ul>
            </div>

            {/* Specialist ID Info */}
            <div className="bg-white rounded-2xl p-6 border border-[#E1F0FF] shadow-sm">
              <h3 className="text-lg font-semibold text-[#023E8A] mb-4">
                Department Information
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span className="font-medium">Department ID:</span>
                  <span className="text-gray-800 font-mono">
                    {specialist._id?.slice(-8)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Total Doctors:</span>
                  <span className="text-blue-600 font-bold">
                    {specialist.doctorList?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Status:</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="bg-linear-to-r from-[#023E8A] to-[#0077B6] text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            {specialist.title}
          </h3>
          <p className="text-lg text-white/90 mb-6">
            Providing expert medical care with compassion and excellence.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Phone size={16} />
              <span>{specialist.contact || "+1 (555) 123-4567"}</span>
            </div>
            <div className="h-4 w-px bg-white/30"></div>
            <div>
              <span>24/7 Emergency Services Available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}