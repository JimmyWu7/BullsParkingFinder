import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import parkingImage from "../assets/images/BullsParkingImage.svg";

// HTML pattern to detect tags
const htmlPattern = /<[^>]*>/g;

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Dynamic URLs
  const localURL = "http://localhost:3000";
  // Dynamic hrefs
  const loginHref = `${localURL}#/login`;

  const signUpPHPUrl = `${localURL}php/signup.php`;

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if the input fields contain any HTML tags
    if (
      htmlPattern.test(name) ||
      htmlPattern.test(email) ||
      htmlPattern.test(password) ||
      htmlPattern.test(confirmPassword)
    ) {
      alert("HTML tags are not allowed in the input fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Prepare sanitized data to send to the server
    const sanitizedData = {
      name: name.trim(), // trim extra spaces
      email: email.trim(),
      password: password.trim(),
      confirmPassword: confirmPassword.trim(),
    };

    try {
      const response = await fetch(signUpPHPUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sanitizedData),
      });

      // Log the raw response text
      const textResponse = await response.text();
      console.log("Raw response:", textResponse);

      // Handle JSON response if the response is valid JSON
      let jsonResponse;
      try {
        jsonResponse = JSON.parse(textResponse);
      } catch (error) {
        console.error("Error parsing JSON:", error);
        alert("Server responded with an error, not valid JSON.");
        return;
      }

      // Check the success of the registration
      if (jsonResponse.success) {
        alert("Registration successful!");
        // Handle successful registration (e.g., redirect or show success message)
        navigate("/login");
      } else {
        alert(jsonResponse.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-white text-center">
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
            <label className="block text-left font-semibold" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="border rounded-2xl w-full p-3 m-0"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
          <div className="mb-2">
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
          <div className="mb-2">
            <label
              className="block text-left font-semibold"
              htmlFor="confirm-password"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm-password"
              className="border rounded-2xl w-full p-3 m-0"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {/* Error Message */}
          {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
          {/* Register Button */}
          <button
            type="submit"
            className="bg-blue-500 text-white rounded w-full py-2 my-2 font-semibold hover:bg-blue-600 transition duration-200"
          >
            Register
          </button>
        </form>
        {/* Login Link */}
        <p className="text-sm">
          Have an account?{" "}
          <a href={loginHref} className="text-blue-500 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
