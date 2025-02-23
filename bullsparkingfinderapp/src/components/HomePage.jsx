import React, {useState} from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen justify-center items-center bg-blue-100 relative overflow-hidden">
      {/* Background Animation */}
      {/* <div className="absolute inset-0 flex justify-center items-center opacity-10">
        <svg
          className="animate-spin-slow h-96 w-96 text-blue-300"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v18m9-9H3"
          />
        </svg>
      </div> */}

      {/* Main Content */}
      <div className="z-10 text-center">
        <div className="overflow-hidden whitespace-nowrap border-r-2 border-black text-4xl font-bold animate-typewriter">
          Welcome to Bulls Parking Finder!
        </div>
        <p className="text-xl text-gray-700 mb-8 animate-slide-up">
          Find your parking spot on the UB campus easily and quickly.
        </p>
        <div className="space-x-4">
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-500 text-white px-6 py-3 rounded-md shadow-md hover:bg-blue-600 transition duration-300 ease-in-out transform hover:-translate-y-1"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="bg-green-500 text-white px-6 py-3 rounded-md shadow-md hover:bg-green-600 transition duration-300 ease-in-out transform hover:-translate-y-1"
          >
            Sign Up
          </button>
        </div>
      </div>

      {/* Car Icon Animation */}
      {/* <div className="absolute bottom-0 left-0 w-full h-40 bg-blue-600 transform -skew-y-6"></div>
      <img
        src={ModernCarImg}
        alt="Modern Car"
        className="absolute bottom-4 left-6 h-32 w-52 animate-car-move"
      /> */}
    </div>
  );
};

export default HomePage;
