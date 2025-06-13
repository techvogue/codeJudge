# ⚖️ CodeForge - Online Judge Platform

CodeForge is a full-stack online judge platform built with the MERN stack. It enables users to submit code solutions for various programming problems, evaluate correctness via Docker-based secure execution, and receive real-time verdicts. Ideal for practice, scoring, and performance tracking.

---

## 🧩 Problem Statement

A web-based online judge system that takes user-submitted code for a given problem, runs it against predefined test cases, and returns a verdict indicating whether the solution is correct.

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
CodeForge/
├── client/ # React.js frontend
├── backend/ # Node.js + Express API
├── compiler/ # Docker-based code execution
└── README.m/

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


