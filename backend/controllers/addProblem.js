import problem from "../models/problem.js";

const create = async (req, res, next) => {
    console.log("request");
    const { problemName, description, testCases, tags, difficulty } = req.body;
    const probfound = await problem.findOne({ problemName });
    if (probfound) {
      console.log("not created");
      return res.json({ message: "problem already exist", success: false });
    }
    try {
      const Problem = await problem.create({
        problemName,
        description,
        testCases,
        tags,
        difficulty,
      });
      await Problem.save();
      return res.status(201).json({
        message: "problem created successfully",
        success: true,
      });
      next();
    } catch (error) {
      console.log(error);
      res.status(500).send({ success: false, message: "Server error" });
    }
  };

  export default create;