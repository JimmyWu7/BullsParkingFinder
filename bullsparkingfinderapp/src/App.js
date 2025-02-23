import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom"; // Change from BrowserRouter to HashRouter
import Login from "./components/Login";
import Register from "./components/Register";
import Map from "./components/Map";
import ForgotPassword from "./components/ForgotPassword";
import HomePage from "./components/HomePage";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";
import Settings from "./components/Settings";
import Profile from "./components/Profile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route
          path="/dashboard"
          element={
            <>
              <Navbar />
              <Dashboard />
            </>
          }
        />
        <Route
          path="/profile"
          element={
            <>
              <Navbar />
              <Profile />
            </>
          }
        />
        <Route
          path="/settings"
          element={
            <>
              <Navbar />
              <Settings />
            </>
          }
        />

        <Route
          path="/login"
          element={
            <div className="flex h-screen">
              <div className="w-1/2">
                <Map />
              </div>
              <div className="w-1/2 flex flex-col justify-center items-center">
                <Login />
              </div>
            </div>
          }
        />

        <Route
          path="/register"
          element={
            <div className="flex h-screen">
              <div className="w-1/2">
                <Map />
              </div>
              <div className="w-1/2 flex flex-col justify-center items-center">
                <Register />
              </div>
            </div>
          }
        />

        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route
          path="*"
          element={
            <h1 className="flex items-center justify-center h-screen text-4xl text-center">
              404 - Page Not Found
            </h1>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
