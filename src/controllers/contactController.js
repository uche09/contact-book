import Contact from "../models/contact.js";
import fs from "fs";
import { Op } from "sequelize";


// 🗑️ Delete a contact by ID
export const deleteContact = async(req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params; // ID comes from URL, e.g. /contacts/:id

        const contact = await Contact.findOne({
            where: { id, userId },
        });

        if (!contact) {
            return res.status(404).json({ message: "Contact not found" });
        }

        await contact.destroy();
        res.status(200).json({ message: "Contact deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



export const searchContact = async(req, res) => {
    try {
        const userId = req.user.id;
        const { name, phone, id } = req.query; // optional query params

        // Build dynamic WHERE conditions
        const where = { userId };

        if (id) {
            where.id = id;
        }

        if (name) {
            where.name = {
                [Op.like]: `%${name}%`
            };
        }

        if (phone) {
            where.phone = {
                [Op.like]: `%${phone}%`
            };
        }

        // Run search
        const contacts = await Contact.findAll({
            where,
            order: [
                ["name", "ASC"]
            ],
        });

        if (!contacts.length) {
            return res.status(404).json({ message: "No contacts found." });
        }

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