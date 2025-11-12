import express from "express";
import {
    searchContact,
    updateContact,
    deleteContact
} from "../controllers/contactController.js";

import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/search", authenticate, searchContact);
router.put("/:name", authenticate, updateContact);
router.delete("/:id", authenticate, deleteContact);

export default router;