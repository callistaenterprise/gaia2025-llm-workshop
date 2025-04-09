import {convertToSwedishUnits, UnitAndAmount} from "./conversions"; // used in Exercise 5
import {
    Content,
    FunctionCall, FunctionCallingConfigMode,
    FunctionDeclaration, FunctionResponse,
    Type
} from "@google/genai"; // used in Exercise 5
import {GenerateContentResponse, GoogleGenAI} from "@google/genai"; // used in Exercise 3


export async function htmlToText(recipeHtml: string): Promise<string> {
    return recipeHtml;  // TODO: Implement extraction logic
}


export async function recipeFromText(recipeText: string, llmProvider: string):Promise<any> {
    const prompt = "Write your prompt here";

    console.log("-----------------------------")
    console.log(`Invoking LLM provider "${llmProvider}" ...`);

    switch (llmProvider) {
        case "gemini":
            return callGemini(prompt);
        case "mistral":
            return callMistral(prompt);
        case "anthropic":
            return callAnthropic(prompt);
        case "openai":
            return callOpenAI(prompt);
        default:
            return "Invalid model";
    }
}

export async function callGemini(prompt: string): Promise<any> {
    const geminiApiKey = process.env.GEMINI_API_KEY;
    // Hint: use the "@google/genai" SDK library
    // Hint: model "gemini-2.0-flash" is recommended to be used
    
    return "Not implemented yet";
}

/**
 * - Backup providers (`callMistral`, `callOpenAI`, `callAnthropic`) are available in case Gemini is not working.
 */
export async function callMistral(prompt: string): Promise<any> {
    return "Not implemented yet";
}

export async function callOpenAI(prompt: string): Promise<any> {
    return "Not implemented yet";
}

export async function callAnthropic(prompt: string): Promise<any> {
    return "Not implemented yet";
}