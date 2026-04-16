import express from "express";
import authCaptain from "../middlewares/auth.middleware";
import {
  getCaptainProfile,
  loginCaptain,
  logoutCaptain,
  registerCaptain,
} from "../controllers/captain.controller";
import {
  loginCaptainValidator,
  registerCaptainValidator,
} from "../validators/captain.validator";

const router = express.Router();

router.post("/register", registerCaptainValidator, registerCaptain);
router.post("/login", loginCaptainValidator, loginCaptain);
router.get("/profile", authCaptain, getCaptainProfile);
router.post("/logout", authCaptain, logoutCaptain);

export default router;
