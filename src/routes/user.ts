import { Router } from "express";
import { check } from "express-validator";

import {
  createUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
  forgotPassword,
} from "../controller/user";
import { validate } from "../middlewares";

const router = Router();

router.post("/new-user", createUser);
router.get("/get-users", getUsers);
router.get(
  "/get-user/:email",
  [
    check("email")
      .notEmpty()
      .withMessage("El email es obligatorio")
      .isEmail()
      .withMessage("El email no es válido"),
    validate,
  ],
  getUser
);

router.get("/get-user/:email", getUser);

router.put(
  "/update-user/:email",
  [
    check("email")
      .notEmpty()
      .withMessage("El email es obligatorio")
      .isEmail()
      .withMessage("El email no es válido"),
    validate,
  ],
  updateUser
);
router.delete(
  "/delete-user/:email",
  [
    check("email")
      .notEmpty()
      .withMessage("El email es obligatorio")
      .isEmail()
      .withMessage("El email no es válido"),
    validate,
  ],
  deleteUser
);
router.post(
  "/forgot-password",
  [
    check("email")
      .notEmpty()
      .withMessage("El email es obligatorio")
      .isEmail()
      .withMessage("El email no es válido"),
    validate,
  ],
  forgotPassword
);

export { router as user };
