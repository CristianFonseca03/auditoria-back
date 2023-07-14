import bcrypt from "bcrypt";
import { generate } from "generate-password-ts";

import { Request, Response } from "express";
import { database } from "../database";
import { User } from "../models";
import { IUser } from "../interfaces";
import { transporter } from "../helpers";

export const getUser = async (req: Request, res: Response) => {
  await database.connect();
  const { email } = req.params;
  try {
    const user = await User.findOne({ email });
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
      status: user.status,
      firstLogin: user.firstLogin,
      attempts: user.attempts,
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
    const { email } = req.params;
    const user = await User.findOneAndUpdate({ email }, req.body, {
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
    const { email } = req.params;
    const user = await User.findOneAndDelete({ email });
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

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({
        success: false,
        message: "The user is not registered",
      });

    if (user.attempts === 3)
      return res.status(400).json({
        success: false,
        message: "Your account has been blocked contact with the administrator",
      });

    const aleatoryPassword: string = generate({
      length: 16,
      numbers: true,
      symbols: true,
    });

    const salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(aleatoryPassword, salt);
    user.firstLogin = true;
    await user.save();

    const mailOptions = {
      from: "ADMIN - JIRA",
      to: user.email,
      subject: `Hola ${user.name} 👋 Olvidaste tu contraseña en Jira`,
      html: `<h1>Crear nueva contraseña</h1>
          <p>Tu nueva contraseña es: <strong>${aleatoryPassword}</strong></p>
          <p><strong>Por favor, cámbielo después de iniciar sesión</strong></p>`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) console.log(err);
      else console.log(`Email sent: ${info.response}`);
    });

    return res.status(200).json({
      success: true,
      message: "Your new password has been sent to your email",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};
