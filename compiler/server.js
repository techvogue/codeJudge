import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/router.js";
import { DBConnection } from "./database/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

DBConnection();

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use("/", router);

app.listen(PORT, () => {
  console.log(`Compiler is running on port ${PORT}`);
});
