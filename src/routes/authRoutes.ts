import { Router } from "express";
import { registerUsers, loginUsers, logoutUsers, refreshToken } from "../controllers/authController";
import { authenticateToken } from "../middleware/auth";
import { loginLimiter, refreshTokenLimiter } from "../middleware/rateLimiter";

const router = Router();

router.post('/register', registerUsers);
router.post('/login', loginLimiter ,loginUsers);
router.post('/logout', authenticateToken, logoutUsers);
router.post('/refresh', refreshTokenLimiter, refreshToken );
export default router;