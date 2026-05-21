import React from "react";
import Sidebar from "../components/Sidebar";
import { Bolt, Globe } from "lucide-react";

function About() {
  return (
    <div className="max-w-3xl mx-auto p-6">

      {/* Sidebar */}
      <div className="flex justify-center p-4 mb-4 shadow-lg rounded-xl bg-white">
        <Sidebar />
      </div>

      {/* Title */}
      <h1 className="flex justify-center items-center gap-3 text-3xl font-extrabold text-center mt-2 mb-5 bg-green-500 p-3 rounded-xl">
        <Bolt size={40} className="text-black" />
        About ChargeFlow
      </h1>

      {/* Image */}
      <div className="mb-6">
        <img 
          src="https://images.unsplash.com/photo-1767042286259-d38926e1f2a4?q=80&w=1823&auto=format&fit=crop" 
          alt="EV Charger"
          className="w-full h-64 object-cover rounded-xl" 
        />
      </div>

      {/* Vision */}
      <div className="bg-white shadow-md rounded-xl p-5 mb-6 border border-gray-100 flex gap-3 items-start">
        <Globe size={28} className="text-green-500 mt-1" />
        <div>
          <h2 className="text-2xl font-bold text-green-600 mb-2 font-display">
            Vision
          </h2>
          <p className="text-gray-600 leading-relaxed text-lg font-display">
            To create a world where every EV driver can travel freely and confidently by instantly finding the nearest and most reliable charging stations anywhere.
          </p>
        </div>
      </div>

      {/* Mission */}
      <div className="bg-white shadow-md rounded-xl p-5 border border-gray-100 flex gap-3 items-start">
        <Bolt size={28} className="text-green-500 mt-1" />
        <div>
          <h2 className="text-2xl font-bold text-green-600 mb-2 font-display">
            Mission
          </h2>
          <p className="text-gray-600 leading-relaxed text-lg font-display">
            To simplify electric vehicle charging by providing a smart, fast, and location-based platform that helps drivers discover, navigate, and access charging stations with ease.
          </p>
        </div>
      </div>

    </div>
  );
}

export default About;