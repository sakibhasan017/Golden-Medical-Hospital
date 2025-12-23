import React from "react";
import Image from "next/image";
import package1 from "../../public/package1.jpg";

const HealthCheckPackages = () => {
  const packages = [
    { id: 1, title: "Exclusive Health Check", gender: "(Male / Female)", img: package1 },
    { id: 2, title: "Heart Check", gender: "(For Men)", img: package1 },
    { id: 3, title: "Heart Check", gender: "(For Women)", img: package1 },
    { id: 4, title: "Whole Body Check", gender: "(For Men above 45 years)", img: package1 },
  ];

  return (
    <section className="bg-[linear-gradient(to_bottom,#CAF0F8,#ADE8F4)] py-16 px-6 md:px-20 font-merriweather text-[#03045E]">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-[#023E8A] mb-4">
          Health Check Packages
        </h2>
        <div className="w-24 h-1 bg-[#0077B6] mx-auto mb-10 rounded-full"></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="flex flex-col justify-between bg-white/80 backdrop-blur-md rounded-2xl shadow-md overflow-hidden hover:shadow-xl hover:scale-[1.05] transition-all duration-300"
            >
              <div>
                <div className="relative w-full h-48 md:h-56">
                  <Image src={pkg.img} alt={pkg.title} fill className="object-cover" />
                </div>
                <div className="p-5 text-center">
                  <h3 className="text-lg md:text-xl font-bold text-[#0077B6] mb-1">
                    {pkg.title}
                  </h3>
                  <p className="text-sm text-[#03045E] mb-6">{pkg.gender}</p>
                </div>
              </div>
              <div className="pb-6 text-center">
                <a
                  href="#"
                  className="inline-block bg-[#0077B6] hover:bg-[#00B4D8] text-white font-semibold py-2 px-5 rounded-full shadow-md transition duration-300"
                >
                  See Package
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HealthCheckPackages;
