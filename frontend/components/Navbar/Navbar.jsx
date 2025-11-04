'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FaUserCircle, FaSearch, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(0);

  const links = [
    { id: 1, title: 'Home', url: '/' },
    { id: 2, title: 'About Us', url: '/about' },
    { id: 3, title: 'Specialists', url: '#' },
    { id: 4, title: 'Online Report', url: '/online-report' },
    { id: 5, title: 'Health Check', url: '/health-check' },
  ];

  const specialists = [
    'Accident & Emergency',
    'Anesthesia and Pain Medicine',
    'Cancer Care Centre',
    'Cardiology Care Centre',
    'Cardiothoracic & Vascular Surgery',
    'Neurology',
    'Thoracic Surgery',
    'Nephrology',
    'Neurosurgery',
    'Kidney Transplant Program',
  ];

  useEffect(() => {
    const footer = document.querySelector('footer');
    if (!footer) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setShowNavbar(!entry.isIntersecting);
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY.current) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      lastScrollY.current = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`w-full bg-[linear-gradient(to_right,#03045E,#0077B6,#00B4D8)] text-white shadow-lg font-merriweather sticky top-0 z-50 transition-transform duration-500 ${
        showNavbar ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="flex items-center justify-between px-6 py-3">
        <Link href="/" className="text-2xl font-bold tracking-wide text-[#CAF0F8]">
          Golden Medical
        </Link>

        <div className="hidden md:flex gap-6 text-base font-medium relative">
          {links.map((link) =>
            link.title === 'Specialists' ? (
              <div
                key={link.id}
                className="relative"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <button className="hover:text-[#90E0EF] transition-colors duration-300">
                  {link.title}
                </button>
                <div
                  className={`absolute top-8 left-0 bg-white text-[#03045E] rounded-lg shadow-xl p-3 grid grid-cols-2 gap-1 w-72 transform transition-all duration-300 origin-top ${
                    dropdownOpen
                      ? 'scale-100 opacity-100 visible'
                      : 'scale-95 opacity-0 invisible'
                  }`}
                >
                  {specialists.map((item, index) => (
                    <Link
                      key={index}
                      href="#"
                      className="text-sm hover:bg-[#ADE8F4] px-2 py-1 rounded-md transition-colors duration-200"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={link.id}
                href={link.url}
                className="hover:text-[#90E0EF] transition-colors duration-300"
              >
                {link.title}
              </Link>
            )
          )}
        </div>

        <Link href="/login" className="hidden md:flex items-center gap-2 bg-[#023E8A] hover:bg-[#0096C7] px-4 py-2 rounded-full transition duration-300">
          <FaUserCircle size={20} />
          <span>Login / Signup</span>
        </Link>

        <div className="flex md:hidden items-center gap-4">
          <button onClick={() => setMobileSearch(!mobileSearch)}>
            <FaSearch size={20} className="text-white" />
          </button>
          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="text-white text-2xl focus:outline-none"
          >
            {mobileMenu ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      <div className="hidden md:flex justify-center items-center py-3 bg-[#023E8A]">
        <div className="flex items-center bg-white rounded-full px-4 py-2 w-[50%] shadow-md">
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-transparent text-[#03045E] outline-none px-2 text-sm"
          />
          <FaSearch size={18} className="text-[#0077B6]" />
        </div>
      </div>

      {mobileSearch && (
        <div className="md:hidden bg-[#023E8A] py-3 px-5 animate-fade-in">
          <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-md">
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-transparent text-[#03045E] outline-none px-2 text-sm"
            />
            <FaSearch size={18} className="text-[#0077B6]" />
          </div>
        </div>
      )}

      {mobileMenu && (
        <div className="md:hidden flex flex-col bg-[#023E8A] px-6 py-4 space-y-3 animate-fade-in">
          {links.map((link) => (
            <Link
              key={link.id}
              href={link.url}
              className="text-[#CAF0F8] hover:text-[#90E0EF] transition"
              onClick={() => setMobileMenu(false)}
            >
              {link.title}
            </Link>
          ))}
          <button className="flex items-center justify-center gap-2 bg-[#0077B6] hover:bg-[#00B4D8] px-4 py-2 rounded-full text-sm font-semibold transition duration-300">
            <FaUserCircle size={18} />
            Login / Signup
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
