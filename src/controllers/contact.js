import {default as contactService} from "../services/contact.js";
import Contact from "../models/contact.js";
import { Op, or } from "sequelize";
import fs from "fs";
import path from "path";
import createContactsCSV from "../utils/fileBackup.js";

async function addContact(req, res) {
    try {
        let {
            name,
            phone,
            email,
            physicalAddr,
            tag
        } = req.body;

        if (!email) {email = null;}
        if (!physicalAddr) {physicalAddr = null;}
        if (!tag) {tag = null;}

        const contactData = {
            userId: req.user.id,
            name,
            phone,
            email,
            physicalAddr,
            tag
        };

        await contactService.createContact(contactData);

        res.status(201).json({ success: true, message: "Contact created successfully" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}


async function getContacts(req, res) {
    let whereClause = { userId: req.user.id };
    let order = [];

    if (req.query.tag) {
        whereClause.tag = {[Op.like]: `%${req.query.tag}%` };
    }

    let ord = req.query.ord || "asc";

    if (req.query.sortBy) {
        switch (req.query.sortBy) {
            case "date":
                order = [["createdAt", ord]];
                break;
            
            default:
                order = [["name", ord]];
                break;
        }
    }

    try {
        const contacts = await contactService.fetchContacts(whereClause, order);
        res.status(200).json({ success: true, data: contacts });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}


const searchContact = async(req, res) => {
    try {
        const userId = req.user.id;
        const { name, phone, id } = req.query; // optional query params

        // Build dynamic WHERE conditions
        const where = { userId };

        if (id) {
            where.id = id;

        } else if (name) {

            where.name = {
                [Op.like]: `%${name}%`
            };
        } else if (phone) {
            where.phone = {
                [Op.like]: `%${phone}%`
            };
        } else {
            return res.status(400).json({ message: "At least one search parameter (id, name, or phone) is required." });
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



const updateContact = async(req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const updates = req.body;

        const contact = await Contact.findOne({ where: { userId, id } });
        if (!contact) {
            return res.status(404).json({ message: "Contact not found." });
        }

        await contact.update(updates);

        res.status(200).json(contact);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const deleteContact = async(req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params; 

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

const saveContactsToFile = async(userId) => {
    try {
        const contacts = await Contact.findAll({
            where: { userId },
            order: [
                ["name", "ASC"]
            ],
        });

        const plain = contacts.map(c => (typeof c.toJSON === "function" ? c.toJSON() : c));

        // create CSV backup and return filepath
        const csvPath = await createContactsCSV(userId, plain);
        return csvPath;
    } catch (err) {
        console.error("Error saving contacts to file:", err.message);
        throw err;
    }
};


// generate CSV backup and send as attachment.
 
const downloadContacts = async (req, res) => {
    try {
        const userId = req.user.id;

        // generate CSV file
        const filePath = await saveContactsToFile(userId);

        if (!fs.existsSync(filePath)) {
            return res.status(500).json({ message: "Backup file not found" });
        }

        const filename = path.basename(filePath);
        res.download(filePath, filename, (err) => {
            if (err) {
                console.error("Error sending file:", err);
                if (!res.headersSent) res.status(500).json({ message: err.message });
            }

            fs.unlinkSync(filePath);
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export default { 
    addContact, 
    getContacts, 
    searchContact,
    updateContact,
    deleteContact,
    saveContactsToFile,
    downloadContacts, 
};