import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import { MongoMemoryServer } from "mongodb-memory-server";


let mongod: MongoMemoryServer | null = null;
let isShuttingDown = false;

/**
 * Ensures that the persistent storage directory exists.
 */
function ensureDbPathExists(dbPath: string): void {
    if (!fs.existsSync(dbPath)) {
        fs.mkdirSync(dbPath, { recursive: true });
        console.log(`📁 Created database directory: ${dbPath}`);
    }
}


/**
 * Connects to MongoDB Memory Server.
 */
export async function connectToDatabase(): Promise<void> {
    try {
        dotenv.config();
        const dbName = process.env.DB_NAME || "";
        const dbPath = path.resolve(process.cwd(), ".dbdata"); 
        ensureDbPathExists(dbPath);
        mongod = await MongoMemoryServer.create({
            instance: {
                dbPath: "./.dbdata",
                storageEngine: "wiredTiger"
            }
        });

        const dbUri: string = mongod.getUri();

        await mongoose.connect(dbUri, {
            dbName: dbName
        });

        console.log(`Connected to ${dbName} at ${dbUri}`);

        // Ensure SIGINT is only added once
        if (process.listenerCount("SIGINT") === 0) {
            process.on("SIGINT", async () => {
                await disconnectDatabase();
                process.exit(0);
            });
        }

    } catch (err) {
        console.error("❌ Could not connect to database:", err);
    }
}


/**
 * Disconnects from MongoDB Memory Server gracefully without wiping data.
 */
export async function disconnectDatabase(): Promise<void> {
    if (isShuttingDown) return; // Prevent multiple calls
    isShuttingDown = true;

    try {
        console.log("⚠️ Shutting down database...");

        await mongoose.disconnect(); // Ensure clean disconnect

        if (mongod) {
            await mongod.stop();
            mongod = null;
        }

        console.log("🛑 Database stopped.");
    } catch (err) {
        console.error("⚠️ Error stopping the database:", err);
    }
}