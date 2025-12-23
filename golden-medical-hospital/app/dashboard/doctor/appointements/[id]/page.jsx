
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function AppointmentDetail() {
  const { id } = useParams();
  const router = useRouter();

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!id) return;
    let mounted = true;

    fetch(`/api/appointments/${id}`)
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.message || 'Not found');
        }
        return res.json();
      })
      .then((d) => {
        if (!mounted) return;
        setAppointment(d);
      })
      .catch((err) => setStatusMsg({ type: 'error', text: err.message || 'Failed' }))
      .finally(() => mounted && setLoading(false));

    return () => (mounted = false);
  }, [id]);

  const updateStatus = async (newStatus) => {
    setUpdating(true);
    setStatusMsg(null);
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const body = await res.json().catch(()=>({}));
      if (!res.ok) throw new Error(body.message || 'Update failed');
      setAppointment(prev => ({ ...prev, status: newStatus }));
      setStatusMsg({ type: 'success', text: 'Updated' });
    } catch (err) {
      console.error(err);
      setStatusMsg({ type: 'error', text: err.message || 'Update failed' });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading…</div>;
  if (!appointment) return <div className="p-8 text-center text-red-600">Appointment not found</div>;

  return (
    <section className="min-h-screen p-6 font-merriweather bg-[linear-gradient(to_bottom,#CAF0F8,#ADE8F4,#90E0EF)]">
      <div className="max-w-3xl mx-auto bg-white/90 p-6 rounded-2xl shadow-lg border border-[#48CAE4]/30">
        <h2 className="text-2xl font-bold text-[#023E8A] mb-4">Appointment Details</h2>

        <div className="grid grid-cols-1 gap-3">
          <div><strong>Patient:</strong> {appointment.name} {appointment.patient ? `(${appointment.patient.name})` : ''}</div>
          <div><strong>Email:</strong> {appointment.email}</div>
          <div><strong>Phone:</strong> {appointment.phone}</div>
          <div><strong>Date:</strong> {appointment.preferredDate?.split?.("T")?.[0] ?? appointment.preferredDate}</div>
          <div><strong>Time:</strong> {appointment.preferredTime}</div>
          <div><strong>Symptoms:</strong> {appointment.symptoms}</div>
          <div><strong>Additional info:</strong> {appointment.additionalInfo || "—"}</div>
          <div><strong>Status:</strong> {appointment.status}</div>
        </div>

        <div className="mt-6 flex gap-3">
          <button disabled={updating} onClick={() => updateStatus('Confirmed')} className="px-4 py-2 bg-green-600 text-white rounded-md">Confirm</button>
          <button disabled={updating} onClick={() => updateStatus('Completed')} className="px-4 py-2 bg-gray-600 text-white rounded-md">Complete</button>
          <button disabled={updating} onClick={() => updateStatus('Cancelled')} className="px-4 py-2 bg-red-600 text-white rounded-md">Cancel</button>
          <button onClick={() => router.back()} className="px-4 py-2 bg-gray-200 rounded-md">Back</button>
        </div>

        {statusMsg && (
          <div className={`mt-4 p-2 rounded ${statusMsg.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {statusMsg.text}
          </div>
        )}
      </div>
    </section>
  );
}
