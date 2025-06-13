import problem from "../models/problem.js";

const deleteproblem = async (req, res) => {
    const { id } = req.params;
    try {
      const Problem = await problem.findByIdAndDelete(id);
      if (!Problem) {
        return res.json({ message: "problem not found", success: false });
      }
      res.json({ message: "problem deleted successfully", success: true });
    } catch (error) {
      console.log(error);
      res.json({ message: error.message, success: false });
    }
  };

  export default deleteproblem;