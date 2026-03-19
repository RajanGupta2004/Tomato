import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config/config";
import User, { IUser } from "../models/user.model";
interface JwtPayloadWithId extends jwt.JwtPayload {
  _id: string;
}

export interface AuthRequest extends Request {
  user?: IUser;
}

const authUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token =
      req.cookies?.token || req.headers?.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorised users" });
    }

    if (!config.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayloadWithId;
    console.log("decoded", decoded);

    const user = await User.findById(decoded.id).select("-password");
    console.log("user", user);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    req.user = user;

    next();
  } catch (error) {
    console.log("error", error);
    if (error instanceof Error) {
      return res.status(401).json({
        message: "Unauthorized",
        error: error.message,
      });
    }
    return res.status(401).json({
      message: "Unauthorized",
      error: "Something went wrong",
    });
  }
};
export default authUser;
