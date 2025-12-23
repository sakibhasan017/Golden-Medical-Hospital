"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

export default function DoctorDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchDoctor = async () => {
      try {
        const res = await fetch(`/api/admin/doctors/${id}`);
        const data = await res.json();
        setDoctor(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  const updateStatus = async (status) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/doctors/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const updated = await res.json();
      setDoctor(updated);
    } catch (err) {
      alert("Failed to update doctor status");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-merriweather">
        <p className="text-lg text-[#023E8A] font-semibold">
          Loading doctor details...
        </p>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center font-merriweather">
        <p className="text-lg text-red-600 font-semibold">Doctor not found</p>
      </div>
    );
  }

  const statusColor =
    doctor.status === "approved"
      ? "bg-green-100 text-green-700"
      : doctor.status === "rejected"
      ? "bg-red-100 text-red-700"
      : "bg-yellow-100 text-yellow-700";

  return (
    <section className="min-h-screen bg-[linear-gradient(to_bottom,#CAF0F8,#ADE8F4,#90E0EF)] p-6 font-merriweather">
      <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-md p-10 rounded-2xl shadow-xl border border-[#00B4D8]/30">

        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          {doctor.image && (
            <Image
              src={doctor.image}
              alt="Doctor"
              width={140}
              height={140}
              className="rounded-full border-4 border-[#0077B6] shadow-lg mb-4 object-cover"
            />
          )}

          <h2 className="text-3xl font-bold text-[#023E8A]">
            {doctor.name}
          </h2>

          <span
            className={`mt-3 px-4 py-1 rounded-full text-sm font-semibold capitalize ${statusColor}`}
          >
            {doctor.status}
          </span>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[#03045E]">
          <Info label="Email" value={doctor.email} />
          <Info label="Phone" value={doctor.phone} />
          <Info label="Designation" value={doctor.designation} />
          <Info label="Department" value={doctor.department} />
        </div>

        {/* Bio */}
        {doctor.bio && (
          <div className="mt-8 bg-[#F8FDFF] p-6 rounded-xl border border-[#90E0EF]">
            <h3 className="text-lg font-bold text-[#023E8A] mb-2">
              Doctor Bio
            </h3>
            <p className="text-[#03045E]/90 leading-relaxed">
              {doctor.bio}
            </p>
          </div>
        )}

        {/* Certificate */}
        <div className="mt-8 flex justify-center">
          <a
            href={doctor.certificate}
            target="_blank"
            className="bg-[#0077B6] hover:bg-[#00B4D8] text-white font-semibold px-6 py-3 rounded-full shadow-md transition"
          >
            View Certificate
          </a>
        </div>

        {doctor.status === "pending" && (
          <div className="mt-10 flex justify-center gap-6">
            <button
              disabled={actionLoading}
              onClick={() => updateStatus("approved")}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-semibold shadow transition"
            >
              {actionLoading ? "Processing..." : "Approve Doctor"}
            </button>

            <button
              disabled={actionLoading}
              onClick={() => updateStatus("rejected")}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-semibold shadow transition"
            >
              Reject Doctor
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function Info({ label, value }) {
  return (
    <div className="bg-[#E0F7FF] p-4 rounded-lg border border-[#48CAE4]">
      <p className="text-sm text-[#0077B6] font-semibold">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
