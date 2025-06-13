import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

const UpdateProfile = () => {
  const [userData, setUserData] = useState(null);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("");
  const [securityKey, setSecurityKey] = useState("");
  const [showSecurityKey, setShowSecurityKey] = useState(false);
  const [showUpdateConfirmModal, setShowUpdateConfirmModal] = useState(false); // New state for update confirmation modal

  // Ensure 'userEmail' is also correctly passed to useCookies for consistency
  const [cookies, setCookie] = useCookies(["userID", "userToken", "userEmail"]);
  const email = cookies.userEmail;
  const token = cookies.userToken;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/profile`,
          { email: cookies.userEmail },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const { success, profile } = response.data;
        if (success) {
          setUserData(profile);
          setNewName(profile.username);
          setNewEmail(profile.email);
          setNewRole(profile.role);
        } else {
          console.error("Error fetching user profile");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error.message);
      }
    };

    fetchUserProfile();
  }, [email, token]); // Added token to dependency array for completeness

  const handleRoleChange = (e) => {
    const role = e.target.value;
    setNewRole(role);
    if (role === "admin") {
      setShowSecurityKey(true);
    } else {
      setShowSecurityKey(false);
      setSecurityKey("");
    }
  };

  // Modified handleSubmit to open the confirmation modal
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newRole === "admin" && securityKey !== "2853") {
      alert("Invalid security key");
      return;
    }
    setShowUpdateConfirmModal(true); // Open the update confirmation modal
  };

  // New function to confirm and execute the profile update
  const confirmUpdateProfile = async () => {
    setShowUpdateConfirmModal(false); // Close the modal
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/updateProfile`,
        { email, updatedName: newName, updatedEmail: newEmail, updatedRole: newRole },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { success } = response.data;
      if (success) {
        alert("Profile updated successfully");

        // Update the email cookie if the email was updated
        if (newEmail !== email) {
          setCookie("userEmail", newEmail, { path: "/" });
        }

        setTimeout(() => {
          navigate("/profile");
        }, 1000);
      } else {
        console.error("Error updating profile");
        alert("Error updating profile: " + (response.data.message || "Unknown error"));
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("Unauthorized. Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        console.error("Error fetching data:", error.message);
        alert("An error occurred: " + error.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-stone-900 to-stone-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-stone-800 rounded-lg shadow-xl p-8 relative">
       
        <h2 className="text-3xl font-bold text-center text-blue-400 mb-6">Update Profile</h2>
        {userData && (
          <form onSubmit={handleSubmit}> {/* This will now trigger the modal */}
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-300 text-sm font-bold mb-2">New Name:</label>
              <input
                type="text"
                id="name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
                className="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 bg-gray-700 text-gray-100 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-300 text-sm font-bold mb-2">New Email:</label>
              <input
                type="email"
                id="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
                className="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 bg-gray-700 text-gray-100 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="role" className="block text-gray-300 text-sm font-bold mb-2">New Role:</label>
              <select
                id="role"
                value={newRole}
                onChange={handleRoleChange}
                required
                className="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 bg-gray-700 text-gray-100 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            {showSecurityKey && (
              <div className="mb-6">
                <label htmlFor="securityKey" className="block text-gray-300 text-sm font-bold mb-2">Security Key:</label>
                <input
                  type="password"
                  id="securityKey"
                  value={securityKey}
                  onChange={(e) => setSecurityKey(e.target.value)}
                  required
                  className="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 bg-gray-700 text-gray-100 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}
            <button
              type="submit" // This is still type="submit" because it triggers the handleSubmit function (which now opens the modal)
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200"
            >
              Update Profile
            </button>
          </form>
        )}

        {/* Update Confirmation Modal */}
        {showUpdateConfirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700 max-w-sm w-full text-center">
              <h3 className="text-xl font-semibold text-white mb-4">Confirm Profile Update</h3>
              <p className="text-gray-300 mb-6">Are you sure you want to update your profile with these changes?</p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={confirmUpdateProfile} // Call the function to actually update the profile
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 flex-1"
                >
                  Yes, Update
                </button>
                <button
                  onClick={() => setShowUpdateConfirmModal(false)} // Close the modal without updating
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-300 flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateProfile;