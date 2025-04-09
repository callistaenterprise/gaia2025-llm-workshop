import { validateLLMConfig } from "../src/utils/ValidationUtils";
import dotenv from "dotenv";
import path from "node:path";
import axios from "axios";

// ANSI color codes for red and green text
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const RESET = "\x1b[0m";

const envPath = path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`);
dotenv.config({ path: envPath });

export async function testLLMConnection(): Promise<void> {
  const configResult = validateLLMConfig();
  if (!configResult) {
    console.error(`${RED}LLM config validation failed. Exiting LLM test...${RESET}`);
    return;
  }

  const { llmProvider, apiKey } = configResult;
  let endpoint: string;
  let config: any = {};

  switch (llmProvider.toLowerCase()) {
    case "mistral":
      endpoint = "https://api.mistral.ai/v1/models";
      config = {
        headers: { Authorization: `Bearer ${apiKey}` },
      };
      break;
    case "gemini":
      endpoint = "https://generativelanguage.googleapis.com/v1beta/models";
      config = {
        params: { key: apiKey },
      };
      break;
    case "anthropic":
      endpoint = "https://api.anthropic.com/v1/models";
      config = {
        headers: {
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01"
        }
      };
      break;
    case "openai":
      endpoint = "https://api.openai.com/v1/models";
      config = {
        headers: { Authorization: `Bearer ${apiKey}` },
      };
      break;
    default:
      console.error(`Unsupported provider: ${llmProvider}`);
      return;
  }

  try {
    const response = await axios.get(endpoint, config);
    console.log(`Connection successful for provider ${llmProvider}. Status: ${response.status} ${GREEN}[OK]${RESET}`);
    console.log(`All checks passed ${GREEN}[OK]${RESET}`);
  } catch (error: any) {
    if (error.response) {
      console.error(`Connection failed for provider ${llmProvider}. Status: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    } else {
      console.error(`Connection failed for provider ${llmProvider}. Error: ${error.message}`);
    }
  }
}


(async () => {
  await testLLMConnection();
})();