import React from "react";

const WhyChooseUs = () => {
  return (
    <section className="bg-[linear-gradient(to_bottom,#CAF0F8, #ADE8F4, #90E0EF)] from-[#CAF0F8] via-[#ADE8F4] to-[#90E0EF] py-16 px-6 md:px-20 font-merriweather text-[#03045E]">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-6 text-[#023E8A]">
          Why Choose Us
        </h1>
        <div className="w-20 h-1 bg-[#0077B6] mx-auto mb-8 rounded-full"></div>
        <p className="text-base md:text-lg leading-relaxed text-[#03045E] bg-white/70 backdrop-blur-md shadow-md rounded-2xl p-6 md:p-10 text-justify">
          <span className="font-semibold text-[#0077B6]">Golden Medical Hospital</span> 
          &nbsp;is a 425-bed multidisciplinary super-specialty tertiary care
          institution dedicated to providing world-class healthcare services. It
          combines advanced medical technology with compassionate patient care,
          offering state-of-the-art diagnostic, imaging, and surgical facilities.
          The hospital’s team of highly qualified physicians, experienced
          surgeons, dedicated nurses, and skilled medical professionals work
          collaboratively to ensure precision, safety, and comfort in every
          treatment. With a strong commitment to clinical excellence, innovation,
          and patient safety, Golden Medical Hospital continues to set new
          benchmarks in healthcare quality and service in Bangladesh and beyond.
        </p>
      </div>
    </section>
  );
};

export default WhyChooseUs;
