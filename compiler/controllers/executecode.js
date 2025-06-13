import { exec } from "child_process";
import path from "path";
import os from "os";

const isWindows = os.platform() === "win32";

// Output file extension (Windows: .exe, Linux: .out)
const getExecutableName = (codePath) => {
  return `${codePath}${isWindows ? ".exe" : ".out"}`;
};

const buildRunCommand = (executablePath, inputPath, outputPath, hasInput) => {
  let runCmd = `"${executablePath}"`;
  if (hasInput) {
    runCmd += ` < "${inputPath}"`;
  }
  if (outputPath) {
    runCmd += ` > "${outputPath}"`;
  }
  return runCmd;
};

const executeCppCode = (codePath, inputPath, outputPath, hasInput, callback) => {
  const executablePath = getExecutableName(codePath);
  const compileCmd = `g++ "${codePath}" -o "${executablePath}"`;
  const runCmd = buildRunCommand(executablePath, inputPath, outputPath, hasInput);
  exec(`${compileCmd} && ${runCmd}`, callback);
};

const executeCCode = (codePath, inputPath, outputPath, hasInput, callback) => {
  const executablePath = getExecutableName(codePath);
  const compileCmd = `gcc "${codePath}" -o "${executablePath}"`;
  const runCmd = buildRunCommand(executablePath, inputPath, outputPath, hasInput);

  exec(`${compileCmd} && ${runCmd}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Compilation or execution error: ${error.message}`);
      console.error(`Error stack: ${error.stack}`);
      callback(error, null);
      return;
    }
    if (stderr) {
      console.error(`Standard Error: ${stderr}`);
      callback(new Error(stderr), null);
      return;
    }
    console.log(`Standard Output: ${stdout}`);
    callback(null, stdout);
  });
};

const executePythonCode = (codePath, inputPath, outputPath, hasInput, callback) => {
  let runCmd = `python "${codePath}"`;
  if (hasInput) {
    runCmd += ` < "${inputPath}"`;
  }
  if (outputPath) {
    runCmd += ` > "${outputPath}"`;
  }
  exec(runCmd, callback);
};

const executeJavaCode = (codePath, inputPath, outputPath, hasInput, callback) => {
  // Java execution is not yet implemented, stub included for completeness
  callback(new Error("Java execution not implemented yet."), null);
};

const executeCode = (language, codePath, inputPath, outputPath, hasInput, callback) => {
  switch (language) {
    case "cpp":
      executeCppCode(codePath, inputPath, outputPath, hasInput, callback);
      break;
    case "python":
      executePythonCode(codePath, inputPath, outputPath, hasInput, callback);
      break;
    case "java":
      executeJavaCode(codePath, inputPath, outputPath, hasInput, callback);
      break;
    case "c":
      executeCCode(codePath, inputPath, outputPath, hasInput, callback);
      break;
    default:
      throw new Error(`Unsupported language: ${language}`);
  }
};

export { executeCode };
