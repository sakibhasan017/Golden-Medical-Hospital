import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import Appointment from '@/models/appointment';

export async function GET(_, { params }) {
  try {
    await connectDB();
    const { id } = params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) return NextResponse.json({ message: 'Invalid id' }, { status: 400 });

    const appts = await Appointment.find({ patientId: id }).sort({ preferredDate: -1 }).lean();
    const mapped = appts.map(a => ({
      id: a._id.toString(),
      doctorId: a.doctorId?.toString(),
      name: a.name,
      email: a.email,
      phone: a.phone,
      preferredDate: a.preferredDate,
      preferredTime: a.preferredTime,
      status: a.status,
      symptoms: a.symptoms,
    }));
    return NextResponse.json(mapped);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Failed' }, { status: 500 });
  }
}
