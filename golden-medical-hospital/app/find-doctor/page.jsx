'use client';
import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

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

export default function FindDoctor() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All Departments');
  const [designation, setDesignation] = useState('All Designations');
  const [ageRange, setAgeRange] = useState('All');

  useEffect(() => {
    const ac = new AbortController();
    const signal = ac.signal;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch('/api/doctors', { signal });

        if (!res.ok) {
          let body = null;
          try {
            body = await res.json();
          } catch (_) {
            
          }
          const msg = (body && (body.message || body.error)) || `Failed to load doctors (${res.status})`;
          throw new Error(msg);
        }

        const data = await res.json();

        const normalized = (Array.isArray(data) ? data : []).map((d) => ({
          id: d._id ?? d.id ?? String(Math.random()),
          name: d.name ?? 'Unknown',
          email: d.email ?? '',
          phone: d.phone ?? '',
          age: d.age ?? d.Age ?? null,
          designation: d.designation ?? d.Designation ?? '',
          department: d.department ?? d.Department ?? '',
          bio: d.bio ?? d.Bio ?? '',
          image: d.image ?? '/placeholder-doctor.png',
          status: d.status ?? 'pending',
          certificate: d.certificate ?? '',
        }));

        if (!signal.aborted) {
          setDoctors(normalized);
        }
      } catch (err) {
        if (!signal.aborted) {
          console.error('Load doctors error', err);
          setError(err.message || 'Failed to load doctors');
          setDoctors([]);
        }
      } finally {
        if (!signal.aborted) setLoading(false);
      }
    };

    load();

    return () => ac.abort();
  }, []);

  const filteredDoctors = useMemo(() => {
    if (!doctors || doctors.length === 0) return [];

    const q = search.trim().toLowerCase();

    return doctors.filter((doc) => {
      const matchSearch =
        !q ||
        (doc.name && doc.name.toLowerCase().includes(q)) ||
        (doc.designation && doc.designation.toLowerCase().includes(q)) ||
        (doc.bio && doc.bio.toLowerCase().includes(q));

      const matchDept = department === 'All Departments' || doc.department === department;
      const matchDesignation =
        designation === 'All Designations' ||
        (doc.designation && doc.designation.toLowerCase().includes(designation.toLowerCase()));

      const matchAge =
        ageRange === 'All' ||
        (ageRange === 'Under 35' && doc.age && doc.age < 35) ||
        (ageRange === '35–45' && doc.age && doc.age >= 35 && doc.age <= 45) ||
        (ageRange === '45+' && doc.age && doc.age > 45);

      return matchSearch && matchDept && matchDesignation && matchAge;
    });
  }, [doctors, search, department, designation, ageRange]);

  return (
    <section className="min-h-screen bg-[linear-gradient(to_bottom,#CAF0F8,#ADE8F4,#90E0EF)] py-16 px-6 md:px-20 font-merriweather text-[#03045E]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-bold text-[#023E8A] mb-2">Find a Doctor</h1>
          <p className="text-lg text-[#03045E]/80">Search and filter to find the right specialist for your care.</p>
          <div className="w-24 h-1 bg-[#0077B6] mx-auto mt-4 rounded-full" />
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
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          <select
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            className="p-3 border border-[#00B4D8]/40 rounded-lg outline-none focus:border-[#0077B6]"
          >
            {DESIGNATIONS.map((desig) => (
              <option key={desig} value={desig}>
                {desig}
              </option>
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

        {loading ? (
          <div className="text-center text-[#023E8A]">Loading doctors…</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : filteredDoctors.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDoctors.map((doc) => (
              <div
                key={doc.id}
                className="bg-white/80 backdrop-blur-md rounded-2xl shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex flex-col text-center p-6"
              >
                <div className="flex justify-center mb-4">
                  <Image
                    src={doc.image || '/placeholder-doctor.png'}
                    alt={doc.name}
                    width={120}
                    height={120}
                    className="rounded-full border-4 border-[#00B4D8] shadow-md object-cover"
                    unoptimized
                  />
                </div>

                <h3 className="text-xl font-bold text-[#023E8A] mb-1">{doc.name}</h3>
                <p className="text-sm text-[#0077B6] font-semibold mb-1">{doc.designation}</p>
                <p className="text-sm text-[#03045E]/80 mb-2">{doc.department}</p>
                <p className="text-xs text-[#03045E]/60 mb-6 line-clamp-2">{doc.bio}</p>

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
          <p className="text-center text-[#03045E]/70 mt-10">No doctors found. Try adjusting your filters.</p>
        )}
      </div>
    </section>
  );
}
