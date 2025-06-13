
# OnlineJudge
=======
# DevDecider - Online Judge Platform

## Problem Statement
A simple online judge which takes a solution of a specific problem from the user and gives a verdict whether the solution is correct or not.

## Overview
DevDecider is a full-stack online judge platform designed using the MERN stack. It allows users to submit their code solutions, get them evaluated, and receive a verdict based on the correctness of their solution.

## Features
- **User Registration, Authentication and Authorization:**
  - Users can register on the website using details such as name, email, and password.
  - Authentication ensures secure login to prevent unauthorized access.
  - Users can be categorized into administrators and normal users (optional).

- **Problem for Practice:**
  - Provides a list of problems categorized as easy, medium, and hard to help users improve their skills.

- **Solution Submission, Evaluation and Scoring:**
  - Users can submit their code for evaluation and receive a verdict.
  - Includes a "Run" button for executing code and displaying output without submission.
  - Scores are provided based on the verdict and problem category, contributing to a leaderboard (optional).

- **Leaderboard:**
  - Displays an overall leaderboard showcasing users' scores from solved problems (optional).

- **Profile Management:**
  - Users can manage their profiles, view personal details, and track problems solved.
  - Privacy settings allow users to control profile visibility (optional).

## High Level Design
### 1. Database Design
- **Collection 1: Problems**
  - Problem Statement: string
  - Problem Name (Pname): string
  - Problem ID (Pid): string
  - Difficulty/Category: string

- **Collection 2: Solutions**
  - Pid: reference to Problems document (foreign key)
  - Verdict: string
  - submitted_at: date and time (auto datetime field)

- **Collection 3: Test Cases**
  - input: array
  - output: array
  - Pid: reference to Problems document (foreign key)

- **Collection 4: User Details**
  - User ID (Uid): string
  - Password: string
  - Email: string
  - Full Name: string
  - Problems Solved: Integer

### 2. Web Server Designing
- Web Server Design details (brief description)

### 3. Security
- Custom isolation for the judge using Docker to ensure security and prevent unauthorized access.

## Deployment
- **Frontend**: Deployed on Vercel - [DevDecider Frontend](https://code-judge-57.vercel.app)
- **Backend and Compiler**: Hosted on AWS

## Credits
- Credits to mentors from AlogoUniversity for guidance and support.

## Contact Information
For inquiries or support, please contact: vishwagautam57@gmail.com

---

### Note:
- **License**: This project is licensed under the GNU General Public License v3.0
- **Contribution**: Not open to contributions as per your note.

# OnlineJudge
