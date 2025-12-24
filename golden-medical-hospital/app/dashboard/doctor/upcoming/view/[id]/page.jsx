'use client';

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function DoctorAppointmentView() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [statusVal, setStatusVal] = useState("Pending");

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.replace("/login");
      return;
    }
    if (!id) {
      setError("Invalid appointment id");
      setLoading(false);
      return;
    }

    let mounted = true;

    (async () => {
      try {
        const res = await fetch(`/api/appointments/${id}`, { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          if (!mounted) return;
          setAppointment(data);
          setStatusVal(data.status ?? "Pending");
          if (data.preferredDate) {
            const d = new Date(data.preferredDate);
            if (!isNaN(d)) setDate(d.toISOString().slice(0, 10));
          }
          if (data.preferredTime) setTime(data.preferredTime ?? "");
          return;
        }

        if (res.status === 403) {
          const res2 = await fetch('/api/appointments/doctor/me', { credentials: 'include' });
          if (!res2.ok) {
            const body = await res2.json().catch(() => ({}));
            throw new Error(body.message || `Forbidden (${res.status})`);
          }
          const arr = await res2.json();
          const found = Array.isArray(arr) ? arr.find(a => String(a.id) === String(id) || String(a._id) === String(id)) : null;
          if (!found) throw new Error('Forbidden');
          if (!mounted) return;
          setAppointment(found);
          setStatusVal(found.status ?? "Pending");
          if (found.preferredDate) {
            const d = new Date(found.preferredDate);
            if (!isNaN(d)) setDate(d.toISOString().slice(0, 10));
          }
          if (found.preferredTime) setTime(found.preferredTime ?? "");
          return;
        }

        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `Failed to load appointment (${res.status})`);
      } catch (err) {
        if (!mounted) return;
        setError(err.message || "Failed to load");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id, session, status, router]);

  const handleSave = async () => {
    setError(null);
    if (!date || !time) {
      setError("Please provide both date and time");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        preferredDate: date,
        preferredTime: time,
        status: statusVal
      };

      const res = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `Failed to update (${res.status})`);
      }

      const updated = await res.json();
      setAppointment(updated.appointment ?? updated);
      router.push("/dashboard/doctor/upcoming");
    } catch (err) {
      setError(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-merriweather text-[#023E8A]">
        Loading…
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center font-merriweather p-6 text-red-600">
        {error}
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="min-h-screen flex items-center justify-center font-merriweather text-red-600">
        Appointment not found
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-[linear-gradient(to_bottom,#CAF0F8,#ADE8F4,#90E0EF)] p-6 font-merriweather text-[#03045E]">
      <div className="max-w-3xl mx-auto bg-white/90 p-8 rounded-2xl shadow-lg border border-[#48CAE4]/30">
        <div className="flex items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#023E8A]">
              {appointment.name}
            </h2>
            <div className="text-sm text-[#0077B6]">{appointment.email}</div>
            <div className="text-sm text-[#03045E]/80">
              Phone: {appointment.phone}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="p-4 rounded-lg bg-[#F8FCFF] border">
            <div className="text-sm text-[#023E8A] font-semibold mb-2">
              Request details
            </div>
            <div className="text-sm text-[#03045E]/80 mb-1">
              Symptoms: {appointment.symptoms}
            </div>
            {appointment.additionalInfo && (
              <div className="text-sm text-[#03045E]/80">
                Message: {appointment.additionalInfo}
              </div>
            )}
          </div>

          <div className="p-4 rounded-lg border bg-white">
            <label className="block text-sm text-[#023E8A] mb-1">
              Preferred date
            </label>
            <input
              value={date}
              onChange={(e) => setDate(e.target.value)}
              type="date"
              className="w-full p-2 border rounded"
            />

            <label className="block text-sm text-[#023E8A] mt-3 mb-1">
              Preferred time
            </label>
            <input
              value={time}
              onChange={(e) => setTime(e.target.value)}
              type="time"
              className="w-full p-2 border rounded"
            />

            <label className="block text-sm text-[#023E8A] mt-3 mb-1">
              Status
            </label>
            <select
              value={statusVal}
              onChange={(e) => setStatusVal(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex items-center gap-3 mt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 rounded-full bg-[linear-gradient(to_right,#03045E,#0077B6,#00B4D8)] text-white"
            >
              {saving ? "Saving…" : "Save & Notify"}
            </button>
            <button
              onClick={() => router.back()}
              className="px-6 py-2 rounded-full bg-gray-200"
            >
              Back
            </button>
            <div className="ml-auto text-sm text-[#03045E]/80 self-center">
              {appointment.status}
            </div>
          </div>

          {error && <div className="text-red-600 mt-3">{error}</div>}
        </div>
      </div>
    </section>
  );
}
