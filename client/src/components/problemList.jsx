import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const ProblemList = () => {
  const [problems, setProblems] = useState([]);
  const navigate = useNavigate();
  const [cookies] = useCookies(["userEmail", "userToken"]);
  const email = cookies.userEmail;
  const token = cookies.userToken;
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchProblems = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/getAllProblems`
      );
      setProblems(response.data);
    } catch (error) {
      console.error("Error fetching problems:", error.message);
      setErrorMessage("Failed to fetch problems.");
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!email || !token) {
          console.warn("Authentication details missing. Redirecting to login...");
          navigate("/login");
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
          setIsAdmin(profile.role === 1);
        } else {
          console.error("Error fetching user profile:", response.data.message);
          setErrorMessage("Failed to fetch user profile.");
          setTimeout(() => setErrorMessage(null), 3000);
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
          alert("Unauthorized. Redirecting to login...");
          navigate("/login");
        } else {
          console.error("Error fetching user profile data:", error.message);
          setErrorMessage("An error occurred while fetching user data.");
          setTimeout(() => setErrorMessage(null), 3000);
        }
      }
    };

    fetchUserProfile();
    fetchProblems();
  }, [email, token, navigate]);

  const handleDeleteProblem = async (problemId) => {
    try {
      const profileResponse = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/profile`,
        { email: email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { success, profile } = profileResponse.data;

      if (success && profile.role === 1) {
        await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/deleteProblem/${problemId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSuccessMessage("Problem deleted successfully");
        setTimeout(() => setSuccessMessage(null), 1500);
        fetchProblems();
      } else {
        setErrorMessage("You are not authorized to delete problems.");
        setTimeout(() => setErrorMessage(null), 1500);
      }
    } catch (error) {
      console.error("Error deleting problem:", error.message);
      setErrorMessage("Error deleting problem");
      setTimeout(() => setErrorMessage(null), 1500);
    }
  };

  const getProblemsByDifficulty = async (difficulty = "") => {
    try {
      const url = difficulty && difficulty !== "All"
        ? `${import.meta.env.VITE_BACKEND_URL}/getByDifficulty`
        : `${import.meta.env.VITE_BACKEND_URL}/getAllProblems`;

      const difficultyResponse = await axios.get(url, {
        params: difficulty && difficulty !== "All" ? { difficulty } : {},
      });
      setProblems(difficultyResponse.data);
    } catch (error) {
      console.error("Error fetching problems by difficulty:", error.message);
      setErrorMessage("Error fetching problems by difficulty");
      setTimeout(() => setErrorMessage(null), 1500);
    }
  };

  const handleDifficultyChange = (event) => {
    const difficulty = event.target.value;
    setSelectedDifficulty(difficulty);
    getProblemsByDifficulty(difficulty);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredProblems = useMemo(() => {
    let currentProblems = problems;

    // Apply search filter
    if (searchTerm) {
      currentProblems = currentProblems.filter(problem =>
        problem.problemName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return currentProblems;
  }, [problems, searchTerm]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-8 font-sans">
      <nav className="mb-6 flex justify-end">
        {isAdmin && (
          <button
            onClick={() => navigate("/addProblem")}
            className="px-6 py-3 bg-emerald-700 text-neutral-100 rounded-lg shadow-md hover:bg-emerald-800 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-opacity-75"
          >
            Add Problem
          </button>
        )}
      </nav>

      <hr className="my-6 border-neutral-700" />

      {/* Filter and Search Section */}
      <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-10">
        {/* Difficulty Filter */}
        <div className="flex items-center w-full sm:w-auto md:w-1/3 lg:w-1/4">
          <label htmlFor="difficulty" className="mr-3 text-lg whitespace-nowrap text-neutral-200">
            Filter by difficulty:
          </label>
          <div className="relative w-full">
            <select
              id="difficulty"
              value={selectedDifficulty}
              onChange={handleDifficultyChange}
              className="px-4 py-3 pr-10 rounded-lg border border-neutral-600 bg-neutral-800 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-300 ease-in-out w-full text-base appearance-none"
            >
              <option value="All" className="py-2 px-4 bg-neutral-800">All</option>
              <option value="Easy" className="py-2 px-4 bg-neutral-800">Easy</option>
              <option value="Medium" className="py-2 px-4 bg-neutral-800">Medium</option>
              <option value="Hard" className="py-2 px-4 bg-neutral-800">Hard</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-400">
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex items-center w-full sm:w-auto md:w-2/3 lg:w-1/2">
          <input
            type="text"
            placeholder="Search problems..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="p-3 rounded-lg border border-neutral-600 bg-neutral-800 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-300 ease-in-out w-full"
          />
        </div>
      </div>

      {/* Success and Error Messages */}
      {successMessage && (
        <div className="bg-emerald-900 text-emerald-300 p-4 rounded-lg mb-4 text-center">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="bg-red-900 text-red-300 p-4 rounded-lg mb-4 text-center">
          {errorMessage}
        </div>
      )}

      {/* Problems List */}
      <div>
        {filteredProblems.length > 0 ? (
          filteredProblems.map((problem) => (
            <div key={problem._id} className="bg-stone-900 p-6 rounded-lg shadow-lg mb-6 border border-neutral-700 hover:border-blue-600 transition duration-300 ease-in-out">
              <h3 className="text-2xl font-bold text-stone-400 mb-2">{problem.problemName}</h3>
              <p className="text-neutral-400 mb-4">Difficulty: <span className={`font-semibold ${problem.difficulty === 'Easy' ? 'text-emerald-500' : problem.difficulty === 'Medium' ? 'text-amber-500' : 'text-red-500'}`}>
                {problem.difficulty}
              </span></p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate(`/individualProblem/${problem._id}`)}
                  className="px-6 py-3 bg-blue-700 text-neutral-100 rounded-lg shadow-md hover:bg-blue-800 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-75"
                >
                  Code
                </button>
                {isAdmin && (
                  <>
                    <button
                      onClick={() => handleDeleteProblem(problem._id)}
                      className="px-6 py-3 bg-red-700 text-neutral-100 rounded-lg shadow-md hover:bg-red-800 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-75"
                    >
                      Delete Problem
                    </button>
                    <button
                      onClick={() => navigate(`/updateProblem/${problem._id}`)}
                      className="px-6 py-3 bg-indigo-700 text-neutral-100 rounded-lg shadow-md hover:bg-indigo-800 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-75"
                    >
                      Update Problem
                    </button>
                  </>
                )}
              </div>
              <hr className="my-6 border-neutral-700" />
            </div>
          ))
        ) : (
          <p className="text-neutral-400 text-center text-xl mt-10">No problems found matching your criteria.</p>
        )}
      </div>
    </div>
  );
};

export default ProblemList;