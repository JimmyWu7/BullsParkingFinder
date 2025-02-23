import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ParkingLogo from "../assets/images/CarParkingLogo.png"; // Adjust the path if necessary

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState("Guest"); // Default name
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Dynamic URLs
  const localURL = "http://localhost:3000";
  const getUserInfoPHPUrl = `${localURL}php/get_user_info.php`;

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const goToDashboard = () => {
    navigate("/dashboard");
  };

  const goToSettings = () => {
    navigate("/settings");
  };

  const goToProfile = () => {
    navigate("/profile");
  };

  const goToHome = () => {
    navigate("/");
  };

  const handleLogout = () => {
    // Implement logout logic here
    console.log("Logging out...");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const token = localStorage.getItem("authToken"); // Replace with your token retrieval logic
        if (!token) {
          console.error("No auth token found");
          return;
        }

        const response = await fetch(getUserInfoPHPUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error("Failed to fetch user data:", response.statusText);
          return;
        }

        const data = await response.json();
        if (data.name) {
          setUserName(data.name);
        } else {
          console.error("Invalid response data:", data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserName();
  }, []);

  return (
    <nav className="bg-blue-500 p-2 flex justify-between items-center shadow-lg fixed top-0 left-0 w-full z-50">
      {/* Left side: Logo and title */}
      <div className="flex items-center">
        <button onClick={goToDashboard} className="flex items-center">
          <img
            src={ParkingLogo}
            alt="Car Parking Logo"
            className="h-12 w-auto mx-2"
          />
        </button>
        <h1 className="text-white text-xl">Bulls Parking Finder</h1>
      </div>

      {/* Right side: User dropdown */}
      <div className="relative mx-4 flex items-center" ref={dropdownRef}>
        <button
          onClick={goToDashboard}
          className="text-white mx-4 focus:outline-none hover:underline"
        >
          Dashboard
        </button>

        {/* User name with triangle (caret) */}
        <button
          onClick={toggleDropdown}
          className="text-white focus:outline-none flex items-center"
        >
          <span className="hover:underline">{userName}</span>
          <span
            className={`ml-0 transition-transform text-[10px] no-underline ${
              isOpen ? "rotate-180" : ""
            }`}
          >
            ▼
          </span>
        </button>

        {isOpen && (
          <div className="absolute left-6 top-8 w-48 bg-white rounded-lg shadow-lg">
            <button
              onClick={goToProfile}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Profile
            </button>
            <button
              onClick={goToSettings}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Settings
            </button>
            <button
              onClick={goToHome}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
