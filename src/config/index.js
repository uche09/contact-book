import dotenv from "dotenv";

dotenv.config()

export default {
    PORT: Number(process.env.PORT || 3000),
    DATABASE_NAME: process.env.DATABASE_NAME || "contact_book",
    DATABASE_USERNAME: process.env.DATABASE_USERNAME || "uche09",
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
    DATABASE_HOST: process.env.DATABASE_HOST || "localhost",
    DATABASE_PORT: Number(process.env.DATABASE_PORT || 3306),
    DATABASE_DIALECT: process.env.DATABASE_DIALECT || "mysql",
}