"use client";

import React, { useEffect } from "react";
import AnesthesiaIcon from "../Icons/Anesthesia";
import CancerCareIcon from "../Icons/CancerCareIcon";
import CardiologyCareIcon from "../Icons/CardiologyCareIcon";
import AlertIcon from "../Icons/Alert";
import KidneyTransplantIcon from "../Icons/KidneyTransplantIcon";
import NeurologyIcon from "../Icons/NeurologyIcon";
import ThoracicSurgery from "../Icons/ThoracicSurgeryIcon";
import NeurosurgeryIcon from "../Icons/NeurosurgeryIcon";
import NeprologyIcon from "../Icons/NeprologyIcon";
import CardiothoracicSurgeryIcon from "../Icons/CardiothoracicSurgeryIcon";
import Link from "next/link";

const iconMapping = {
  "Accident & Emergency": AlertIcon,
  "Anesthesia and Pain Medicine": AnesthesiaIcon,
  "Cancer Care Centre": CancerCareIcon,
  "Cardiology Care Centre": CardiologyCareIcon,
  "Cardiothoracic & Vascular Surgery": CardiothoracicSurgeryIcon,
  "Neurology": NeurologyIcon,
  "Thoracic Surgery": ThoracicSurgery,
  "Nephrology": NeprologyIcon,
  "Neurosurgery": NeurosurgeryIcon,
  "Kidney Transplant Program": KidneyTransplantIcon,
};

export default function Specialities() {
  const [specialists, setSpecialists] = React.useState([]);
  
  useEffect(() => {
    async function getSpecialists() {
  try {
    const res = await fetch(`/api/specialists`, {
      cache: 'no-store'
    });
    
    if (!res.ok) {
      console.error("Failed to fetch specialists");
      return [];
    }
    
    const specialists = await res.json();
    setSpecialists(Array.isArray(specialists) ? specialists : []);
  } catch (error) {
    console.error("Error fetching specialists:", error);
    setSpecialists([]);
  }
}
    getSpecialists();

  }, []);

  
  const displaySpecialists = specialists.length > 0 ? specialists : [
    { _id: 1, title: "Accident & Emergency" },
    { _id: 2, title: "Anesthesia and Pain Medicine" },
    { _id: 3, title: "Cancer Care Centre" },
    { _id: 4, title: "Cardiology Care Centre" },
    { _id: 5, title: "Cardiothoracic & Vascular Surgery" },
    { _id: 6, title: "Neurology" },
    { _id: 7, title: "Thoracic Surgery" },
    { _id: 8, title: "Nephrology" },
    { _id: 9, title: "Neurosurgery" },
    { _id: 10, title: "Kidney Transplant Program" },
  ];

  return (
    <section className="bg-linear-to-b from-[#ADE8F4] to-[#CAF0F8] py-16 px-6 md:px-20 font-merriweather text-[#03045E]">
      <div className="max-w-6xl mx-auto text-center">
        {/* Title */}
        <h2 className="text-3xl md:text-5xl font-bold text-[#023E8A] mb-4">
          Our Specialities
        </h2>
        <div className="w-24 h-1 bg-[#0077B6] mx-auto mb-10 rounded-full"></div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10">
          {displaySpecialists.map((specialist) => {
            const IconComponent = iconMapping[specialist.title] || AlertIcon;
            return (
              <Link
                key={specialist._id}
                href={`/specialists/${specialist._id}`}
                className="flex flex-col items-center justify-center bg-white/80 backdrop-blur-md rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-8 hover:bg-[#90E0EF]/50 hover:scale-[1.05] group"
              >
                <div className="text-[#0077B6] group-hover:text-[#03045E] transition duration-300 mb-4">
                  <IconComponent className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24" />
                </div>
                <p className="text-sm md:text-base font-semibold text-center leading-tight">
                  {specialist.title}
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  {specialist.doctorList?.length || 0} doctors
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}