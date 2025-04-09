import dotenv from "dotenv";
import path from "node:path";
import { trainOneEpocInParallel } from "../testdata/training";

const envPath = path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`);
dotenv.config({ path: envPath });
dotenv.config();

export async function testTrainOneEpocInParallel(): Promise<void> {
  const llmProvider = (process.env.LLM_PROVIDER || "gemini").toLowerCase();

  const args = process.argv.slice(2);
  const useCache = args.includes("--use-cache");
  const fullRun = args.includes("--full");

  // Extract dataset number if provided, default to 1
  const datasetArgIndex = args.findIndex(arg => arg === "--dataset");
  let dataset = 1;

  if (datasetArgIndex !== -1 && args[datasetArgIndex + 1]) {
    const parsed = parseInt(args[datasetArgIndex + 1], 10);
    if (isNaN(parsed) || parsed < 1 || parsed > 3) {
      console.error("❌ Invalid dataset number. Please use an integer between 1 and 3.");
      process.exit(1);
    }
    dataset = parsed;
  }
  
  console.log(`🔹 Running test-exercise-4 with options: useCache=${useCache}, fullRun=${fullRun}, dataset=${dataset}`);
  trainOneEpocInParallel(useCache, fullRun, llmProvider, dataset);
}

(async () => {
  await testTrainOneEpocInParallel();
})();