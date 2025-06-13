import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateProblem = () => {
  const host = import.meta.env.VITE_BACKEND_URL;
  const { id } = useParams(); // Fetching the problem ID from URL params
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    statement: "",
    inputFormat: "",
    outputFormat: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${host}/updateProblem/${id}`, formData);
      const { success, message } = response.data;
      if (success) {
        toast.success(message, { position: "bottom-right" });
        setTimeout(() => {
          navigate(`/individualProblem/${id}`);
        }, 1000);
      } else {
        toast.error(message, { position: "bottom-left" });
      }
    } catch (error) {
      console.error("Error updating problem:", error.message);
      alert("Error updating problem. Please try again.");
    }
  };

  return (
    <div className="w-full p-8 bg-black text-gray-100 min-h-screen"> {/* Overall black background */}

  <div className="max-w-xl mx-auto p-8 bg-gray-900 rounded-lg shadow-lg border border-purple-800"> {/* Dark blue/gray background for form */}
    <h2 className="text-center text-3xl font-extrabold mb-6 text-purple-400">UPDATE PROBLEM</h2> {/* Purple heading */}
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <label htmlFor="statement" className="block mb-2 text-lg font-medium text-purple-300">Statement</label> {/* Purple-ish labels */}
        <textarea
          id="statement"
          name="statement"
          value={formData.statement}
          onChange={handleChange}
          required
          className="w-full p-3 border border-purple-600 rounded-md min-h-[120px] bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <label htmlFor="inputFormat" className="block mt-4 mb-2 text-lg font-medium text-purple-300">Input Format</label>
        <textarea
          id="inputFormat"
          name="inputFormat"
          value={formData.inputFormat}
          onChange={handleChange}
          required
          className="w-full p-3 border border-purple-600 rounded-md min-h-[120px] bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <label htmlFor="outputFormat" className="block mt-4 mb-2 text-lg font-medium text-purple-300">Output Format</label>
        <textarea
          id="outputFormat"
          name="outputFormat"
          value={formData.outputFormat}
          onChange={handleChange}
          required
          className="w-full p-3 border border-purple-600 rounded-md min-h-[120px] bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="text-center">
        <button
          type="submit"
          className="px-6 py-3 bg-blue-700 text-white rounded-md border-none cursor-pointer hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Update Problem
        </button>
      </div>
    </form>
    <div className="mt-6">
      <ToastContainer />
    </div>
  </div>
</div>
  );
  
};

export default UpdateProblem;
