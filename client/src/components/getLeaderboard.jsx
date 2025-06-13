import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const GetLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [visibleEntries, setVisibleEntries] = useState(10); // State for visible entries
  const [cookies] = useCookies(['userEmail', 'userToken']);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const token = cookies.userToken;
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/leaderboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const leaderboardData = response.data;

        const rankedLeaderboard = leaderboardData.map((entry, index) => ({
          ...entry,
          rank: index + 1,
        }));

        setLeaderboard(rankedLeaderboard);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          alert('Unauthorized. Redirecting to login...');
          setTimeout(() => {
            navigate('/login');
          }, 100);
        } else {
          console.error('Error fetching data:', error.message);
        }
      }
    };

    fetchLeaderboard();
  }, [cookies.userEmail]);

  const formatRankText = (rank) => {
    if (rank === 1) return '🥇 1st';
    if (rank === 2) return '🥈 2nd';
    if (rank === 3) return '🥉 3rd';
    return `${rank}th`;
  };

  const handleLoadMore = () => {
    // You can choose to load all remaining, or load in chunks (e.g., 10 more)
    // For this example, let's load all remaining if any, or a next chunk of 10
    setVisibleEntries(prev => prev + 10); // Load 10 more entries
    // Or to load all remaining: setVisibleEntries(leaderboard.length);
  };

  const currentUserEmail = cookies.userEmail;
  const currentUserEntry = leaderboard.find((entry) => entry.email === currentUserEmail);
  const currentUserRank = currentUserEntry?.rank;
  const currentUserUsername = currentUserEntry?.username;

  // Determine if the current user's rank is outside the initial top 10
  const isCurrentUserBeyondTop10 = currentUserRank && currentUserRank > 10;

  return (
    <div className="p-6 md:p-12 bg-black text-gray-100 min-h-screen font-sans">
      <h2 className="text-4xl font-extrabold text-center mb-10 text-purple-400 drop-shadow-lg">🏆 Leaderboard</h2>

      <div className="overflow-x-auto shadow-xl rounded-lg border border-slate-200">
        <table className="min-w-full text-sm text-left bg-gray-900">
          <thead className="bg-black text-purple-200 uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-4 border-b border-slate-200">Rank</th>
              <th className="px-6 py-4 border-b border-slate-200">Username</th>
              <th className="px-6 py-4 border-b border-slate-200">Problems Solved</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.slice(0, visibleEntries).map((entry) => ( // Slice to show only visible entries
              <tr
                key={entry._id}
                className={`transition-colors
                  ${entry.email === currentUserEmail
                    ? 'bg-green-700 hover:bg-green-500 text-white font-bold'
                    : 'bg-stone-900 hover:bg-gray-800 text-gray-200'
                  }`}
              >
                <td className="px-6 py-4 border-b border-gray-800 font-medium">{formatRankText(entry.rank)}</td>
                <td className="px-6 py-4 border-b border-gray-800">{entry.username}</td>
                <td className="px-6 py-4 border-b border-gray-800">{entry.noProblemsSolved}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {leaderboard.length > visibleEntries && ( // Show "Load More" button if there are more entries
        <div className="text-center mt-8">
          <button
            onClick={handleLoadMore}
            className="px-6 py-3 bg-blue-700 text-white rounded-md border-none cursor-pointer hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 ease-in-out"
          >
            Load More
          </button>
        </div>
      )}

    </div>
  );
};

export default GetLeaderboard;