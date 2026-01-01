import { 
  Users, 
  Clock, 
  MapPin, 
  FileText, 
  Shield, 
  Heart,
  Building,
  Coffee,
  ParkingCircle,
  Wifi,
  DollarSign,
  Phone,
  HelpCircle
} from 'lucide-react';

export default function PatientsVisitorsGuidePage() {
  const visitingHours = [
    { day: 'Monday - Friday', time: '8:00 AM - 8:00 PM', type: 'General' },
    { day: 'Saturday', time: '9:00 AM - 6:00 PM', type: 'General' },
    { day: 'Sunday', time: '9:00 AM - 4:00 PM', type: 'General' },
    { day: 'Emergency', time: '24 Hours', type: 'Emergency' },
    { day: 'ICU/CCU', time: '10:00 AM - 12:00 PM & 4:00 PM - 6:00 PM', type: 'Restricted' },
  ];

  const facilities = [
    { id: 1, name: 'Free Wi-Fi', icon: <Wifi />, description: 'High-speed internet throughout the hospital' },
    { id: 2, name: 'Parking', icon: <ParkingCircle />, description: 'Free parking for patients and visitors' },
    { id: 3, name: 'Cafeteria', icon: <Coffee />, description: '24/7 cafeteria with healthy food options' },
    { id: 4, name: 'ATM & Banking', icon: <DollarSign />, description: 'ATM machines and banking services' },
    { id: 5, name: 'Prayer Room', icon: <Heart />, description: 'Multi-faith prayer rooms available' },
    { id: 6, name: 'Information Desk', icon: <HelpCircle />, description: '24/7 help desk for guidance' },
  ];

  const preparationTips = [
    'Bring your previous medical records and reports',
    'Carry valid ID proof and insurance documents',
    'List of current medications with dosages',
    'Emergency contact information',
    'Comfortable clothing for overnight stay',
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-[#F0F9FF] to-[#E6F4FF]">
      {/* Hero Section */}
      <div className="bg-linear-to-r from-[#0077B6] to-[#00B4D8] text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="text-center">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Users className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Patients & Visitors Guide</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Everything you need to know for your visit to Golden Medical. Your comfort and convenience are our priority.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-2/3">
              <h2 className="text-3xl font-bold text-[#023E8A] mb-4">Welcome to Golden Medical</h2>
              <p className="text-gray-600 mb-4">
                We understand that visiting a hospital can be overwhelming. This guide is designed to help you navigate our facilities and make your visit as comfortable as possible.
              </p>
              <p className="text-gray-600">
                Our patient-centered approach ensures that you receive not only the best medical care but also a supportive environment throughout your healing journey.
              </p>
            </div>
            <div className="md:w-1/3">
              <div className="bg-blue-50 rounded-2xl p-6 text-center">
                <Phone className="w-12 h-12 text-[#0077B6] mx-auto mb-4" />
                <p className="text-lg font-bold text-[#023E8A] mb-2">Need Immediate Help?</p>
                <p className="text-gray-600 mb-4">Call our 24/7 helpline</p>
                <p className="text-2xl font-bold text-[#0077B6]">12345</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-linear-to-r from-[#023E8A] to-[#0077B6] text-white rounded-2xl p-6">
            <Clock className="w-8 h-8 mb-4" />
            <h3 className="text-xl font-bold mb-2">Visiting Hours</h3>
            <p className="text-white/90 text-sm">Check when you can visit patients</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition duration-300">
            <MapPin className="w-8 h-8 text-[#0077B6] mb-4" />
            <h3 className="text-xl font-bold text-[#023E8A] mb-2">Hospital Map</h3>
            <p className="text-gray-600 text-sm">Navigate our facilities easily</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition duration-300">
            <FileText className="w-8 h-8 text-[#0077B6] mb-4" />
            <h3 className="text-xl font-bold text-[#023E8A] mb-2">Admission Process</h3>
            <p className="text-gray-600 text-sm">Step-by-step admission guide</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition duration-300">
            <Shield className="w-8 h-8 text-[#0077B6] mb-4" />
            <h3 className="text-xl font-bold text-[#023E8A] mb-2">Safety Guidelines</h3>
            <p className="text-gray-600 text-sm">COVID-19 & general safety rules</p>
          </div>
        </div>

        {/* Visiting Hours Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-[#023E8A] mb-6 text-center">Visiting Hours</h2>
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
              {visitingHours.map((item, index) => (
                <div 
                  key={index} 
                  className={`p-6 border-r border-gray-200 ${index === visitingHours.length - 1 ? '' : ''} ${
                    item.type === 'Emergency' ? 'bg-red-50' : 
                    item.type === 'Restricted' ? 'bg-yellow-50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-[#023E8A]">{item.day}</h3>
                    {item.type === 'Emergency' && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                        Emergency
                      </span>
                    )}
                    {item.type === 'Restricted' && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                        Restricted
                      </span>
                    )}
                  </div>
                  <p className="text-2xl font-bold text-gray-800">{item.time}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {item.type === 'Emergency' ? 'Available 24/7 for critical cases' :
                     item.type === 'Restricted' ? 'Limited visiting hours for patient safety' :
                     'General visiting hours for all patients'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Facilities Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-[#023E8A] mb-6 text-center">Hospital Facilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map((facility) => (
              <div
                key={facility.id}
                className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition duration-300"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-[#0077B6]">
                  {facility.icon}
                </div>
                <h3 className="text-xl font-bold text-[#023E8A] mb-2">{facility.name}</h3>
                <p className="text-gray-600">{facility.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Before Your Visit */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-[#023E8A] mb-6">Before Your Visit</h2>
            <div className="space-y-4">
              <h3 className="font-bold text-[#023E8A] mb-2">What to Bring:</h3>
              <ul className="space-y-2">
                {preparationTips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-1 shrink-0">
                      <Heart className="w-3 h-3 text-[#0077B6]" />
                    </div>
                    <span className="text-gray-600">{tip}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                <h4 className="font-bold text-[#023E8A] mb-2">Appointment Tips</h4>
                <p className="text-gray-600 text-sm">
                  • Arrive 15 minutes before your appointment time<br />
                  • Check-in at the reception with your appointment slip<br />
                  • Inform staff of any special requirements or accessibility needs
                </p>
              </div>
            </div>
          </div>

          {/* During Your Stay */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-[#023E8A] mb-6">During Your Stay</h2>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-xl">
                <h4 className="font-bold text-green-800 mb-2">Patient Rights</h4>
                <ul className="text-green-700 text-sm space-y-1">
                  <li>• Right to receive respectful care</li>
                  <li>• Right to privacy and confidentiality</li>
                  <li>• Right to informed consent</li>
                  <li>• Right to access medical records</li>
                </ul>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-xl">
                <h4 className="font-bold text-purple-800 mb-2">Visitor Guidelines</h4>
                <ul className="text-purple-700 text-sm space-y-1">
                  <li>• Maximum 2 visitors per patient at a time</li>
                  <li>• Maintain quiet environment in patient areas</li>
                  <li>• Follow hand hygiene protocols</li>
                  <li>• No smoking anywhere on hospital premises</li>
                </ul>
              </div>
              
              <div className="p-4 bg-yellow-50 rounded-xl">
                <h4 className="font-bold text-yellow-800 mb-2">Payment & Insurance</h4>
                <p className="text-yellow-700 text-sm">
                  We accept all major insurance providers. Please bring your insurance card and any authorization forms. Cash, credit cards, and mobile payments are accepted.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Information */}
        <div className="mt-8 bg-linear-to-r from-[#023E8A] to-[#0077B6] rounded-2xl p-8 text-white">
          <div className="text-center">
            <Building className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Emergency Protocols</h2>
            <p className="text-white/90 max-w-3xl mx-auto mb-6">
              In case of emergency within the hospital premises, please follow these steps:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h4 className="font-bold text-lg mb-2">Stay Calm</h4>
                <p className="text-white/80 text-sm">Alert the nearest staff member immediately</p>
              </div>
              <div className="text-center p-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <h4 className="font-bold text-lg mb-2">Call Emergency</h4>
                <p className="text-white/80 text-sm">Dial extension 555 or use emergency call points</p>
              </div>
              <div className="text-center p-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h4 className="font-bold text-lg mb-2">Follow Instructions</h4>
                <p className="text-white/80 text-sm">Cooperate with emergency response team</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}