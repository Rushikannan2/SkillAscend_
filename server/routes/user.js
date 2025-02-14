import express from "express";
import { loginUser, myProfile, register, verifyUser, logoutUser } from "../controllers/user.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

router.get('/', (req, res) => {
    res.json(req.oidc.user);
});

export default router;
