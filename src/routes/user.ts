import { Router } from "express";
import {
  createUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
} from "../controller/user";

const router = Router();

router.post("/new-user", createUser);
router.get("/get-users", getUsers);
router.get("/get-user/:id", getUser);
router.put("/update-user/:id", updateUser);
router.delete("/delete-user/:id", deleteUser);

export { router as user };
