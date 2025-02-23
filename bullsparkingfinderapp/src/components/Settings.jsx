import React, { useState, useEffect } from "react";

const Settings = () => {
  const [activePanel, setActivePanel] = useState("Security");

  const renderContent = () => {
    switch (activePanel) {
      case "Security":
        return <SecurityPanel />;
      case "Notifications":
        return <NotificationsPanel />;
      default:
        return <SecurityPanel />;
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      {/* Settings Card */}
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg p-8 flex">
        {/* Sidebar */}
        <div className="w-1/4 border-r pr-6">
          <button
            className={`w-full text-left p-4 mb-2 rounded-lg ${
              activePanel === "Security"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setActivePanel("Security")}
          >
            Security
          </button>
          <button
            className={`w-full text-left p-4 mb-2 rounded-lg ${
              activePanel === "Notifications"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setActivePanel("Notifications")}
          >
            Notifications
          </button>
        </div>

        {/* Main Content */}
        <div className="w-3/4 pl-6">
          <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

// Security Panel
const SecurityPanel = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Security Settings</h2>
    <p>Adjust your security preferences here.</p>
  </div>
);

// Dynamic URLs
const localURL = "http://localhost:3000";
const notifPHPUrl = `${localURL}php/notifs.php`;

// Notifications Panel

const NotificationsPanel = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false); // Track hover state

  // Fetch subscription status on component mount
  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      const authToken = localStorage.getItem("authToken");

      try {
        const response = await fetch(notifPHPUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            authToken,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setIsSubscribed(data.subscribed === 1);
          } else {
            console.error("Error fetching subscription status:", data.message);
          }
        } else {
          console.error("Failed to fetch subscription status");
        }
      } catch (error) {
        console.error("Error fetching subscription status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionStatus();
  }, []);

  const handleToggleSubscription = async () => {
    const newSubscriptionStatus = !isSubscribed;

    // Retrieve the auth token from local storage
    const authToken = localStorage.getItem("authToken");

    try {
      const response = await fetch(notifPHPUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscribed: newSubscriptionStatus ? 1 : 0, // Send 1 for subscribed, 0 for unsubscribed
          authToken,
        }),
      });

      if (response.ok) {
        setIsSubscribed(newSubscriptionStatus);
      } else {
        console.error("Failed to update subscription status:", response.status);
      }
    } catch (error) {
      console.error("Error updating subscription status:", error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Notification Settings</h2>
      <p>Configure how you receive notifications here.</p>

      {/* Loading state */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <button
          onClick={handleToggleSubscription}
          onMouseEnter={() => setIsHovered(true)} // Set hover state to true on mouse enter
          onMouseLeave={() => setIsHovered(false)} // Set hover state to false on mouse leave
          className={`mt-4 px-4 py-2 rounded-lg transition-all ${
            isSubscribed
              ? "bg-green-500 text-white hover:bg-red-500 hover:text-white" // Red background and "Unsubscribe" text on hover
              : "bg-gray-300 text-gray-700"
          }`}
        >
          {isSubscribed && isHovered
            ? "Unsubscribe"
            : isSubscribed
            ? "Subscribed"
            : "Not Subscribed"}
        </button>
      )}
    </div>
  );
};

export default Settings;
