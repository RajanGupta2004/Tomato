import { IUser } from "../../models/captain.model";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export {};
