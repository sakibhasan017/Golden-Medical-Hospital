import mongoose from "mongoose";

const specialistSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  doctorList: [{ type: mongoose.Schema.Types.ObjectId, ref: "Doctor" }],
  contact: { type: String, required: true },
});

const Specialist = mongoose.models.Specialist || mongoose.model("Specialist", specialistSchema);

export default Specialist;