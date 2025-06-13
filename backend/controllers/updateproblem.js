import problem from "../models/problem.js";

const updateProblem = async (req, res) => {
    const { id } = req.params;
    const { statement, inputFormat, outputFormat } = req.body;
    const updatedFields = {
      "description.statement": statement,
      "description.inputFormat": inputFormat,
      "description.outputFormat": outputFormat,
    };
    try {
      const Problem = await problem.findByIdAndUpdate(id, {
        $set: updatedFields,
      });
      if (!Problem) {
        return res.json({ message: "problem not found", success: false });
      }
      res.json({ message: "problem updated successfully", success: true });
      console.log(Problem.problemName);
    } catch (error) {
      console.log(error);
      res.json({ message: error.message, success: false });
    }
  };

  export default updateProblem;