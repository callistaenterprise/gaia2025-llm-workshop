import { BEFORE_ALL_TIMEOUT, startAllContainers, teardownAll } from "./setup";
import request from 'supertest';
import express, {Express} from "express";
import cors from "cors";
import {recipesRouter} from "../src/routes/recipes.router";

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
        app.use('/recipes', recipesRouter);
    }, BEFORE_ALL_TIMEOUT
);

afterAll(async () => {
    await teardownAll();
});

describe('Recipe API', () => {
    it('should create a new recipe', async () => {
        const recipe = {
            name: 'Test Recipe',
            description: 'Test Description',
            ingredients: [
                {
                    name: 'Test Ingredient',
                    quantity: 1,
                    unit: 'g',
                },
            ],
            steps: [
                {
                    order: 1,
                    instruction: 'Test Step',
                    minutes: 10,
                },
            ],
            portions: 4,
        };

        const res = await request(app)
            .post('/recipes')
            .send(recipe);

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('_id');
    });

    it('should fetch all recipes', async () => {
        const res = await request(app).get('/recipes');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array);
    });

    it('should fetch a recipe by id', async () => {
        const recipeRes = await request(app)
            .post('/recipes')
            .send({
                name: 'ToFetchRecipe',
                description: 'Test Description',
                ingredients: [
                    {
                        name: 'Test Ingredient',
                        quantity: 1,
                        unit: 'g',
                    },
                ],
                steps: [
                    {
                        order: 1,
                        instruction: 'Test Step',
                        minutes: 10,
                    },
                ],
                portions: 4,
            });

        const recipeId = recipeRes.body._id;
        const res = await request(app).get(`/recipes/${recipeId}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('_id', recipeId);
    });

    it('should delete a recipe by id', async () => {
        const recipeRes = await request(app)
            .post('/recipes')
            .send({
                name: 'ToDeleteRecipe',
                description: 'Test Description',
                ingredients: [
                    {
                        name: 'Test Ingredient',
                        quantity: 1,
                        unit: 'g',
                    },
                ],
                steps: [
                    {
                        order: 1,
                        instruction: 'Test Step',
                        minutes: 10,
                    },
                ],
                portions: 4,
            });

        const recipeId = recipeRes.body._id;
        const res = await request(app).delete(`/recipes/${recipeId}`);

        expect(res.statusCode).toEqual(202);
    });


    it('should parse a recipe', async () => {
        const res = await request(app)
            .post('/recipes/parse/url')
            .send({url: "https://receptfavoriter.se/recept/sashimi-med-lax.html"});

        expect(res.statusCode).toEqual(200);
        expect(res.body.name).toEqual("Sashimi med lax");
    }, 15000);
});

