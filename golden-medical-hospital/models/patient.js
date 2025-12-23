import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  name: { type: String,required: true},
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  age: { type: Number, required: true },
  bloodGroup: { type: String, required: true },
  password: { type: String, required: true },
  image: { type: String },
  profileComplete: { type: Boolean, default: false },
});

const Patient = mongoose.models.Patient || mongoose.model("Patient", patientSchema);

export default Patient;