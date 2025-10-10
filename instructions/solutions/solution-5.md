# Exercise 5: Solution

[&#x25c0; Go back to Exercise 4](../exercise-4.md)

<details>

<summary>Click here to view the solution for Exercise 5</summary>

## Solution code for callGemini

Open the file [`backend/src/services/parseRecipes.ts`](../../backend/src/services/parseRecipes.ts) and replace function `callGemini` by using below code:

```
export async function callGemini(prompt: string): Promise<any> {
    // 1. SETUP & INITIALIZATION
    const geminiClient = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});
    const contents: Content[] = [{role: 'user', parts: [{text: prompt}]}];
    let result: string;

    // 2. FUNCTION DECLARATION
    // Define the structure of the function the LLM can call
    const conversionFunctionDeclaration: FunctionDeclaration = {
        name: 'convertUStoSwedishUnits',
        parameters: {
            type: Type.OBJECT,
            description: 'Convert US recipe units to Swedish units. Do NOT call this function for units that are already in Swedish format (g, kg, l, dl, msk, tsk, krm, efter smak).',
            properties: {
                unit: {
                    type: Type.STRING,
                    description: 'US recipe unit for weight, volume or other that appears in a food recipe'
                },
                amount: {
                    type: Type.NUMBER,
                    description: 'The amount of the US recipe unit'
                }
            },
            required: ['unit', 'amount']
        }
    };

    // 3. FIRST API CALL
    // The model receives the prompt and may decide to call functions
    const firstResponse: GenerateContentResponse = await geminiClient.models.generateContent({
        model: 'gemini-2.0-flash', // Consider 'gemini-1.5-pro-latest' for higher reliability
        contents: contents,
        config: {
            tools: [{
                functionDeclarations: [conversionFunctionDeclaration]
            }],
            toolConfig: {
                functionCallingConfig: {
                    mode: FunctionCallingConfigMode.ANY,
                    allowedFunctionNames: [conversionFunctionDeclaration.name!]
                }
            },
            temperature: 0.0,
            seed: 42,
        },
    });

    // 4. HANDLE FUNCTION CALLS (if any)
    result = firstResponse.text!;
    const functionCalls: FunctionCall[] = firstResponse.functionCalls!;

    if (functionCalls && functionCalls.length > 0) {
        console.log(`🔧 FunctionCalls: ${functionCalls.length}`);

        // This array will hold the results of our local function executions
        const functionResponseParts: Part[] = [];

        // Execute each function call from the model's response
        for (const functionCall of functionCalls) {
            const {unit, amount} = functionCall.args as unknown as UnitAndAmount;
            
            // Call your local function
            const apiResponse = convertToSwedishUnits(unit, amount);
            console.log(`  ✅  ${amount}${unit} converted to ${apiResponse.amount}${apiResponse.unit}`);

            // Add the structured response to our collection as a 'Part'
            functionResponseParts.push({
                functionResponse: {
                    name: functionCall.name,
                    response: {
                        name: functionCall.name,
                        content: apiResponse
                    },
                },
            });
        }

        // CONSTRUCT THE CONVERSATION HISTORY CORRECTLY
        // A: Add the model's turn containing ALL parallel function call requests
        contents.push({
            role: 'model',
            parts: functionCalls.map(fc => ({ functionCall: fc })),
        });

        // B: Add a SINGLE tool turn containing ALL the function responses
        contents.push({
            role: 'tool', // 'tool' is the correct role for function responses
            parts: functionResponseParts,
        });

        // 5. SECOND API CALL
        // The model receives the function results and generates the final text response
        const final_response = await geminiClient.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: contents,
            config: {
                tools: [{
                    functionDeclarations: [conversionFunctionDeclaration]
                }],
                temperature: 0.0,
                seed: 42
            },
        });
        
        result = final_response.text!;
        if (!final_response.text) {
            throw new Error("LLM response did not contain any text after function calls. The model may have been confused by the conversation history.");
        }
    }

    // 6. CLEANUP AND RETURN
    // Remove markdown code fences and parse the JSON string
    result = result
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```$/, '')
        .trim();
        
    return JSON.parse(result);
}
```

## Reducing number of function calls (bonus)

To avoid unnecessary conversions of units already in Swedish format, we added an extra instruction to the `prompt`. This reduced redundant function calls, though it wasn't completely bulletproof:

```
Convert only units that are not already in Swedish cooking format by using using the convertToSwedishUnits function.
Do not convert if the unit is already one of: "g", "kg", "l", "dl", "msk", "tsk", "krm", or "efter smak".
```

</details>


