import {recipeFromText, htmlToText} from "./parseRecipes"

import axios from "axios";

export async function fetchRecipeHtml(url: string): Promise<string> {
    const recipeResponse = await axios.get(url);
    const recipeHtml = recipeResponse.data;
    return recipeHtml;
}

export async function recipeFromUrl(url: string, llmProvider: string):Promise<any> {
    const recipeHtml = await fetchRecipeHtml(url);
    const recipeText = await htmlToText(recipeHtml);
    return await recipeFromText(recipeText, llmProvider);
}

export async function recipeFromHtml(recipeHtml: string, llmProvider: string):Promise<any> {
    const recipeText = await htmlToText(recipeHtml);
    return await recipeFromText(recipeText, llmProvider);
}