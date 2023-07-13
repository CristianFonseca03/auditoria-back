import { Request, Response } from "express";
import { database } from "../database";
import { User } from "../models";
import bcrypt from "bcrypt";
import { IUser } from "../interfaces";

export const getUser = async (req: Request, res: Response) => {
  await database.connect();
  const { id } = req.params;
  console.log(id);
  try {
    const user = await User.findById(id);
    if (!user) {
      await database.disconnect();
      return res.status(400).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }
    const userData: IUser = {
      _id: user.id,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    };
    await database.disconnect();
    return res.status(200).json({
      user: userData,
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
        message: "Usuarios no encontrados",
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
      message: "Usuario creado exitosamente",
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
    const { id } = req.params;
    const user = await User.findByIdAndUpdate({ id }, req.body, {
      new: true,
    });
    if (!user) {
      await database.disconnect();
      return res.status(400).json({
        success: false,
        message: "Usuario encontrado",
      });
    }
    await database.disconnect();
    return res.status(200).json({
      success: true,
      message: "Usuario actualizado exitosamente",
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
    const { id } = req.params;
    const user = await User.findOneAndDelete({ _id: id });
    if (!user) {
      await database.disconnect();
      return res.status(400).json({
        success: false,
        message: "No se pudo eliminar el usuario",
      });
    }
    await database.disconnect();
    return res.status(200).json({
      success: true,
      message: "Usuario eliminado exitosamente",
    });
  } catch (error) {
    await database.disconnect();
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
