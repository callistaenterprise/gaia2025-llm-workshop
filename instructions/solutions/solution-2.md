# Exercise 2: Solution

[&#x25c0; Go back to Exercise 2](../exercise-2.md)

<details>

<summary>Click here to view the solution for Exercise 2</summary>

## Solution for implementing htmlToText

Open the file [`backend/src/services/parseRecipes.ts`](../backend/src/services/parseRecipes.ts) and replace the placeholder for `htmlToText` with below code:

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

</details>