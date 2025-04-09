# Exercise 3: Create prompt (convert text into JSON)

[&#x25c0; Go back to Exercise 2](./exercise-2.md)

In this exercise, you'll design an LLM prompt and complete a function that calls the LLM provider API to convert recipe text into a structured JSON format that adheres to the **full recipe schema defined in code**.

## Resources

Google Gemini official docs: 
* https://ai.google.dev/gemini-api/docs/quickstart?lang=node

# Step-by-step instructions

## 1. Locate the recipe schema in code

Open the file [`backend/src/models/recipe.ts`](../backend/src/models/recipe.ts) and review the `recipeSchema`.

As you review the schema, ask yourself:
* What instructions should I give the LLM to ensure that it converts recipe text into this exact JSON structure?
* How can I describe the expected JSON format clearly enough for the LLM to follow?

> **_NOTE:_**  The `recipeSchema` references other schemas like `ingredientSchema` and `stepSchema`. Make sure that the LLM understands the full structure.

## 2. Design LLM prompt and implement LLM API call

Open the file [`backend/src/services/parseRecipes.ts`](../backend/src/services/parseRecipes.ts) and locate:

* The placeholder `prompt` inside the `recipeFromText` function.
* The empty `callGemini` function.

```
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
```

```
export async function callGemini(prompt: string): Promise<any> {
    const geminiApiKey = process.env.GEMINI_API_KEY;
    // Hint: use the "@google/genai" SDK library
    // Hint: model "gemini-2.0-flash" is recommended to be used
    
    return "Not implemented yet";
}
```

Your goal is to: 
1. Design a LLM prompt that takes the plain recipe text and converts it into a JSON object matching the full schema defined in `recipeSchema`. 
2. Implement the `callGemini` function to call the LLM provider with your designed prompt and return the structured JSON object as the response.

### Validation
To validate your implementation, run the following command from the `backend` directory to execute the tests for this exercise:

```
npm run test-exercise-3
```

Then, verify that the terminal displays log output similar to the sample below:

```
❯ npm run test-exercise-3

> backend@1.0.0 test-exercise-3
> NODE_ENV=development ts-node test-exercises/exercise_3.ts

Testing recipe URL: "https://www.arla.se/recept/janssons-frestelse/" with LLM provider "gemini" ...
-----------------------------
Invoking LLM provider "gemini" ...
Returned value is of type object [OK]
Returned object matches Recipe schema [OK]
Test passed: recipeFromText returned a valid recipe.
```

Once the backend tests pass, verify the functionality through the frontend:
1. Navigate to the Add Recipe view:\
👉 http://localhost:5173/add
2. Press the blue `Use Favorite` button to autofill the recipe URL field with a predefined recipe.
3. Press `Fetch from web` to attempt parsing the recipe from the Internet.
   > **_NOTE:_**  If your backend implementation is correct, this step should now return a parsed recipe instead of an error.
4. Finally, press `Save the recipe` to store it in the system.
5. If you have additional time, try parsing other recipes of your choice from various recipe providers, such as:
   * https://www.godare.se/
   * https://www.ica.se/recept/
   * https://www.koket.se/
   * https://www.landleyskok.se/recept
   * https://recept.se/
   * http://www.recept.com/
   
   > **_Tip:_** Trying recipes from different sites helps test both the HTML parsing and how well the LLM converts the recipe text into structured JSON — ensuring your solution works across various formats and layouts.
6. If you still have additional time, navigate to the Cook view: 
👉 http://localhost:5173/cook
7. Click on one of your saved recipes in the left-hand navigation panel.
8. Scroll down to the chat section, enter a question about the recipe, and press `Ask Question`.
   > The LLM should respond with an answer based on the selected recipe.


## Solution
Try to complete the exercise on your own first! But if you get stuck, cannot complete the exercise within a reasonable time, or want to compare your final implementation with a working example, you can review the solution here: [Solution for Exercise 3](./solutions/solution-3.md)

## Next steps

After you have successfully validated your implementation, you can move on to Exercise 4. Next steps include adding features such as testing the LLM prompt.

[&#x25B6; Click here to proceed to Exercise 4](./exercise-4.md)