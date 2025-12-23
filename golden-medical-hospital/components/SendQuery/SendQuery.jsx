import React from "react";

const SendQuery = () => {
  return (
    <section className="bg-[linear-gradient(to_right,#ADE8F4,#90E0EF,#CAF0F8)] py-12 px-6 md:px-20 font-merriweather text-[#03045E]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
  
        <div>
          <h2 className="text-2xl md:text-4xl font-bold text-[#023E8A] mb-3">
            Ask Golden Medical
          </h2>
          <p className="text-base md:text-lg text-[#03045E]">
            Looking for world-class care? We are here to support you.
          </p>
        </div>
        <div>
          <a
            href="#"
            className="inline-block bg-[#0077B6] hover:bg-[#00B4D8] text-white font-semibold text-lg py-3 px-8 rounded-full shadow-md transition duration-300"
          >
            Send Query
          </a>
        </div>
      </div>
    </section>
  );
};

export default SendQuery;
