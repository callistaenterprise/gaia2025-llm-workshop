import express, { Request, Response } from "express";
import Recipe from "../models/recipe";
import {ObjectId} from "mongodb";
import {recipeFromUrl} from "../services/recipeHandler";
import { askQuestionAboutRecipe } from "../services/questionrecipe";

export const recipesRouter = express.Router();

recipesRouter.use(express.json());

recipesRouter.get("/", async (_req: Request, res: Response) => {
    try {
        const recipes = await Recipe.find();
        res.status(200).send(recipes);
    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
});

recipesRouter.get("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;
    const question = req.query.question as string;
    try {
        const query = { _id: new ObjectId(id) };
        const recipe = (await Recipe.findOne(query));
        if (question && recipe) {
            console.log("question", question);
            const response = await askQuestionAboutRecipe(recipe.toObject(), question);
            return res.status(200).send(response);;
        }
        if (recipe) {
            res.status(200).send(recipe);
        }
    } catch (error) {
        res.status(404).send(`Unable to find matching document with id: ${req.params.id}`);
    }
});

recipesRouter.post("/", async (req: Request, res: Response) => {
    try {
        const recipe = new Recipe(req.body);
        const result = await recipe.save();
        if (result) {
            const msg = `Successfully created a new recipe with id ${result._id}`;
            console.log(msg)
            res.status(201).send(result)
        } else {
            const msg = "Failed to create a new recipe.";
            console.log(msg)
            res.status(500).send(msg);
        }
    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
});

recipesRouter.put("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        const updatedRecipe = req.body as typeof Recipe;
        const query = { _id: new ObjectId(id) };

        const result = await Recipe.updateOne(query, { $set: updatedRecipe });

        result
            ? res.status(200).send(`Successfully updated recipe with id ${id}`)
            : res.status(304).send(`Recipe with id: ${id} not updated`);
    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
});

recipesRouter.delete("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        const query = { _id: new ObjectId(id) };
        const result = await Recipe.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send(`Successfully removed recipe with id ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove recipe with id ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Recipe with id ${id} does not exist`);
        }
    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
});

recipesRouter.post("/parse/url", async (req: Request, res: Response) => {
    const url = req.body.url;
    const model = (process.env.LLM_PROVIDER || "gemini").toLowerCase();
    try {
        const result = await recipeFromUrl(url, model);

        if (result !== undefined) {
            console.log("-----------------------------")
            console.log(result);
            res.status(200).send(result);
        } else {
            console.log("-----------------------------")
            console.log("No result");
            res.status(404).send("No result found.");
        }
    } catch(error) {
        console.log(`error: ${error}`)
        res.status(400).send(error);
    }

});

