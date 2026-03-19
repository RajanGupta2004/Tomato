import User from "../models/user.model";
import { Request, Response } from "express";
import { comparePassword, hashPassword } from "../utils/authUtils";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import BlacklistToken from "../models/blackListToken.model";
import config from "../config/config";

import { IUser } from "../models/user.model";

interface AuthRequest extends Request {
  user?: IUser;
}

const registerUser = async (req: Request, res: Response) => {
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
    const existingUser = await User.find({ email: email });
    if (existingUser.length) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }
    const encryptedPassword = await hashPassword(password);

    const newUser = await User.create({
      name,
      email,
      password: encryptedPassword,
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, config.JWT_SECRET as string, {
      expiresIn: "7d",
    });
    res.cookie("token", token);

    return res.status(200).json({
      message: "User register successfully....",
      token,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const loginUser = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      return res
        .status(400)
        .json({ message: "User Not Found please register" });
    }

    const isMatch = await comparePassword(password, existingUser.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email and password.." });
    }

    const token = jwt.sign(
      { id: existingUser._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" },
    );
    res.cookie("token", token);

    return res.status(200).json({
      message: "User Login successfully....",
      token,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const logoutUser = async (req: Request, res: Response) => {
  try {
    const token =
      req.cookies?.token || req.headers?.authorization?.split(" ")[1];
    await BlacklistToken.create({ token });
    res.clearCookie("token");
    res.status(200).json({ message: "User logout successfully..." });
  } catch (error) {
    console.log("Error in user logout", error);
    return res.status(500).json({ message: "Unable to logout user" });
  }
};

const getUserProfile = async (req: AuthRequest, res: Response) => {
  return res.status(200).json({
    user: req.user,
  });
};

export { registerUser, loginUser, logoutUser, getUserProfile };
