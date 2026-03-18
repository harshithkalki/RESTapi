import { Router } from "express";
import { registerUsers, loginUsers, logoutUsers } from "../controllers/authController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.post('/register', registerUsers);
router.post('/login', loginUsers);
router.post('/logout', authenticateToken, logoutUsers);
export default router;