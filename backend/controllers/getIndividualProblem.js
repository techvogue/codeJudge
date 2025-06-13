import problem from "../models/problem.js";

const getproblembyid = async (req, res) => {
    const id  = req.params.id;
    try {
      const Problem = await problem.findById(id);
      if (!Problem) {
        return res.json({ message: "problem not found" });
      }
      res.json(Problem);
    } catch (error) {
      console.log(error);
      res.json({ message: error.message });
    }
  };

  export default getproblembyid;