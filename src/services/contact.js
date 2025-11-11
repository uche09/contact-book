import contact from "../models/contact.js";
import { Op } from "sequelize";

async function createContact(contactData) {
    let phone = contactData.phone;

    // Duplicate contact is defined by have the same name and phone number
    // Phone numbers can be stored with country code assuming +2348123456789
    // Phone numbers can also be stored without country code as 08123456789
    // These two should be considered the same for duplicate check
    // Therefore, we normalize by removing the country code if it exists
    // Or removing the leading zero if no country code
    
    if (!phone.startsWith("+")) {
        phone = phone.slice(1);
    } else if (phone.startsWith("+")) {
        phone = phone.slice(4); // +234xxx to xxx
    }

    const contactExists = await contact.findOne({
        where: { name: contactData.name, 
            phone: {[Op.like]: `%${phone}` }
        },
    });

    if (contactExists) throw new Error("Contact already exist");

    const newContact = await contact.create(contactData);
}


async function fetchContacts(whereClause, order) {
    const contacts = await contact.findAll({
        order: order,
        where: whereClause,
        raw: true,
    });
    
    return contacts;
}

export default { createContact, fetchContacts };