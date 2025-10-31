import User from "./user.js";
import Contact from "./contact.js";
import RefreshToken from "./refresh_token.js";

// Relationship
User.hasMany(Contact, {foreignKey: "userId"});
Contact.belongsTo(User, { foreignKey: "userId" });
User.hasMany(RefreshToken, {foreignKey: "userId"});
RefreshToken.belongsTo(User, {foreignKey: "userId"});

export default {User, Contact, RefreshToken};