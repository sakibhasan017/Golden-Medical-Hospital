import { Phone, Mail, MapPin, Clock, MessageSquare, Shield } from 'lucide-react';

export default function HelplinePage() {
  const emergencyContacts = [
    { id: 1, name: 'Emergency Ambulance', number: '12345', available: '24/7' },
    { id: 2, name: 'Cardiac Emergency', number: '12346', available: '24/7' },
    { id: 3, name: 'Neurology Emergency', number: '12347', available: '24/7' },
    { id: 4, name: 'Pediatric Emergency', number: '12348', available: '24/7' },
  ];

  const supportContacts = [
    { id: 1, department: 'Appointment & Booking', number: '1800-123-456', email: 'appointment@goldenmedical.com' },
    { id: 2, department: 'Billing & Insurance', number: '1800-123-457', email: 'billing@goldenmedical.com' },
    { id: 3, department: 'Medical Records', number: '1800-123-458', email: 'records@goldenmedical.com' },
    { id: 4, department: 'Doctor Consultation', number: '1800-123-459', email: 'consultation@goldenmedical.com' },
    { id: 5, department: 'Ambulance Service', number: '1800-123-460', email: 'ambulance@goldenmedical.com' },
    { id: 6, department: 'General Inquiry', number: '1800-123-461', email: 'info@goldenmedical.com' },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-[#F0F9FF] to-[#E6F4FF]">
      {/* Hero Section */}
      <div className="bg-linear-to-r from-[#0077B6] to-[#00B4D8] text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="text-center">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Phone className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">24/7 Helpline & Support</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              We are here to help you 24 hours a day, 7 days a week. Contact us for emergencies, appointments, or any medical assistance.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Emergency Contacts */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#023E8A] mb-4">Emergency Contacts</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              In case of emergency, please contact immediately. Our emergency services are available 24/7.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {emergencyContacts.map((contact) => (
              <div
                key={contact.id}
                className="bg-white rounded-2xl border border-red-200 shadow-md hover:shadow-xl transition-all duration-300 p-6 text-center"
              >
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-[#023E8A] mb-2">{contact.name}</h3>
                <div className="mb-4">
                  <p className="text-2xl font-bold text-red-600">{contact.number}</p>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <Clock size={14} />
                  <span>{contact.available}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-red-50 border border-red-200 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <Shield className="w-6 h-6 text-red-600 mt-1" />
              <div>
                <h4 className="font-bold text-red-700 mb-2">Important Emergency Information</h4>
                <ul className="text-red-600 space-y-2">
                  <li>• Stay calm and provide clear information to the operator</li>
                  <li>• Mention your exact location and nature of emergency</li>
                  <li>• Follow the instructions given by the emergency operator</li>
                  <li>• Keep your phone line free after calling</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Support Contacts */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#023E8A] mb-4">Department Contacts</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Contact specific departments for non-emergency inquiries and support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {supportContacts.map((contact) => (
              <div
                key={contact.id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 p-6"
              >
                <h3 className="text-lg font-bold text-[#023E8A] mb-4">{contact.department}</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-[#0077B6]" />
                    <div>
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="font-semibold text-[#023E8A]">{contact.number}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-[#0077B6]" />
                    <div>
                      <p className="text-sm text-gray-500">Email Address</p>
                      <p className="font-semibold text-[#023E8A]">{contact.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hospital Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Hospital Location */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-2xl font-bold text-[#023E8A] mb-6">Hospital Location</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-6 h-6 text-[#0077B6] mt-1" />
                <div>
                  <h4 className="font-bold text-[#023E8A] mb-1">Main Hospital</h4>
                  <p className="text-gray-600">
                    123 Medical Street, Healthcare District<br />
                    Dhaka 1212, Bangladesh
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-6 h-6 text-[#0077B6] mt-1" />
                <div>
                  <h4 className="font-bold text-[#023E8A] mb-1">Visiting Hours</h4>
                  <p className="text-gray-600">
                    Monday - Friday: 8:00 AM - 8:00 PM<br />
                    Saturday - Sunday: 9:00 AM - 6:00 PM<br />
                    Emergency: 24/7
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Live Chat Support */}
          <div className="bg-linear-to-r from-[#023E8A] to-[#0077B6] rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare className="w-8 h-8" />
              <h3 className="text-2xl font-bold">Live Chat Support</h3>
            </div>
            <div className="space-y-4">
              <p className="text-white/90">
                Need immediate assistance? Chat with our support team in real-time.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Average response time: 2 minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Available: Monday - Sunday, 8:00 AM - 11:00 PM</span>
                </div>
              </div>
              <button className="w-full bg-white text-[#0077B6] font-semibold py-3 rounded-xl hover:bg-gray-100 transition duration-300 mt-4">
                Start Live Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}