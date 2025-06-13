import express from "express";
import jwtAuth from "../middleware/jwtAuthentication.js";
import signup from "../controllers/signUp.js";
import login from "../controllers/login.js";
import logout from "../controllers/logout.js";
import create from "../controllers/addProblem.js"
import getAllProblems from "../controllers/getAllProblems.js";
import getproblembyid from "../controllers/getIndividualProblem.js";
import deleteproblem from "../controllers/deleteProblem.js";
import updateProblem from "../controllers/updateproblem.js";
import getleaderboard from "../controllers/leaderboard.js";
import getbydifficulty from "../controllers/getByDifficulty.js";
import profile from "../controllers/profile.js";
import deleteUser from "../controllers/deleteUser.js";
import updateProfile from "../controllers/updateProfile.js";

const router = express.Router();

// Public Routes
router.post("/signUp", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/getAllProblems", getAllProblems);
router.get("/getByDifficulty", getbydifficulty);
router.get("/deleteProblem/:id", deleteproblem);
router.put("/updateProblem/:id", updateProblem);

// Protected Routes 
router.post("/addProblem", jwtAuth, create);
router.get("/getIndividualproblem/:id", jwtAuth, getproblembyid);
router.get("/leaderboard", jwtAuth, getleaderboard);
router.post("/profile", jwtAuth, profile);
router.post("/deleteUser", jwtAuth, deleteUser);
router.post("/updateProfile", jwtAuth, updateProfile);

export default router;
