import React, { useState, useEffect, useRef } from "react";
import defaultImg from "../assets/images/default.jpg";
import { Camera } from "lucide-react";

// Dynamic URLs
const localURL = "http://localhost:3000";
const profilePicPHP = `${localURL}php/upload_profile_pic.php`;
const getUserInfoPHP = `${localURL}php/get_user_info.php`;

const Profile = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [profilePic, setProfilePic] = useState(defaultImg);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null); // For temporary preview
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("authToken");

        if (!token) {
          console.error("No auth token found in localStorage.");
          return;
        }

        const response = await fetch(getUserInfoPHP, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (response.ok) {
          setFormData({
            name: data.name || "",
            email: data.email || "",
            password: "",
          });
          setProfilePic(data.profile_pic || defaultImg);
        } else {
          console.error(
            "Failed to fetch profile data:",
            data.message || "Unknown error"
          );
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const previewURL = URL.createObjectURL(file);
      setPreview(previewURL); // Set temporary preview
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (selectedFile) {
        const uploadData = new FormData();
        uploadData.append("profile_picture", selectedFile);

        const token = localStorage.getItem("authToken");

        const response = await fetch(profilePicPHP, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: uploadData,
        });

        const result = await response.json();

        if (result.success) {
          setProfilePic(result.file_path); // Update profile picture URL
          setPreview(null); // Clear the preview
          alert("Profile picture uploaded successfully!");
          window.location.reload();
        } else {
          alert(result.message || "Failed to upload profile picture.");
        }
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating the profile.");
    }
  };

  // Trigger the file input when the profile image is clicked
  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  // Clean up object URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 mt-6">
      <div className="bg-white shadow-lg rounded-lg w-auto p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Profile</h2>
        <div className="flex justify-center mb-4">
          {/* Profile image container with overlayed camera icon */}
          <div className="relative group">
            <img
              src={preview || profilePic || defaultImg} // Use preview if available, else current profile pic
              alt="Profile Avatar"
              className="w-32 h-32 rounded-full border-4 border-blue-500 cursor-pointer object-cover transition-opacity group-hover:opacity-75"
              onClick={handleImageClick}
            />
            {/* Camera Icon that appears on hover */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-8 h-8 text-white" />
            </div>

            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png,image/jpeg,image/gif,image/jpg"
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="block text-gray-700 text-sm font-semibold">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name || "Guest"}
              onChange={handleChange}
              disabled
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700 text-sm font-semibold">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email || "guest@buffalo.edu"}
              onChange={handleChange}
              disabled
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700 text-sm font-semibold">
              Password
            </label>
            <input
              type="password"
              name="password"
              value="********"
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              disabled
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
