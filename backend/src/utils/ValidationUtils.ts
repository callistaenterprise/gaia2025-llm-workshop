import crypto from "crypto";
import dotenv from 'dotenv';

// ANSI color codes for red and green text
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const RESET = "\x1b[0m";

const expectedApiKeyHashes = {
    mistral: [
      "11f343372b1206d1e84cda4a6cfb1655d74d9ff17fa6945316d323121bbb8bdb"
    ],
    gemini: [
      "a4218db52d2aa5181d83b70fc9a142808300a3d51f7512c26a49696688e6b5fb"
    ],
    anthropic: [
      "ca67406ca752cdc62380ea9776b5c32ca780bc21f67e55381e4c63bdb70bb76c"
    ],
    openai: [
      "fd61cdcb239643a455eca8a1b1571db4ce7a8217217045210cccab48a6d774fd"
    ]
  };


export function validateLLMConfig() {
    dotenv.config();
    const llmProvider = (process.env.LLM_PROVIDER || "gemini").toLowerCase();
    let apiKey;
    let apiKeyEnvVar;
  
    switch (llmProvider) {
      case "mistral":
        apiKey = process.env.MISTRAL_API_KEY;
        apiKeyEnvVar = "MISTRAL_API_KEY";
        break;
      case "gemini":
        apiKey = process.env.GEMINI_API_KEY;
        apiKeyEnvVar = "GEMINI_API_KEY";
        break;
      case "anthropic":
        apiKey = process.env.ANTHROPIC_API_KEY;
        apiKeyEnvVar = "ANTHROPIC_API_KEY";
        break;
      case "openai":
        apiKey = process.env.OPENAI_API_KEY;
        apiKeyEnvVar = "OPENAI_API_KEY";
        break;
      default:
        console.error(`${RED}Unsupported LLM provider configured: ${llmProvider}${RESET}`);
        return;
    }
  
    if (!apiKey) {
        console.error(`${RED}Missing API key in "${apiKeyEnvVar}" for provider "${llmProvider}" in .env file.${RESET}`);
      return;
    } else {
      // Compute the SHA-256 hash of the provided API key
      const hash = crypto.createHash("sha256").update(apiKey).digest("hex");
      
      // Lookup the list of expected hashes for the provider
      const allowedHashes = expectedApiKeyHashes[llmProvider];
      if (!allowedHashes || !Array.isArray(allowedHashes)) {
        console.error(`${RED}No expected hash list defined for provider: ${llmProvider}${RESET}`);
        return;
      }
  
      // Check if the computed hash is in the list of allowed hashes
      if (!allowedHashes.includes(hash)) {
        console.error(
            `${RED}Invalid API key in "${apiKeyEnvVar}" for provider "${llmProvider}". Please update your .env file with a valid key.${RESET}`
          );
        //console.log(`Got hash "${hash}", espected one of: ${allowedHashes}`)
        return;
      }
  
      console.log(`API key in "${apiKeyEnvVar}" validated for provider "${llmProvider}" ${GREEN}[OK]${RESET}`);

      return { llmProvider, apiKey };

    }
  }
