# ⚖️ CodeForge – Real-Time Online Code Evaluation Platform

CodeForge is a full-stack, real-time code evaluation platform built using the **MERN stack** (MongoDB, Express.js, React.js, Node.js). It allows users to submit code solutions for various programming problems, evaluate them securely using Docker-based execution, and receive instant verdicts.  
It is ideal for practicing coding problems, tracking performance, and building competitive programming skills.

---

## 🧩 Problem Statement

Build a secure, web-based online judge system that accepts user-submitted code for specific problems, runs it against predefined test cases, and returns verdicts such as `Accepted`, `Wrong Answer`, or `Time Limit Exceeded`.

---

## 🚀 Features

### 🔐 User Registration, Authentication & Authorization
- Secure sign-up/login system using JWT
- Role-based access (Admin & User – optional)
- Passwords securely hashed and stored

### 🧠 Practice Problems
- Problem set categorized by **Easy**, **Medium**, and **Hard**
- Each problem has detailed statements, constraints, and examples

### 🧪 Code Submission & Evaluation
- Real-time code execution via a "Run" feature
- "Submit" functionality evaluates code against test cases
- Verdicts include: `Accepted`, `Wrong Answer`, `Time Limit Exceeded`, etc.

### 🏆 Leaderboard 
- Scores awarded based on problem difficulty and verdict
- Displays user rankings across the platform

### 👤 Profile Management
- View and edit user profile
- Track number of problems solved
- (Optional) Privacy settings for visibility control

---

## 🧱 High-Level Design

### 📚 Database Collections

#### `Problems`
- `problemId` (string)
- `name` (string)
- `statement` (string)
- `category` (Easy/Medium/Hard)

#### `Solutions`
- `problemId` (ref)
- `userId` (ref)
- `verdict` (string)
- `submittedAt` (timestamp)

#### `TestCases`
- `problemId` (ref)
- `input` (array of strings)
- `expectedOutput` (array of strings)

#### `Users`
- `userId` (string)
- `fullName` (string)
- `email` (string)
- `password` (hashed)
- `problemsSolved` (int)

---

## 🌐 Deployment

- **Frontend**: Vercel  
  🔗 [CodeJudge Frontend](https://code-judge-57.vercel.app)

- **Backend & Compiler**: Render  
  🔗 Hosted with Docker-based execution environment

---

## 🔒 Security

- Secure user authentication using JWT
- Passwords hashed with bcrypt
- Code execution isolated in Docker containers to prevent unauthorized access and ensure runtime safety

---

## 📁 Folder Structure
```bash
CodeForge/
├── client/      # React.js frontend
├── backend/     # Node.js + Express API
├── compiler/    # Docker-based code execution
└── README.md    # Project documentation
```


---

## 💡 Web Server Overview

- RESTful APIs for problems, users, submissions, and leaderboard
- Express.js-based routing and middleware
- MongoDB for storing structured data
- Docker to sandbox and execute user-submitted code securely

---

## 📧 Contact

For queries or feedback, contact:  
📧 **vishwagautam57@gmail.com**

---

## 📜 License

This project is licensed under the **GNU General Public License v3.0**.

---

## 🛑 Contribution

This project is **not currently open** to external contributions.

---


