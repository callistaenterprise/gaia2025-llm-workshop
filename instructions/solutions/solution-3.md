# Exercise 3: Solution

[&#x25c0; Go back to Exercise 3](../exercise-3.md)



<details>

<summary>Click here to view the solution with schema in prompt</summary>

## Solution code

Open the file [`backend/src/services/parseRecipes.ts`](../backend/src/services/parseRecipes.ts) and replace the placeholder for `recipeFromText` and `callGemini` by using below code:

```
export async function recipeFromText(recipeText: string, llmProvider: string):Promise<any> {    
    const prompt = `Given a food recipe text from a web page in swedish:
     <text>${recipeText}</text>
      Create a JSON object describing the recipe and use Swedish for the values.
        If there is no time on the cooking steps dont invent any new ones, just set the value to 0
        Respond with JSON on format recipeSchema:
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
        case "mistral":
            return callMistral(prompt);
        case "gemini":
            return callGemini(prompt);
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