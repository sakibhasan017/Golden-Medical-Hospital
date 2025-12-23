'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FaUserCircle, FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import { useSession, signOut } from 'next-auth/react';

const Navbar = () => {
  const { data: session } = useSession();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(0);
  const profileRef = useRef(null);

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

  const dashboardLink =
    session?.user?.role === 'admin'
      ? '/dashboard/admin'
      : session?.user?.role === 'doctor'
      ? '/dashboard/doctor'
      : '/dashboard/patient';

  /* Hide navbar near footer */
  useEffect(() => {
    const footer = document.querySelector('footer');
    if (!footer) return;

    const observer = new IntersectionObserver(
      (entries) => setShowNavbar(!entries[0].isIntersecting),
      { threshold: 0.1 }
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  /* Scroll hide/show */
  useEffect(() => {
    const handleScroll = () => {
      setShowNavbar(window.scrollY < lastScrollY.current);
      lastScrollY.current = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* Close profile dropdown when clicking outside or pressing Escape */
  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    const handleKey = (e) => {
      if (e.key === 'Escape') setProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  return (
    <nav
      className={`w-full bg-[linear-gradient(to_right,#03045E,#0077B6,#00B4D8)] text-white shadow-lg sticky top-0 z-50 transition-transform duration-500 ${
        showNavbar ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="flex items-center justify-between px-6 py-3">
        <Link href="/" className="text-2xl font-bold text-[#CAF0F8]">
          Golden Medical
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-6 font-medium relative">
          {links.map((link) =>
            link.title === 'Specialists' ? (
              <div
                key={link.id}
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
                className="relative"
              >
                <button className="hover:text-[#90E0EF]">Specialists</button>
                <div
                  className={`absolute top-8 left-0 bg-white text-[#03045E] rounded-lg shadow-xl p-3 grid grid-cols-2 gap-1 w-72 transition ${
                    dropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
                  }`}
                >
                  {specialists.map((item, i) => (
                    <Link
                      key={i}
                      href="#"
                      className="text-sm hover:bg-[#ADE8F4] px-2 py-1 rounded-md"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link key={link.id} href={link.url} className="hover:text-[#90E0EF]">
                {link.title}
              </Link>
            )
          )}
        </div>

        {/* AUTH SECTION */}
        {!session ? (
          // Login Button (unchanged)
          <Link
            href="/login"
            className="hidden md:flex items-center gap-2 bg-[#023E8A] hover:bg-[#0096C7] px-4 py-2 rounded-full"
          >
            <FaUserCircle size={20} />
            Login / Signup
          </Link>
        ) : (
          // Profile Icon + Dropdown
          <div className="relative hidden md:block" ref={profileRef}>
            <button
              onClick={() => setProfileOpen((s) => !s)}
              aria-haspopup="true"
              aria-expanded={profileOpen}
              className="flex items-center gap-2"
            >
              <FaUserCircle size={28} className="hover:text-[#CAF0F8]" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-3 w-44 bg-white text-[#03045E] rounded-lg shadow-lg overflow-hidden">
                <Link
                  href={dashboardLink}
                  className="block px-4 py-2 hover:bg-[#ADE8F4]"
                  onClick={() => setProfileOpen(false)}
                >
                  Dashboard
                </Link>
                <div className="border-t border-[#e6f6ff]" />
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    signOut({ callbackUrl: '/' });
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-600"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}

        {/* Mobile Icons */}
        <div className="flex md:hidden items-center gap-4">
          <button
            onClick={() => setMobileSearch((s) => !s)}
            aria-label="Toggle search"
          >
            <FaSearch size={20} />
          </button>
          <button
            onClick={() => setMobileMenu((s) => !s)}
            aria-label="Toggle menu"
          >
            {mobileMenu ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>
      </div>

      {/* Desktop Search */}
      <div className="hidden md:flex justify-center py-3 bg-[#023E8A]">
        <div className="flex bg-white rounded-full px-4 py-2 w-1/2">
          <input
            className="w-full outline-none text-[#03045E]"
            placeholder="Search..."
            aria-label="Site search"
          />
          <FaSearch className="text-[#0077B6]" />
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="md:hidden bg-[#023E8A] px-6 py-4 space-y-3">
          {links.map((l) => (
            <Link key={l.id} href={l.url} className="block text-[#CAF0F8]">
              {l.title}
            </Link>
          ))}

          {!session ? (
            <Link
              href="/login"
              className="flex justify-center gap-2 bg-[#0077B6] px-4 py-2 rounded-full text-white"
            >
              <FaUserCircle /> Login / Signup
            </Link>
          ) : (
            <>
              <Link
                href={dashboardLink}
                className="block text-center bg-[#0077B6] px-4 py-2 rounded-full text-white"
              >
                Dashboard
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="block w-full bg-red-500 px-4 py-2 rounded-full text-white"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
