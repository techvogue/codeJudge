import problem from "../models/problem.js";

const getAllProblems = async (req, res) => {
    const { problemName } = req.query;
    try {
      let query = {};
      if (problemName) {
        query.problemName = { $regex: problemName, $options: "i" }; // Case-insensitive search
      }
      const problems = await problem.find(query);
      res.json(problems);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  export default getAllProblems;