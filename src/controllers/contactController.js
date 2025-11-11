import Contact from "../models/contact.js";
import fs from "fs";

// ➕ Add a new contact
export const addContact = async(req, res) => {
    try {
        const userId = req.user.id; // assuming JWT auth middleware sets req.user
        const { name, phone, email, physicalAddr, tag } = req.body;

        if (!name || !phone) {
            return res.status(400).json({ message: "Name and phone are required." });
        }

        const existing = await Contact.findOne({ where: { userId, name } });
        if (existing) {
            return res.status(400).json({ message: "Contact with this name already exists." });
        }

        const contact = await Contact.create({ userId, name, phone, email, physicalAddr, tag });
        await saveContactsToFile(userId);
        res.status(201).json(contact);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 👀 View all contacts (alphabetically)
export const getContacts = async(req, res) => {
    try {
        const userId = req.user.id;
        const contacts = await Contact.findAll({
            where: { userId },
            order: [
                ["name", "ASC"]
            ],
        });
        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 🔍 Search contact by name
export const searchContact = async(req, res) => {
    try {
        const userId = req.user.id;
        const { name } = req.query;

        const contacts = await Contact.findAll({
            where: {
                userId,
                name: {
                    [Contact.sequelize.Op.like]: `%${name}%`
                },
            },
            order: [
                ["name", "ASC"]
            ],
        });

        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✏️ Update existing contact
export const updateContact = async(req, res) => {
    try {
        const userId = req.user.id;
        const { name } = req.params;
        const updates = req.body;

        const contact = await Contact.findOne({ where: { userId, name } });
        if (!contact) {
            return res.status(404).json({ message: "Contact not found." });
        }

        await contact.update(updates);
        await saveContactsToFile(userId);

        res.status(200).json(contact);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 🗑️ Delete a contact by name
export const deleteContact = async(req, res) => {
    try {
        const userId = req.user.id;
        const { name } = req.params;

        const deleted = await Contact.destroy({ where: { userId, name } });
        if (!deleted) {
            return res.status(404).json({ message: "Contact not found." });
        }

        await saveContactsToFile(userId);
        res.status(200).json({ message: "Contact deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 💾 Backup contacts to file for persistence
const saveContactsToFile = async(userId) => {
    try {
        const contacts = await Contact.findAll({
            where: { userId },
            order: [
                ["name", "ASC"]
            ],
        });
        fs.writeFileSync(
            `contacts_backup_user_${userId}.json`,
            JSON.stringify(contacts, null, 2)
        );
    } catch (err) {
        console.error("Error saving contacts to file:", err.message);
    }
};