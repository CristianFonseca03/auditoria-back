import { Request, Response } from "express";
import { compareSync } from "bcrypt";
import { IUserToken } from "../interfaces";
import User from "../models/User";
import { database } from "../database";
import { generateJWT } from "../helpers";

export const signIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    await database.connect();
    const user = await User.findOne({ email });
    if (!user) {
      await database.disconnect();
      return res.status(400).json({
        ok: false,
        msg: "The email is not registered",
      });
    }

    const validPassword = compareSync(password, user.password as string);
    if (!validPassword) {
      await database.disconnect();
      return res.status(400).json({
        ok: false,
        msg: "The password is incorrect",
      });
    }
    await database.disconnect();
    const userData: IUserToken = {
      id: user._id,
      lastName: user.lastName,
      name: user.name,
      email: user.email,
      role: user.role,
      status: false,
    };

    const token: string | undefined = await generateJWT(userData);

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token,
    });
  } catch (error) {
    await database.disconnect();
    return res.status(500).json({
      ok: false,
      msg: error.message,
    });
  }
};
