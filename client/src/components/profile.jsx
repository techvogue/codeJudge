import axios from "axios";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [cookies, , removeCookie] = useCookies(["userEmail", "userToken"]);
  const navigate = useNavigate();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

  const showAlert = (message, type = 'success') => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlertModal(true);
  };

  const showConfirmation = () => {
    setShowConfirmModal(true);
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = cookies.userToken;
        const email = cookies.userEmail;

        if (!token || !email) {
          showAlert("Authentication details missing. Redirecting to login...", "error");
          setTimeout(() => {
            navigate("/login");
          }, 500);
          return;
        }

        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/profile`,
          { email: email },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const { success, profile } = response.data;
        if (success) {
          setUserData(profile);
        } else {
          console.error("Error fetching user profile:", response.data.message || "Unknown error");
          showAlert(response.data.message || "Failed to fetch user profile.", "error");
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
          showAlert("Unauthorized. Redirecting to login...", "error");
          setTimeout(() => {
            navigate("/login");
          }, 100);
        } else {
          console.error("Error fetching data:", error.message);
          showAlert("An error occurred while fetching your profile data.", "error");
        }
      }
    };

    fetchUserProfile();
  }, [cookies.userEmail, cookies.userToken, navigate]);

  const handleDeleteAccount = async () => {
    showConfirmation();
  };

  const confirmDeleteAccount = async () => {
    setShowConfirmModal(false);
    try {
      const token = cookies.userToken;
      const email = cookies.userEmail;

      if (!token || !email) {
        showAlert("Authentication details missing. Cannot delete account.", "error");
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/deleteUser`,
        { email: email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      if (response.data.success) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        removeCookie('userEmail', { path: '/' });
        removeCookie('userToken', { path: '/' });

        showAlert("Account deleted successfully", "success");
        setTimeout(() => navigate('/login'), 1500);
      } else {
        showAlert(response.data.message || "Failed to delete account. Please try again.", "error");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      if (axios.isAxiosError(error) && error.response) {
        showAlert(error.response.data.message || "Failed to delete account. Please try again.", "error");
      } else {
        showAlert("An unexpected error occurred while deleting your account. Please try again.", "error");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-stone-900 to-stone-700 font-sans text-gray-100 flex flex-col items-center p-8">
      {/* Navigation - Styled for responsiveness */}
      <div className="w-full max-w-md flex flex-col md:flex-row justify-between items-center gap-5  mb-8 pt-10 md:pt-16 px-4">
        <button
          onClick={() => navigate("/updateProfile")}
          className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
        >
          Update Profile
        </button>
        <button
          onClick={handleDeleteAccount}
          className="w-full md:w-auto px-6 py-3 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75"
        >
          Delete Account
        </button>
      </div>

      {/* Profile Card */}
      <div className="w-full max-w-md bg-stone-900 p-8 rounded-xl shadow-sm shadow-white border border-stone-600 ">
        {userData ? (
          <div>
            <h2 className="text-3xl font-bold text-blue-400 mb-6 text-center">User Profile</h2>
            <div className="space-y-4">
              <p className="flex justify-between items-center text-lg">
                <strong className="text-gray-300">Name:</strong>
                <span className="text-gray-100">{userData.username}</span>
              </p>
              <p className="flex justify-between items-center text-lg">
                <strong className="text-gray-300">Email:</strong>
                <span className="text-gray-100">{userData.email}</span>
              </p>
              <p className="flex justify-between items-center text-lg">
                <strong className="text-gray-300">Role:</strong>
                <span className={`font-semibold ${userData.role === 1 ? 'text-purple-400' : 'text-green-400'}`}>
                  {userData.role === 1 ? "Admin" : "User"}
                </span>
              </p>
              <p className="flex justify-between items-center text-lg">
                <strong className="text-gray-300">Problems Solved:</strong>
                <span className="text-gray-100">{userData.problemsSolved?.length || 0}</span>
              </p>
            </div>
          </div>
        ) : (
          <p className="text-center text-xl text-gray-300">Loading user data...</p>
        )}
      </div>

      {/* Custom Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700 max-w-sm w-full text-center">
            <h3 className="text-xl font-semibold text-white mb-4">Confirm Deletion</h3>
            <p className="text-gray-300 mb-6">Are you sure you want to delete your account? This action cannot be undone.</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={confirmDeleteAccount}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Alert Modal */}
      {showAlertModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className={`p-8 rounded-xl shadow-2xl border ${alertType === 'success' ? 'bg-green-800 border-green-700' : 'bg-red-800 border-red-700'} max-w-sm w-full text-center`}>
            <p className="text-white text-lg mb-6">{alertMessage}</p>
            <button
              onClick={() => setShowAlertModal(false)}
              className={`px-6 py-3 rounded-lg text-white ${alertType === 'success' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} transition duration-300`}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;