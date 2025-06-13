import Problem from "../models/problem.js";
import axios from "axios";
import compareOutput from "./compare.js";
import util from 'util'; // Import util for improved logging
import User from "../models/user.js";
import Leaderboard from "../models/leaderboard.js";

const judge = async (req, res) => {
  const { language, code, userEmail } = req.body;
  const id = req.params.id;

  console.log(`Received request for problem ID: ${id}`);
  console.log(`Language: ${language}, Code: ${code}`);

  try {
    const problem = await Problem.findById(id);
    if (!problem) {
      console.log(`Problem with ID ${id} not found.`);
      return res.status(404).json({ success: false, message: "Problem not found" });
    }

    const testCases = problem.testCases;
    console.log(`Test cases: ${JSON.stringify(testCases)}`);

    let testResults = [];
    for (let i = 0; i < testCases.length; i++) {
      const input = testCases[i].input;
      const expectedOutput = testCases[i].expectedOutput;
      console.log("Preparing to send code to compiler service");

      try {
        const response = await axios.post(`${process.env.COMPILER_URL}/compiler`, {
          code,
          language,
          input,
        });
        console.log("Received response from compiler service");

        console.log(`Result for testcase ${i + 1}: ${JSON.stringify(response.data)}`);

        const isCorrect = compareOutput(response.data.output, expectedOutput);
        if (!isCorrect) {
          testResults.push({ testcase: i + 1, success: false });
          console.log(`Testcase ${i + 1} failed`);
          return res.status(200).json({
            success: false,
            message: `Testcase ${i + 1} failed`,
            testResults,
          });
        } else {
          testResults.push({ testcase: i + 1, success: true });
        }
      } catch (compilerError) {
        console.error(`Error calling compiler service: ${compilerError.message}`);
        if (compilerError.response) {
          console.error(`Response data: ${util.inspect(compilerError.response.data, { depth: null })}`);
          console.error(`Response status: ${compilerError.response.status}`);
          console.error(`Response headers: ${util.inspect(compilerError.response.headers, { depth: null })}`);
        } else if (compilerError.request) {
          console.error(`No response received: ${util.inspect(compilerError.request, { depth: null })}`);
        } else {
          console.error(`Error setting up the request: ${compilerError.message}`);
        }
        return res.status(500).json({ success: false, message: `Error calling compiler service: ${compilerError.message}` });
      }
    }

    console.log("All test cases passed");

    if (userEmail) {
      const user = await User.findOneAndUpdate(
        { email: userEmail },
        { $addToSet: { problemsSolved: id } },
        { new: true }
      );

      const leaderboard = await Leaderboard.findOneAndUpdate(
        { email:userEmail},
        { $set: { noProblemsSolved: user.problemsSolved.length } },
        { new: true }
      );
    }
    

    return res.status(200).json({
      success: true,
      message: "All testcases passed",
      testResults,
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default judge;
