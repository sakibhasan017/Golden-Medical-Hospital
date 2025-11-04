'use client';
import { FaUserEdit, FaHistory, FaFileMedical, FaStethoscope, FaNotesMedical, FaCalendarCheck } from 'react-icons/fa';
import Link from 'next/link';

const features = [
  {
    id: 1,
    title: 'Find a Doctor',
    desc: 'Search for specialists and schedule consultations.',
    icon: <FaStethoscope size={40} />,
    href: '#',
  },
  {
    id: 2,
    title: 'Book Appointment',
    desc: 'Book your appointment at your preferred time slot.',
    icon: <FaCalendarCheck size={40} />,
    href: '/find-doctor',
  },
  {
    id: 3,
    title: 'View Prescription',
    desc: 'Check and download your prescribed medications.',
    icon: <FaFileMedical size={40} />,
    href: '/prescriptions',
  },
  {
    id: 4,
    title: 'Online Report',
    desc: 'Access your lab and diagnostic test results anytime.',
    icon: <FaNotesMedical size={40} />,
    href: '#',
  },
  {
    id: 5,
    title: 'Previous History',
    desc: 'View your previous treatments and hospital visits.',
    icon: <FaHistory size={40} />,
    href: '#',
  },
  {
    id: 6,
    title: 'Edit Profile',
    desc: 'Update your personal information and contact details.',
    icon: <FaUserEdit size={40} />,
    href: '#',
  },
];

const PatientDashboard= ()=> {
  return (
    <section className="min-h-screen bg-[linear-gradient(to_bottom,#CAF0F8,#ADE8F4,#90E0EF)] text-[#03045E] font-merriweather py-16 px-6 md:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-[#023E8A] mb-3">
            Patient Dashboard
          </h1>
          <p className="text-lg text-[#03045E]/80">
            Manage your medical activities easily and securely.
          </p>
          <div className="w-24 h-1 bg-[#0077B6] mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Link
              key={feature.id}
              href={feature.href}
              className="bg-white/80 backdrop-blur-md rounded-2xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-xl hover:scale-[1.03] transition-all duration-300"
            >
              <div className="text-[#0077B6] mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-[#023E8A] mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-[#03045E]/80 mb-4">{feature.desc}</p>
              <span className="inline-block bg-[#0077B6] hover:bg-[#00B4D8] text-white text-sm font-semibold py-2 px-5 rounded-full shadow-md transition duration-300">
                Go to {feature.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PatientDashboard