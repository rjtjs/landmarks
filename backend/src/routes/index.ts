import { Router } from "express";
import landmarkRoutes from "./landmarks";

const router = Router();

router.use("/landmarks", landmarkRoutes);

export default router;
