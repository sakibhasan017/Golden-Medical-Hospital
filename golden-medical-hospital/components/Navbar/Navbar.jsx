'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';
import { useSession, signOut } from 'next-auth/react';

const Navbar = () => {
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [specialists, setSpecialists] = useState([]);
  const [loadingSpecialists, setLoadingSpecialists] = useState(true);
  const lastScrollY = useRef(0);
  const profileRef = useRef(null);
  const dropdownRef = useRef(null);

  const links = [
    { id: 1, title: 'Home', url: '/' },
    { id: 2, title: 'About Us', url: '/about' },
    { id: 3, title: 'Specialists', url: '#' },
    { id: 4, title: 'Health Check', url: '/health-checks' },
    { id: 5, title: 'See Queries', url: '/queries' },
  ];

  const dashboardLink =
    session?.user?.role === 'admin'
      ? '/dashboard/admin'
      : session?.user?.role === 'doctor'
      ? '/dashboard/doctor'
      : '/dashboard/patient';

  useEffect(() => {
    fetchSpecialists();
  }, []);

  const fetchSpecialists = async () => {
    try {
      const res = await fetch('/api/specialists');
      if (res.ok) {
        const data = await res.json();
        setSpecialists(data);
      }
    } catch (err) {
      console.error('Failed to fetch specialists:', err);
    } finally {
      setLoadingSpecialists(false);
    }
  };

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

  /* Close dropdowns when clicking outside or pressing Escape */
  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        setProfileOpen(false);
        setDropdownOpen(false);
      }
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
      className={`w-full bg-linear-to-r from-[#03045E] via-[#0077B6] to-[#00B4D8] text-white shadow-lg sticky top-0 z-50 transition-transform duration-500 ${
        showNavbar ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="flex items-center justify-between px-6 py-4">
        <Link href="/" className="text-2xl font-bold text-[#CAF0F8]">
          Golden Medical
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-6 font-medium relative">
          {links.map((link) =>
            link.title === 'Specialists' ? (
              <div
                key={link.id}
                ref={dropdownRef}
                className="relative"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <button className="hover:text-[#90E0EF] transition-colors duration-200">
                  Specialists
                </button>
                <div
                  className={`absolute top-8 left-0 bg-white text-[#03045E] rounded-lg shadow-xl p-3 grid grid-cols-2 gap-1 w-72 transition-all duration-200 ${
                    dropdownOpen
                      ? 'opacity-100 visible translate-y-0'
                      : 'opacity-0 invisible translate-y-2 pointer-events-none'
                  }`}
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  {loadingSpecialists ? (
                    <div className="col-span-2 text-center py-2 text-sm text-gray-500">
                      Loading...
                    </div>
                  ) : specialists.length > 0 ? (
                    specialists.map((specialist) => (
                      <Link
                        key={specialist._id}
                        href={`/specialists/${specialist._id}`}
                        className="text-sm hover:bg-[#ADE8F4] px-2 py-1 rounded-md transition-colors duration-150"
                        onClick={() => setDropdownOpen(false)}
                      >
                        {specialist.title}
                      </Link>
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-2 text-sm text-gray-500">
                      No specialists found
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Link 
                key={link.id} 
                href={link.url} 
                className="hover:text-[#90E0EF] transition-colors duration-200"
              >
                {link.title}
              </Link>
            )
          )}
        </div>

        {/* AUTH SECTION */}
        {!session ? (
          <Link
            href="/login"
            className="hidden md:flex items-center gap-2 bg-[#023E8A] hover:bg-[#0096C7] px-4 py-2 rounded-full transition-colors duration-200"
          >
            <FaUserCircle size={20} />
            Login / Signup
          </Link>
        ) : (
          <div className="relative hidden md:block" ref={profileRef}>
            <button
              onClick={() => setProfileOpen((s) => !s)}
              aria-haspopup="true"
              aria-expanded={profileOpen}
              className="flex items-center gap-2 hover:text-[#CAF0F8] transition-colors duration-200"
            >
              <FaUserCircle size={28} />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-3 w-44 bg-white text-[#03045E] rounded-lg shadow-lg overflow-hidden border border-gray-200">
                <div className="px-4 py-2 bg-[#f8fafc] border-b border-gray-100">
                  <p className="text-sm font-medium">{session.user.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{session.user.role}</p>
                </div>
                <Link
                  href={dashboardLink}
                  className="block px-4 py-3 hover:bg-[#ADE8F4] transition-colors duration-150"
                  onClick={() => setProfileOpen(false)}
                >
                  Dashboard
                </Link>
                <div className="border-t border-gray-100" />
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    signOut({ callbackUrl: '/' });
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-600 transition-colors duration-150"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setMobileMenu((s) => !s)}
            aria-label="Toggle menu"
            className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200"
          >
            {mobileMenu ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="md:hidden bg-[#023E8A] px-6 py-4 space-y-4">
          {links.map((l) => (
            <div key={l.id}>
              {l.title === 'Specialists' ? (
                <details className="group">
                  <summary className="text-[#CAF0F8] cursor-pointer list-none py-2 flex items-center justify-between">
                    <span>Specialists</span>
                    <span className="group-open:rotate-90 transition-transform">›</span>
                  </summary>
                  <div className="mt-2 ml-4 space-y-2 border-l border-[#0077B6] pl-4">
                    {loadingSpecialists ? (
                      <div className="text-sm text-gray-300">Loading...</div>
                    ) : specialists.length > 0 ? (
                      specialists.map((specialist) => (
                        <Link
                          key={specialist._id}
                          href={`/specialists/${specialist._id}`}
                          className="block text-sm text-[#CAF0F8] hover:text-white py-1 transition-colors duration-150"
                          onClick={() => setMobileMenu(false)}
                        >
                          {specialist.title}
                        </Link>
                      ))
                    ) : (
                      <div className="text-sm text-gray-300">No specialists</div>
                    )}
                  </div>
                </details>
              ) : (
                <Link 
                  key={l.id} 
                  href={l.url} 
                  className="block text-[#CAF0F8] hover:text-white py-2 transition-colors duration-150"
                  onClick={() => setMobileMenu(false)}
                >
                  {l.title}
                </Link>
              )}
            </div>
          ))}

          <div className="pt-4 border-t border-[#0077B6]">
            {!session ? (
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 bg-[#0077B6] hover:bg-[#0096C7] px-4 py-3 rounded-full text-white transition-colors duration-200"
                onClick={() => setMobileMenu(false)}
              >
                <FaUserCircle /> 
                <span>Login / Signup</span>
              </Link>
            ) : (
              <>
                <div className="mb-4 px-2">
                  <p className="font-medium text-white">{session.user.name}</p>
                  <p className="text-sm text-[#CAF0F8] capitalize">{session.user.role}</p>
                </div>
                <Link
                  href={dashboardLink}
                  className="block text-center bg-[#0077B6] hover:bg-[#0096C7] px-4 py-3 rounded-full text-white mb-3 transition-colors duration-200"
                  onClick={() => setMobileMenu(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    setMobileMenu(false);
                    signOut({ callbackUrl: '/' });
                  }}
                  className="block w-full bg-red-600 hover:bg-red-700 px-4 py-3 rounded-full text-white transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;