import {default as contactService} from "../services/contact.js";
import { Op, or } from "sequelize";

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

export default { addContact, getContacts };