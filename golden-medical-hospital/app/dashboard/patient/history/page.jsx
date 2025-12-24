'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function PatientHistory() {
  const { data: session, status } = useSession();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      setTimeout(()=>{ setError('Not authenticated'); setLoading(false); }, 0);
      return;
    }
    let mounted = true;
    const patientId = session.user?.id;
    if (!patientId) { setTimeout(()=>{ setError('No patient id'); setLoading(false); }, 0); return; }

    fetch(`/api/appointments/patient/${patientId}`)
      .then(async res => { if (!res.ok) { const b=await res.json().catch(()=>({})); throw new Error(b.message||'Failed'); } return res.json(); })
      .then(data => { if (!mounted) return; setList(Array.isArray(data)?data:[]); })
      .catch(err => { if (!mounted) return; setError(err.message||'Failed'); })
      .finally(() => { if (!mounted) return; setLoading(false); });

    return () => { mounted = false; };
  }, [session, status]);

  if (loading) return <div className="p-8 text-center">Loading…</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <section className="p-6 min-h-screen font-merriweather bg-[linear-gradient(to_bottom,#CAF0F8,#ADE8F4,#90E0EF)]">
      <div className="max-w-4xl mx-auto bg-white/90 p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-[#023E8A] mb-4">Appointment History</h2>
        {list.length === 0 ? <p>No history.</p> : (
          <div className="space-y-3">
            {list.map(it => (
              <div key={it.id} className="p-3 border rounded bg-[#F8FCFF] flex justify-between items-center">
                <div>
                  <div className="font-semibold">{it.name} — {it.symptoms}</div>
                  <div className="text-sm text-[#666]">{new Date(it.preferredDate).toLocaleDateString()} • {it.preferredTime}</div>
                </div>
                <div className="text-sm">{it.status}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
