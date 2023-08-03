import mongoose, { Schema, model, Model } from "mongoose";
import { IUser } from "../interfaces";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: {
        values: ["admin", "editor", "user"],
        message: "{VALUE} no es un role válido",
        default: "user",
        required: true,
      },
    },
    status: {
      type: Boolean,
      default: true,
    },
    firstLogin: {
      type: Boolean,
      default: true,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    oldPassword: [
      {
        type: String,
        require: false,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> = mongoose.models.User || model("User", userSchema);

export default User;
