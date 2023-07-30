import { Request, Response } from "express";
import { compareSync, genSaltSync, hashSync } from "bcrypt";
import { generate } from "generate-password-ts";

import User from "../models/User";
import { database } from "../database";
import { generateJWT, transporter } from "../helpers";
import { IUserToken } from "../interfaces";

export const signIn = async (req: Request, res: Response) => {
  try {
    await database.connect();
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({
        success: false,
        message: "El correo no está registrado",
      });

    const validPassword = compareSync(password, user.password as string);
    if (!validPassword && user.status === true) {
      if (user.attempts < 3) {
        user.attempts += 1;
        if (user.attempts === 3) user.status = false;
        await user.save();
      }
      return res.status(400).json({
        success: false,
        message: "Correo o contraseña incorrecta",
      });
    }

    if (user.status === false) {
      res.status(400).json({
        success: false,
        message: "Usuario bloqueado",
      });
    }

    user.attempts = 0;
    await user.save();

    const userData: IUserToken = {
      id: user._id,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      status: user.status,
      firstLogin: user.firstLogin,
      attempts: user.attempts,
    };

    const token: string | undefined = await generateJWT(userData);

    return res.status(200).json({
      success: true,
      message: "Usuario logeado exitosamente",
      user: {
        firstLogin: user.firstLogin,
      },
      token,
    });
  } catch (error) {
    await database.disconnect();
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const signUp = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user)
      return res.status(400).json({
        success: false,
        message: "El correo ya está en uso",
      });

    user = new User(req.body);

    let aleatoryPassword: string = generate({
      length: 12,
      numbers: true,
      symbols: true,
      exclude: "\"'",
    });

    if (
      aleatoryPassword.includes("\\") ||
      aleatoryPassword.includes("'") ||
      aleatoryPassword.includes('"') ||
      aleatoryPassword.includes("`")
    ) {
      aleatoryPassword = aleatoryPassword.replace(/[\\\'\"\`]/gm, "h");
    }

    const salt = genSaltSync(10);
    user.password = hashSync(aleatoryPassword, salt);
    await user.save();

    user.oldPassword.push(user.password);
    await user.save();

    const mailOptions = {
      from: "ADMIN - SECURE DOCS",
      to: user.email,
      subject: "Bienvenido a SECURE DOCS 👋",
      html: `<h1>Bienvenido a SECURE DOCS</h1>
      <p>Tu constraseña generada es: <strong>${aleatoryPassword}</strong></p>
      <p><strong>Por favor, cámbielo después de iniciar sesión</strong></p>`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) console.log(err);
      else console.log(`Correo enviado: ${info.response}`);
    });

    return res.status(201).json({
      success: true,
      message: "Usuario creado correctamente",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Algo salió mal",
      error: error.message,
    });
  }
};

export const updatePassword = async (req: Request, res: Response) => {
  const { email } = req.params;
  const { newPassword } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({
        success: false,
        message: "El correo no está registrado",
      });

    const result = user.oldPassword.some((old) =>
      compareSync(newPassword, old)
    );
    if (result) {
      return res.status(400).json({
        success: false,
        message: "La contraseña es la misma que la anterior",
      });
    } else {
      if (user.oldPassword.length === 2) user.oldPassword.pop();
    }

    const salt = genSaltSync(10);
    user.password = hashSync(newPassword, salt);
    user.oldPassword.unshift(user.password);
    user.firstLogin = false;
    await user.save();

    const userData: IUserToken = {
      id: user._id,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      status: user.status,
      firstLogin: user.firstLogin,
      attempts: user.attempts,
    };

    const token = await generateJWT(userData);

    return res.status(200).json({
      success: true,
      message: "Contraseña actualizada correctamente",
      token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Algo salió mal",
      error: error.message,
    });
  }
};

export const revalidateToken = async (_req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "Token revalidated successfully",
  });
};

export const renewToken = async (req: Request, res: Response) => {
  try {
    const { user } = req;
    const token = await generateJWT(user as IUserToken);
    return res.status(200).json({
      success: true,
      message: "Token renovado exitosamente",
      token,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Algo salió mal",
      error: error.message,
    });
  }
};
