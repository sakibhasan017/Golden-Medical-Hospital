'use client';
import React, { useState } from 'react';
import { FaCamera } from 'react-icons/fa';
import Image from 'next/image';

const DoctorEditProfile = () => {
  const [form, setForm] = useState({
    name: 'Dr. Ahsan Rahman',
    email: 'ahsan.rahman@example.com',
    phone: '01700000001',
    age: '45',
    designation: 'Senior Cardiologist',
    department: 'Cardiology Care Centre',
    bio: 'Over 15 years of experience in heart surgery and patient care.',
  });

  const [profileImage, setProfileImage] = useState('/default-doctor.jpg');
  const [preview, setPreview] = useState(profileImage);
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setStatus('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imgUrl = URL.createObjectURL(file);
      setPreview(imgUrl);
      setProfileImage(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('✅ Profile updated successfully!');
    
  };

  return (
    <section className="min-h-screen bg-[linear-gradient(to_bottom,#CAF0F8,#ADE8F4,#90E0EF)] py-16 px-6 md:px-20 font-merriweather text-[#03045E]">
      <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-md rounded-2xl shadow-md p-8">
        <h2 className="text-3xl font-bold text-[#023E8A] mb-6 text-center">
          Edit Profile
        </h2>

        <div className="flex flex-col items-center mb-8 relative">
          <div className="relative w-32 h-32">
            <Image
              src={preview}
              alt="Doctor profile"
              width={128} 
              height={128} 
              className="w-32 h-32 object-cover rounded-full border-4 border-[#00B4D8] shadow-md"
            />
            <label
              htmlFor="imageUpload"
              className="absolute bottom-0 right-0 bg-[#0077B6] hover:bg-[#00B4D8] text-white p-2 rounded-full cursor-pointer shadow-md transition"
              title="Change photo"
            >
              <FaCamera size={18} />
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>
          <p className="text-sm text-[#03045E]/70 mt-3">
            Click the camera icon to change your photo
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="p-3 border border-[#00B4D8]/40 rounded-md outline-none focus:border-[#0077B6]"
            placeholder="Full Name"
          />
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="p-3 border border-[#00B4D8]/40 rounded-md outline-none focus:border-[#0077B6]"
            placeholder="Email"
          />
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="p-3 border border-[#00B4D8]/40 rounded-md outline-none focus:border-[#0077B6]"
            placeholder="Phone"
          />
          <input
            name="age"
            value={form.age}
            onChange={handleChange}
            className="p-3 border border-[#00B4D8]/40 rounded-md outline-none focus:border-[#0077B6]"
            placeholder="Age"
            type="number"
          />
          <input
            name="designation"
            value={form.designation}
            onChange={handleChange}
            className="p-3 border border-[#00B4D8]/40 rounded-md outline-none focus:border-[#0077B6]"
            placeholder="Designation"
          />
          <input
            name="department"
            value={form.department}
            onChange={handleChange}
            className="p-3 border border-[#00B4D8]/40 rounded-md outline-none focus:border-[#0077B6]"
            placeholder="Department"
          />

          <textarea
            name="bio"
            rows={3}
            value={form.bio}
            onChange={handleChange}
            className="md:col-span-2 p-3 border border-[#00B4D8]/40 rounded-md outline-none focus:border-[#0077B6]"
            placeholder="Short Bio"
          />

          <button
            type="submit"
            className="md:col-span-2 bg-[linear-gradient(to_right,#03045E,#0077B6,#00B4D8)] text-white py-3 rounded-md font-semibold transition duration-300 hover:scale-[1.02] focus:ring-2 focus:ring-[#00B4D8]/40"
          >
            Save Changes
          </button>
        </form>

        {status && (
          <p className="text-center mt-6 text-[#0077B6] font-semibold animate-fade-in">
            {status}
          </p>
        )}
      </div>
    </section>
  );
};

export default DoctorEditProfile;
