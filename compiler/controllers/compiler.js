import { generateFilePaths, ensureCodesDirectory } from "../generateFile.js";
import fs from "fs";
import { executeCode } from "./executecode.js";
import path from "path";

const runcode = async (req, res) => {
  const { language, code, input } = req.body;

  console.log("[INFO] Received request:", { language, hasCode: !!code, hasInput: !!input });

  if (!code) {
    console.log("[ERROR] No code provided in request body.");
    return res.status(400).json({ error: "Code is required" });
  }

  try {
    ensureCodesDirectory();
    console.log("[INFO] Ensured 'codes' directory exists.");
  } catch (err) {
    console.error("[ERROR] Failed to ensure 'codes' directory:", err);
    return res.status(500).json({ error: "Internal server error - directory creation failed" });
  }

  const { codePath, inputPath, outputPath } = generateFilePaths(language);
  const hasInput = Boolean(input);

  try {
    fs.writeFileSync(codePath, code);
    console.log(`[INFO] Successfully wrote code to ${codePath}`);
  } catch (error) {
    console.error(`[ERROR] Writing code to ${codePath} failed:`, error);
    return res.status(500).json({ error: `Error writing code file: ${error.message}` });
  }

  try {
    fs.writeFileSync(inputPath, hasInput ? input : "");
    console.log(`[INFO] Successfully wrote input to ${inputPath}`);
  } catch (error) {
    console.error(`[ERROR] Writing input to ${inputPath} failed:`, error);
    return res.status(500).json({ error: `Error writing input file: ${error.message}` });
  }

  console.log(`[INFO] Ready to execute. Paths:\n  Code: ${codePath}\n  Input: ${inputPath}\n  Output: ${outputPath}`);

  executeCode(
    language,
    codePath,
    inputPath,
    outputPath,
    hasInput,
    (error, stdout, stderr) => {
      if (error) {
        console.error("[ERROR] Code execution failed:", stderr);
        return res.status(500).json({ error: stderr });
      }

      try {
        const output = fs.readFileSync(outputPath, "utf-8");
        console.log("[INFO] Execution complete. Output:", output);
        return res.json({ output });
      } catch (readErr) {
        console.error("[ERROR] Failed to read output file:", readErr);
        return res.status(500).json({ error: "Error reading output file" });
      }
    }
  );
};

export default runcode;
