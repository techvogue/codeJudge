import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuid } from "uuid";

// Resolve __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("Resolved __filename:", __filename);
console.log("Resolved __dirname:", __dirname);

const generateFilePaths = (language) => {
  const uuidpath = uuid(); // Generate a unique identifier
  console.log(`Generated UUID: ${uuidpath}`);
  
  let codeFile;
  let className;

  switch (language) {
    case 'c':
      codeFile = ".c";
      className = uuidpath;
      break;
    case 'cpp':
      codeFile = ".cpp";
      className = uuidpath;
      break;
    case 'python':
      codeFile = ".py";
      className = uuidpath;
      break;
    default:
      console.error(`Unsupported language: ${language}`);
      throw new Error(`Unsupported language: ${language}`);
  }

  const codeFile1 = className + codeFile;
  const inputFile = "input.txt";
  const outputFile = "output.txt";
  const inputFile1 = uuidpath + inputFile;
  const outputFile1 = uuidpath + outputFile;

  const baseDir = path.join(__dirname, "./codes");

  const codePath = path.join(baseDir, codeFile1);
  const inputPath = path.join(baseDir, inputFile1);
  const outputPath = path.join(baseDir, outputFile1);

  console.log(`Paths generated for language: ${language}`);
  console.log("Code path:", codePath);
  console.log("Input path:", inputPath);
  console.log("Output path:", outputPath);

  return { codePath, inputPath, outputPath };
};

const ensureCodesDirectory = () => {
  const codesDir = path.join(__dirname, "./codes");
  console.log("Checking for directory:", codesDir);

  if (!fs.existsSync(codesDir)) {
    console.log("Directory does not exist. Creating...");
    fs.mkdirSync(codesDir, { recursive: true });
    console.log(`Created directory: ${codesDir}`);
  } else {
    console.log("Directory already exists.");
  }
};

export { generateFilePaths, ensureCodesDirectory };
