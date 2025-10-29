import User from "./user";
import Contact from "./contact";

// Relationship
User.hasMany(Contact);

export default {User, Contact};