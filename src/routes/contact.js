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

export default router;