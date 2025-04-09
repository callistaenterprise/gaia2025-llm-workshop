# Exercise 4: Test the LLM prompt

[&#x25c0; Go back to Exercise 3](./exercise-3.md)

Large Language Models (LLMs) are highly sensitive to prompt design. Small changes in wording can lead to dramatically different outputs, making systematic evaluation important to ensure high-quality results.

In this exercise, you will:
* Test your LLM prompt by comparing its output against predefined [`golden dataset`](../backend/testdata/golden-recipes/) with expected results. 
* Identify errors and inconsistencies in generated recipes. 
* Set up a structured workflow to iteratively refine the prompt for better performance.

## Key considerations before testing

Before testing variations of your LLM prompt, ask yourself:

1. What defines a "correct" recipe output?
   * Does the output match expectations in format, completeness, and correctness?
   * Should minor variations in text fail a test? (e.g., "Gul lök: 1" vs. "gul lök: 1st")
   * Should the LLM infer missing data (e.g., estimate cooking times if none are provided)?
2. How do we measure output quality?
   * Exact string match? Too strict—it may fail due to small, acceptable variations.
   * Fuzzy matching? Allows flexibility, but might accept incorrect values.
   * Use LLM-as-a-judge? Automates evaluation by scoring output based on defined criteria.
3. How can we automate the LLM prompt evaluation?


# Step-by-step instructions

## 1. Locate the compareRecipes in code

Open the file [`backend/testdata/evaluation.ts`](../backend/testdata/evaluation.ts) and review the function `compareRecipes`.

As you review the function, you will notice that:
 * The function evaluates how similar two recipes are by assigning a score between 0.0 and 1.0.
 * If the recipes are identical, it immediately returns a score of **1.0**.
 * If the recipes does not match: 
   * A `calculateFuzzyScore` function is used to evaluate similarity
   * An AI judge (`calculateLlmScore`) to compare the two recipes and provide a similarity score and explanatory comment.
   * A weighted average of the fuzzy score and the LLM-generated score is used as the final rating.
 

The `isExactMatch` function is **already implemented**, but it is too strict—it fails on small, acceptable variations. To enhance the LLM evaluation, you need to **implement** the functions `calculateFuzzyScore` and `calculateLlmScore`.

## 2. Implement the LLM evaluation

Open the file [`backend/testdata/evaluation.ts`](../backend/testdata/evaluation.ts) and locate the function for `calculateFuzzyScore` and `calculateLlmScore`.


### Implement calculateFuzzyScore

Replace the placeholder function with a meaningful implementation that allows minor variations but still detects substantial differences.


```
function calculateFuzzyScore(expected: Recipe, actual: Recipe): number {
    // Implement calculation of a fuzzy score    
    return 0.0;
}
```

### Refine calculateLlmScore

The `calculateLlmScore` function queries Gemini 2.0 to evaluate recipe similarity. Update the `prompt` to ensure the LLM:
* Returns a JSON object formatted as { "score": 0.0, "comment": "Comment from LLM" }.
* Penalizes missing key ingredients or incorrect measurements more than minor formatting differences.
* Provides a clear, brief comment explaining why a certain score was assigned.

```
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
```

Your goal is to complete the `calculateFuzzyScore` and `calculateLlmScore` functions to automatically evaluate LLM-generated recipes against the [`golden dataset`](../backend/testdata/golden-recipes/) of expected outputs.


### Validation
To validate your implementation, run the following command from the `backend` directory to execute the tests for this exercise:

```
npm run test-exercise-4 -- --dataset 1
```

By default, this command fetches new results from the LLM for every test run. However, caching can help speed up testing when iterating on functions that do not affect the raw LLM output

Supplement the command option `-- --use-cache` when refining post-processing logic, such as:
* Tweaking the `calculateFuzzyScore` and `calculateLlmScore` functions.
* Adjusting how results are analyzed or logged.
* Running multiple test iterations without re-fetching the same LLM output.

Avoid using cache when making changes to the LLM prompt because:
* The model's response might change with new prompt adjustments.
* Running fresh parsing ensures that you evaluate the latest LLM-generated results.

Once you've tested dataset 1, continue with datasets 2 and 3:

```
npm run test-exercise-4 -- --dataset 2
npm run test-exercise-4 -- --dataset 3
```


#### Command usage examples:

| Command | Behavior |
|---------|---------|
| `npm run test-exercise-4` | Runs normally, using fresh parsing (no cache, no saving). |
| `npm run test-exercise-4 -- --use-cache` | Loads results from the cache file instead of fetching new ones. |
| `npm run test-exercise-4 -- --dataset 2` | Runs evaluation only on dataset 2 using fresh parsing. Allowed values: 1, 2, or 3. |                                                             
| `npm run test-exercise-4 -- --full` | Runs the LLM evaluation on the full golden dataset. |

#### Expected Output

When your implementation is correct, the test should display logs summarizing evaluation accuracy and highlight any failed comparisons.

## 3. Iteratively improve the LLM recipe converting prompt
To improve the LLM's ability to parse and evaluate recipes, update the `prompt` inside `recipeFromText` in the file [`backend/src/services/parseRecipes.ts`](../backend/src/services/parseRecipes.ts) and re-run the test cases for this exercise until you get improved scoring. 


## Solution
Try to complete the exercise on your own first! But if you get stuck, cannot complete the exercise within a reasonable time, or want to compare your final implementation with a working example, you can review the solution here: [Solution for Exercise 4](./solutions/solution-4.md)

## Next steps

Once you've validated your implementation, proceed to Exercise 5, where you’ll integrate unit conversion via LLM tool usage.

[&#x25B6; Click here to proceed to Exercise 5](./exercise-5.md)