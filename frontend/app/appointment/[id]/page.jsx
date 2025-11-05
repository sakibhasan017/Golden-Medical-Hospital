'use client';
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

const doctorsData = [
  { id: 1, name: 'Dr. Ahsan Rahman', department: 'Cardiology Care Centre' },
  { id: 2, name: 'Dr. Nusrat Alam', department: 'Neurosurgery' },
  { id: 3, name: 'Dr. Rafi Khan', department: 'Nephrology' },
  { id: 4, name: 'Dr. Sabiha Haque', department: 'Cancer Care Centre' },
];

const AppointmentPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const doctor = doctorsData.find((d) => d.id === Number(id));

  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    patientName: '',
    email: '',
    phone: '',
    date: '',
    preferredTime: '',
    symptoms: '',
    message: '',
  });

  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Submitting...');

    if (!formData.date || !formData.preferredTime) {
      setStatus('Please select both date and preferred time.');
      return;
    }

    const requestedDateTimeISO = new Date(
      `${formData.date}T${formData.preferredTime}`
    ).toISOString();

    try {
      const response = await fetch('/api/appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          doctorId: id,
          doctorName: doctor?.name,
          department: doctor?.department,
          requestedDate: formData.date,
          requestedTime: formData.preferredTime,
          requestedDateTime: requestedDateTimeISO,
          status: 'pending',
        }),
      });

      if (response.ok) {
        setStatus('Appointment booked successfully!');
        setFormData({
          patientName: '',
          email: '',
          phone: '',
          date: '',
          preferredTime: '',
          symptoms: '',
          message: '',
        });
        setTimeout(() => router.push('/find-doctor'), 2000);
      } else {
        setStatus('Failed to book appointment. Please try again.');
      }
    } catch (error) {
      console.error(error);
      setStatus('Server error. Please try again later.');
    }
  };

  if (!doctor)
    return (
      <div className="min-h-screen flex justify-center items-center text-red-600 text-xl">
        Doctor not found.
      </div>
    );

  return (
    <section className="min-h-screen bg-[linear-gradient(to_bottom,#CAF0F8,#ADE8F4,#90E0EF)] py-16 px-6 md:px-20 font-merriweather text-[#03045E]">
      <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-10">
        <h1 className="text-3xl font-bold text-[#023E8A] mb-6 text-center">
          Book an Appointment
        </h1>

        <div className="bg-[#CAF0F8] rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-[#0077B6] mb-2">
            {doctor.name}
          </h2>
          <p className="text-[#03045E]/80">{doctor.department}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 font-semibold text-[#023E8A]">
              Full Name
            </label>
            <input
              type="text"
              name="patientName"
              required
              value={formData.patientName}
              onChange={handleChange}
              className="w-full p-3 border border-[#00B4D8]/40 rounded-lg outline-none focus:border-[#0077B6]"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-[#023E8A]">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-[#00B4D8]/40 rounded-lg outline-none focus:border-[#0077B6]"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-[#023E8A]">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 border border-[#00B4D8]/40 rounded-lg outline-none focus:border-[#0077B6]"
            />
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block mb-2 font-semibold text-[#023E8A]">
                Preferred Date
              </label>
              <input
                type="date"
                name="date"
                required
                min={today}
                value={formData.date}
                onChange={handleChange}
                className="w-full p-3 border border-[#00B4D8]/40 rounded-lg outline-none focus:border-[#0077B6]"
              />
            </div>

            <div className="flex-1">
              <label className="block mb-2 font-semibold text-[#023E8A]">
                Preferred Time
              </label>
              <input
                type="time"
                name="preferredTime"
                required
                value={formData.preferredTime}
                onChange={handleChange}
                className="w-full p-3 border border-[#00B4D8]/40 rounded-lg outline-none focus:border-[#0077B6]"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 font-semibold text-[#023E8A]">
              Symptoms
            </label>
            <input
              type="text"
              name="symptoms"
              placeholder="e.g., chest pain, headache"
              required
              value={formData.symptoms}
              onChange={handleChange}
              className="w-full p-3 border border-[#00B4D8]/40 rounded-lg outline-none focus:border-[#0077B6]"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-[#023E8A]">
              Additional Message (Optional)
            </label>
            <textarea
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              className="w-full p-3 border border-[#00B4D8]/40 rounded-lg outline-none focus:border-[#0077B6]"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-[#0077B6] hover:bg-[#00B4D8] text-white py-3 rounded-lg font-semibold shadow-md transition duration-300"
          >
            Submit Appointment
          </button>
        </form>

        {status && (
          <p className="text-center text-[#023E8A] font-medium mt-5">
            {status}
          </p>
        )}
      </div>
    </section>
  );
};

export default AppointmentPage;

