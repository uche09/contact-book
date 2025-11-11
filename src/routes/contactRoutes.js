import express from "express";
import {
    addContact,
    getContacts,
    searchContact,
    updateContact,
    deleteContact
} from "../controllers/contactController.js";

import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, addContact);
router.get("/", authenticate, getContacts);
router.get("/search", authenticate, searchContact);
router.put("/:name", authenticate, updateContact);
router.delete("/:name", authenticate, deleteContact);

export default router;