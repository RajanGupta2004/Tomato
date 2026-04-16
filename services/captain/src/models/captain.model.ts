// src/models/user.model.ts
import mongoose, { Document } from "mongoose";

export interface ICaptain extends Document {
  name: string;
  email: string;
  password: string;
  isAvailable: Boolean;
}

const captainSchema = new mongoose.Schema<ICaptain>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAvailable: {
    type: Boolean,
    default: false,
  },
});

const Captain = mongoose.model<ICaptain>("Captain", captainSchema);
export default Captain;
