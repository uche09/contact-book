import sequelise from "../config/db.js";
import User from "./user.js";
import { DataTypes } from "sequelize";

const Contact = sequelise.define(
    "Contact",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        userId: {
            type: DataTypes.INTEGER,

            references: {
                model: User,
                key: "id",
            },
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        email: DataTypes.STRING,
        physicalAddr: DataTypes.STRING,
        tag: DataTypes.STRING,
    },

    {
        timestamps: true,

        indexes: [
            {
                fields: ["userId", "name", "tag"],
            },
        ],
    }
);

export default Contact;