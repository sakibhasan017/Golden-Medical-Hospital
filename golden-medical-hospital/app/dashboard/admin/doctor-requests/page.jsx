"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function DoctorRequestsPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch("/api/admin/doctors");
        const data = await res.json();
        setDoctors(data);
      } catch (error) {
        console.error("Failed to load doctor requests", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading doctor requests...
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-[linear-gradient(to_bottom,#CAF0F8,#ADE8F4,#90E0EF)] p-6 font-merriweather">
      <div className="max-w-5xl mx-auto bg-white/90 p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-[#023E8A] mb-6 text-center">
          Pending Doctor Requests
        </h1>

        {doctors.length === 0 ? (
          <p className="text-center text-gray-600">
            No pending doctor requests.
          </p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#0077B6] text-white">
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doc) => (
                <tr key={doc._id} className="border-b">
                  <td className="p-3">{doc.name}</td>
                  <td className="p-3">{doc.email}</td>
                  <td className="p-3 capitalize text-orange-600 font-semibold">
                    {doc.status}
                  </td>
                  <td className="p-3 text-center">
                    <Link
                      href={`/dashboard/admin/doctor-requests/${doc._id}`}
                      className="bg-[#0077B6] text-white px-4 py-1 rounded-md hover:bg-[#00B4D8]"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
