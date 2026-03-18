import{Router} from 'express';
import { getUserProfile } from '../controllers/userController';
import {Request, Response} from 'express';
import { authenticateToken } from '../middleware/auth';

const router= Router();
router.get("/profile", authenticateToken, getUserProfile);

export default router;