import contact from "../models/contact.js"

async function createContact(contactData) {
    const contactExists = await contact.findOne({
        where: { name: contactData.name, phone: contactData.phone },
    });

    if (contactExists) throw new Error("Contact already exist");

    const newContact = await contact.create(contactData);
}

export default { createContact };