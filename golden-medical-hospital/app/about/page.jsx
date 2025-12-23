"use client";
import React from "react";
import Image from "next/image";
import { Heart, Award, Scale, Users, Lightbulb } from "lucide-react";
import hospital_image from "@/public/hospital_image.png";

const About = () => {
  return (
    <div className="font-merriweather text-[#03045E] bg-[#CAF0F8]">
      <div className="relative w-full h-[400px] md:h-[500px]">
        <Image
          src={hospital_image}
          alt="Golden Medical Hospital"
          fill
          className="object-cover brightness-90"
          priority
        />
        <div className="absolute inset-0 bg-[#03045E]/40 flex items-center justify-center">
          <h1 className="text-white text-4xl md:text-5xl font-bold tracking-wide drop-shadow-lg">
            About Us
          </h1>
        </div>
      </div>

      <section className="max-w-5xl mx-auto py-16 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Who We Are</h2>
        <p className="text-lg leading-relaxed text-[#023E8A]">
          <strong>Golden Medical Hospital</strong> is a 425-bed multidisciplinary
          super-specialty healthcare center dedicated to providing world-class
          medical care. As one of Bangladesh’s most trusted hospitals, we uphold
          international standards of patient safety and clinical excellence.
          With a compassionate approach and advanced technology, we strive to
          make quality healthcare accessible to everyone — right here at home.
        </p>
      </section>

      <section className="max-w-5xl mx-auto py-12 px-6 text-center bg-white/70 rounded-3xl shadow-md">
        <h2 className="text-3xl font-bold mb-4 text-[#0077B6]">
          Building a Healthier Bangladesh
        </h2>
        <p className="text-lg text-[#023E8A] leading-relaxed">
          At <strong>Golden Medical Hospital</strong>, our mission is to build a
          healthier nation by combining innovation, medical expertise, and
          compassion. We are committed to raising the standard of healthcare in
          Bangladesh through modern treatment facilities, skilled professionals,
          and patient-centered services. Our goal is to ensure that every
          citizen can receive international-quality care without the need to
          travel abroad.
        </p>
      </section>

      <section className="max-w-6xl mx-auto py-16 px-6">
        <div className="grid md:grid-cols-2 gap-12 text-center mb-16">
          <div>
            <h3 className="text-xl font-bold tracking-widest bg-[#ADE8F4] inline-block px-4 py-2 rounded-md shadow-sm mb-4">
              OUR VISION
            </h3>
            <p className="text-[#023E8A]">
              To become Bangladesh’s leading center of excellence in tertiary and
              quaternary care, providing advanced, compassionate, and
              internationally recognized medical services for every citizen.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-widest bg-[#ADE8F4] inline-block px-4 py-2 rounded-md shadow-sm mb-4">
              OUR MISSION
            </h3>
            <p className="text-[#023E8A]">
              To deliver world-class healthcare through innovation, integrity,
              and compassion — ensuring every patient receives safe, effective,
              and affordable treatment, while empowering our team to achieve
              excellence in service.
            </p>
          </div>
        </div>

        <div className="text-center mb-10">
          <h3 className="text-xl font-bold tracking-widest bg-[#ADE8F4] inline-block px-4 py-2 rounded-md shadow-sm">
            OUR VALUES
          </h3>
          <p className="mt-4 text-[#023E8A] max-w-3xl mx-auto">
            At Golden Medical Hospital, we are guided by values that define who
            we are and how we care — ensuring that every decision we make leads
            to better health, trust, and service for our patients and community.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
          <div className="bg-white rounded-2xl shadow-md p-6 text-center border border-[#ADE8F4] w-full max-w-sm">
            <Award className="w-10 h-10 text-green-500 mx-auto mb-2" />
            <h4 className="font-bold text-lg">Quality</h4>
            <p className="text-sm text-[#023E8A] mt-1">
              We are devoted to delivering high-quality healthcare through
              precision, safety, and patient satisfaction.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 text-center border border-[#ADE8F4] w-full max-w-sm">
            <Scale className="w-10 h-10 text-purple-600 mx-auto mb-2" />
            <h4 className="font-bold text-lg">Integrity</h4>
            <p className="text-sm text-[#023E8A] mt-1">
              We practice transparency, ethics, and honesty in every step of
              patient care and professional service.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 text-center border border-[#ADE8F4] w-full max-w-sm">
            <Heart className="w-10 h-10 text-red-600 mx-auto mb-2" />
            <h4 className="font-bold text-lg">Compassion</h4>
            <p className="text-sm text-[#023E8A] mt-1">
              We treat every patient with empathy, kindness, and respect — caring
              for them like family.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 text-center border border-[#ADE8F4] w-full max-w-sm">
            <Users className="w-10 h-10 text-blue-600 mx-auto mb-2" />
            <h4 className="font-bold text-lg">Respect</h4>
            <p className="text-sm text-[#023E8A] mt-1">
              We value diversity, teamwork, and the dignity of every individual —
              patients, staff, and caregivers alike.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 text-center border border-[#ADE8F4] w-full max-w-sm">
            <Lightbulb className="w-10 h-10 text-yellow-500 mx-auto mb-2" />
            <h4 className="font-bold text-lg">Innovation</h4>
            <p className="text-sm text-[#023E8A] mt-1">
              We continuously embrace new technologies and ideas to improve
              outcomes and redefine healthcare excellence.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
