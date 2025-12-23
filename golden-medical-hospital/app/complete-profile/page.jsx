"use client";

import React, { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const DEPARTMENTS = [
  'Accident & Emergency','Anesthesia and Pain Medicine','Cancer Care Centre',
  'Cardiology Care Centre','Cardiothoracic & Vascular Surgery','Neurology',
  'Thoracic Surgery','Nephrology','Neurosurgery','Kidney Transplant Program'
];

export default function CompleteProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [registered, setRegistered] = useState(false);
  const [initial, setInitial] = useState(null);
  const [role, setRole] = useState("patient");
  const [form, setForm] = useState({
    name: "", email: "", phone: "", age: "", bloodGroup: "",
    designation: "", department: "", bio: "", password: "", confirmPassword: ""
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [certPreview, setCertPreview] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (status === "loading") return;
      if (!session) {
        router.push("/login");
        return;
      }

      const res = await fetch("/api/auth/me");
      const data = await res.json();

      if (!data.authenticated) {
        signOut();
        return;
      }

      if (data.registered && data.profileComplete) {
        if (data.role === "patient") router.replace("/dashboard/patient");
        else if (data.role === "doctor") {
          if (data.user?.status === "approved") router.replace("/dashboard/doctor");
          else router.replace("/doctor-waiting");
        }
        return;
      }

      setInitial(data.sessionUser || {});
      setForm(f => ({
        ...f,
        name: data.sessionUser?.name || "",
        email: data.sessionUser?.email || ""
      }));
      setLoading(false);
    };

    init();
  }, [session, status, router]);

  const handleChange = (e) => {
    if (e.target.name === "image") {
      const file = e.target.files[0];
      setImagePreview(file ? URL.createObjectURL(file) : null);
      setForm(f => ({ ...f, image: file }));
    } else if (e.target.name === "certificate") {
      const file = e.target.files[0];
      setCertPreview(file ? file.name : null);
      setForm(f => ({ ...f, certificate: file }));
    } else {
      setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    }
  };

  const handleBack = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    const fd = new FormData();
    fd.append("role", role);
    Object.entries(form).forEach(([k, v]) => {
      if (v !== null && v !== undefined) fd.append(k, v);
    });

    const res = await fetch("/api/auth/complete-profile", { method: "POST", body: fd });
    const data = await res.json();

    if (!res.ok) {
      setMessage({ type: "error", text: data.error || "Failed" });
      return;
    }

    if (data.role === "patient") router.replace("/dashboard/patient");
    else router.replace("/doctor-waiting");
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-[#023E8A] font-semibold">
        Loading…
      </div>
    );

  return (
    <div className="min-h-screen bg-[linear-gradient(to_bottom,#CAF0F8,#ADE8F4,#90E0EF)] font-merriweather p-6 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-[#48CAE4]/40">

        <h2 className="text-3xl font-bold text-center text-[#023E8A] mb-2">
          Complete your profile
        </h2>

        <p className="text-sm text-center text-[#03045E]/70 mb-6">
          Please fill all required information to finish registration.
        </p>

        <div className="mb-6">
          <label className="text-sm font-semibold text-[#0077B6] mb-1 block">
            Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-3 rounded-xl border border-[#48CAE4] bg-[#E0F7FF] focus:ring-2 focus:ring-[#00B4D8] outline-none"
          >
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
          </select>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["name","email","phone","age"].map((field) => (
            <input
              key={field}
              name={field}
              value={form[field]}
              onChange={handleChange}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              className="p-3 rounded-xl border border-[#48CAE4] focus:ring-2 focus:ring-[#00B4D8] outline-none"
              required={field !== "age"}
            />
          ))}

          {role === "patient" && (
            <>
              <input
                name="bloodGroup"
                value={form.bloodGroup}
                onChange={handleChange}
                placeholder="Blood Group"
                className="p-3 rounded-xl border border-[#48CAE4]"
                required
              />

              <div className="p-3 rounded-xl border border-[#48CAE4] bg-[#F0FBFF]">
                <label className="block text-sm font-semibold text-[#0077B6]">
                  Profile Image (optional)
                </label>
                <input name="image" type="file" accept="image/*" onChange={handleChange} />
                {imagePreview && (
                  <div className="mt-3">
                    <Image src={imagePreview} alt="preview" width={90} height={90} className="rounded-full border" />
                  </div>
                )}
              </div>
            </>
          )}

          {role === "doctor" && (
            <>
              <input
                name="designation"
                value={form.designation}
                onChange={handleChange}
                placeholder="Designation"
                className="p-3 rounded-xl border border-[#48CAE4]"
                required
              />

              <select
                name="department"
                value={form.department}
                onChange={handleChange}
                className="p-3 rounded-xl border border-[#48CAE4]"
                required
              >
                <option value="">Select Department</option>
                {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
              </select>

              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                placeholder="Short Bio"
                rows={3}
                className="p-3 rounded-xl border border-[#48CAE4] md:col-span-2"
              />

              <div className="md:col-span-2 p-3 rounded-xl border border-[#48CAE4] bg-[#F0FBFF]">
                <label className="block text-sm font-semibold text-[#0077B6]">
                  Upload Certificate (ZIP / PDF)
                </label>
                <input name="certificate" type="file" accept=".zip,.pdf" onChange={handleChange} />
                {certPreview && <div className="mt-2 text-sm">{certPreview}</div>}
                <p className="text-xs text-gray-600 mt-1">
                  Admin will verify your certificate before activation.
                </p>
              </div>

              <div className="md:col-span-2 p-3 rounded-xl border border-[#48CAE4] bg-[#F0FBFF]">
                <label className="block text-sm font-semibold text-[#0077B6]">
                  Profile Image (optional)
                </label>
                <input name="image" type="file" accept="image/*" onChange={handleChange} />
                {imagePreview && (
                  <div className="mt-3">
                    <Image src={imagePreview} alt="preview" width={90} height={90} className="rounded-full border" />
                  </div>
                )}
              </div>
            </>
          )}

          <div className="md:col-span-2 flex justify-between mt-6">
            <button
              type="button"
              onClick={handleBack}
              className="px-5 py-2 rounded-full bg-gray-200 hover:bg-gray-300 transition"
            >
              Back (Cancel)
            </button>

            <button
              type="submit"
              className="px-8 py-2 rounded-full text-white bg-[linear-gradient(to_right,#03045E,#0077B6,#00B4D8)] hover:opacity-90 transition"
            >
              Submit
            </button>
          </div>
        </form>

        {message && (
          <div className={`mt-4 text-center font-semibold ${
            message.type === "error" ? "text-red-600" : "text-green-600"
          }`}>
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}
