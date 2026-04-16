import { Request, Response } from "express";
import { comparePassword, hashPassword } from "../utils/authUtils";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import BlacklistToken from "../models/blackListToken.model";
import config from "../config/config";

import Captain, { ICaptain } from "../models/captain.model";

interface AuthRequest extends Request {
  captain?: ICaptain;
}

const registerCaptain = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All field are required....",
      });
    }
    const existingCaptain = await Captain.find({ email: email });
    if (existingCaptain.length) {
      return res
        .status(400)
        .json({ message: "Captain already exists with this email" });
    }
    const encryptedPassword = await hashPassword(password);

    const newCaptain = await Captain.create({
      name,
      email,
      password: encryptedPassword,
    });

    await newCaptain.save();

    const token = jwt.sign(
      { id: newCaptain._id },
      config.JWT_SECRET as string,
      {
        expiresIn: "7d",
      },
    );
    res.cookie("token", token);

    return res.status(200).json({
      message: "Captain register successfully....",
      token,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const loginCaptain = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { email, password } = req.body;

    const existingCaptain = await Captain.findOne({ email: email });
    if (!existingCaptain) {
      return res
        .status(400)
        .json({ message: "Captain Not Found please register" });
    }

    const isMatch = await comparePassword(password, existingCaptain.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email and password.." });
    }

    const token = jwt.sign(
      { id: existingCaptain._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" },
    );
    res.cookie("token", token);

    return res.status(200).json({
      message: "Captain Login successfully....",
      token,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const logoutCaptain = async (req: Request, res: Response) => {
  try {
    const token =
      req.cookies?.token || req.headers?.authorization?.split(" ")[1];
    await BlacklistToken.create({ token });
    res.clearCookie("token");
    res.status(200).json({ message: "Captain logout successfully..." });
  } catch (error) {
    console.log("Error in Captain logout", error);
    return res.status(500).json({ message: "Unable to logout Captain" });
  }
};

const getCaptainProfile = async (req: AuthRequest, res: Response) => {
  const captain = await Captain.findById(req?.captain?._id);
  if (!captain) {
    return res.status(404).json({
      message: "captain not found",
    });
  }
  return res.status(200).json({
    captain,
  });
};

export { registerCaptain, loginCaptain, logoutCaptain, getCaptainProfile };
