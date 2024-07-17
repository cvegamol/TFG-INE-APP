import { config } from "dotenv";

config();

export default {
    host: process.env.HOST || "127.0.0.1",
    database: process.env.DATABASE || "ine",
    user: process.env.USER || "root",
    password: process.env.PASSWORD || ""
    
};