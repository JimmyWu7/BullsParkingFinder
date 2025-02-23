import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Circle,
  useMap,
  Marker,
  Popup,
} from "react-leaflet";
import {
  northCampusParkingLots,
  southCampusParkingLots,
} from "../constants/constants";

import chargingLogo from "../assets/images/charging-station-solid.svg"; // Adjust the path if necessary
import SideInfoPage from "./SideInfoPage";
import L from "leaflet";
import dashedCircle from "../assets/images/circle-dashed.png";
import solidCircle from "../assets/images/dry-clean.png";

const Dashboard = () => {
  const [showSidePage, setShowSidePage] = useState(false);
  const [selectedLot, setSelectedLot] = useState(null);
  const [isNorthCampus, setIsNorthCampus] = useState(true);
  const [hasCampusToggled, setHasCampusToggled] = useState(false);
  const [showLegend, setShowLegend] = useState(true);
  const [isLegendAnimating, setIsLegendAnimating] = useState(false);
  const sidePageRef = useRef();
  const legendButtonRef = useRef();
  const [lotCapacities, setLotCapacities] = useState({});

  const toggleSidePage = (lot) => {
    setSelectedLot(lot);
    setShowSidePage(true);
  };

  const toggleCampus = () => {
    setIsNorthCampus((prev) => !prev);
  };

  const toggleLegend = () => {
    if (showLegend) {
      setIsLegendAnimating(true);
      setTimeout(() => {
        setShowLegend(false);
        setIsLegendAnimating(false);
      }, 500);
    } else {
      setShowLegend(true);
      setIsLegendAnimating(false);
    }
  };

  const parkingLots = isNorthCampus
    ? northCampusParkingLots
    : southCampusParkingLots;

  // Dynamic URLs
  const localURL = "http://localhost:3000";
  const averagePHP = `${localURL}php/average.php`;

  useEffect(() => {
    const fetchCapacities = async () => {
      try {
        const response = await fetch(averagePHP); // No need for method: "GET"
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        console.log("Fetched data:", data); // Log fetched data

        const capacityMap = {};
        data.forEach(({ parking_lot_name, average_capacity }) => {
          capacityMap[parking_lot_name] = average_capacity;
        });

        console.log("Capacity map:", capacityMap); // Log capacity mapping
        setLotCapacities(capacityMap);
      } catch (error) {
        console.error("Failed to fetch capacities:", error);
      }
    };

    const handleClickOutside = (event) => {
      if (
        sidePageRef.current &&
        !sidePageRef.current.contains(event.target) &&
        !event.target.closest(".map-container") &&
        !(
          legendButtonRef.current &&
          legendButtonRef.current.contains(event.target)
        )
      ) {
        setShowSidePage(false);
      }
    };

    fetchCapacities();
    const interval = setInterval(fetchCapacities, 30000);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      clearInterval(interval);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [averagePHP]); // Add averagePHP if it may change

  const northCampusCenter = [43.0018, -78.7895];
  const southCampusCenter = [42.9536, -78.818];
  const northCampusBounds = [
    [42.9925, -78.805], // Southwest corner
    [43.014, -78.769], // Northeast corner
  ];
  const southCampusBounds = [
    [42.9472, -78.835], // Southwest corner
    [42.961, -78.801], // Northeast corner
  ];

  // Function to determine circle color based on capacity
  const getCircleColor = (capacity) => {
    if (capacity <= 29) return "#388E3C";
    if (capacity <= 49) return "#FFD54F";
    if (capacity <= 79) return "#FFA500";
    return "#FF0000"; // This will trigger for 80 and above
  };

  const MapComponent = () => {
    const map = useMap();
    const newCenter = isNorthCampus ? northCampusCenter : southCampusCenter;
    const bounds = isNorthCampus ? northCampusBounds : southCampusBounds;

    useEffect(() => {
      map.setView(newCenter, 16);
      map.setMaxBounds(bounds); // Set the max bounds based on the campus
      map.panInsideBounds(bounds); // Ensure the map is within bounds

      // Optional: Reset the bounds when component unmounts
      return () => {
        map.setMaxBounds(null);
      };
    }, [isNorthCampus, map, bounds]); // Include bounds as a dependency

    return null;
  };

  // for charging station coordinates:
  const chargingStationIcon = L.divIcon({
    html: `<img src="${chargingLogo}" style="width: 30px; height: 30px;" alt="Charging Station"/>`,
    className: "custom-div-icon",
    iconSize: [30, 30], // Size of the icon
    iconAnchor: [15, 15], // Anchor to center the icon
  });

  // constant variable to store a list of the charging stations
  const chargingStations = [
    // North campus
    { lat: 43.00180085211501, lng: -78.78861819514279 },
    { lat: 42.99896637226175, lng: -78.78735611282343 },
    { lat: 42.99865194144516, lng: -78.78126917457934 },
    // South Campus
    { lat: 42.95274661973357, lng: -78.81750740152215 },
  ];

  return (
    <div className="relative h-screen overflow-hidden">
      <div className="absolute inset-0 z-10">
        <MapContainer
          className="map-container"
          center={northCampusCenter}
          zoom={16}
          style={{ height: "100%", width: "100%" }}
        >
          <MapComponent />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {parkingLots.map((lot, index) => {
            const capacity = lotCapacities[lot.name] || 0;
            const color = getCircleColor(capacity);

            return (
              <Circle
                key={`${index}-${capacity}`} // Unique key to force re-render
                center={lot.coordinates}
                color={color} // Use capacity-based color for all lots
                radius={lot.radius}
                pathOptions={{
                  dashArray: lot.type === "Faculty/Staff" ? "10, 10" : null, // Dashed for Faculty/Staff
                }}
                eventHandlers={{
                  click: () => toggleSidePage(lot),
                }}
              />
            );
          })}
          {isNorthCampus ? (
            <Marker position={northCampusCenter}>
              <Popup>North Campus</Popup>
            </Marker>
          ) : (
            <Marker position={southCampusCenter}>
              <Popup>South Campus</Popup>
            </Marker>
          )}

          {chargingStations.map((station, index) => (
            <Marker
              key={index}
              position={[station.lat, station.lng]}
              icon={chargingStationIcon}
            />
          ))}
        </MapContainer>
      </div>
      {showSidePage && (
        <div ref={sidePageRef} className="absolute right-0 top-0 h-full z-20">
          <SideInfoPage
            isVisible={showSidePage}
            onClose={() => setShowSidePage(false)}
            parkingLot={selectedLot}
          />
        </div>
      )}
      <button
        onClick={toggleCampus}
        className="absolute top-20 left-16 bg-blue-500 text-white px-4 py-2 rounded z-20 animate-slide-in-left transition-colors duration-300 ease-in-out hover:bg-blue-700"
      >
        Switch to {isNorthCampus ? "South Campus" : "North Campus"}
      </button>
      {/* Jimmy I removed the legend toggler because I think it should always be there */}
      Small button to toggle the legend
      <button
        ref={legendButtonRef} // Attach the ref here
        onClick={toggleLegend}
        className="fixed bottom-80 left-4 bg-blue-500 text-white px-2 py-1 rounded z-30 animate-slide-in-left transition-colors duration-300 ease-in-out hover:bg-blue-700"
      >
        {showLegend ? "<<" : ">>"}
      </button>{" "}
      */
      {showLegend && (
        <div
          className={`absolute bottom-4 left-4 bg-white p-4 rounded shadow z-20 
                      ${
                        isLegendAnimating
                          ? "animate-slide-out-left"
                          : "animate-slide-in-left"
                      }`}
        >
          <h4 className="font-bold text-center">Legend</h4>
          <p style={{ display: "flex", alignItems: "center" }}>
            <span>
              <img
                src={dashedCircle}
                alt="Charging Station Logo"
                style={{ width: "30px", height: "30px", marginRight: "8px" }}
              />
            </span>
            Faculty Only
          </p>

          <p className="mt-2" style={{ display: "flex", alignItems: "center" }}>
            <span>
              <img
                src={solidCircle}
                alt="Charging Station Logo"
                style={{ width: "30px", height: "30px", marginRight: "8px" }}
              />
            </span>
            Students
          </p>

          <p className="mt-2" style={{ display: "flex", alignItems: "center" }}>
            <span>
              <img
                src={chargingLogo}
                alt="Charging Station Logo"
                style={{ width: "30px", height: "30px", marginRight: "8px" }}
              />
            </span>
            Charging Station
          </p>
          <h5 className="font-bold text-center mt-4">Capacity Ranges</h5>
          <p>
            <span className="text-[#388E3C]">●</span> 0-29%
          </p>
          <p>
            <span className="text-[#FFD54F]">●</span> 30-49%
          </p>
          <p>
            <span className="text-[#FFA500]">●</span> 50-79%
          </p>
          <p>
            <span className="text-[#FF0000]">●</span> 80-100%
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
