import { Router } from "express";
import { registerUsers, loginUsers, logoutUsers, refreshToken } from "../controllers/authController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.post('/register', registerUsers);
router.post('/login', loginUsers);
router.post('/logout', authenticateToken, logoutUsers);
router.post('/refresh', refreshToken );
export default router;