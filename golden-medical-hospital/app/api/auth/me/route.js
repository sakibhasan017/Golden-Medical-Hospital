import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Patient from "@/models/patient";
import Doctor from "@/models/doctor";

/** escape regex utility (avoid injection when building regex from user email) */
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET() {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return Response.json({ authenticated: false }, { status: 200 });
    }

    const rawEmail = String(session.user.email).trim();
    const emailRegex = new RegExp(`^${escapeRegExp(rawEmail)}$`, "i");

    // 1) Try patient (case-insensitive)
    const patient = await Patient.findOne({ email: emailRegex }).select("-password").lean();
    if (patient) {
      const profileComplete = !!(
        patient.profileComplete === true ||
        patient.profileComplete === "true" ||
        (patient.profileComplete && String(patient.profileComplete).toLowerCase() === "true")
      );

      const user = {
        id: patient._id,
        name: patient.name,
        email: patient.email,
        phone: patient.phone,
        age: patient.age,
        bloodGroup: patient.bloodGroup,
        image: patient.image || null,
        profileComplete,
      };

      return Response.json({
        authenticated: true,
        registered: true,
        profileComplete,
        role: "patient",
        user,
        sessionUser: session.user,
      }, { status: 200 });
    }

    // 2) Try doctor (case-insensitive)
    const doctor = await Doctor.findOne({ email: emailRegex }).select("-password").lean();
    if (doctor) {
      const profileComplete = !!(
        doctor.profileComplete === true ||
        doctor.profileComplete === "true" ||
        (doctor.profileComplete && String(doctor.profileComplete).toLowerCase() === "true")
      );

      const user = {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        phone: doctor.phone,
        designation: doctor.designation || doctor.Designation || "",
        department: doctor.department || doctor.Department || "",
        bio: doctor.bio || doctor.Bio || "",
        image: doctor.image || null,
        certificate: doctor.certificate || null,
        status: doctor.status || "pending",
        profileComplete,
      };

      return Response.json({
        authenticated: true,
        registered: true,
        profileComplete,
        role: "doctor",
        user,
        sessionUser: session.user,
      }, { status: 200 });
    }

    // Not in DB -> first-time oauth user
    return Response.json({
      authenticated: true,
      registered: false,
      profileComplete: false,
      sessionUser: session.user,
    }, { status: 200 });

  } catch (error) {
    console.error("Error in /api/auth/me:", error);
    return Response.json({ authenticated: false, error: "server_error" }, { status: 500 });
  }
}
