import axios from 'axios';
import {Recipe} from "../../types/Recipe.ts";

const url = import.meta.env.VITE_BASE_URL + "/recipes";

export const getRecipes = async () => {
    const response = await axios.get(url);
    const recipes = response.data.map((element: any) => {
        return toRecipeDTO(element)
    });
    console.log("Feteched " + recipes.length + " recipes");
    return recipes;
};

export const getRecipe = async (id: string ) => {
    const response = await axios.get(`${url}/${id}`);
    console.log("Fetched recipe with id " + response.data._id);
    return toRecipeDTO(response.data) as Recipe;
};

export const addRecipe = async (recipe: Recipe) => {
    return await axios.post(url, fromRecipeDTO(recipe));
};

export const askQuestionAboutRecipe = async (id: string, question: string) => {
    console.log({url});
    return await axios.get(`${url}/questionaboutrecipe/${id}`, {
        params: { question }
    });
};

export const deleteTheRecipe = async (id: String) => {
    return await axios.delete(url + "/" + id);
};

export const updateRecipe = async (recipe: Recipe) => {
    return await axios.put(`${url}/${recipe.id}`, fromRecipeDTO(recipe));
};

export const getParsedRecipe = async (urlToParse: string) => {
    const response = await axios.post(`${url}/parse/url`, {url: urlToParse});
    console.log(response);
    return response.data;
}

function toRecipeDTO(doc: any): Recipe {
    return {
        id: doc._id,
        name: doc.name,
        description: doc.description,
        portions: doc.portions == undefined ? 0 : doc.portions,
        ingredients: doc.ingredients == undefined ? [] : doc.ingredients,
        steps: doc.steps == undefined ? [] : doc.steps,
        categories: doc.categories == undefined ? [] : doc.categories,
    }
}

function fromRecipeDTO(recipe: Recipe): any {
    return {
        _id: recipe.id,
        name: recipe.name,
        description: recipe.description,
        portions: recipe.portions == undefined ? 0 : recipe.portions,
        ingredients: recipe.ingredients == undefined ? [] : recipe.ingredients,
        steps: recipe.steps == undefined ? [] : recipe.steps,
        categories: recipe.categories == undefined ? [] : recipe.categories,
    }
}
