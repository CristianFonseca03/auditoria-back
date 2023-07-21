import { Router } from "express";
import { check, param } from "express-validator";

import { validate, validateToken } from "../middlewares";
import {
  renewToken,
  revalidateToken,
  signIn,
  signUp,
  updatePassword,
} from "../controller/auth";
import { passwordOptions } from "../helpers";

const router = Router();

router.post(
  "/sign-up",
  [
    check("name")
      .notEmpty()
      .withMessage("El nombre es requerido")
      .matches(/^[a-zA-Z ]+$/)
      .withMessage("El nombre no es válido (sólo letras y espacios)"),
    check("lastName")
      .notEmpty()
      .withMessage("El apellido es requerido ")
      .matches(/^[a-zA-Z ]+$/)
      .withMessage("El apellido no es válido (sólo letras y espacios)"),
    check("email")
      .notEmpty()
      .withMessage("El correo es requerido")
      .isEmail()
      .withMessage("El correo no es válido")
      .isLength({ max: 40 })
      .withMessage("El correo no puede tener más de 40 caracteres"),
    validate,
  ],
  signUp
);

router.post(
  "/sign-in",
  [
    check("email")
      .notEmpty()
      .withMessage("El correo es requerido")
      .isEmail()
      .withMessage("El correo no es válido"),
    check("password", "La contraseña es requerida").notEmpty(),
    validate,
  ],
  signIn
);

router.patch(
  "/change-pass/:email",
  [
    param("email")
      .exists()
      .withMessage("El correo es requerido")
      .isEmail()
      .withMessage("El correo no es válido"),
    check("newPassword")
      .notEmpty()
      .withMessage("La nueva contraseña es requerida")
      .isStrongPassword(passwordOptions)
      .withMessage(
        "La nueva contraseña no es lo suficientemente segura (mínimo 8 caracteres, al menos una mayúscula, una minúscula, un número y un carácter especial)"
      ),
    validate,
  ],
  updatePassword
);

router.get("/validate-jwt", validateToken, revalidateToken);

router.get("/renew", validateToken, renewToken);

export { router as auth };
