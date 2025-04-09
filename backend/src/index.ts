import express, { Express } from "express";
import { connectToDatabase } from "./services/database.connection";
import { recipesRouter } from "./routes/recipes.router";
import { categoriesRouter} from "./routes/categories.router";
import { validateLLMConfig } from "./utils/ValidationUtils";
import dotenv from "dotenv";
import cors from "cors";
import path from "node:path";

const envPath = path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`);
dotenv.config({ path: envPath });

const app: Express = express();
const port = process.env.PORT;
const domain = process.env.CORS_DOMAIN ||''

// Add a list of allowed origins.
// If you have more origins you would like to add, you can add them to the array below.
const allowedOrigins = [domain];
console.log("Allowed origins", allowedOrigins)
const options: cors.CorsOptions = {
    origin: allowedOrigins
};

if (process.env.NODE_ENV !== 'test') {
    console.log("NODE_ENV",process.env.NODE_ENV);
    connectToDatabase()
        .then(() => {
            app.use(cors(options));
            app.use("/recipes", recipesRouter);
            app.use("/categories", categoriesRouter);
            app.listen(port, () => {
                console.log(`Server started at http://localhost:${port}`);
            });
            validateLLMConfig();
        })
        .catch((error: Error) => {
            console.error("Database connection failed", error);
            process.exit();
        });
}