import {Recipe, Ingredient, Step } from "./Recipe";
import _ from 'lodash';
import { normalizeText, logDifferences } from "./training-utils"; 
import {GenerateContentResponse, GoogleGenAI} from "@google/genai";

export async function compareRecipes(expected: Recipe, actual: Recipe): Promise<number> {
    console.log("\n--------------------------------------------------");
    console.log(`Assessing recipe: ${actual?.name || "Unknown Recipe"}`);
    console.log("--------------------------------------------------");
    
    if (!expected || !actual) {
        console.error("❌ Error: One or both recipes are undefined.");
        return 0.0;
    }

    try {
        const exactMatchScore = isExactMatch(expected, actual);
        if (exactMatchScore === 1.0) {
            console.log("✅ Exact match found, returning 1.0");
            return 1.0;
        }

        const fuzzyScore = calculateFuzzyScore(expected, actual);
        const llmResult = await calculateLlmScore(expected, actual);
        
        const finalScore = (fuzzyScore + llmResult.score) / 2.0;
        
        console.log(`Fuzzy Score: ${fuzzyScore.toFixed(2)}`);
        console.log(`LLM Score: ${llmResult.score.toFixed(2)}`);
        console.log(`Final Weighted Score: ${finalScore.toFixed(2)}`);
        console.log("--------------------------------------------------\n");
        logDifferences(expected, actual);
        console.log("--------------------------------------------------\n");
        console.log(`LLM Comment: ${llmResult.comment}`);
    
        console.log("--------------------------------------------------\n");
        return finalScore;
    } catch (error) {
        console.error("❌ Error: An unexpected issue occurred in compareRecipes:", error);
        return 0.0;
    }
}



function isExactMatch(expected: Recipe, actual: Recipe): number {
    return JSON.stringify(expected).toLowerCase() === JSON.stringify(actual).toLowerCase() ? 1.0 : 0.0;
}

function calculateFuzzyScore(expected: Recipe, actual: Recipe): number {
    // Implement calculation of a fuzzy score    
    return 0.0;
}


function parseLlmJsonResponse(response: string): any {
    return JSON.parse(response
        .replace(/^```json\s*/i, '')  // Remove starting ```json (case-insensitive)
        .replace(/^```\s*/i, '')      // If it's just ``` without json
        .replace(/```$/, '')          // Remove ending ```
        .trim());                      // Remove extra spaces and line breaks
}


async function calculateLlmScore(expected: Recipe, actual: Recipe): Promise<{ score: number; comment: string }> {
    const geminiClient = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});
    const prompt = `Write your prompt here, ensure LLM returns a JSON on the format {"score": 0.0, "comment": "Comment from LLM"}`;

    // TODO: Remove below line and implement LLM-based evaluation
    return { score: 0.0, comment: "Not yet implemented" };
    
    try {
        const completion: GenerateContentResponse = await geminiClient.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            config: {
                temperature: 0.0,
                topP: 1,
                topK: 40,
                seed: 42,
            },
        });

        const response = completion.text!;
        const responseJson = parseLlmJsonResponse(response);
        return {
            score: responseJson.score ?? 0.0,
            comment: responseJson.comment ?? "No comment provided."
        };
    } catch (error) {
        console.error("❌ Error: Failed to get LLM score:", error);
        return { score: 0.0, comment: "LLM evaluation failed." };
    }
}



