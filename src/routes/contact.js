import express from "express";
import { default as validation} from "../validators/contact.js"
import getValidationErr from "../middlewares/get_validation_error.js"
import { requireAuth } from "../middlewares/auth_required.js"
import { default as contactController } from "../controllers/contact.js";

const router = express.Router();

router.post(
    "/add-contact",
    requireAuth,
    validation.addContactValidator,
    getValidationErr,
    contactController.addContact
);

router.get(
    "/contacts",
    requireAuth,
    validation.queryContactsValidator,
    getValidationErr,
    contactController.getContacts
);

export default router;