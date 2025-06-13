import Leaderboard from "../models/leaderboard.js";
import User from "../models/user.js"; // Import User model for population

const getleaderboard = async (req, res) => {
  try {
    // Fetch all leaderboard entries sorted by noProblemsSolved descending
    const leaderboard = await Leaderboard.find()
      .sort({ noProblemsSolved: -1 })
      .populate({
        path: 'userid',
        select: 'username problemsSolved',
        model: User,
      });

    // Log the leaderboard entries
    console.log("Leaderboard Entries:");
    leaderboard.forEach(entry => {
      console.log(`Username: ${entry.username}, Problems Solved: ${entry.noProblemsSolved}`);
    });

    // Return the leaderboard entries as JSON response
    res.json(leaderboard);
  } catch (err) {
    console.error("Error fetching leaderboard", err);
    res.status(500).json({ error: "Error fetching leaderboard" });
  }
};

export default getleaderboard;
