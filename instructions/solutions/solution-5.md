# Exercise 5: Solution

[&#x25c0; Go back to Exercise 4](../exercise-4.md)

<details>

<summary>Click here to view the solution for Exercise 5</summary>

## Solution code for callGemini

Open the file [`backend/src/services/parseRecipes.ts`](../../backend/src/services/parseRecipes.ts) and replace function `callGemini` by using below code:

```
export async function callGemini(prompt: string): Promise<string> {
    let result;
    const geminiClient = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

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
    }

    const contents: Content[] = [{role: 'user', parts: [{text: prompt}]}];

    const firstResponse: GenerateContentResponse = await geminiClient.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: contents,
        config: {
            tools: [{
                functionDeclarations: [conversionFunctionDeclaration]
            }],
            toolConfig: {functionCallingConfig: {mode: FunctionCallingConfigMode.ANY, allowedFunctionNames: [conversionFunctionDeclaration.name!]}} ,
            temperature: 0.0,
            seed: 42,
        },
    });

    result = firstResponse.text!;

    const functionCalls: FunctionCall[] = firstResponse.functionCalls!;

    if(functionCalls) {
        console.log(`🔧 FunctionCalls: ${functionCalls.length}`);

        for (const functionCall of functionCalls) {
            if (functionCall) {
                // Call the executable function
                const {unit, amount} = functionCall.args as unknown as UnitAndAmount;
                const apiResponse = convertToSwedishUnits(unit, amount);
                const functionResponse: FunctionResponse =  {
                    id: functionCall.id,
                    name: functionCall.name,
                    response: {output: apiResponse}
                }
                contents.push({ role: 'model', parts: [{ functionCall: functionCall }] });
                contents.push({ role: 'user', parts: [{ functionResponse: functionResponse }] });
                console.log(`  ✅  ${amount}${unit} converted to ${apiResponse.amount}${apiResponse.unit}`);
            }
        }

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
            throw new Error("LLM response did not contain any text. Only function calls were returned which is unexpected.");
        }
    }

    result = result
        .replace(/^```json\s*/i, '') // Remove starting ```json (case-insensitive)
        .replace(/^```\s*/i, '')    // If it's just ``` without json
        .replace(/```$/, '')        // Remove ending ```
        .trim();                   // Remove extra spaces and line breaks
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


