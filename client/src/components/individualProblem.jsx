import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import Editor from 'react-simple-code-editor';
import { useCookies } from 'react-cookie';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-python';
import 'prism-themes/themes/prism-dracula.css';

// Helper to get default boilerplate code for different languages
const getDefaultBoilerplate = (language) => {
  switch (language) {
    case "c":
      return '#include <stdio.h>\nint main() {\n    printf("Hello, World!");\n    return 0;\n}';
    case "cpp":
      return '#include <iostream>\nint main() {\n    std::cout << "Hello, World!";\n    return 0;\n}';
    case "java":
      return 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}';
    case "python":
    default:
      return 'print("Hello, World!")';
  }
};


const getCookieValue = (cookieName) => {
  const name = cookieName + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(';');
  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return "";
};

const IndividualProblem = () => {
  const [problemData, setProblemData] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const { id } = useParams();
  const navigate = useNavigate();
  const [code, setCode] = useState(getDefaultBoilerplate("python")); // Initialize with Python boilerplate
  const [output, setOutput] = useState("");
  const [verdict, setVerdict] = useState("Not Applicable");
  const [input, setInput] = useState("");
  const [cookies] = useCookies(['userToken']); // Removed setCookie, removeCookie if not used
  const token = cookies.userToken;

  // Ensure PrismJS highlights correctly for the selected language
  const getLanguageHighlight = (lang) => {
    switch (lang) {
      case 'c':
        return languages.c;
      case 'cpp':
        return languages.cpp;
      case 'java':
        return languages.java;
      case 'python':
        return languages.python;
      default:
        return languages.clike; // Fallback for general C-like syntax
    }
  };


  useEffect(() => {
    const fetchProblemData = async () => {
      try {
        if (!token) {
          console.warn("No token found. Redirecting to login...");
          navigate("/login");
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/getIndividualProblem/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProblemData(response.data);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
          alert("Unauthorized. Please log in again.");
          navigate("/login");
        } else {
          console.error("Error fetching problem data:", error.message);
        }
      }
    };

    fetchProblemData();
  }, [id, navigate, token]); // Add token and navigate to dependencies

  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    setSelectedLanguage(newLanguage);
    setCode(getDefaultBoilerplate(newLanguage));
  };

  const executeCode = async () => {
    setOutput("Executing code...");
    setVerdict("Running...");
    try {
      const payload = {
        language: selectedLanguage.toLowerCase(),
        code,
        input,
      };

      const { data } = await axios.post(
        `${import.meta.env.VITE_COMPILER_URL}/compiler`,
        payload,
        {
          withCredentials: true,
        }
      );
      setOutput(data.output || "No output");
      setVerdict(data.verdict || "Code executed successfully");
    } catch (error) {
      console.error("Error in executeCode:", error);
      setOutput("Error during execution");
      setVerdict("Execution Failed");
    }
  };

  const handleSubmitClick = async () => {
    setVerdict("Submitting code...");
    try {
      const userEmail = getCookieValue("userEmail"); // Using the helper
      if (!userEmail) {
        setVerdict("User email not found. Please log in.");
        return;
      }

      const payload = {
        language: selectedLanguage.toLowerCase(),
        code,
        userEmail,
      };

      const { data } = await axios.post(
        `${import.meta.env.VITE_COMPILER_URL}/submit/${id}`,
        payload,
        {
          withCredentials: true,
        }
      );

      if (data.success === true) {
        setVerdict("Accepted!");
      } else {
        setVerdict(`Wrong Answer: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error in submitCode:", error);
      setVerdict("Submission Failed");
    }
  };

  // If problemData is not loaded, show a loading message
  if (!problemData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        Loading problem data...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 font-sans text-gray-100 flex flex-col pt-8">


      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row flex-grow p-8 gap-8">
        {/* Left Side: Problem Description */}
        <div className="w-full lg:w-1/2 flex flex-col">

          <div className="p-6 border border-gray-700 rounded-xl bg-gray-800 shadow-xl flex-grow overflow-y-auto custom-scrollbar">
            <h2 className="text-3xl font-bold text-blue-400 mb-4">
              {problemData.problemName || "Problem Title"}
            </h2>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">Problem Statement:</h3>
            <p className="text-gray-200 mb-4">{problemData.description.statement}</p>

            <h3 className="text-xl font-semibold text-gray-300 mb-2">Difficulty:</h3>
            <p className={`font-semibold mb-4 ${problemData.difficulty === 'Easy' ? 'text-green-400' :
              problemData.difficulty === 'Medium' ? 'text-yellow-400' :
                'text-red-400'
              }`}>
              {problemData.difficulty}
            </p>

            <h3 className="text-xl font-semibold text-gray-300 mb-2">Example:</h3>
            <div className="mb-4">
              <h4 className="text-lg font-medium text-gray-300 mb-1">Input</h4>
              <div className="p-4 mb-3 bg-gray-700 border border-gray-600 rounded-md font-mono text-sm text-gray-100 whitespace-pre-wrap">
                {problemData.testCases[0]?.input || "N/A"}
              </div>
              <h4 className="text-lg font-medium text-gray-300 mb-1">Output</h4>
              <div className="p-4 bg-gray-700 border border-gray-600 rounded-md font-mono text-sm text-gray-100 whitespace-pre-wrap">
                {problemData.testCases[0]?.expectedOutput || "N/A"}
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-300 mb-2">Input Description:</h3>
            <p className="text-gray-200 mb-4">{problemData.description.inputFormat || "N/A"}</p>

            <h3 className="text-xl font-semibold text-gray-300 mb-2">Output Description:</h3>
            <p className="text-gray-200">{problemData.description.outputFormat || "N/A"}</p>
          </div>
        </div>

        {/* Right Side: Code Editor and Output */}
        <div className="w-full lg:w-1/2 flex flex-col space-y-6">
          {/* Language Selector and Buttons */}
          <div className="flex items-center space-x-4">
            <div className="relative w-40"> {/* Added a relative wrapper, set a fixed width for the select */}
              <select
                value={selectedLanguage}
                onChange={handleLanguageChange}
                className="px-4 py-3 pr-10 rounded-lg border border-gray-600 bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 ease-in-out w-full text-base appearance-none"
              >
                <option value="c" className="py-2 px-4 text-base">C</option>
                <option value="cpp" className="py-2 px-4 text-base">C++</option>
                <option value="java" className="py-2 px-4 text-base">Java</option>
                <option value="python" className="py-2 px-4 text-base">Python</option>
              </select>
              {/* Custom arrow icon - this is what makes the arrow appear custom */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            <button
              className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              onClick={executeCode}
            >
              Run Code
            </button>
            <button
              className="px-6 py-3 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              onClick={handleSubmitClick}
            >
              Submit
            </button>
          </div>

          {/* Code Editor */}
          <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-xl flex-grow h-96"> {/* Fixed height for editor */}
            <Editor
              value={code}
              onValueChange={code => setCode(code)}
              highlight={code => highlight(code, getLanguageHighlight(selectedLanguage))}
              padding={20}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 14,
                outline: 'none',
                border: 'none',
                backgroundColor: '#1E1E1E', // Dark background for code
                color: '#D4D4D4', // Light text color
                minHeight: '100%', // Ensure editor takes full height of its container
                boxSizing: 'border-box', // Include padding in element's total width and height
              }}
            />
          </div>

          {/* Input, Output, Verdict Textareas */}
          <div className="flex flex-col space-y-4 flex-grow">
            <textarea
              className="w-full p-4 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y flex-grow font-mono text-sm min-h-[80px]"
              placeholder="Custom Input (optional)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <textarea
              className="w-full p-4 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y flex-grow font-mono text-sm min-h-[80px]"
              placeholder="Output"
              value={output}
              readOnly
            />
            <textarea
              className={`w-full p-4 border rounded-lg focus:outline-none focus:ring-2 resize-y flex-grow font-mono text-sm min-h-[80px] ${verdict === "Accepted!" ? "bg-green-800 border-green-700 text-green-100" :
                verdict.includes("Wrong Answer") || verdict.includes("Error") || verdict.includes("Failed") ? "bg-red-800 border-red-700 text-red-100" :
                  "bg-gray-800 border-gray-700 text-gray-100"
                }`}
              placeholder="Verdict"
              value={verdict}
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndividualProblem;