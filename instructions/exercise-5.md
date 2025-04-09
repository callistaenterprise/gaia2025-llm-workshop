# Exercise 5: Tool-use (unit conversion)

[&#x25c0; Go back to Exercise 4](./exercise-4.md)

So far, we’ve extracted recipe text, structured it into JSON, and evaluated the quality of the LLM-generated outputs. However, one common challenge with international recipes is unit inconsistencies.

## Why unit conversion matters
* American recipes often use `"cups"`, `"tsp"`, `"tbs"`, and `"lbs"`, while a Swedish recipe uses `"ml"`, `"tsk"`, `"msk"`, and `"g"`.
* Some recipes mix metric and imperial units, making it difficult to follow instructions correctly.


## What you will learn in this exercise:

* How to extend the LLM with tool-use (function calling).
* How to convert non-Swedish units into Swedish cooking units dynamically.
* How to integrate unit conversion into the existing recipe pipeline.


## Key considerations before implementation

Before implementing tool-use, ask yourself:

1. How will you detect which units should be converted?
Consider handling abbreviations (e.g., oz., tblsp), typos, and case differences. Should you hardcode known Swedish units to skip, or rely on the LLM model?
2. How can you guide the LLM to avoid unnecessary conversions?
Think about how your prompt or function definitions can clarify which units to convert and which to ignore, possibly with concrete examples.

# Step-by-step instructions

## 1. Locate the unit conversion function in code

Open the file [`backend/src/services/conversions.ts`](../backend/src/services/conversions.ts) and locate the function `convertToSwedishUnits`:

In the next step, you should integrate this function through tool-use.

## 2. Integrate tool-use (function calling) in LLM requests

Modify the LLM function `callGemini` in [`backend/src/services/parseRecipes.ts`](../backend/src/services/parseRecipes.ts) and configure function calling in the LLM so that when it encounters non-Swedish units, it calls the  `convertToSwedishUnits` function.

To save time, you can copy and use the following function declaration directly in your `callGemini` implementation as a start. 


```
const conversionFunctionDeclaration: FunctionDeclaration = {
    name: 'convertUStoSwedishUnits',
    parameters: {

        type: Type.OBJECT,
        description: 'Convert US recipe units to Swedish units.',
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
```

### Resources

Introduction to function calling: 
* https://ai.google.dev/gemini-api/docs/function-calling?example=meeting#javascript_1

### Validation
To validate your implementation, run the following command from the `backend` directory to execute the tests for this exercise:

```
npm run test-exercise-5
```

The test will process an international recipe:\
👉 https://hungryhappens.net/perfect-swedish-meatballs/

The recipe contains multiple international units, which should be converted correctly.


Verify that the terminal displays log output similar to the sample below:

```
❯ npm run test-exercise-5

> backend@1.0.0 test-exercise-5
> NODE_ENV=development ts-node test-exercises/exercise_5.ts

...
...
...
Returned object matches Recipe schema [OK]
Ingredient[2] "fläskfärs (eller nötfärs)": 0.9071848kg [OK]
Ingredient[3] "panko ströbröd": 1.182941dl [OK]
Test passed: got a valid recipe.
```


## Solution
Try to complete the exercise on your own first! But if you get stuck, cannot complete the exercise within a reasonable time, or want to compare your final implementation with a working example, you can review the solution here: [Solution for Exercise 5](./solutions/solution-5.md)

## Next steps

Congratulations on finishing the final exercise!
Once you've confirmed that unit conversion works correctly, you can move on to exploring additional bonus features.

[&#x25B6; Click here to proceed to bonus exercises](./exercise-bonus.md)