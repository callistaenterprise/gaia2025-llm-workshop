import {GenerateContentResponse, GoogleGenAI} from "@google/genai";

export async function callGemini(prompt: string): Promise<any> {
  const geminiClient = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

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

  return completion.text!;
}

export interface Ingredient {
  _id?: string;
  name: string;
  quantity: number;
  unit: string;
}

export interface Step {
  _id?: string;
  order: number;
  instruction: string;
  minutes: number;
}

export interface Recipe {
  id?: string;
  name: string;
  description: string;
  portions: number;
  ingredients: Ingredient[];
  steps: Step[];
  categories: string[];
}



export async function askQuestionAboutRecipe(recipe: any, question: string): Promise<string> {
    // Construct the prompt
    const prompt = `
    Given the following recipe:
    Name: ${recipe.name}
    Description: ${recipe.description}
    Portions: ${recipe.portions}
    Ingredients: ${recipe.ingredients.map((ing: { quantity: any; unit: any; name: any; }) => `${ing.quantity} ${ing.unit} ${ing.name}`).join(', ')}
    Steps: ${recipe.steps.map((step: { order: any; instruction: any; minutes: any; }) => `${step.order}. ${step.instruction} (${step.minutes} minutes)`).join(', ')}
    Categories: ${recipe.categories?.join(', ') || 'None'}
    
    Question: ${question}
    
    Please provide a short answer in Swedish.
    `;

    
    // Call the Gemini API
    const response = await callGemini(prompt);
    // Process the response and return it as a readable string
    return response;
}

// // Example usage
// (async () => {
//     const exampleRecipe: Recipe = {
//         name: "Pasta Carbonara",
//         description: "A classic Italian pasta dish.",
//         ingredients: [
//             { name: "Spaghetti", quantity: 200, unit: "g" },
//             { name: "Eggs", quantity: 4, unit: "st" },
//             { name: "Parmesan cheese", quantity: 50, unit: "g" },
//             { name: "Pancetta", quantity: 100, unit: "g" },
//             { name: "Black pepper", quantity: 1, unit: "tsk" },
//             { name: "Salt", quantity: 1, unit: "tsk" }
//         ],
//         steps: [
//             { order: 1, instruction: "Boil the spaghetti.", minutes: 10 },
//             { order: 2, instruction: "Fry the pancetta.", minutes: 5 },
//             { order: 3, instruction: "Mix eggs and cheese.", minutes: 2 },
//             { order: 4, instruction: "Combine all ingredients.", minutes: 3 }
//         ],
//         portions: 4,
//         categories: ["Italian", "Pasta"]
//     };

//     const question = "Hur kan jag göra denna rätt mer hälsosam?";

//     try {
//         const answer = await askQuestionAboutRecipe(exampleRecipe, question);
//         console.log("Answer:", answer);
//     } catch (error) {
//         console.error("Error:", error);
//     }
// })();