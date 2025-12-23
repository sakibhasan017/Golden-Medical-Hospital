import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db.js';
import Doctor from '@/models/doctor';

function calculateAge(dob) {
  if (!dob) return null;
  const diff = Date.now() - new Date(dob).getTime();
  return new Date(diff).getUTCFullYear() - 1970;
}

export async function GET() {
  try {
    await connectDB();

    const doctors = await Doctor.find({ status: 'approved' }).sort({ name: 1 });

    const formatted = doctors.map((d) => ({
      id: d._id.toString(),
      name: d.name,
      email: d.email,
      phone: d.phone,
      designation: d.designation,
      department: d.department,
      bio: d.bio,
      image: d.image || '/placeholder-doctor.png',
      age: calculateAge(d.dob), 
    }));

    return NextResponse.json(formatted);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: 'Failed to load doctors' },
      { status: 500 }
    );
  }
}
