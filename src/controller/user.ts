import { Request, Response } from "express";
import { database } from "../database";
import User from "../models/User";
import bcrypt from "bcrypt";

export const getUser = async (req: Request, res: Response) => {
  await database.connect();
  const { email } = req.params;
  try {
    const user = User.findOne({ email });
    if (!user) {
      await database.disconnect();
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      user,
    });
  } catch (error) {
    await database.disconnect();
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUsers = async (_req: Request, res: Response) => {
  try {
    await database.connect();
    const users = await User.find({});
    if (!users) {
      await database.disconnect();
      return res.status(400).json({
        success: false,
        message: "Users not found",
      });
    }
    return res.status(200).json({
      users,
    });
  } catch (error) {
    await database.disconnect();
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    await database.connect();
    const { name, lastName, email, password, role } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      lastName,
      email,
      password: hashPassword,
      role,
    });
    await user.save();
    await database.disconnect();
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user,
    });
  } catch (error) {
    await database.disconnect();
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    await database.connect();
    const { email } = req.params;
    const user = await User.findByIdAndUpdate({ email }, req.body, {
      new: true,
    });
    if (!user) {
      await database.disconnect();
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    await database.disconnect();
    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    await database.disconnect();
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    await database.connect();
    const { email } = req.params;
    const user = await User.findOneAndDelete({ email });
    if (!user) {
      await database.disconnect();
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    await database.disconnect();
    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    await database.disconnect();
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
