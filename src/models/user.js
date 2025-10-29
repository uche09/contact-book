import sequelise from "../config/db.js";
import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";

const User = sequelise.define(
    "User",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        
    },

    {
        hooks: {
            beforeCreate: async (user) => {
                user.email = user.email.toLowerCase();
                if (user.password) {
                    const salt = await bcrypt.genSalt();
                    user.password = await bcrypt.hash(user.password, salt);
                }

            },

            beforeUpdate: async (user) => {
                if (user.changed("email")) {
                    user.email = user.email.toLowerCase();
                }

                if (user.password) {
                    const salt = await bcrypt.genSalt();
                    user.password = await bcrypt.hash(user.password, salt);
                }
            }
        },

        indexes: [
            {
                unique: true,
                fields: "id"
            },
            {
                unique: true,
                fields: "email",
            },
            {
                fields: "createdAt",
            }
        ],
    }
);

User.prototype.verifyPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

export default User;