export default function DoctorWaiting() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[linear-gradient(to_bottom,#CAF0F8,#ADE8F4,#90E0EF)] font-merriweather p-6">
      <div className="max-w-2xl bg-white/90 p-8 rounded-xl shadow-lg text-center">
        <h2 className="text-2xl font-bold text-[#023E8A] mb-4">Registration Pending</h2>
        <p className="text-[#03045E]/80 mb-6">
          Thank you for completing your profile. Your registration is under review by our administration team.
          We will notify you via email once your account is verified. Meanwhile, you cannot access the doctor dashboard.
        </p>
        <p className="text-sm text-[#0077B6]">If you have any queries, contact support at <a href="mailto:info@goldenmedical.com" className="underline">info@goldenmedical.com</a>.</p>
      </div>
    </div>
  );
}
