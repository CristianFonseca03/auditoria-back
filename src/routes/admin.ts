import { Router } from "express";
import { check } from "express-validator";

import { validate } from "../middlewares";
import { getUsersBlocked, unlockUser } from "../controller/admin";

const router = Router();

router.post(
  "/unlock-user",
  [
    check("email")
      .notEmpty()
      .withMessage("El email es obligatorio")
      .isEmail()
      .withMessage("El email no es válido"),
    validate,
  ],
  unlockUser
);

router.get("/get-users-blocked", getUsersBlocked);

export { router as admin };
