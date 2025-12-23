"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ProfileImageUpload from "@/components/profileImageUpload/page";

export default function PatientEditProfile() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    bloodGroup: "",
    password: "",
    confirmPassword: "",
    imageFile: null,
    imagePath: "",
  });

  const [preview, setPreview] = useState({ image: null });

  useEffect(() => {
    const init = async () => {
      if (status === "loading") return;
      if (!session) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();

        if (!data?.authenticated) {
          setMessage({ type: "error", text: "Session invalid. Please login." });
          return;
        }

        const role = data.role ?? session.user?.role;
        if (role !== "patient") {
          if (role === "doctor") router.replace("/dashboard/doctor");
          else if (role === "admin") router.replace("/dashboard/admin");
          return;
        }

        const user = data.user ?? data.sessionUser ?? session.user ?? {};

        setForm({
          name: user.name ?? "",
          email: user.email ?? "",
          phone: user.phone ?? "",
          age: user.age ?? "",
          bloodGroup: user.bloodGroup ?? "",
          password: "",
          confirmPassword: "",
          imageFile: null,
          imagePath: user.image ?? "",
        });

        if (user.image) setPreview({ image: user.image });
      } catch (err) {
        console.error("Could not load profile:", err);
        setMessage({ type: "error", text: "Could not load profile" });
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [session, status, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleFileChange = (file) => {
    if (!file) return;
    setForm((s) => ({ ...s, imageFile: file }));
    setPreview((p) => ({ ...p, image: URL.createObjectURL(file) }));
  };

  async function uploadFile(file) {
    if (!file) return null;
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/user/upload", { method: "POST", body: fd });
    if (!res.ok) {
      let err;
      try {
        err = await res.json();
      } catch {
        err = { message: "Upload failed" };
      }
      throw new Error(err.message || "Upload failed");
    }
    const data = await res.json();
    if (!data?.path) throw new Error("Upload did not return path");
    return data.path;
  }

  const validate = () => {
    if (!form.name?.trim()) return "Name is required";
    if (!form.email?.trim()) return "Email is required";
    if (!form.phone?.trim()) return "Phone is required";
    if (form.age === "" || form.age === undefined) return "Age is required";
    if (!/^\d+$/.test(String(form.age))) return "Age must be a number";
    if (!form.bloodGroup?.trim()) return "Blood group is required";
    if (form.password || form.confirmPassword) {
      if (form.password !== form.confirmPassword) return "Passwords do not match";
      if (form.password.length > 0 && form.password.length < 8)
        return "Password must be at least 8 characters";
    }
    return null;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage(null);

    const v = validate();
    if (v) {
      setMessage({ type: "error", text: v });
      return;
    }

    setSaving(true);
    try {
      let uploadedImage = form.imagePath || "";

      if (form.imageFile) {
        uploadedImage = await uploadFile(form.imageFile);
      }

      const body = {
        name: form.name,
        phone: form.phone,
        age: Number(form.age),
        bloodGroup: form.bloodGroup,
        image: uploadedImage || undefined,
      };

      if (form.password) body.password = form.password;

      const res = await fetch("/api/user/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Update failed");

      setMessage({ type: "success", text: "Profile updated." });

      if (result.image) setPreview({ image: result.image });

      setForm((f) => ({
        ...f,
        imagePath: result.image ?? f.imagePath,
        password: "",
        confirmPassword: "",
      }));
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: err.message || "Failed to save" });
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center font-merriweather text-[#023E8A]">
        Loading profile…
      </div>
    );

  return (
    <div className="min-h-screen bg-[linear-gradient(to_bottom,#CAF0F8,#ADE8F4,#90E0EF)] p-6 font-merriweather">
      <div className="max-w-2xl mx-auto bg-white/90 p-8 rounded-2xl shadow-lg border border-[#48CAE4]/30">
        <h1 className="text-2xl font-bold text-[#023E8A] mb-4">Edit Profile — Patient</h1>

        {message && (
          <div
            className={`mb-4 p-3 rounded ${
              message.type === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSave} className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full name"
              className="p-3 rounded border border-[#48CAE4]"
              required
            />
            <input
              name="email"
              value={form.email}
              onChange={() => {}}
              placeholder="Email"
              className="p-3 rounded border border-[#48CAE4] bg-[#F8FCFF]"
              disabled
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="p-3 rounded border border-[#48CAE4]"
              required
            />
            <input
              name="age"
              type="number"
              value={form.age}
              onChange={handleChange}
              placeholder="Age"
              className="p-3 rounded border border-[#48CAE4]"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
            <input
              name="bloodGroup"
              value={form.bloodGroup}
              onChange={handleChange}
              placeholder="Blood group"
              className="p-3 rounded border border-[#48CAE4]"
              required
            />

            <div className="p-3 rounded border border-[#48CAE4] bg-[#F0FBFF]">
              <label className="block text-sm text-[#0077B6] font-semibold mb-2">Profile image</label>

              {/* Use ProfileImageUpload component (hidden native input inside component) */}
              <ProfileImageUpload
                value={preview.image}
                onFileSelect={(file) => {
                  if (!file) return;
                  setForm((s) => ({ ...s, imageFile: file }));
                  setPreview((p) => ({ ...p, image: URL.createObjectURL(file) }));
                }}
              />
            </div>
          </div>

          <div className="text-sm text-[#023E8A]">
            <strong>Note:</strong> If you signed in via Google, you do not need to set a password. Leave both password fields blank to keep your current credentials.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="New password (leave blank)"
              className="p-3 rounded border border-[#48CAE4]"
            />
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
              className="p-3 rounded border border-[#48CAE4]"
            />
          </div>

          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 rounded-full bg-[linear-gradient(to_right,#03045E,#0077B6,#00B4D8)] text-white"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
            <button type="button" onClick={() => router.back()} className="px-6 py-2 rounded-full bg-gray-200">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
