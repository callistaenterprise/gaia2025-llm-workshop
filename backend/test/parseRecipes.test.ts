import {recipeFromUrl} from "../src/services/recipeHandler";
import { isEqual } from "lodash";

describe('recipeFromUrl', () => {

    const expectedRecipe = {
        "name": "Krämig kycklinggryta med soltorkade tomater",
        "description": "En superenkel kycklinggryta som går fort att tillaga. Stek kycklingen tills den har en perfekt innertemperatur, tillsätt crème fraiche, buljong och soltorkade tomater för att få den mustiga och goda smaken. Servera kycklinggrytan med ris och sockerärtor.",
        "portions": 4,
        "ingredients": [
            {
                "name": "ris eller couscous",
                "quantity": 4,
                "unit": "portioner"
            },
            {
                "name": "kycklingfilé eller kycklinginnerfilé",
                "quantity": 650,
                "unit": "g"
            },
            {
                "name": "olja",
                "quantity": 1,
                "unit": "msk"
            },
            {
                "name": "salt",
                "quantity": 1,
                "unit": "efter smak"
            },
            {
                "name": "peppar",
                "quantity": 1,
                "unit": "efter smak"
            },
            {
                "name": "vitlöksklyfta",
                "quantity": 1,
                "unit": "st"
            },
            {
                "name": "crème fraiche",
                "quantity": 2,
                "unit": "dl"
            },
            {
                "name": "kycklingbuljong",
                "quantity": 2.5,
                "unit": "dl"
            },
            {
                "name": "soltorkade tomater",
                "quantity": 200,
                "unit": "g"
            },
            {
                "name": "gröna ärtor eller sockerärtor",
                "quantity": 250,
                "unit": "g"
            }
        ],
        "steps": [
            {
                "order": 1,
                "instruction": "Tina kycklingen om fryst används. Koka riset enligt anvisning på förpackningen.",
                "minutes": 0
            },
            {
                "order": 2,
                "instruction": "Strimla kycklingen och stek den i oljan i en stekpanna och krydda med salt och peppar.",
                "minutes": 0
            },
            {
                "order": 3,
                "instruction": "Sänk värmen, pressa i vitlöken och häll i crème fraiche och buljong.",
                "minutes": 0
            },
            {
                "order": 4,
                "instruction": "Strimla tomaterna och rör ner i grytan och sjud",
                "minutes": 5
            },
            {
                "order": 5,
                "instruction": "Koka ärtorna i saltat vatten enligt anvisningen på förpackningen eller socker ärtor",
                "minutes": 3
            },
            {
                "order": 6,
                "instruction": "Servera grytan med ris och sockerärtor.",
                "minutes": 0
            }
        ],
        "categories": [
            "Vardagsmat",
            "Kyckling",
            "Gryta"
        ]
    };

    const prompt = 'https://www.ica.se/recept/kramig-kycklinggryta-med-soltorkade-tomater-723346/'
    it('parseWithAnthropic',
        async () => {
            const anthropicRecipe = await recipeFromUrl(prompt, 'anthropic')
            expect(isEqual(anthropicRecipe, expectedRecipe));
        },
        25000
    ),

    it('parseWithGemini',
        async () => {
            const geminiRecipe = await recipeFromUrl(prompt, 'gemini')
            expect(isEqual(geminiRecipe, expectedRecipe));
        },
        25000
    )
    it('parseWithOpenAI',
        async () => {
            const openAiRecipe = await recipeFromUrl(prompt, 'openai')
            expect(isEqual(openAiRecipe, expectedRecipe));
        },
        25000
    ),

    it('parseWithMistral',
        async () => {
            const mistralRecipe = await recipeFromUrl(prompt, 'mistral')
            expect(isEqual(mistralRecipe, expectedRecipe));
        },
        50000
    )
});