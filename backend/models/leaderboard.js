import mongoose from "mongoose";
import User from "./user.js";

const leaderboardSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  noProblemsSolved: {
    type: Number,
    default: 0,
  },
});

// Middleware to populate email and username, and calculate noProblemsSolved
leaderboardSchema.pre('save', async function (next) {
  const user = await User.findById(this.userid);
  if (user) {
    this.email = user.email;
    this.username = user.username;
    this.noProblemsSolved = user.problemsSolved.length;
  }
  next();
});

const Leaderboard = mongoose.model("Leaderboard", leaderboardSchema);
export default Leaderboard;
