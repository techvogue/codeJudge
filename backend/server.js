import express from "express";
import router from "./routes/router.js";
import { DBConnection } from "./database/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// ✅ Connect to DB
DBConnection();

// ✅ Use proper CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // ✅ Do NOT wrap in array
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// ✅ Routes
app.use("/", router);

// ✅ Server configuration
const PORT = process.env.PORT || 8000;

// ✅ You don't need HOST = '0.0.0.0' unless you're deploying or testing from another machine
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
