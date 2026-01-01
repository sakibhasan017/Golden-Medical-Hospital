"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import hospital_image from "../../public/hospital_image.png";
import patient_bed from "../../public/patient_bed.png";
import reception from "../../public/reception.png";

const Hero = () => {
  const heroImages = [hospital_image, patient_bed, reception];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? heroImages.length - 1 : prev - 1));
  };
  const nextSlide = () => {
    setCurrent((prev) => (prev === heroImages.length - 1 ? 0 : prev + 1));
  };

  const buttons = [
    { id: 1, label: "Find a Doctor", link: "/find-doctor" },
    { id: 2, label: "Request an Appointment", link: "/find-doctor" },
    { id: 3, label: "Online Report", link: "/online-report" },
    { id: 4, label: "Helpline", link: "/helpline" },
    { id: 5, label: "Patients and Visitors Guide", link: "/patients-visitors-guide" },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-[#CAF0F8] font-merriweather">
      <div className="relative w-full h-[calc(100vh-100px)]"> 
        {heroImages.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === current ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <Image
              src={img}
              alt={`Slide ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
            />

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex gap-4 flex-wrap justify-center">
              {buttons.map((btn) => (
                <a
                  key={btn.id}
                  href={btn.link}
                  className="bg-[#0077B6] text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-[#00B4D8] transition duration-300 shadow-md"
                >
                  {btn.label}
                </a>
              ))}
            </div>
          </div>
        ))}

        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#023E8A]/70 hover:bg-[#0096C7]/90 text-white p-3 rounded-full transition"
        >
          <FaArrowLeft size={18} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#023E8A]/70 hover:bg-[#0096C7]/90 text-white p-3 rounded-full transition"
        >
          <FaArrowRight size={18} />
        </button>
      </div>

      <div className="flex flex-col md:hidden gap-3 items-center py-6 bg-[#ADE8F4]">
        {buttons.map((btn) => (
          <a
            key={btn.id}
            href={btn.link}
            className="bg-[#023E8A] text-white w-4/5 text-center py-2 rounded-full hover:bg-[#0096C7] transition duration-300 shadow-md"
          >
            {btn.label}
          </a>
        ))}
      </div>
    </section>
  );
};

export default Hero;
