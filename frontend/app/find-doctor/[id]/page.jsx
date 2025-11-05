'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

const doctorsData = [
  {
    id: 1,
    name: 'Dr. Ahsan Rahman',
    email: 'ahsan.rahman@example.com',
    phone: '01700000001',
    age: 45,
    designation: 'Senior Cardiologist',
    department: 'Cardiology Care Centre',
    bio: 'Over 15 years of experience in heart surgery and patient care.',
    image: '/doctor1.jpg',
  },
  {
    id: 2,
    name: 'Dr. Nusrat Alam',
    email: 'nusrat.alam@example.com',
    phone: '01700000002',
    age: 38,
    designation: 'Consultant Neurosurgeon',
    department: 'Neurosurgery',
    bio: 'Specialist in minimally invasive brain surgery techniques.',
    image: '/doctor2.jpg',
  },
  {
    id: 3,
    name: 'Dr. Rafi Khan',
    email: 'rafi.khan@example.com',
    phone: '01700000003',
    age: 40,
    designation: 'Nephrologist',
    department: 'Nephrology',
    bio: 'Expert in kidney transplant and renal failure treatment.',
    image: '/doctor3.jpg',
  },
  {
    id: 4,
    name: 'Dr. Sabiha Haque',
    email: 'sabiha.haque@example.com',
    phone: '01700000004',
    age: 35,
    designation: 'Oncologist',
    department: 'Cancer Care Centre',
    bio: 'Dedicated to personalized cancer treatment and chemotherapy management.',
    image: '/doctor4.jpg',
  },
];

const DoctorProfile = () => {
  const params = useParams();
  const doctorId = Number(params.id);
  const doctor = doctorsData.find((doc) => doc.id === doctorId);

  if (!doctor) {
    return (
      <div className="min-h-screen flex justify-center items-center text-xl text-red-500">
        Doctor not found.
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-[linear-gradient(to_bottom,#CAF0F8,#ADE8F4,#90E0EF)] py-16 px-6 md:px-20 font-merriweather text-[#03045E]">
      <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-10">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <Image
            src={doctor.image}
            alt={doctor.name}
            width={200}
            height={200}
            className="rounded-full border-4 border-[#00B4D8] shadow-lg object-cover"
          />
          <div>
            <h2 className="text-3xl font-bold text-[#023E8A] mb-2">{doctor.name}</h2>
            <p className="text-[#0077B6] font-semibold mb-1">{doctor.designation}</p>
            <p className="text-[#03045E]/80 mb-3">{doctor.department}</p>
            <p className="text-sm text-[#03045E]/80 mb-2"><strong>Email:</strong> {doctor.email}</p>
            <p className="text-sm text-[#03045E]/80 mb-2"><strong>Phone:</strong> {doctor.phone}</p>
            <p className="text-sm text-[#03045E]/80 mb-2"><strong>Age:</strong> {doctor.age}</p>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold text-[#023E8A] mb-2">About Doctor</h3>
          <p className="text-[#03045E]/80 leading-relaxed">{doctor.bio}</p>
        </div>

        <div className="flex justify-between mt-10">
          <Link
            href="/find-doctor"
            className="bg-[#023E8A] hover:bg-[#0077B6] text-white px-6 py-2 rounded-full transition duration-300"
          >
            ← Back to Doctors
          </Link>

          <Link href={`/appointment/${doctor.id}`}
            className="bg-[#0077B6] hover:bg-[#00B4D8] text-white px-6 py-2 rounded-full shadow-md transition duration-300"
          >
            Request Appointment
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DoctorProfile;
