import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export const isDev = ["development", "local"].includes(
  process.env.NODE_ENV || "",
);
export const isProd = process.env.NODE_ENV === "production";
export const isTest = process.env.NODE_ENV === "test";

const env = {
  appEnv: process.env.NODE_ENV,
  api: {
    key: process.env.API_KEY,
    host: process.env.API_HOST,
    port: process.env.API_PORT ?? 4100,
    baseUrl: process.env.API_BASE_URL,
  },
  auth: {
    accessToken: process.env.ACCESS_TOKEN,
    expiredDate: "365h",
    refreshToken: process.env.REFRESH_TOKEN,
    accessExpirationMinutes: process.env.ACCESS_EXPIRATION_MINUTES,
    accessExpirationDays: process.env.ACCESS_EXPIRATION_DAYS,
  },
  database: {
    url: process.env.DATABASE_URL,
  },
  encryption: {
    secretKey: process.env.ENCRYPTION_SECRET_KEY,
  },
};

export default env;
