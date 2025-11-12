import { body, query, param } from "express-validator";

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
        .toLowerCase()
        .isLength({ max: 50 }).withMessage("Tag can be at most 50 characters long"),
];

const queryContactsValidator = [
    query("tag")
        .optional()
        .trim()
        .isLength({ max: 50 }).withMessage("Tag can be at most 50 characters long"),

    query("sortBy")
        .optional()
        .trim()
        .isIn(["name", "date"]).withMessage("sortBy must be either 'name' or 'date'"),
        
    query("ord")
        .optional()
        .trim()
        .isIn(["asc", "desc"]).withMessage("ord must be either 'asc' or 'desc'"),
];

const searchValidator = [
    query("id")
        .optional()
        .isInt().withMessage("Invalid contact id"),

    query("name")
        .optional()
        .trim()
        .isLength({ max: 100 }).withMessage("Name can be at most 100 characters long"),

    query("phone")
        .optional()
        .trim()
        .isMobilePhone().withMessage("Invalid phone number"),
];

const updateContactValidator = [
    param("id")
        .exists().withMessage("Contact id is required")
        .bail()
        .isInt().withMessage("Invalid contact id"),

    body("name")
        .optional()
        .trim()
        .isLength({ max: 100 }).withMessage("Name can be at most 100 characters long")
        .bail()
        .toLowerCase(),

    body("phone")
        .optional()
        .trim()
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
        .toLowerCase()
        .isLength({ max: 50 }).withMessage("Tag can be at most 50 characters long"),
];

const deleteContactValidator = [
    param("id")
        .exists().withMessage("Contact id is required")
        .bail()
        .isInt().withMessage("Invalid contact id"),
];

export default { 
    addContactValidator, 
    queryContactsValidator,
    searchValidator,
    updateContactValidator,
    deleteContactValidator,
};