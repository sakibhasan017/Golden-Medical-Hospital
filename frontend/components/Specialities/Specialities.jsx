import React from "react";
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

const Specialities = () => {
  const specialities = [
    { id: 1, name: "Accident & Emergency", Icon: AlertIcon },
    { id: 2, name: "Anesthesia and Pain Medicine", Icon: AnesthesiaIcon },
    { id: 3, name: "Cancer Care Centre", Icon: CancerCareIcon },
    { id: 4, name: "Cardiology Care Centre", Icon: CardiologyCareIcon },
    { id: 5, name: "Cardiothoracic & Vascular Surgery", Icon: CardiothoracicSurgeryIcon },
    { id: 6, name: "Neurology", Icon: NeurologyIcon },
    { id: 7, name: "Thoracic Surgery", Icon: ThoracicSurgery },
    { id: 8, name: "Nephrology", Icon: NeprologyIcon },
    { id: 9, name: "Neurosurgery", Icon: NeurosurgeryIcon },
    { id: 10, name: "Kidney Transplant Program", Icon: KidneyTransplantIcon },
  ];

  return (
    <section className="bg-[linear-gradient(to_bottom,#ADE8F4,#CAF0F8)] py-16 px-6 md:px-20 font-merriweather text-[#03045E]">
      <div className="max-w-6xl mx-auto text-center">
        {/* Title */}
        <h2 className="text-3xl md:text-5xl font-bold text-[#023E8A] mb-4">
          Our Specialities
        </h2>
        <div className="w-24 h-1 bg-[#0077B6] mx-auto mb-10 rounded-full"></div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10">
          {specialities.map(({ id, name, Icon }) => (
            <a
              key={id}
              href="#"
              className="flex flex-col items-center justify-center bg-white/80 backdrop-blur-md rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-8 hover:bg-[#90E0EF]/50 hover:scale-[1.05]"
            >
              <div className="text-[#0077B6] hover:text-[#03045E] transition duration-300 mb-4">
                <Icon className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24" />
              </div>
              <p className="text-sm md:text-base font-semibold text-center leading-tight">
                {name}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Specialities;
