import express from 'express';
import { getProflie, Login, Logout, Register } from '../controllers/authController.js';
import authCheck from '../middlewares/protectedRoute.js';

const router = express.Router();

router.post('/register', Register)
router.post('/login', Login)
router.post('/logout', Logout)
router.get('/profile', authCheck, getProflie)

export default router;