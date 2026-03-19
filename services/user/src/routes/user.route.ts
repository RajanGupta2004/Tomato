import express from "express";
import {
  getUserProfile,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controller";
import {
  loginUserValidator,
  registerUserValidator,
} from "../validators/user.validator";
import authUser from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/register", registerUserValidator, registerUser);
router.post("/login", loginUserValidator, loginUser);
router.get("/profile", authUser, getUserProfile);
router.post("/logout", authUser, logoutUser);

export default router;
