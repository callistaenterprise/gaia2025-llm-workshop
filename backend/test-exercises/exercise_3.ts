import dotenv from "dotenv";
import path from "node:path";
import assert from "assert";
import { recipeFromUrl } from "../src/services/recipeHandler";
import Recipe from "../src/models/recipe";

// ANSI color codes for red and green text
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const RESET = "\x1b[0m";

const envPath = path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`);
dotenv.config({ path: envPath });
dotenv.config();

export async function testrecipeFromUrl(): Promise<void> {
  const url = "https://www.arla.se/recept/janssons-frestelse/";
  const llmProvider = (process.env.LLM_PROVIDER || "gemini").toLowerCase();
  console.log(`Testing recipe URL: "${url}" with LLM provider "${llmProvider}" ...`);

  let recipe = await recipeFromUrl(url, llmProvider);
  
  try {
    // Ensure recipe is an object.
    assert.strictEqual(typeof recipe, "object", "recipe from recipeFromText is not an object");
    console.log(`Returned value is of type object ${GREEN}[OK]${RESET}`) 
    console.log({recipe});

    // Create an instance of the Recipe model and validate it.
    const recipeInstance = new Recipe(recipe);
    console.log({recipeInstance});
    await recipeInstance.validate();
    console.log(`Returned object matches Recipe schema ${GREEN}[OK]${RESET}`) 

    console.log(`${GREEN}Test passed: recipeFromText returned a valid recipe.${RESET}`);
  } catch (error: any) {
    console.error(`${RED}Test failed: ${error.message}${RESET}`);
  }
}

(async () => {
  await testrecipeFromUrl();
})();