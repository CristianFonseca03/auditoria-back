import { Request, Response } from "express";

import { User } from "../models/";

export const unlockUser = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({
        success: false,
        message: "Usuario no encontrado",
      });

    user.status = true;
    user.attempts = 0;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Usuario desbloqueado exitosamente",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUsersBlocked = async (_req: Request, res: Response) => {
  try {
    const users = await User.find(
      { status: false },
      { password: 0, __v: 0, oldPassword: 0 }
    );
    if (!users || users.length === 0)
      return res.status(400).json({
        success: false,
        message: "No hay usuarios bloqueados",
      });

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Algo salió mal",
      error: error.message,
    });
  }
};
