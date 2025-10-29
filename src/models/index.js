import User from "./user";
import Contact from "./contact";

// Relationship
User.hasMany(Contact);
Contact.belongsTo(User);

export default {User, Contact};