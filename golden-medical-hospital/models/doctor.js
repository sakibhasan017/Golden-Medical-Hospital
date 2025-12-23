import { Biohazard } from "lucide-react";
import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  designation: { type: String, required: true },
  department: { type: String, required: true },
  bio: { type: String, required: true },
  password: { type: String, required: true },
  certificate: { type: String, required: true },
  image: { type: String },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  profileComplete: { type: Boolean, default: true },
});

const Doctor = mongoose.models.Doctor || mongoose.model("Doctor", doctorSchema);

export default Doctor;