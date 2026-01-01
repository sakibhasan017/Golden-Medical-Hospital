'use client';
import { FaUserMd, FaComments, FaClinicMedical, FaEnvelopeOpenText, FaBoxOpen } from 'react-icons/fa';
import Link from 'next/link';

const features = [
  {
    id: 1,
    title: 'New Doctor Requests',
    desc: 'View and approve newly registered doctors awaiting verification.',
    icon: <FaUserMd size={40} />,
    href: '/dashboard/admin/doctor-requests',
  },
  {
    id: 2,
    title: 'Patient Queries',
    desc: 'Check and respond to queries submitted by patients.',
    icon: <FaEnvelopeOpenText size={40} />,
    href: '/dashboard/admin/patient-queries',
  },
  {
    id: 3,
    title: 'Feedback & Reviews',
    desc: 'Monitor feedback and ratings shared by patients.',
    icon: <FaComments size={40} />,
    href: '/dashboard/admin/feedback',
  },
  {
    id: 4,
    title: 'Specialist Management',
    desc: 'Manage and oversee specialist departments.',
    icon: <FaClinicMedical size={40} />,
    href: '/dashboard/admin/specialists',
  },
  {
  id: 5, 
  title: 'Healthcheck Packages',
  desc: 'Manage health screening and checkup packages.',
  icon: <FaBoxOpen size={40} />, 
  href: '/dashboard/admin/health-checks',
  },
  
];

const AdminDashboard = () => {
  return (
    <section className="min-h-screen bg-[linear-gradient(to_bottom,#CAF0F8,#ADE8F4,#90E0EF)] text-[#03045E] font-merriweather py-16 px-6 md:px-20">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-[#023E8A] mb-3">
            Admin Dashboard
          </h1>
          <p className="text-lg text-[#03045E]/80">
            Manage doctors, monitor activities, and oversee system operations.
          </p>
          <div className="w-24 h-1 bg-[#0077B6] mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <Link
              key={feature.id}
              href={feature.href}
              className="bg-white/80 backdrop-blur-md rounded-2xl shadow-md p-6 flex flex-col justify-between text-center hover:shadow-xl hover:scale-[1.03] transition-all duration-300 h-full min-h-[260px]"
            >
              <div>
                <div className="text-[#0077B6] mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-[#023E8A] mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-[#03045E]/80 mb-6">
                  {feature.desc}
                </p>
              </div>

              <div className="mt-auto">
                <span className="inline-block bg-[#0077B6] hover:bg-[#00B4D8] text-white text-sm font-semibold py-2 px-5 rounded-full shadow-md transition duration-300">
                  View Details
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;
