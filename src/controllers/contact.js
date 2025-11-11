import {default as contactService} from "../services/contact.js";

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

export default { addContact };