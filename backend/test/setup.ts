import {MongoDBContainer, StartedMongoDBContainer} from '@testcontainers/mongodb';
import mongoose, {Mongoose} from 'mongoose';
import {Db, MongoClient} from "mongodb";

export let startedMongoDBContainer: StartedMongoDBContainer;
let mongodbUri: string;
let db: Db;
let mongoClient: MongoClient;
let mongooseClient: Mongoose;

export const BEFORE_ALL_TIMEOUT = 15000;
global.console = require('console');

export async function startAllContainers() {
    await startMongoContainerAndClients();
}

export async function teardownAll() {
    await stopMongoContainerAndClients();
}

export async function startMongoContainerAndClients() {
    startedMongoDBContainer = await new MongoDBContainer('mongo:6.0.1').start();
    mongodbUri = `${startedMongoDBContainer.getConnectionString()}?directConnection=true`;
    mongooseClient = await mongoose.connect(mongodbUri, {dbName: "test"})
}

export async function stopMongoContainerAndClients() {
    await mongooseClient?.disconnect();
    await startedMongoDBContainer?.stop();
}
