'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function DoctorProfile() {
  const params = useParams();
  const id = params?.id;
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    let mounted = true;

    fetch(`/api/doctors/${id}`)
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.message || 'Doctor not found');
        }
        return res.json();
      })
      .then((d) => {
        if (!mounted) return;
        const doc = {
          id: d._id ?? d.id,
          name: d.name,
          email: d.email,
          phone: d.phone,
          designation: d.designation ?? d.Designation ?? '',
          department: d.department ?? d.Department ?? '',
          bio: d.bio ?? d.Bio ?? '',
          image: d.image ?? '/placeholder-doctor.png',
          certificate: d.certificate ?? '',
          status: (d.status ?? d.status === false) ? d.status : 'pending',
        };
        setDoctor(doc);
      })
      .catch((err) => {
        console.error('Doctor load error', err);
        if (mounted) setError(err.message || 'Failed to load doctor');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-merriweather text-[#023E8A]">
        Loading doctor…
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 font-merriweather">
        {error}
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-red-500">
        Doctor not found.
      </div>
    );
  }

  const statusColor =
    doctor.status === 'approved'
      ? 'bg-green-100 text-green-700'
      : doctor.status === 'rejected'
      ? 'bg-red-100 text-red-700'
      : 'bg-yellow-100 text-yellow-700';

  return (
    <section className="min-h-screen bg-[linear-gradient(to_bottom,#CAF0F8,#ADE8F4,#90E0EF)] py-16 px-6 md:px-20 font-merriweather text-[#03045E]">
      <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-8 md:p-10">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
          <div className="shrink-0">
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-[#00B4D8] shadow-lg">
              <Image
                src={doctor.image}
                alt={doctor.name}
                width={160}
                height={160}
                className="object-cover w-full h-full"
                unoptimized
              />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-[#023E8A]">{doctor.name}</h1>
                <p className="text-sm text-[#0077B6] font-semibold mt-1">{doctor.designation}</p>
                <p className="text-sm text-[#03045E]/80 mt-1">{doctor.department}</p>
              </div>

              <div className="flex items-center gap-3 mt-3 sm:mt-0">
                <span className={`px-3 py-1 rounded-full text-sm ${statusColor} font-semibold`}>
                  {doctor.status || 'pending'}
                </span>
                <Link
                  href={`/appointment/${doctor.id}`}
                  className="inline-flex items-center gap-2 bg-[#0077B6] hover:bg-[#00B4D8] text-white px-4 py-2 rounded-full shadow-md transition"
                >
                  Request Appointment
                </Link>
              </div>
            </div>

            <div className="mt-4 text-[#03045E]">
              {doctor.bio ? (
                <p className="leading-relaxed">{doctor.bio}</p>
              ) : (
                <p className="text-sm text-[#03045E]/70">No bio provided.</p>
              )}

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <div>
                  <strong className="text-[#023E8A]">Email:</strong>{' '}
                  <span className="text-[#03045E]/80">{doctor.email || '—'}</span>
                </div>
                <div>
                  <strong className="text-[#023E8A]">Phone:</strong>{' '}
                  <span className="text-[#03045E]/80">{doctor.phone || '—'}</span>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                {doctor.certificate ? (
                  <a
                    href={doctor.certificate}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block bg-white border border-[#48CAE4] text-[#0077B6] px-4 py-2 rounded-md shadow-sm hover:bg-[#F0FDFF] transition"
                  >
                    View Certificate
                  </a>
                ) : null}

                <Link
                  href="/find-doctor"
                  className="inline-block bg-[#F8F9FA] border border-transparent text-[#023E8A] px-4 py-2 rounded-md hover:bg-[#EFF8FB] transition"
                >
                  ← Back to Doctors
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
