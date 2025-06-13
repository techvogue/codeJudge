import problem from "../models/problem.js";
import getAllProblems from "./getAllProblems.js";

const getbydifficulty = async (req, res) => {
  const { difficulty } = req.query;

  if (!difficulty) {
    return res.status(400).json({ message: "Difficulty is required" });
  }

  try {
    if (difficulty === "All") {
      // Fetch problems for "Easy", "Medium", and "Hard" difficulties
      const easyProblems = await problem.find({ difficulty: "Easy" });
      const mediumProblems = await problem.find({ difficulty: "Medium" });
      const hardProblems = await problem.find({ difficulty: "Hard" });

      // Combine all problems into a single array
      const allProblems = [...easyProblems, ...mediumProblems, ...hardProblems];

      // Return the combined array of problems
      return res.json(allProblems);
    }

    // Fetch problems for the specified difficulty
    const problems = await problem.find({ difficulty });
    res.json(problems);
  } catch (err) {
    console.error("Error in getbydifficulty:", err);
    res.status(500).json({ message: err.message });
  }
};

export default getbydifficulty;
