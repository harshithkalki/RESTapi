import { Router } from "express";
import { registerUsers } from "../controllers/authController";
import { loginUsers } from "../controllers/authController";

const router = Router();

router.post('/register', registerUsers);
router.post('/login', loginUsers);

export default router;