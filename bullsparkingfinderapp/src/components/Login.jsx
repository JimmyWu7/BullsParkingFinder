import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import parkingImage from "../assets/images/BullsParkingImage.svg";

// HTML pattern to detect tags
const htmlPattern = /<[^>]*>/g;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Dynamic URLs
  const localURL = "http://localhost:3000";
  // Dynamic hrefs
  const forgotPasswordLink = `${localURL}#/forgot-password`;
  const registerHref = `${localURL}#/register`;

  const loginPHPUrl = `${localURL}php/login.php`;

  // Helper function to save token in localStorage
  const saveTokenToLocalStorage = (token) => {
    localStorage.setItem("authToken", token); // Save token to local storage
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if the input fields contain any HTML tags
    if (htmlPattern.test(email) || htmlPattern.test(password)) {
      alert("HTML tags are not allowed in the input fields.");
      return;
    }
    // Prepare sanitized data to send to the server
    const sanitizedData = {
      email: email.trim(), // trim extra spaces
      password: password.trim(),
    };

    try {
      const response = await fetch(loginPHPUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sanitizedData),
      });
      // Handle the response
      if (response.ok) {
        const jsonResponse = await response.json();
        if (jsonResponse.success) {
          console.log("Login successful:", jsonResponse.message);
          saveTokenToLocalStorage(jsonResponse.token); // Save JWT token
          alert(jsonResponse.message);
          // Redirect or show success message
          navigate("/dashboard");
        } else {
          console.error("Login failed:", jsonResponse.message);
          alert(jsonResponse.message);
        }
      } else {
        console.error("Login failed:", response.statusText);
        alert("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle fetch error (e.g., network issues)
    }
  };

  return (
    <div className="flex items-center justify-center rounded text-center p-6 h-screen">
      <div className="p-6">
        {/* Image Section */}
        <div className="mb-4">
          <img
            src={parkingImage}
            alt="Parking Finder"
            className="mx-auto mb-4 w-32"
          />
          <h2 className="text-2xl font-bold mb-6">BULLS PARKING FINDER</h2>
        </div>
        {/* Form Section */}
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="block text-left font-semibold" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="border rounded-2xl w-full p-3 m-0"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="">
            <label className="block text-left font-semibold" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="border rounded-2xl w-full p-3 m-0"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end">
            <a
              href={forgotPasswordLink}
              className="text-sm text-blue-500 hover:underline"
            >
              Forgot Password?
            </a>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="bg-blue-500 text-white rounded w-full py-2 my-4 font-semibold hover:bg-blue-600 transition duration-300 ease-in-out transform hover:-translate-y-1"
          >
            Sign In
          </button>
        </form>
        {/* Sign Up Link */}
        <p className="text-sm">
          Don’t have an account yet?{" "}
          <a href={registerHref} className="text-blue-500 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
