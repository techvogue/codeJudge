import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';

const CreateProblem = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['userEmail' , 'userToken']);
  const token = cookies.userToken;
  const navigate = useNavigate();
  const host = import.meta.env.VITE_BACKEND_URL;
  const [formData, setFormData] = useState({
    problemName: "",
    description: {
      statement: "",
      inputFormat: "",
      outputFormat: "",
    },
    tags: [""],
    testCases: [{ input: "", expectedOutput: "" }],
    difficulty: "Easy",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("description.")) {
      const [_, key] = name.split(".");
      setFormData({
        ...formData,
        description: {
          ...formData.description,
          [key]: value,
        },
      });
    } else if (name.startsWith("tags.")) {
      const index = parseInt(name.split(".")[1], 10);
      const tags = [...formData.tags];
      tags[index] = value;
      setFormData({ ...formData, tags });
    } else if (name.startsWith("testCases.")) {
      const [_, index, key] = name.split(".");
      const testCases = [...formData.testCases];
      testCases[index][key] = value;
      setFormData({ ...formData, testCases });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addTag = () => {
    setFormData({
      ...formData,
      tags: [...formData.tags, ""],
    });
  };

  const removeTag = (index) => {
    const tags = formData.tags.filter((_, i) => i !== index);
    setFormData({ ...formData, tags });
  };

  const removeTest = (index) => {
    const testCases = formData.testCases.filter((_, i) => i !== index);
    setFormData({ ...formData, testCases });
  };

  const addTestCase = () => {
    setFormData({
      ...formData,
      testCases: [...formData.testCases, { input: "", expectedOutput: "" }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        tags: formData.tags.filter((tag) => tag.trim()), // Filter out any empty tags
      };
      console.log(data.testCases);
      const response = await axios.post(
        `${host}/addProblem`, data,
        {headers:{
          Authorization:`Bearer ${token}`,
        }}
      );
      const { success, message } = response.data;
      if (success) toast.success(message, { position: "bottom-right" });
      else toast.error(message, { position: "bottom-left" });
      setFormData({
        problemName: "",
        description: {
          statement: "",
          inputFormat: "",
          outputFormat: "",
        },
        tags: [""],
        testCases: [{ input: "", expectedOutput: "" }],
        difficulty: "Easy",
      });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("Unauthorized. Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 100);
      } else {
        console.error("Error fetching data:", error.message);
      }
    }
  };

  return (
   <div className="w-full p-8 bg-black text-gray-100 min-h-screen flex items-center justify-center"> {/* Overall black background, centered content */}
  <div
    className="max-w-3xl w-full p-8 bg-gray-900 rounded-lg shadow-lg border border-purple-800" // Dark blue/gray background for form
  >
    <h2 className="text-center text-3xl font-extrabold mb-6 text-purple-400">
      CREATE A NEW PROBLEM
    </h2>
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block mb-2 text-lg font-medium text-purple-300">
          Title
        </label>
        <input
          type="text"
          name="problemName"
          value={formData.problemName}
          onChange={handleChange}
          required
          className="w-full p-3 border border-purple-600 rounded-md bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 text-lg font-medium text-purple-300">
          Statement
        </label>
        <textarea
          id="statement"
          name="description.statement"
          value={formData.description.statement}
          onChange={handleChange}
          required
          className="w-full p-3 border border-purple-600 rounded-md min-h-[120px] bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <label
          className="block mb-2 mt-4 text-lg font-medium text-purple-300"
        >
          Input Format
        </label>
        <textarea
          id="inputFormat"
          name="description.inputFormat"
          value={formData.description.inputFormat}
          onChange={handleChange}
          required
          className="w-full p-3 border border-purple-600 rounded-md min-h-[120px] bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <label
          className="block mb-2 mt-4 text-lg font-medium text-purple-300"
        >
          Output Format
        </label>
        <textarea
          id="outputFormat"
          name="description.outputFormat"
          value={formData.description.outputFormat}
          onChange={handleChange}
          required
          className="w-full p-3 border border-purple-600 rounded-md min-h-[120px] bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <label className="block mb-2 text-lg font-medium text-purple-300">
        Tags:
      </label>
      <div className="mb-4">
        {formData.tags.map((tag, index) => (
          <div
            key={index}
            className="flex items-center mb-2"
          >
            <input
              type="text"
              id={`tag-${index}`}
              name={`tags.${index}`}
              value={tag}
              onChange={handleChange}
              className="flex-1 p-3 border border-purple-600 rounded-md bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="ml-2 p-2 rounded-md bg-red-600 text-white border-none cursor-pointer hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addTag}
          className="px-4 py-2 rounded-md bg-purple-700 text-white border-none cursor-pointer hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          Add Tag
        </button>
      </div>
      <label className="block mb-2 text-lg font-medium text-purple-300">
        Test Cases:
      </label>
      <div className="mb-4">
        {formData.testCases.map((testCase, index) => (
          <div key={index} className="mb-4 p-4 border border-blue-800 rounded-md bg-gray-800"> {/* Added a border for test cases */}
            <label
              htmlFor={`input-${index}`}
              className="block mb-2 text-md font-medium text-purple-300"
            >
              Input:
            </label>
            <textarea
              id={`input-${index}`}
              name={`testCases.${index}.input`}
              value={testCase.input}
              onChange={handleChange}
              className="w-full p-3 border border-purple-600 rounded-md min-h-[80px] bg-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label
              htmlFor={`expectedOutput-${index}`}
              className="block mb-2 mt-4 text-md font-medium text-purple-300"
            >
              Expected Output:
            </label>
            <textarea
              id={`expectedOutput-${index}`}
              name={`testCases.${index}.expectedOutput`}
              value={testCase.expectedOutput}
              onChange={handleChange}
              required
              className="w-full p-3 border border-purple-600 rounded-md min-h-[80px] bg-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => removeTest(index)}
              className="mt-2 p-2 rounded-md bg-red-600 text-white border-none cursor-pointer hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addTestCase}
          className="px-4 py-2 rounded-md bg-purple-700 text-white border-none cursor-pointer hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          Add Test Case
        </button>
      </div>
      <div className="mb-6"> {/* Increased margin bottom for dropdown */}
        <select
          name="difficulty"
          value={formData.difficulty}
          onChange={handleChange}
          className="w-full p-3 rounded-md border border-purple-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>
      <div className="text-center">
        <button
          type="submit"
          className="px-6 py-3 bg-blue-700 text-white rounded-md border-none cursor-pointer hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Create Problem
        </button>
      </div>
    </form>
    <ToastContainer className="mt-6"/> {/* Added margin top to ToastContainer */}
  </div>
</div>
  );
};

export default CreateProblem;
