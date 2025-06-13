import { Router } from "express";
import runcode from "../controllers/compiler.js";
import judge from "../controllers/submit.js";
const router=Router();

router.post("/compiler", runcode);
router.post("/submit/:id", judge);

export default router;