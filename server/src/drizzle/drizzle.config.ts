import { defineConfig } from "drizzle-kit";
import { ENV } from "../config/env";

export default defineConfig({
    schema: "./src/models/**/*.ts",
    out: "./src/drizzle/migrations",
    dialect: "postgresql",
    dbCredentials: {
        user: ENV.DB_USER,
        password: ENV.DB_PASS,
        host: ENV.DB_HOST,
        port: +(ENV.DB_PORT),
        database: ENV.DB_NAME,
    },
});
