import dotenv from "dotenv";

dotenv.config();

export const env = {
    port:process.env.PORT || 5000,
  
  database: {
    name: process.env.DB_NAME!,
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT) || 5432,
  },
   swagger: {
    apiBaseUrl: process.env.API_BASE_URL || "http://localhost:5000",
  },
  };