import { Router } from "express";

import { getEntries, getEntry, postEntry } from "../controller/entry";

const router = Router();

router.get("/get-entries", getEntries);
router.get("/get-entry/:id", getEntry);
router.post("/new-entry", postEntry);

export { router as entry };
