import mongoose from "mongoose";

const healthcheckSchema = new mongoose.Schema({
  title: {type: String, required: true, unique: true},
  description: {type: String, required: true},
  tests: [{type: String, required: true}],
  price: {type: Number, required: true},
});
const Healthcheck = mongoose.models.Healthcheck || mongoose.model("Healthcheck", healthcheckSchema);
export default Healthcheck;