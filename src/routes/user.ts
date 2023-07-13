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
router.get("/get-user/:email", getUser);
router.put("/update-user/:email", updateUser);
router.delete("/delete-user/:email", deleteUser);

export { router as user };
