import fs from "fs/promises";
import path from "node:path";
import {Recipe} from "./Recipe";
import _ from 'lodash';
import { readdir } from "node:fs/promises";
import {recipeFromUrl, recipeFromHtml} from "../src/services/recipeHandler";
import { compareRecipes } from "./evaluation";

interface AnnotatedRecipe {
    url: string,
    siteNameSlug: string,
    recipeNameSlug: string
    recipe: Recipe,
    language: string,
    hitl: boolean,
    model: string
}


export async function trainOneEpocInParallel(
    useCache: boolean = false,
    fullRun: boolean = false,
    llmProvider: string = 'gemini',
    dataset: number = 1
) {
    const cacheFile = path.join('testdata', 'cachedResults.json');
    const saveCache = useCache;

     // Read the golden dataset
    let annotatedRecipes: AnnotatedRecipe[] = [];
    if (fullRun) {
        const goldenDir = path.join('testdata', 'golden-recipes');
        const files = await readdir(goldenDir);
        const annotatedFiles = files.filter(name =>
            /^annotatedGoldenRecipes\d+\.json$/.test(name)
        );

        for (const fileName of annotatedFiles) {
            const filePath = path.join(goldenDir, fileName);
            const content = await fs.readFile(filePath, 'utf-8');
            const data = JSON.parse(content) as AnnotatedRecipe[];
            annotatedRecipes.push(...data);
        }
    } else {
        const annotatedFilePath = path.join('testdata', 'golden-recipes', `annotatedGoldenRecipes${dataset}.json`);
        const content = await fs.readFile(annotatedFilePath, 'utf-8');
        annotatedRecipes = JSON.parse(content) as AnnotatedRecipe[];
    }

    console.log(`🔍 Loaded ${annotatedRecipes.length} annotated recipes`);

    try {
        let actualResults: AnnotatedRecipe[] | undefined = [];
        let scores: number[] = [];

        if (useCache) {
            try {
                const actualFileContent = await fs.readFile(cacheFile, 'utf-8');
                actualResults = JSON.parse(actualFileContent);
                console.log(`✅ Loaded results from cache file: ${cacheFile}`);
            } catch (error) {
                console.warn(`⚠️ Warning: Could not read cache file. Fetching new results instead.`);
                actualResults = await parseInParallel(annotatedRecipes, llmProvider);
            }
        } else {
            console.log(`🔄 Fetching new results by running the parser...`);
            actualResults = await parseInParallel(annotatedRecipes, llmProvider);
        }

        // Ensure actualResults is valid before processing
        if (!actualResults || !Array.isArray(actualResults)) {
            console.error("❌ Critical Error: actualResults is undefined or not an array.");
            return;
        }

        // Compare expected vs. actual results and store scores
        for (const expected of annotatedRecipes) {
            const expectedRecipe: Recipe = expected.recipe;
            const actual = actualResults.find(result => result.url === expected.url);

            if (actual && actual.recipe) {
                const score = await compareRecipes(expectedRecipe, actual.recipe);
                scores.push(score);
            } else {
                console.error(`❌ Error: No valid result found for ${expected.url}`);
            }
        }

        // Compute and log final average score
        if (scores.length > 0) {
            const averageScore = scores.reduce((sum, s) => sum + s, 0) / scores.length;
            console.log("==================================================");
            console.log(`✅ Final Average Score: ${averageScore.toFixed(2)}`);
            console.log("==================================================");
        } else {
            console.warn("⚠️ Warning: No scores recorded, check for errors.");
        }

        // Save results to cache if requested
        if (saveCache) {
            try {
                await fs.writeFile(cacheFile, JSON.stringify(actualResults, null, 2), 'utf-8');
                console.log(`💾 Saved results to cache file: ${cacheFile}`);
            } catch (error) {
                console.error(`❌ Error: Could not save results to cache file: ${error}`);
            }
        }

    } catch (error) {
        console.error(`❌ Critical Error: Failed to execute training. ${error}`);
    }
}



async function parseInParallel(annotatedRecipes: AnnotatedRecipe[], llmProvider: string): Promise<AnnotatedRecipe[]> {
    const actualResults: AnnotatedRecipe[] = new Array(annotatedRecipes.length);
    await Promise.all(
        annotatedRecipes.map(async (annotatedRecipe: AnnotatedRecipe , index: number)=> {
            let recipeHtmlFilePath = path.join('testdata', 'golden-recipes', annotatedRecipe.siteNameSlug, annotatedRecipe.recipeNameSlug, `${annotatedRecipe.recipeNameSlug}.html`);
            const recipeHtml = await fs.readFile(recipeHtmlFilePath, 'utf-8');
            const recipe: Recipe = await recipeFromHtml(recipeHtml, llmProvider);
            const result: AnnotatedRecipe = {
                url: annotatedRecipe.url,
                siteNameSlug: annotatedRecipe.siteNameSlug,
                recipeNameSlug: annotatedRecipe.recipeNameSlug,
                recipe: recipe,
                model: llmProvider,
                language: annotatedRecipe.language,
                hitl: false
            }
            actualResults[index] = result;
        })
    );
    return actualResults;
}