import React from "react";
import { Outlet } from 'react-router-dom';
import Sidebar from "../component/sidebar";
import { Bolt } from "lucide-react"

function About() {
  return (
    <div className="max-w-375 mx-auto p-6">
      <div className="flex justify-center p-4 borde m-1 shadow-lg">
        <Sidebar />
      </div>

      
      {/* Title */}
      <h1 className="flex justify-center gap-4 text-3xl font-extrabold text-center mt-2 mb-5 bg-green-500 p-3">
        <Bolt size={40} className="text-black"/> About ChargeFlow
      </h1>

      <div>
        <img 
          src="https://images.unsplash.com/photo-1767042286259-d38926e1f2a4?q=80&w=1823&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
          alt="Ev Charger"
          className="w-full h-100 object-cover" 
        />
      </div>

      {/* Vision */}
      <div className="bg-white shadow-md rounded-xl p-5 mb-6 border border-gray-100">
        <h2 className="text-2xl font-bold text-green-600 mb-2 font-display">
          🌍 Vision
        </h2>
        <p className="text-gray-600 leading-relaxed text-lg font-display">
          To create a world where every EV driver can travel freely and
          confidently by instantly finding the nearest and most reliable
          charging stations anywhere.
        </p>
      </div>

      {/* Mission */}
      <div className="bg-white shadow-md rounded-xl p-5 border border-gray-100">
        <h2 className="text-2xl font-bold text-green-600 mb-2 font-display">
          Mission
        </h2>
        <p className="text-gray-600 leading-relaxed text-lg font-display">
          To simplify electric vehicle charging by providing a smart, fast,
          and location-based platform that helps drivers discover, navigate,
          and access charging stations with ease.
        </p>
      </div>

    </div>
  );
}

export default About;