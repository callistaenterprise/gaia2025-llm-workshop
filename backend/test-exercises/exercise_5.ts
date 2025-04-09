import dotenv from "dotenv";
import path from "node:path";
import assert from "assert";
import fs from "fs/promises";
import { recipeFromHtml } from "../src/services/recipeHandler";
import Recipe from "../src/models/recipe";

// ANSI color codes for red and green text
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const RESET = "\x1b[0m";

const envPath = path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`);
dotenv.config({ path: envPath });
dotenv.config();

export async function testrecipeFromHtml(): Promise<void> {

  // Test the tool-use
  const llmProvider = (process.env.LLM_PROVIDER || "gemini").toLowerCase();
  console.log(`Testing recipe "perfect-swedish-meatballs" with LLM provider "${llmProvider}" ...`);

  let recipeHtmlFilePath = path.join('testdata', 'non-swedish-recipes', 'hungryhappens', 'perfect-swedish-meatballs', `perfect-swedish-meatballs.html`);
  const recipeHtml = await fs.readFile(recipeHtmlFilePath, 'utf-8');
  let recipe = await recipeFromHtml(recipeHtml, llmProvider);

  
  try {
    // Ensure recipe is an object.
    assert.strictEqual(typeof recipe, "object", "recipe from recipeFromUrl is not an object");
    console.log(`Returned value is of type object ${GREEN}[OK]${RESET}`) 
    console.log(recipe);

    // Create an instance of the Recipe model and validate it.
    const recipeInstance = new Recipe(recipe);
    await recipeInstance.validate();
    console.log(`Returned object matches Recipe schema ${GREEN}[OK]${RESET}`)

    // Validate specific ingredient conversions to verify function calls were used
    const i2 = recipe.ingredients[2];
    const i3 = recipe.ingredients[3];

    const expected2 = { quantity: 0.907, unit: "kg" };
    const expected3 = { quantity: 1.18, unit: "dl" };

    const isCloseEnough = (a: number, b: number, tolerance = 0.01) => Math.abs(a - b) < tolerance;


    if (!isCloseEnough(i2.quantity, expected2.quantity) || i2.unit !== expected2.unit) {
      throw new Error(
        `Ingredient[2] "${i2.name}" mismatch: got ${i2.quantity}${i2.unit}, expected ${expected2.quantity}${expected2.unit}`
      );
    }

    if (!isCloseEnough(i3.quantity, expected3.quantity) || i3.unit !== expected3.unit) {
      throw new Error(
        `Ingredient[3] "${i3.name}" mismatch: got ${i3.quantity}${i3.unit}, expected ${expected3.quantity}${expected3.unit}`
      );
    }

    console.log(`Ingredient[2] "${i2.name}": ${i2.quantity}${i2.unit} ${GREEN}[OK]${RESET}`);
    console.log(`Ingredient[3] "${i3.name}": ${i3.quantity}${i3.unit} ${GREEN}[OK]${RESET}`);

    console.log(`${GREEN}Test passed: got a valid recipe.${RESET}`);
  } catch (error: any) {
    console.error(`${RED}Test failed: ${error.message}${RESET}`);
  }
}

(async () => {
  await testrecipeFromHtml();
})();