import mongoose from "mongoose";

const querySchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Query = mongoose.models.Query || mongoose.model("Query", querySchema);

export default Query;