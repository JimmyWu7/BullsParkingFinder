import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// HTML pattern to detect tags
const htmlPattern = /<[^>]*>/g;

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  // Dynamic URLs
  const localURL = "http://localhost:3000";
  // Dynamic hrefs
  const loginHref = `${localURL}#/login`;

  const checkEmailPHPUrl = `${localURL}php/check_email.php`;
  const updatePasswordPHPUrl = `${localURL}php/update_password.php`;

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(checkEmailPHPUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    setIsEmailValid(data.success);
  };

  const handlePasswordChangeSubmit = async (e) => {
    e.preventDefault();

    if (newPassword === "" || confirmPassword === "") {
      alert("Email and new password are required.");
      return;
    }

    if (htmlPattern.test(newPassword) || htmlPattern.test(confirmPassword)) {
      alert("HTML tags are not allowed in the input fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const response = await fetch(updatePasswordPHPUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: newPassword }),
    });

    const data = await response.json();
    alert(data.message);

    if (data.success) {
      // Redirect to login page upon success
      navigate("/login");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-white text-center">
      <div className="p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-6">Forgot Password</h2>

        {isEmailValid === null || isEmailValid === false ? (
          <form onSubmit={handleEmailSubmit}>
            <div className="my-4">
              <label className="block text-left font-semibold" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="border rounded-2xl w-full p-3 m-0"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {isEmailValid === false && (
                <p className="text-red-500 mt-2">
                  Email not found. Please try again.
                </p>
              )}
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white rounded w-full py-2 my-2 font-semibold hover:bg-blue-600 transition duration-200"
            >
              Check Email
            </button>
          </form>
        ) : (
          <form onSubmit={handlePasswordChangeSubmit}>
            <p className="mb-4">Valid email. Please enter your new password.</p>
            <div className="my-4">
              <label
                className="block text-left font-semibold"
                htmlFor="newPassword"
              >
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                className="border rounded-2xl w-full p-3 m-0"
                placeholder="Enter new password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="my-4">
              <label
                className="block text-left font-semibold"
                htmlFor="confirmPassword"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="border rounded-2xl w-full p-3 m-0"
                placeholder="Confirm new password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white rounded w-full py-2 my-2 font-semibold hover:bg-blue-600 transition duration-200"
            >
              Change Password
            </button>
          </form>
        )}

        <p className="mt-4 text-sm">
          Remember your password?{" "}
          <a href={loginHref} className="text-blue-500 hover:underline">
            Back to Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
