import React from "react";

function About() {
  return (
    <div className="max-w-3xl mx-auto p-6">

      {/* Title */}
      <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
        ⚡ About ChargeFlow
      </h1>

      {/* Vision */}
      <div className="bg-white shadow-md rounded-xl p-5 mb-6 border border-gray-100">
        <h2 className="text-xl font-bold text-green-600 mb-2">
          🌍 Vision
        </h2>
        <p className="text-gray-600 leading-relaxed">
          To create a world where every EV driver can travel freely and
          confidently by instantly finding the nearest and most reliable
          charging stations anywhere.
        </p>
      </div>

      {/* Mission */}
      <div className="bg-white shadow-md rounded-xl p-5 border border-gray-100">
        <h2 className="text-xl font-bold text-blue-600 mb-2">
          🎯 Mission
        </h2>
        <p className="text-gray-600 leading-relaxed">
          To simplify electric vehicle charging by providing a smart, fast,
          and location-based platform that helps drivers discover, navigate,
          and access charging stations with ease.
        </p>
      </div>

    </div>
  );
}

export default About;