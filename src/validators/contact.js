import { body, query } from "express-validator";

const addContactValidator = [
    body("name")
        .trim()
        .notEmpty().withMessage("Name is required")
        .bail()
        .isLength({ max: 100 }).withMessage("Name can be at most 100 characters long")
        .bail()
        .toLowerCase(),

    body("phone")
        .trim()
        .notEmpty().withMessage("Phone number is required")
        .bail()
        .isMobilePhone().withMessage("Invalid phone number"),

    body("email")
        .optional({ nullable: true })
        .trim()
        .isEmail().withMessage("Invalid email address"),

    body("physicalAddr")
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 200 }).withMessage("Physical address can be at most 200 characters long"),

    body("tag")
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 50 }).withMessage("Tag can be at most 50 characters long"),
];


export default { addContactValidator };