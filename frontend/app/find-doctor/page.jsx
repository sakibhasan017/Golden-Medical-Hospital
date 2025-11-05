'use client';
import React, { useState } from 'react';
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

const DEPARTMENTS = [
  'All Departments',
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

const DESIGNATIONS = [
  'All Designations',
  'Consultant',
  'Senior Consultant',
  'Specialist',
  'Junior Doctor',
  'Resident',
  'Professor',
];

const FindDoctor = () => {
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All Departments');
  const [designation, setDesignation] = useState('All Designations');
  const [ageRange, setAgeRange] = useState('All');

  const filteredDoctors = doctorsData.filter((doc) => {
    const matchSearch =
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.designation.toLowerCase().includes(search.toLowerCase()) ||
      doc.bio.toLowerCase().includes(search.toLowerCase());

    const matchDept =
      department === 'All Departments' || doc.department === department;

    const matchDesignation =
      designation === 'All Designations' ||
      doc.designation.toLowerCase().includes(designation.toLowerCase());

    const matchAge =
      ageRange === 'All' ||
      (ageRange === 'Under 35' && doc.age < 35) ||
      (ageRange === '35–45' && doc.age >= 35 && doc.age <= 45) ||
      (ageRange === '45+' && doc.age > 45);

    return matchSearch && matchDept && matchDesignation && matchAge;
  });

  return (
    <section className="min-h-screen bg-[linear-gradient(to_bottom,#CAF0F8,#ADE8F4,#90E0EF)] py-16 px-6 md:px-20 font-merriweather text-[#03045E]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-bold text-[#023E8A] mb-2">
            Find a Doctor
          </h1>
          <p className="text-lg text-[#03045E]/80">
            Search and filter to find the right specialist for your care.
          </p>
          <div className="w-24 h-1 bg-[#0077B6] mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="bg-white/70 backdrop-blur-md shadow-md rounded-2xl p-6 mb-10 grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search by name, designation, or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-3 border border-[#00B4D8]/40 rounded-lg outline-none focus:border-[#0077B6]"
          />

          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="p-3 border border-[#00B4D8]/40 rounded-lg outline-none focus:border-[#0077B6]"
          >
            {DEPARTMENTS.map((dept) => (
              <option key={dept}>{dept}</option>
            ))}
          </select>

          <select
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            className="p-3 border border-[#00B4D8]/40 rounded-lg outline-none focus:border-[#0077B6]"
          >
            {DESIGNATIONS.map((desig) => (
              <option key={desig}>{desig}</option>
            ))}
          </select>

          <select
            value={ageRange}
            onChange={(e) => setAgeRange(e.target.value)}
            className="p-3 border border-[#00B4D8]/40 rounded-lg outline-none focus:border-[#0077B6]"
          >
            <option>All</option>
            <option>Under 35</option>
            <option>35–45</option>
            <option>45+</option>
          </select>
        </div>

        {filteredDoctors.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDoctors.map((doc) => (
              <div
                key={doc.id}
                className="bg-white/80 backdrop-blur-md rounded-2xl shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex flex-col text-center p-6"
              >
                <div className="flex justify-center mb-4">
                  <Image
                    src={doc.image}
                    alt={doc.name}
                    width={120}
                    height={120}
                    className="rounded-full border-4 border-[#00B4D8] shadow-md object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-[#023E8A] mb-1">
                  {doc.name}
                </h3>
                <p className="text-sm text-[#0077B6] font-semibold mb-1">
                  {doc.designation}
                </p>
                <p className="text-sm text-[#03045E]/80 mb-2">
                  {doc.department}
                </p>
                <p className="text-xs text-[#03045E]/60 mb-6 line-clamp-2">
                  {doc.bio}
                </p>

                <Link
                  href={`/find-doctor/${doc.id}`}
                  className="mt-auto bg-[#0077B6] hover:bg-[#00B4D8] text-white text-sm font-semibold py-2 px-6 rounded-full shadow-md transition duration-300"
                >
                  View Profile
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-[#03045E]/70 mt-10">
            No doctors found. Try adjusting your filters.
          </p>
        )}
      </div>
    </section>
  );
};

export default FindDoctor;
