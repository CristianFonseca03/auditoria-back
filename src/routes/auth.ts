import { Router } from "express";
import { check } from "express-validator";


import { validate } from "../middlewares";
import { signIn } from "../controller/auth";

const router = Router();

router.post(
  "/sign-in",
  [
    check("email")
      .notEmpty()
      .withMessage("The email is required")
      .isEmail()
      .withMessage("The email is invalid"),
    check("password", "The password is required").notEmpty(),
    validate,
  ],
  signIn
);

export { router as auth };
