import { Router } from "express";
import { check } from "express-validator";
import { signIn } from "../controller/auth";
import { validate } from "../middlewares";

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
