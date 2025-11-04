import Hero from "@/components/Hero/Hero";
import WhyChooseUs from "@/components/WhyChooseUs/WhyChooseUs";
import React from "react";
import Specialites from "@/components/Specialities/Specialities";
import HealthCheckPackages from "@/components/HealthCheckPackages/HealthCheckPackages";
import SendQuery from "@/components/SendQuery/SendQuery";

const Home=()=>{
  return <div>
    <Hero/>
    <WhyChooseUs/>
    <Specialites/>
    <HealthCheckPackages/>
    <SendQuery/>
  </div>
}

export default Home;