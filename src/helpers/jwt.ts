import jwt from "jsonwebtoken";
import { IUserToken } from "../interfaces";

const secret: string = `${process.env.JWT_SECRET}`;

export const generateJWT = (user: IUserToken): Promise<string | undefined> => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      user,
      secret,
      {
        expiresIn: "8h",
      },
      (err, token) => {
        if (err) reject(`Can't generate token: ${err.message}`);
        resolve(token);
      }
    );
  });
};
