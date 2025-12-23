import { connectDB } from "@/lib/db";
import Patient from "@/models/patient";
import Doctor from "@/models/doctor";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    await connectDB();

    const form = await request.formData();
    const role = form.get("role");
    const email = String((form.get("email") || "").trim()).toLowerCase();

    if (role === "patient") {
      // build a patient payload from form fields
      const payload = {
        name: form.get("name") || "",
        email,
        phone: form.get("phone") || "",
        age: form.get("age") ? Number(form.get("age")) : undefined,
        bloodGroup: form.get("bloodGroup") || "",
        image: form.get("image") ? form.get("image").name || "" : form.get("image") || "",
        profileComplete: true,
      };

      // find existing -> update, otherwise create
      let patient = await Patient.findOne({ email });
      if (patient) {
        Object.assign(patient, payload);
        await patient.save();
      } else {
        // create with placeholder password (for oauth users)
        const pw = await bcrypt.hash("oauth-patient", 10);
        patient = await Patient.create({ ...payload, password: pw });
      }

      return Response.json({ ok: true, role: "patient", profileComplete: true }, { status: 200 });
    }

    // doctor path (keep your existing doctor logic)...
    if (role === "doctor") {
      // ... your existing doctor handling (ensure you set profileComplete appropriately)
    }

    return Response.json({ error: "invalid_role" }, { status: 400 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "server_error" }, { status: 500 });
  }
}
