# Exercise 2: Extract recipe text from a web page

[&#x25c0; Go back to Exercise 1](./exercise-1.md)

# Introduction

When working with recipe web pages, we often want to extract only the essential recipe information and remove all unnecessary content.

One important reason for this is that Large Language Models (LLMs), like the ones we will use in later exercises, have a **limited context window** — meaning we usually cannot send an entire HTML page to the model because it would be too large and inefficient. Stripping unnecessary content reduces data volume, making the LLM **faster**, **more cost-effective**, and better optimized for processing.

In fact, our analysis of major Swedish recipe providers shows that 80% to 99% of webpage content can be safely removed without losing valuable recipe information.

## How recipe web pages are built

Recipe pages are structured in different ways, and it's important to handle both common cases:

1. **Unstructured recipes**: Some pages present the recipe as plain text inside HTML tags, scattered across headings, paragraphs, and lists.
2. **Structured recipes**: Other pages use JSON-LD (JavaScript Object Notation for Linked Data) — a format designed to make data easy for machines to read and understand. This data is embedded inside special tags like:
   ```
   <script type="application/ld+json"> 
   ... 
   </script>
   ```

To handle both cases efficiently, we will in this exercise implement selective parsing — removing all unnecessary HTML while preserving important structured data when available.

# Step-by-step instructions

## 1. Implement htmlToText

Open the file [`backend/src/services/parseRecipes.ts`](../backend/src/services/parseRecipes.ts) and locate the placeholder for `htmlToText`:

```
export async function htmlToText(recipeHtml: string): Promise<string> {
    return recipeHtml;  // TODO: Implement extraction logic
}
```

Your task is to complete the `htmlToText` function to fulfill the following requirements:

1. Remove all regular HTML tags and unnecessary content from the input string.
2. Preserve the contents from any `<script type="application/ld+json">...</script>` blocks, as these often contain structured recipe data.
3. Return the cleaned text as a string, including JSON-LD data.

### Validation
To validate your implementation, run the following command from the `backend` directory to execute the tests for this exercise:

```
npm run test-exercise-2
```


## Solution (step-by-step)

Execute the test command `npm run test-exercise-2` from the `backend` directory, and we should get an output similar as below:

```
❯ npm run test-exercise-2

> backend@1.0.0 test-exercise-2
> NODE_ENV=development ts-node test-exercises/exercise_2.ts

Testing recipe URL: "https://www.arla.se/recept/janssons-frestelse/"...
Validating recipeText ...
INFO: The original HTML content size is of length 208611
INFO: The parsed text content size is of length 208611
INFO: The total size was reduced with 0.000%
Found string 'Janssons frestelse' [OK]
Test failed: Found 1364 disallowed HTML tags that should be parsed out to reduce content size
```

First, we remove all unnecessary HTML tags using the `string-strip-html` package:

```
export async function htmlToText(recipeHtml: string): Promise<string> {
    const { stripHtml } = await import('string-strip-html');
    return stripHtml(recipeHtml).result.trim();
}
```

When re-running the test command, we get an output similar as below:

```
❯ npm run test-exercise-2

> backend@1.0.0 test-exercise-2
> NODE_ENV=development ts-node test-exercises/exercise_2.ts

Testing recipe URL: "https://www.arla.se/recept/janssons-frestelse/"...
Validating recipeText ...
INFO: The original HTML content size is of length 208611
INFO: The parsed text content size is of length 14916
INFO: The total size was reduced with 92.85%
Found string 'Janssons frestelse' [OK]
Found no disallowed HTML tags [OK]
Test failed: Expected recipeText to contain content from the <script type="application/ld+json"> tag
```

This confirms that HTML stripping is working, but JSON-LD content is missing. Modify `htmlToText` to extract JSON-LD data while still cleaning up unnecessary HTML:

```
export async function htmlToText(recipeHtml: string): Promise<string> {
    // Extract JSON-LD content
    const ldJsonRegex = /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
    const ldJsonContents: string[] = [];
    let match;

    while ((match = ldJsonRegex.exec(recipeHtml)) !== null) {
        ldJsonContents.push(match[1].trim());
    }

    // Strip HTML tags
    const { stripHtml } = await import('string-strip-html');
    const cleanedText = stripHtml(recipeHtml).result.trim();

    // Append JSON-LD content if available
    if (ldJsonContents.length > 0) {
        return `${cleanedText}\n\n${ldJsonContents.join('\n\n')}`.trim();
    }

    return cleanedText;
}
```

When re-running test command, we get an output similar as below:

```
❯ npm run test-exercise-2

> backend@1.0.0 test-exercise-2
> NODE_ENV=development ts-node test-exercises/exercise_2.ts

Testing recipe URL: "https://www.arla.se/recept/janssons-frestelse/"...
Validating recipeText ...
INFO: The original HTML content size is of length 208611
INFO: The parsed text content size is of length 18316
INFO: The total size was reduced with 91.22%
Found string 'Janssons frestelse' [OK]
Found no disallowed HTML tags [OK]
Found content from the <script type="application/ld+json"> tag [OK]
Test passed: fetchRecipeText returned valid text.
```

Success! The function now removes unnecessary HTML, preserves JSON-LD metadata when available and ensures the final output is optimized for the next processing step.

You can review the full solution here: [Solution for Exercise 2](./solutions/solution-2.md)

## Next steps

After you have successfully validated your implementation, proceed to Exercise 3. Next steps include adding features such as creating an LLM prompt that converts the recipe text into structured JSON format.

[&#x25B6; Click here to proceed to Exercise 3](./exercise-3.md)