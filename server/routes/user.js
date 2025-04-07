import express from 'express';
import { loginUser, myProfile, register } from '../controllers/user.js';
import { isAuth } from '../middlewares/isAuth.js';

const router = express.Router();

// Auth routes
router.post('/user/register', register);
router.post('/user/login', loginUser);
router.get('/user/me', isAuth, myProfile);

export default router;
