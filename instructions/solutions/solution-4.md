# Exercise 4: Solution

[&#x25c0; Go back to Exercise 4](../exercise-4.md)

<details>

<summary>Click here to view the solution for Exercise 4</summary>

## Solution for implementing compareRecipes

#### What was done:

This solution improves the `compareRecipes` function by combining two ways of scoring:

1. Fuzzy scoring (`calculateFuzzyScore`) – A simple rule-based check that compares name, description, portions, ingredients, steps, and categories. Each part is weighted, so partial matches can still give points even if it's not an exact match.
2. LLM scoring (`calculateLlmScore`) – Uses Gemini 2.0 Flash to evaluate the recipe. The model is given a prompt that explains how to judge the output, including what to penalize (like missing ingredients or incorrect quantities) and what to ignore (like formatting or stars). It returns a score and a short comment.

#### Solution code:
To incorportate these changes in your code, open the file [`backend/testdata/evaluation.ts`](../backend/testdata/evaluation.ts) and replace the draft implementation for `calculateFuzzyScore` and `calculateLlmScore` with below code:

```

function calculateFuzzyScore(expected: Recipe, actual: Recipe): number {
    let score = 0;
    let total = 0;

    const nameWeight = 1.0;
    const descriptionWeight = 1.0;
    const portionsWeight = 1.0;
    const ingredientsWeight = 1.0;
    const stepsWeight = 1.0;
    const categoryWeight = 0.25;

    total += nameWeight;
    if (normalizeText(expected.name) === normalizeText(actual.name)) score += nameWeight;

    total += descriptionWeight;
    if (normalizeText(expected.description) === normalizeText(actual.description)) score += descriptionWeight;

    total += portionsWeight;
    if (expected.portions === actual.portions) score += portionsWeight;

    score += compareIngredients(expected.ingredients, actual.ingredients) * ingredientsWeight;
    total += expected.ingredients.length * ingredientsWeight;

    score += compareSteps(expected.steps, actual.steps) * stepsWeight;
    total += expected.steps.length * stepsWeight;

    score += compareCategories(expected.categories, actual.categories) * categoryWeight;
    total += expected.categories.length * categoryWeight;
    
    return total > 0 ? score / total : 0;
}

function compareIngredients(expected: Ingredient[], actual: Ingredient[]): number {
    let score = 0;
    const minLength = Math.min(expected.length, actual.length);
    for (let i = 0; i < minLength; i++) {
        if (
            normalizeText(expected[i].name) === normalizeText(actual[i].name) &&
            normalizeText(expected[i].unit) === normalizeText(actual[i].unit) &&
            expected[i].quantity === actual[i].quantity // Must be exactly the same
        ) {
            score += 1;
        }
    }
    return score;
}

function compareSteps(expected: Step[], actual: Step[]): number {
    let score = 0;
    const minLength = Math.min(expected.length, actual.length);
    for (let i = 0; i < minLength; i++) {
        if (
            expected[i].order === actual[i].order &&
            normalizeText(expected[i].instruction) === normalizeText(actual[i].instruction) &&
            expected[i].minutes === actual[i].minutes // Must be exactly the same
        ) {
            score += 1;
        }
    }
    return score;
}


function compareCategories(expectedCategories: string[] | undefined, actualCategories: string[] | undefined): number {
    expectedCategories = expectedCategories || [];
    actualCategories = actualCategories || [];
    return expectedCategories.filter(cat => actualCategories!.map(normalizeText).includes(normalizeText(cat))).length;
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
    
    const prompt = `You are an expert recipe evaluator assessing the accuracy of a generated recipe. 
    Compare it against the expected recipe and provide a similarity score between 0.0 and 1.0.
    Completely ignore any "stars" or rating values in the recipe. 
    
    Critical issues (Severe Penalty, Strong Deduction):
    - Missing key ingredients that could make the dish inedible or entirely different.
    - Significant errors in ingredient quantities that would lead to bad taste or texture.
    - Completely wrong cooking instructions (e.g., missing steps, incorrect techniques).
    
    Moderate issues (Mild Deduction):
    - Slight variations in cooking methods or temperatures.
    - Small ingredient substitutions that preserve the overall taste.
    
    Trivial differences (Ignore or Minor Deduction):
    - Formatting, spacing, or category mismatches.
    - Additional optional ingredients that do not drastically change the dish.
    
    Expected Recipe:
    \`\`\`json
    ${JSON.stringify(expected, null, 2)}
    \`\`\`

    Actual Recipe:
    \`\`\`json
    ${JSON.stringify(actual, null, 2)}
    \`\`\`

    Respond in the following JSON format:
    {
    "score": <similarity_score>,
    "comment": "<brief_comment>"
    }`;
    
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
```

## Solution for implementing improved prompt and LLM call

#### What was done:
The LLM `prompt` was enhanced to improve parsing consistency by adding the following conditions:

* If two spices such as "salt och peppar", split them as two ingredients.
* Use quantity 0 for unit "efter smak".
* Do never split instructions into multiple steps.

Additionally, `generationConfig` was set to get more stable outputs:

```
generationConfig: {
  temperature: 0.2,   // Reduces randomness for more stable outputs
  topP: 1,            // Uses full probability distribution
  topK: 40            // Considers top 40 likely tokens
}
```

These changes improved both recipe consistency and scoring in our tests. When running the full evaluation on all six golden recipes, the total average score increased from 0.89 to 0.93.

#### Solution code:
To incorportate these changes in your code, open the file [`backend/src/services/parseRecipes.ts`](../backend/src/services/parseRecipes.ts) and replace `recipeFromText` and `callGemini` by using below code:

```
export async function recipeFromText(recipeText: string, llmProvider: string):Promise<any> {
    const prompt = `Given a food recipe text from a web page in swedish:
     <text>${recipeText}</text>
      Create a JSON object describing the recipe and use Swedish for the values.
        If there is no time on the cooking steps dont invent any new ones, just set the value to 0
        If two spices such as "salt och peppar", split them as two ingredients.
        Use quantity 0 for unit "efter smak".
        Do never split instructions into multiple steps.
        Respond with JSON as the schema defined by on recipeSchema:
        type Unit = "l" | "dl" | "cl" | "ml" | "msk" | "tsk" | "krm" | "kg" | "g" | "st" | "efter smak" | "port";
        const UnitEnum = Object.freeze({
            LITER : "l",
            DECILITER: "dl",
            CENTILITER: "cl",
            MILLILITER: "ml",
            MATSKED: "msk",
            TESKED: "tsk",
            KRYDDMATT: "krm",
            KILOGRAM: "kg",
            GRAM: "g",
            STYCK: "st",
            EFTER_SMAK: "efter smak",
            PORTIONER: "port"
        });

        });
        interface Ingredient {
            name: string;
            quantity: number;
            unit: Unit;
        }
        interface Step {
            order: number;
            instruction: string;
            minutes: number;
        }
        const ingredientSchema = new mongoose.Schema<Ingredient>({
            name: { type: String, required: true },
            quantity: { type: Number, required: true, default: 1 },
            unit: { type: String, required: true, enum: Object.values(UnitEnum), default: UnitEnum.STYCK }
        });
        const stepSchema = new mongoose.Schema<Step>({
            order: { type: Number, required: true },
            instruction: { type: String,  required: true },
            minutes: {type: Number, required: false}
        });
        const recipeSchema = new mongoose.Schema({
            name: { type: String, required: true },
            description: { type: String, required: true },
            ingredients: {type: [ingredientSchema], required: true},
            steps: {type: [stepSchema], required: false},
            portions: { type: Number, required: true },
            stars: { type: Number, required: false },
            categories: {type: [String], required: false}
        });`;

    console.log("-----------------------------")
    // console.log(prompt)
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
            console.error(`Invalid model configured: ${llmProvider}`);
            return "Invalid model";
    }
}

export async function callGemini(prompt: string): Promise<any> {

    const geminiClient = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

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

    let response = completion.text!;
    response = response
    .replace(/^```json\s*/i, '') // Remove starting ```json (case-insensitive)
    .replace(/^```\s*/i, '')    // If it's just ``` without json
    .replace(/```$/, '')        // Remove ending ```
    .trim();                   // Remove extra spaces and line breaks

    return JSON.parse(response);
}
```

</details>