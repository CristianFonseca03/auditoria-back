import { Router } from "express";
import { getDocuments, updateDocument } from "../controller/document";

const router = Router();

router.get("/", getDocuments);
router.put("/", updateDocument);

export { router as document };
