import express, { Request, Response } from "express";
import Category from "../models/category";
import {ObjectId} from "mongodb";

export const categoriesRouter = express.Router();

categoriesRouter.use(express.json());

categoriesRouter.get("/", async (_req: Request, res: Response) => {
    try {
        const recipes = await Category.find();
        res.status(200).send(recipes);
    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
});

categoriesRouter.post("/", async (req: Request, res: Response) => {
    try {
        const category = new Category(req.body);
        const result = await category.save();
        if (result) {
            const msg = `Successfully created a new category with id ${result._id}`;
            console.log(msg)
            res.status(201).send(result)
        } else {
            const msg = "Failed to create a new category.";
            console.log(msg)
            res.status(500).send(msg);
        }
    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
});

categoriesRouter.delete("/:id", async (req: Request, res: Response) => {
    const id =req?.params?.id;
    console.log(id);
    try {
        const query = { _id: id };
        const result = await Category.deleteOne(query);
        if (result && result.deletedCount) {
            res.status(202).send(`Successfully removed category with id ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove category with id ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Category with id ${id} does not exist`);
        }
    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
});

categoriesRouter.delete("/name/:name", async (req: Request, res: Response) => {
    const name = decodeURIComponent(req?.params?.name);
    try {
        const query = { name: name };
        const result = await Category.deleteOne(query);
        if (result && result.deletedCount) {
            res.status(202).send(`Successfully removed category with name ${name}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove category with name ${name}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Category with name ${name} does not exist`);
        }
    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
});