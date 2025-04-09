import { BEFORE_ALL_TIMEOUT, startedMongoDBContainer, startAllContainers, teardownAll } from "./setup";
import request from 'supertest';
import express, {Express} from "express";
import cors from "cors";
import {categoriesRouter} from "../src/routes/categories.router";

let app: Express;

beforeAll( async () => {
        await startAllContainers();

        app = express();
        const domain = process.env.CORS_DOMAIN || 'http://localhost:5173';
        const allowedOrigins = [domain];
        const options: cors.CorsOptions = {
            origin: allowedOrigins,
        };
        app.use(cors(options));
        app.use('/categories', categoriesRouter);
    }, BEFORE_ALL_TIMEOUT
);

afterAll(async () => {
    await teardownAll();
});

describe('Category API', () => {
    it('should create a new category', async () => {
        const res = await request(app)
            .post('/categories')
            .send({ name: 'TestCategory' });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('_id');
    });

    it('should fetch all categories', async () => {
        const res = await request(app).get('/categories');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array);
    });

    it('should delete a category by id', async () => {
        const postRes = await request(app)
            .post('/categories')
            .send({ name: 'ToDeleteByIdCategory' });

        const categoryId = postRes.body._id;
        console.log("categoryId:" + categoryId)
        const deleteUrl = "/categories/" + categoryId
        const res = await request(app).delete(deleteUrl);

        expect(res.statusCode).toEqual(202);
    });

    it('should delete a category by name', async () => {
        const postRes = await request(app)
            .post('/categories/')
            .send({ name: 'ToDeleteByNameCategory' });

        const categoryName = postRes.body.name;
        console.log("categoryName:" + categoryName)
        const deleteUrl = "/categories/name/" + categoryName
        const res = await request(app).delete(deleteUrl);

        expect(res.statusCode).toEqual(202);
    });
});