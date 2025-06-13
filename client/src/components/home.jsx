import axios from 'axios';
import Cookies from 'js-cookie';
import { Award, Code, Star, Target, TrendingUp, Trophy, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [animationStep, setAnimationStep] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [currentStatIndex, setCurrentStatIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState({
    problemsSolved: 0,
    streak: 0,
    rank: 0,
    points: 0
  });

  const welcomeText = "Welcome back, Coder!";

  // --- Fetch Leaderboard Data ---
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.warn("Leaderboard fetch: No token found in localStorage. User might be unauthenticated.");
          return;
        }

        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/leaderboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error(`Leaderboard fetch failed: HTTP status ${response.status}`);
          throw new Error('Failed to fetch leaderboard');
        }

        const leaderboardData = await response.json();

        // Map and rank the leaderboard data
        const rankedLeaderboard = leaderboardData.map((entry, index) => ({
          ...entry,
          rank: index + 1 // Assign rank based on order
        }));

        setLeaderboard(rankedLeaderboard);
      } catch (error) {
        console.error("Error fetching leaderboard:", error.message);
      }
    };

    fetchLeaderboard();
  }, []); // Runs once on mount

  // --- Fetch User Profile Data ---
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = Cookies.get('userToken');
        const email = Cookies.get('userEmail');

        if (!token || !email) {
          console.warn("Authentication details (token/email) missing for profile fetch. Redirecting to login...");
          setLoading(false); // Stop loading if authentication is missing
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
          setProfileData(profile);

          // Calculate problemsSolved count from the array length
          const problemsSolvedCount = Array.isArray(profile.problemsSolved) ? profile.problemsSolved.length : 0;
          // You need to decide how to handle streak, rank, and points
          // if your backend does not send them directly in the /profile response.
          // For now, we'll keep streak as 0 if not provided and calculate points.
          const userPoints = problemsSolvedCount * 20; // Example point calculation

          setUserStats(prevStats => ({
            ...prevStats, // Keep existing state if some props aren't updated
            problemsSolved: problemsSolvedCount,
            streak: profile.streak || 0, // Assuming profile.streak might exist, otherwise default to 0
            points: userPoints,
            // Rank will be set in the separate useEffect below
          }));
        } else {
          console.error("Error fetching user profile: Success flag is false.", response.data.message);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Axios error during profile fetch:", error.response ? error.response.data : error.message);
          if (error.response && error.response.status === 401) {
            alert("Unauthorized. Please log in again.");
            Cookies.remove('userToken'); // Clear invalid cookies
            Cookies.remove('userEmail');
            localStorage.removeItem('token'); // Clear localStorage token if used
            setTimeout(() => {
              navigate("/login");
            }, 100);
          }
        } else {
          console.error("Non-Axios error fetching profile data:", error.message);
        }
      } finally {
        setLoading(false); // Always set loading to false after profile fetch attempt
      }
    };

    fetchUserProfile();
  }, [navigate]);

  useEffect(() => {
    if (profileData && leaderboard.length > 0) {
      const currentUserInLeaderboard = leaderboard.find(
        entry => entry.email === profileData.email
      );

      if (currentUserInLeaderboard) {
        setUserStats(prevStats => ({
          ...prevStats,
          rank: currentUserInLeaderboard.rank
        }));
      } else {
        console.log("Current user not found in leaderboard to update rank.");
      }
    }
  }, [profileData, leaderboard]); // Depends on profileData and leaderboard state

  // --- Typewriter effect for welcome message ---
  useEffect(() => {
    const timer = setTimeout(() => {
      if (typedText.length < welcomeText.length) {
        setTypedText(welcomeText.slice(0, typedText.length + 1));
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [typedText, welcomeText]); // welcomeText is a dependency

  // --- Animation sequence for general UI elements ---
  useEffect(() => {
    const timer = setTimeout(() => {
      if (animationStep < 4) {
        setAnimationStep(animationStep + 1);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [animationStep]);

  // --- Cycling stats animation ---
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStatIndex((prev) => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const handleNavigation = (route) => {
    navigate(route);
  };

  // Helper component for displaying a stat card
  const StatCard = ({ icon: Icon, label, value, delay, isActive }) => (
    <div
      className={`bg-white/10 backdrop-blur-lg rounded-2xl p-3 sm:p-6 border border-white/20 transition-all duration-700 hover:bg-white/20 hover:scale-105 hover:shadow-2xl ${animationStep >= delay ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        } ${isActive ? 'ring-2 ring-cyan-400 bg-white/20' : ''}`}
    >
      <div className="flex items-center justify-between mb-3">
        <Icon className={`w-8 h-8 transition-colors duration-300 ${isActive ? 'text-cyan-400' : 'text-white/70'}`} />
        <div className={`w-2 h-2 rounded-full transition-all duration-300 ${isActive ? 'bg-cyan-400 shadow-lg shadow-cyan-400/50' : 'bg-white/30'}`}></div>
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-white/70 text-sm">{label}</div>
    </div>
  );

  const LeaderboardRow = ({ rank, username, problemsSolved, isYou, delay, email }) => (
    <div
      className={`flex items-center justify-between p-4 rounded-xl transition-all duration-500 hover:bg-white/10 ${isYou ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30' : 'bg-white/5'
        } ${animationStep >= 3 ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}
      style={{ transitionDelay: `${delay * 100}ms` }}
    >
      <div className="flex items-center space-x-4">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${rank <= 3 ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' : 'bg-white/20 text-white/70'
          }`}>
          {rank <= 3 ? <Trophy className="w-4 h-4" /> : rank}
        </div>
        <div>
          <div className={`font-semibold ${isYou ? 'text-cyan-400' : 'text-white'}`}>
            {isYou ? `${username} (You)` : username}
          </div>
          <div className="text-white/60 text-sm flex items-center">
            <Code className="w-3 h-3 mr-1" />
            {problemsSolved} problems solved
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-white font-bold">{problemsSolved * 20}</div>
        <div className="text-white/60 text-sm">points</div>
      </div>
    </div>
  );

  if (loading || !profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading awesome content...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-5 bg-gradient-to-br from-black via-neutral-900 to-black relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/10 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Floating geometric shapes (darker tones) */}
      <div className="absolute top-20 left-10 w-20 h-20 border border-gray-700 rounded-lg rotate-45 animate-bounce" style={{ animationDuration: '3s' }} />
      <div className="absolute top-40 right-20 w-16 h-16 bg-gray-800 rounded-full animate-pulse" style={{ animationDuration: '2s' }} />
      <div className="absolute bottom-20 left-20 w-12 h-12 border-2 border-gray-600 rotate-12 animate-spin" style={{ animationDuration: '8s' }} />

      <div className="relative z-10 p-8 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12 mt-5">
          <div className="mb-10">
            <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-gray-400 to-gray-100 mb-5">
              {typedText}<span className="animate-pulse">|</span>
            </h1>
            <p className={`text-xl text-gray-400 transition-all mb-10 duration-700 ${animationStep >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              Ready to level up your coding skills today?
            </p>
          </div>

          {/* CTA Buttons */}
          <div className={`flex justify-center space-x-6 transition-all duration-700 ${animationStep >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <button
              onClick={() => handleNavigation('/problemList')}
              className="bg-neutral-800 cursor-pointer hover:bg-black text-gray-100 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-md hover:shadow-cyan-500/30 flex items-center space-x-2"
            >
              <Code className="w-5 h-5" />
              <span>Solve Problems</span>
            </button>
            <button
              onClick={() => handleNavigation('/getLeaderboard')}
              className="bg-neutral-800 cursor-pointer hover:bg-black text-gray-100 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-md hover:shadow-pink-500/30 flex items-center space-x-2"
            >
              <Trophy className="w-5 h-5" />
              <span>View Rankings</span>
            </button>
          </div>
        </div>

        {/* Stats Dashboard */}
        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-16 mx-0 md:mx-10 mb-32">
          <StatCard
            icon={Target}
            label="Problems Solved"
            value={userStats.problemsSolved}
            delay={1}
            isActive={currentStatIndex === 0}
          />
          <StatCard
            icon={Award}
            label="Global Rank"
            value={userStats.rank > 0 ? `#${userStats.rank}` : 'Unranked'}
            delay={3}
            isActive={currentStatIndex === 2}
          />
          <StatCard
            icon={Star}
            label="Total Points"
            value={userStats.points}
            delay={4}
            isActive={currentStatIndex === 3}
          />
        </div>

        {/* Leaderboard Preview */}
        <div className={`bg-black/20 backdrop-blur-lg rounded-3xl p-5 sm:p-8 border border-gray-700 transition-all duration-700 ${animationStep >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="flex-row sm:flex items-center sm:justify-between mb-6">
            <div className="flex items-center md:px-5 justify-center space-x-3 mb-3 sm:mb-0">
              <Users className="md:w-8 h-8 text-gray-300" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-100">Leaderboard</h2>
            </div>
            <button
              onClick={() => handleNavigation('/getLeaderboard')}
              className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center space-x-2 transition-colors duration-300 cursor-pointer"
            >
              <span>View Full Leaderboard</span>
              <TrendingUp className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {leaderboard.slice(0, 5).map((entry, index) => (
              <LeaderboardRow
                key={entry.email}
                rank={entry.rank}
                username={entry.username}
                problemsSolved={entry.noProblemsSolved} // Assuming leaderboard still uses noProblemsSolved
                isYou={profileData && entry.email === profileData.email}
                delay={index + 1}
                email={entry.email}
              />
            ))}

          </div>
        </div>

        {/* Progress Indicator */}
        <div className={`mt-12 text-center transition-all duration-700 ${animationStep >= 4 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <div className="inline-flex items-center space-x-4 bg-black/30 backdrop-blur-lg rounded-full px-6 py-3 border border-gray-700">
            <div className="flex space-x-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${i <= currentStatIndex ? 'bg-cyan-400' : 'bg-white/20'}`}
                />
              ))}
            </div>
            <span className="text-gray-300 text-sm">Keep coding, keep growing!</span>
          </div>
        </div>
      </div>
    </div>

  );
};

export default Home;
