'use client';
import React, { useState } from 'react';
import Image from 'next/image';

const DEPARTMENTS = [
  'Accident & Emergency',
  'Anesthesia and Pain Medicine',
  'Cancer Care Centre',
  'Cardiology Care Centre',
  'Cardiothoracic & Vascular Surgery',
  'Neurology',
  'Thoracic Surgery',
  'Nephrology',
  'Neurosurgery',
  'Kidney Transplant Program',
];

const SignUpPage=()=> {
  const [active, setActive] = useState('patient'); 
  const [patient, setPatient] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    bloodGroup: '',
    password: '',
    confirmPassword: '',
    image: null,
  });
  const [doctor, setDoctor] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    designation: '',
    department: '',
    bio: '',
    password: '',
    confirmPassword: '',
    image: null,
    certificate: null,
  });
  const [preview, setPreview] = useState({ patient: null, doctor: null });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkPasswordStrength = (password) => ({
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  });

  const handleChange = (e, type) => {
    const { name, value, files } = e.target;
    const state = type === 'patient' ? patient : doctor;
    const setState = type === 'patient' ? setPatient : setDoctor;
    const setPrev = (fileUrl) =>
      setPreview((prev) => ({ ...prev, [type]: fileUrl }));

    if (name === 'image' || name === 'certificate') {
      const file = files[0] || null;
      setState({ ...state, [name]: file });
      if (name === 'image') setPrev(file ? URL.createObjectURL(file) : null);
    } else {
      setState({ ...state, [name]: value });
    }
  };

  const validate = (data, type) => {
    const err = {};
    const strength = checkPasswordStrength(data.password);

    ['name', 'email', 'phone', 'age', 'password', 'confirmPassword'].forEach((f) => {
      if (!data[f]?.trim()) err[f] = `${f} is required`;
    });

    if (data.password !== data.confirmPassword)
      err.confirmPassword = 'Passwords do not match';

    const weak = Object.values(strength).some((v) => !v);
    if (weak) err.password = 'Password is not strong enough';

    if (type === 'patient' && !data.bloodGroup.trim())
      err.bloodGroup = 'Blood group is required';

    if (type === 'doctor') {
      ['designation', 'department'].forEach((f) => {
        if (!data[f]?.trim()) err[f] = `${f} is required`;
      });
      if (!data.certificate) err.certificate = 'Certificate is required';
    }

    return err;
  };

  const handleSubmit = async (e, type) => {
    e.preventDefault();
    const data = type === 'patient' ? patient : doctor;
    const err = validate(data, type);
    setErrors(err);
    if (Object.keys(err).length) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('role', type);
      Object.entries(data).forEach(([k, v]) => {
        if (v !== null) formData.append(k, v);
      });

      const res = await fetch('/api/auth/register', { method: 'POST', body: formData });
      const response = await res.json();
      if (!res.ok) throw new Error(response.message || 'Registration failed');

      setMessage({
        type: 'success',
        text:
          type === 'doctor'
            ? 'Doctor registered. Await admin verification.'
            : 'Patient registered successfully. Please check your email.',
      });
      if (type === 'patient') setPatient({ name:'', email:'', phone:'', age:'', bloodGroup:'', password:'', confirmPassword:'', image:null });
      else setDoctor({ name:'', email:'', phone:'', age:'', designation:'', department:'', bio:'', password:'', confirmPassword:'', image:null, certificate:null });
      setPreview({ patient:null, doctor:null });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const renderPasswordStrength = (password) => {
    const checks = checkPasswordStrength(password);
    const getColor = (valid) => (valid ? 'text-green-600' : 'text-red-500');
    return (
      <ul className="text-xs space-y-1 mt-2">
        <li className={getColor(checks.length)}>• At least 8 characters</li>
        <li className={getColor(checks.uppercase)}>• At least one uppercase letter</li>
        <li className={getColor(checks.lowercase)}>• At least one lowercase letter</li>
        <li className={getColor(checks.number)}>• At least one number</li>
        <li className={getColor(checks.special)}>• At least one special character</li>
      </ul>
    );
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-6 bg-[linear-gradient(to_bottom,#CAF0F8,#ADE8F4,#90E0EF)] font-merriweather">
      <div className="w-full max-w-5xl bg-white/80 p-8 rounded-3xl shadow-lg border border-[#00B4D8]/40">
        <header className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-[#03045E] mb-4">Create Account</h2>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setActive('patient')}
              className={`px-6 py-2 rounded-md font-semibold transition-all ${active === 'patient' ? 'bg-[#03045E] text-white' : 'bg-[#ADE8F4] text-[#03045E]'}`}
            >
              Register as Patient
            </button>
            <button
              onClick={() => setActive('doctor')}
              className={`px-6 py-2 rounded-md font-semibold transition-all ${active === 'doctor' ? 'bg-[#03045E] text-white' : 'bg-[#ADE8F4] text-[#03045E]'}`}
            >
              Register as Doctor
            </button>
          </div>
        </header>

        {message && (
          <div className={`mb-4 p-3 rounded-md text-center ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message.text}
          </div>
        )}

        {active === 'patient' && (
          <form onSubmit={(e) => handleSubmit(e, 'patient')} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="name" placeholder="Full Name *" value={patient.name} onChange={(e) => handleChange(e, 'patient')} className="p-2 border rounded-md" />
            <input name="email" type="email" placeholder="Email *" value={patient.email} onChange={(e) => handleChange(e, 'patient')} className="p-2 border rounded-md" />
            <input name="phone" placeholder="Phone *" value={patient.phone} onChange={(e) => handleChange(e, 'patient')} className="p-2 border rounded-md" />
            <input name="age" type="number" placeholder="Age *" value={patient.age} onChange={(e) => handleChange(e, 'patient')} className="p-2 border rounded-md" />
            <input name="bloodGroup" placeholder="Blood Group *" value={patient.bloodGroup} onChange={(e) => handleChange(e, 'patient')} className="p-2 border rounded-md" />

            <div className="md:col-span-2">
              <input name="password" type="password" placeholder="Password *" value={patient.password} onChange={(e) => handleChange(e, 'patient')} className="p-2 border rounded-md w-full" />
              {renderPasswordStrength(patient.password)}
            </div>
            <input name="confirmPassword" type="password" placeholder="Confirm Password *" value={patient.confirmPassword} onChange={(e) => handleChange(e, 'patient')} className="p-2 border rounded-md md:col-span-2" />

            <label className="md:col-span-2 text-sm font-medium text-[#0077B6]">
              Profile Image
              <div className="mt-1 bg-[#E0F7FA] border border-[#48CAE4] rounded-md p-2 text-center cursor-pointer hover:bg-[#CAF0F8]">
                <input name="image" type="file" accept="image/*" onChange={(e) => handleChange(e, 'patient')} className="w-full cursor-pointer" />
              </div>
            </label>
            {preview.patient && <Image src={preview.patient} alt="preview" width={100} height={100} className="rounded-md border" />}

            <button disabled={loading} type="submit" className="md:col-span-2 w-full bg-[linear-gradient(to_right,#03045E,#0077B6,#00B4D8)] text-white py-2 rounded-md font-semibold">
              {loading ? 'Registering...' : 'Register as Patient'}
            </button>
          </form>
        )}

        {active === 'doctor' && (
          <form onSubmit={(e) => handleSubmit(e, 'doctor')} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="name" placeholder="Full Name *" value={doctor.name} onChange={(e) => handleChange(e, 'doctor')} className="p-2 border rounded-md" />
            <input name="email" type="email" placeholder="Email *" value={doctor.email} onChange={(e) => handleChange(e, 'doctor')} className="p-2 border rounded-md" />
            <input name="phone" placeholder="Phone *" value={doctor.phone} onChange={(e) => handleChange(e, 'doctor')} className="p-2 border rounded-md" />
            <input name="age" type="number" placeholder="Age *" value={doctor.age} onChange={(e) => handleChange(e, 'doctor')} className="p-2 border rounded-md" />
            <input name="designation" placeholder="Designation *" value={doctor.designation} onChange={(e) => handleChange(e, 'doctor')} className="p-2 border rounded-md" />
            
            <select name="department" value={doctor.department} onChange={(e) => handleChange(e, 'doctor')} className="p-2 border rounded-md">
              <option value="">Select Department *</option>
              {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
            </select>

            <textarea name="bio" placeholder="Short Bio" rows={3} value={doctor.bio} onChange={(e) => handleChange(e, 'doctor')} className="p-2 border rounded-md md:col-span-2" />

            <div className="md:col-span-2">
              <input name="password" type="password" placeholder="Password *" value={doctor.password} onChange={(e) => handleChange(e, 'doctor')} className="p-2 border rounded-md w-full" />
              {renderPasswordStrength(doctor.password)}
            </div>
            <input name="confirmPassword" type="password" placeholder="Confirm Password *" value={doctor.confirmPassword} onChange={(e) => handleChange(e, 'doctor')} className="p-2 border rounded-md md:col-span-2" />

            <label className="text-sm font-medium text-[#0077B6] md:col-span-2">
              Upload Certificate (ZIP or PDF)
              <div className="mt-1 bg-[#E0F7FA] border border-[#48CAE4] rounded-md p-2 text-center cursor-pointer hover:bg-[#CAF0F8]">
                <input name="certificate" type="file" accept=".zip,.pdf" onChange={(e) => handleChange(e, 'doctor')} className="w-full cursor-pointer" />
              </div>
              <p className="text-xs text-gray-600 mt-1">Upload certifications (ZIP/PDF). Admin will verify credentials before activation.</p>
            </label>

            <label className="text-sm font-medium text-[#0077B6] md:col-span-2">
              Profile Image
              <div className="mt-1 bg-[#E0F7FA] border border-[#48CAE4] rounded-md p-2 text-center cursor-pointer hover:bg-[#CAF0F8]">
                <input name="image" type="file" accept="image/*" onChange={(e) => handleChange(e, 'doctor')} className="w-full cursor-pointer" />
              </div>
            </label>
            {preview.doctor && <Image src={preview.doctor} alt="preview" width={100} height={100} className="rounded-md border" />}

            <button disabled={loading} type="submit" className="md:col-span-2 w-full bg-[linear-gradient(to_right,#03045E,#0077B6,#00B4D8)] text-white py-2 rounded-md font-semibold">
              {loading ? 'Registering...' : 'Register as Doctor'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default SignUpPage
