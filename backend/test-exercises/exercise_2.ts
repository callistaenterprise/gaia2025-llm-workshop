import dotenv from "dotenv";
import path from "node:path";
import assert from "assert";
import { htmlToText} from "../src/services/parseRecipes";
import { fetchRecipeHtml } from "../src/services/recipeHandler";

// ANSI color codes for red and green text
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const RESET = "\x1b[0m";

const envPath = path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`);
dotenv.config({ path: envPath });

export async function testFetchRecipeText(): Promise<void> {
  const url = "https://www.arla.se/recept/janssons-frestelse/";
  console.log(`Testing recipe URL: "${url}"...`);

  const recipeHtml = await fetchRecipeHtml(url);
  const recipeText = await htmlToText(recipeHtml);

  try {
      // 1. Verify that the result is a string.
      console.log('Validating recipeText ...')
      assert.strictEqual(typeof recipeText, "string", "Expected recipeText to be a string");
      assert.notStrictEqual(recipeText, "Not implemented yet", "Expected function fetchRecipeText to be implemented")

      // 2. Verify that the result is not an empty string.
      assert.ok(recipeText.length > 0, "Expected recipeText to be non-empty");
      console.log(`INFO: The original HTML content size is of length ${GREEN}${recipeHtml.length}${RESET}`);
      console.log(`INFO: The parsed text content size is of length ${GREEN}${recipeText.length}${RESET}`);

      const reduction = (100.0-(recipeText.length/recipeHtml.length)*100.0).toPrecision(4);
      console.log(`INFO: The total size was reduced with ${GREEN}${reduction}%${RESET}`)

      // 3. Verify that the result contains Janssons frestelse.
      assert.ok(recipeText.includes("Janssons frestelse"), "Expected recipeText to contain string 'Janssons frestelse'");
      console.log(`Found string 'Janssons frestelse' ${GREEN}[OK]${RESET}`);

      // 4. Find all HTML tags
      const allTags = recipeText.match(/<[^>]+>/g) || [];

      // 5. Filter out allowed <script type="application/ld+json"> tags
      const disallowedTags = allTags.filter(tag => {
          // Normalize tag (remove extra spaces)
          const normalizedTag = tag.replace(/\s+/g, ' ').trim().toLowerCase();

          // Check if it's a JSON-LD script tag
          const isJsonLdScript = /^<script\b[^>]*type=["']application\/ld\+json["'][^>]*>$/i.test(normalizedTag) ||
                                 /^<\/script>$/i.test(normalizedTag); // Allow closing </script>

          return !isJsonLdScript; // Return true if it's a disallowed tag
      });

      // 6. Assert that no disallowed tags are found
      assert.strictEqual(disallowedTags.length, 0, `Found ${disallowedTags.length} disallowed HTML tags that should be parsed out to reduce content size`);

      console.log(`Found no disallowed HTML tags ${GREEN}[OK]${RESET}`) 

      // 7. Assert content in ld+json exists
      assert.ok(recipeText.includes("recipeYield"), 'Expected recipeText to contain content from the <script type="application/ld+json"> tag');
      console.log(`Found content from the <script type="application/ld+json"> tag ${GREEN}[OK]${RESET}`);

      console.log(`${GREEN}Test passed: fetchRecipeText returned valid text.${RESET}`);
  } catch (error: any) {
      console.error(`${RED}Test failed: ${error.message}${RESET}`);
  }
}

(async () => {
  await testFetchRecipeText();
})();