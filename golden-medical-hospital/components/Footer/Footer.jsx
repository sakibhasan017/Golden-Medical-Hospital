import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-[linear-gradient(to_right,#03045E,#0077B6,#00B4D8)] text-white font-merriweather">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        
        <div>
          <h3 className="text-xl font-bold mb-4 text-[#ADE8F4]">Golden Medical</h3>
          <p className="text-sm leading-relaxed text-[#CAF0F8]">
            Providing world-class healthcare with compassion and innovation. Your health, our priority always.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-[#ADE8F4]">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-[#90E0EF] transition">Home</Link></li>
            <li><Link href="/about" className="hover:text-[#90E0EF] transition">About Us</Link></li>
            <li><Link href="/health-checks" className="hover:text-[#90E0EF] transition">Health Check</Link></li>
            <li><Link href="/online-report" className="hover:text-[#90E0EF] transition">Online Report</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-[#ADE8F4]">Contact Us</h3>
          <ul className="space-y-3 text-sm text-[#CAF0F8]">
            <li className="flex items-start gap-2">
              <FaMapMarkerAlt className="text-[#90E0EF] mt-1" />
              <span>75/B, Shobujhbag, Savar, Dhaka, Bangladesh</span>
            </li>
            <li className="flex items-center gap-2">
              <FaPhoneAlt className="text-[#90E0EF]" />
              <span>+880 1601215756</span>
            </li>
            <li className="flex items-center gap-2">
              <FaEnvelope className="text-[#90E0EF]" />
              <span>info@goldenmedical.com</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-[#ADE8F4]">Follow Us</h3>
          <div className="flex gap-4">
            <a href="https://www.facebook.com/GoldenBoySakibb" className="bg-[#0077B6] hover:bg-[#00B4D8] p-3 rounded-full transition">
              <FaFacebookF size={18} />
            </a>
            <a href="https://x.com/SakibHasan6067" className="bg-[#0077B6] hover:bg-[#00B4D8] p-3 rounded-full transition">
              <FaTwitter size={18} />
            </a>
            <a href="https://www.instagram.com/_goldensakib/" className="bg-[#0077B6] hover:bg-[#00B4D8] p-3 rounded-full transition">
              <FaInstagram size={18} />
            </a>
            <a href="https://www.linkedin.com/in/sakib-hasan-46954b316/" className="bg-[#0077B6] hover:bg-[#00B4D8] p-3 rounded-full transition">
              <FaLinkedinIn size={18} />
            </a>
          </div>
        </div>
      </div>

      <div className="bg-[#023E8A] py-4 text-center text-sm text-[#CAF0F8] border-t border-[#0077B6]/50">
        © 2025 <span className="font-semibold text-[#ADE8F4]">Golden Medical</span>. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
