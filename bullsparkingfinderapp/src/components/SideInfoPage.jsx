import React, { useState, useEffect } from "react";
import { Destination } from "../constants/constants";

const SideInfoPage = ({ isVisible, onClose, parkingLot }) => {
  const [capacity, setCapacity] = useState(parkingLot.capacity);
  const [visible, setVisible] = useState(isVisible);
  const [averageCapacities, setAverageCapacities] = useState({});
  const [userLocation, setUserLocation] = useState(null); // State for user's location

  // Dynamic URLs
  const localURL = "http://localhost:3000";
  const averagePHP = `${localURL}php/average.php`;
  const surveyPHPUrl = `${localURL}php/survey.php`;

  useEffect(() => {
    setCapacity(parkingLot.capacity);
  }, [parkingLot]);

  useEffect(() => {
    setVisible(isVisible);
  }, [isVisible]);

  // Polling setup
  useEffect(() => {
    const fetchAverages = async () => {
      try {
        const response = await fetch(averagePHP);
        if (response.ok) {
          const data = await response.json();
          const capacities = {};
          data.forEach(({ parking_lot_name, average_capacity }) => {
            capacities[parking_lot_name] = average_capacity;
          });
          setAverageCapacities(capacities);
        } else {
          console.error("Failed to fetch averages");
        }
      } catch (error) {
        console.error("Error fetching averages:", error);
      }
    };

    fetchAverages(); // Initial fetch

    const intervalId = setInterval(fetchAverages, 30000); // Poll every 5 seconds

    return () => {
      clearInterval(intervalId); // Clear interval on unmount
    };
  }, [averagePHP]); // Depend on averagePHP

  useEffect(() => {
    if (averageCapacities[parkingLot.name] !== undefined) {
      setCapacity(averageCapacities[parkingLot.name]);
    }
  }, [averageCapacities, parkingLot.name]);

  // Get user location using Geolocation API
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const handleSliderChange = (e) => {
    const newCapacity = Math.round(e.target.value / 10) * 10;
    setCapacity(newCapacity);
  };

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  const submitSurvey = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("No token found! Please log in.");
      return;
    }

    try {
      const response = await fetch(surveyPHPUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          parkingLot: parkingLot.name,
          percentage: capacity,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert("Survey submitted successfully!");
        console.log("Survey submitted successfully:", result.message);
      } else {
        const errorData = await response.json();
        if (response.status === 401 && errorData.error === "Invalid token") {
          alert("Invalid token. Please log in again.");
        } else {
          console.error(
            `Error submitting survey: ${response.status} - ${errorData.error}`
          );
          alert("Failed to submit survey. Please check your input.");
        }
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Network error or server unavailable.");
    }
  };

  const getSliderBackground = () => {
    const percentage = capacity;
    const color =
      percentage < 30
        ? "green"
        : percentage < 50
        ? "#F1C80D"
        : percentage < 80
        ? "orange"
        : "red";
    return `linear-gradient(to right, ${color} ${percentage}%, #e0e0e0 ${percentage}%)`;
  };

  const getCapacityColor = (value) => {
    if (value < 30) return "green";
    if (value < 50) return "#F1C80D";
    if (value < 80) return "orange";
    return "red";
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full bg-white shadow-lg ${
        visible ? "animate-slide-in-right" : "animate-slide-out-right"
      }`}
      style={{ width: "500px", top: "60px", zIndex: 40 }}
    >
      <div className="p-4 relative">
        <button
          title="Close"
          onClick={handleClose}
          className="absolute top-2 right-4 text-gray-500 hover:text-gray-800"
          style={{ fontSize: "32px" }}
        >
          &times;
        </button>
        <h2 className="text-xl font-bold">{parkingLot.name}</h2>
        <p className="text-gray-600 mb-4">
          Current Capacity:{" "}
          <span
            className="font-bold"
            style={{
              color: getCapacityColor(averageCapacities[parkingLot.name] || 0),
            }}
          >
            {averageCapacities[parkingLot.name] !== undefined
              ? `${averageCapacities[parkingLot.name]}%`
              : "Loading..."}
          </span>
        </p>

        <div className="flex justify-center items-center mt-6 mb-6">
          <div
            className="rounded-full border-4 flex justify-center items-center"
            style={{
              width: "150px",
              height: "150px",
              borderColor: getCapacityColor(capacity),
            }}
          >
            <span
              className="text-4xl font-bold"
              style={{ color: getCapacityColor(capacity) }}
            >
              {capacity}%
            </span>
          </div>
        </div>

        <div className="mt-4">
          <label className="block mb-2 text-center font-medium">
            Set new capacity:
          </label>
          <input
            type="range"
            min="0"
            max="100"
            step="10"
            value={capacity}
            onChange={handleSliderChange}
            className="w-full h-2 rounded-lg cursor-pointer"
            style={{
              background: getSliderBackground(),
              appearance: "none",
            }}
          />
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={submitSurvey}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
          >
            Submit Survey
          </button>
        </div>
        <div className="my-4">
          <div className="font-bold text-lg">
            Opening Time: <span className="font-bold">7:00 AM</span>
          </div>
          <div className="font-bold text-red-500 text-lg">
            Closing Time: <span className="font-bold">10:00 PM</span>
          </div>
          <div className="flex justify-center items-center my-4">
            {Destination.find((lot) => lot.name === parkingLot.name) ? (
              <button
                onClick={() => {
                  const destination = Destination.find(
                    (lot) => lot.name === parkingLot.name
                  );
                  if (userLocation) {
                    const { latitude, longitude } = userLocation;
                    const url = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${destination.coordinates[0]},${destination.coordinates[1]}`;
                    window.open(url, "_blank");
                  } else {
                    alert("User location is not available");
                  }
                }}
                className="bg-green-500 text-white hover:bg-green-600 font-bold py-2 px-4 rounded"
              >
                Get Directions to {parkingLot.name}
              </button>
            ) : (
              <p className="text-red-500">
                Coordinates not found for {parkingLot.name}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideInfoPage;
