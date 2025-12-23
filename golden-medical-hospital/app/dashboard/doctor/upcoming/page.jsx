
'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function DoctorUpcoming() {
  const { data: session, status } = useSession();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      if (status === 'loading') return;

      if (!session) {
        if (!mounted) return;
        setError('Not authenticated');
        setLoading(false);
        return;
      }

      const endpoint = '/api/appointments/doctor/me';

      try {
        const res = await fetch(endpoint);
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.message || 'Failed to load');
        }
        const data = await res.json();
        if (!mounted) return;
        setAppointments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('load upcoming error', err);
        if (!mounted) return;
        setError(err.message || 'Failed to load');
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [session, status]);

  if (loading) return <div className="p-8 text-center">Loading…</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <section className="p-6 min-h-screen font-merriweather bg-[linear-gradient(to_bottom,#CAF0F8,#ADE8F4,#90E0EF)]">
      <div className="max-w-4xl mx-auto bg-white/90 p-6 rounded-2xl shadow-lg border border-[#48CAE4]/30">
        <h2 className="text-2xl font-bold text-[#023E8A] mb-4">Upcoming Appointments</h2>

        {appointments.length === 0 ? (
          <p className="text-[#03045E]">No upcoming appointments.</p>
        ) : (
          <div className="space-y-4">
            {appointments.map((a) => (
              <div key={a.id} className="flex items-center justify-between p-4 border rounded-lg bg-[#F8FCFF]">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <div className="font-semibold text-[#023E8A] truncate">{a.name}</div>
                    <div className="text-xs text-[#0077B6]">{a.patient ? a.patient.email : a.email}</div>
                  </div>
                  <div className="text-sm text-[#03045E]/80 mt-1">
                    {a.preferredDate} • {a.preferredTime} • {a.symptoms}
                  </div>
                </div>

                <div className="ml-4 flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm ${a.status === 'Confirmed' ? 'bg-green-100 text-green-700' : a.status === 'Completed' ? 'bg-gray-100 text-gray-700' : a.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {a.status}
                  </span>

                  <Link href={`/dashboard/doctor/appointments/${a.id}`} className="px-3 py-1 bg-[#0077B6] text-white rounded-md">View</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
