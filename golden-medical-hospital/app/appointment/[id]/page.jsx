
'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AppointmentPage() {
  const { id } = useParams();
  const router = useRouter();
  const today = new Date().toISOString().split('T')[0];

  const [doctor, setDoctor] = useState(null);
  const [loadingDoctor, setLoadingDoctor] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const [formData, setFormData] = useState({
    patientName: '',
    email: '',
    phone: '',
    date: '',
    preferredTime: '',
    symptoms: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  useEffect(() => {
    if (!id) return;
    let mounted = true;

    (async () => {
      try {
        const res = await fetch(`/api/doctors/${id}`);
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.message || 'Doctor not found');
        }
        const d = await res.json();
        if (!mounted) return;
        setDoctor({
          id: d._id ?? d.id,
          name: d.name,
          department: d.department ?? d.Department ?? '',
          image: d.image ?? '/placeholder-doctor.png',
        });
      } catch (err) {
        console.error('doctor fetch error', err);
        if (mounted) setFetchError(err.message || 'Failed to load doctor');
      } finally {
        if (mounted) setLoadingDoctor(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          return;
        }
        const data = await res.json().catch(() => ({}));
        if (!mounted) return;
        const user = data.user ?? data.sessionUser ?? null;
        if (user && ((data.role ?? user.role) === 'patient' || !data.role)) {
          setFormData((f) => ({
            ...f,
            patientName: user.name ?? f.patientName,
            email: user.email ?? f.email,
            phone: user.phone ?? f.phone,
          }));
        }
      } catch (e) {
        
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handleChange = (e) => setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));

  const validate = () => {
    if (!formData.patientName?.trim()) return 'Full name required';
    if (!formData.email?.trim()) return 'Email required';
    if (!formData.phone?.trim()) return 'Phone required';
    if (!formData.date) return 'Preferred date required';
    if (!formData.preferredTime) return 'Preferred time required';
    if (new Date(formData.date) < new Date(today)) return 'Date must be today or later';
    if (!formData.symptoms?.trim()) return 'Please describe symptoms';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg(null);
    const v = validate();
    if (v) {
      setStatusMsg({ type: 'error', text: v });
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        doctorId: id,
        doctorName: doctor?.name,
        department: doctor?.department,
        name: formData.patientName,
        email: formData.email,
        phone: formData.phone,
        preferredDate: formData.date,
        preferredTime: formData.preferredTime,
        symptoms: formData.symptoms,
        additionalInfo: formData.message,
        status: 'Pending',
      };

      const res = await fetch('/api/appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatusMsg({ type: 'error', text: body.message || 'Failed to book appointment' });
        setSubmitting(false);
        return;
      }

      setStatusMsg({ type: 'success', text: 'Appointment requested. You will be notified.' });
      setFormData({ patientName: '', email: '', phone: '', date: '', preferredTime: '', symptoms: '', message: '' });
      setTimeout(() => router.push('/find-doctor'), 1600);
    } catch (err) {
      console.error(err);
      setStatusMsg({ type: 'error', text: 'Server error. Try again later.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingDoctor) {
    return <div className="min-h-screen flex items-center justify-center font-merriweather text-[#023E8A]">Loading…</div>;
  }
  if (fetchError) {
    return <div className="min-h-screen flex items-center justify-center text-red-600 font-merriweather">{fetchError}</div>;
  }

  return (
    <section className="min-h-screen bg-[linear-gradient(to_bottom,#CAF0F8,#ADE8F4,#90E0EF)] py-12 px-6 md:px-20 font-merriweather text-[#03045E]">
      <div className="max-w-3xl mx-auto bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-8 md:p-10">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-[#00B4D8]">
            <Image src={doctor?.image ?? '/placeholder-doctor.png'} width={80} height={80} alt={doctor?.name ?? 'doctor'} className="object-cover" unoptimized />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#023E8A]">{doctor?.name}</h2>
            <p className="text-sm text-[#0077B6]">{doctor?.department}</p>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-[#023E8A] mb-3">Book an Appointment</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#023E8A] mb-1">Full name</label>
            <input name="patientName" value={formData.patientName} onChange={handleChange} required className="w-full p-3 border border-[#00B4D8]/40 rounded-lg outline-none focus:border-[#0077B6]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#023E8A] mb-1">Email</label>
              <input name="email" value={formData.email} onChange={handleChange} type="email" required className="w-full p-3 border border-[#00B4D8]/40 rounded-lg outline-none focus:border-[#0077B6]" />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#023E8A] mb-1">Phone</label>
              <input name="phone" value={formData.phone} onChange={handleChange} type="tel" required className="w-full p-3 border border-[#00B4D8]/40 rounded-lg outline-none focus:border-[#0077B6]" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#023E8A] mb-1">Preferred date</label>
              <input name="date" value={formData.date} onChange={handleChange} type="date" min={today} required className="w-full p-3 border border-[#00B4D8]/40 rounded-lg outline-none focus:border-[#0077B6]" />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#023E8A] mb-1">Preferred time</label>
              <input name="preferredTime" value={formData.preferredTime} onChange={handleChange} type="time" required className="w-full p-3 border border-[#00B4D8]/40 rounded-lg outline-none focus:border-[#0077B6]" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#023E8A] mb-1">Symptoms</label>
            <input name="symptoms" value={formData.symptoms} onChange={handleChange} placeholder="e.g., chest pain, headache" required className="w-full p-3 border border-[#00B4D8]/40 rounded-lg outline-none focus:border-[#0077B6]" />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#023E8A] mb-1">Additional message (optional)</label>
            <textarea name="message" value={formData.message} onChange={handleChange} rows={4} className="w-full p-3 border border-[#00B4D8]/40 rounded-lg outline-none focus:border-[#0077B6]" />
          </div>

          <button type="submit" disabled={submitting} className="w-full bg-[#0077B6] hover:bg-[#00B4D8] text-white py-3 rounded-lg font-semibold shadow-md transition">
            {submitting ? 'Submitting...' : 'Submit Appointment'}
          </button>

          {statusMsg && (
            <p className={`text-center font-medium mt-3 ${statusMsg.type === 'error' ? 'text-red-600' : 'text-green-700'}`}>
              {statusMsg.text}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
