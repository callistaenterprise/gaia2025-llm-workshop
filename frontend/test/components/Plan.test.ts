import { describe, it } from 'vitest'
// import { getFilteredRecipes } from '../../src/components/ManagePlan';
import {Recipe} from "../../src/types/Recipe";
import {Meal} from "../../src/types/Meal";
import {FoodDay} from "../../src/types/FoodDay";
import {FoodPlan} from "../../src/types/FoodPlan";
import {addDays} from "date-fns";

// describe('get Random Filtered Recipe', () => {
//     const onion = {
//         name: "onion",
//         quantity: 3,
//         unit: "st"
//     };
//     const meat = {
//         name: "meat",
//         quantity: 1,
//         unit: "kg"
//     }
//     const first = {
//         order: 1,
//         instruction: "peal",
//         minutes: 1
//     }
//     const second = {
//         order: 2,
//         instruction: "fry",
//         minutes: 3
//     }
//
//     const meatballs = {
//         id: "111abc",
//         name: "meatballs",
//         description: "bla",
//         portions: 4,
//         ingredients: [onion, meat],
//         steps: [first, second],
//         categories: ["breakfast", "meat"]
//     }
//
//     const onions = {
//         id: "222abc",
//         name: "breakfast",
//         description: "bla",
//         portions: 4,
//         ingredients: [onion],
//         steps: [first],
//         categories: ["breakfast"]
//     }
//
//     const nocategory = {
//         id: "333abc",
//         name: "nocategory",
//         description: "bla",
//         portions: 4,
//         ingredients: [onion],
//         steps: [first],
//         categories: []
//     }
//
//     it('breakfast filter should return two', () => {
//         const recipes = [meatballs, onions, nocategory];
//         const result = getFilteredRecipes(recipes, ["breakfast"]);
//         expect(result.length).toBe(2);
//     });
//
//     it('meat filter should return one', () => {
//         const recipes = [meatballs, onions, nocategory];
//         const result = getFilteredRecipes(recipes, ["meat"]);
//         expect(result.length).toBe(1);
//     });
//
//     it('no filter should return three', () => {
//         const recipes = [meatballs, onions, nocategory];
//         const result = getFilteredRecipes(recipes, []);
//         expect(result.length).toBe(3);
//     });
//
//     it('category not in recipes should return zero', () => {
//         const recipes = [meatballs, onions, nocategory];
//         const result = getFilteredRecipes(recipes, ["AlienFood"]);
//         expect(result.length).toBe(0);
//     });
//
// });

describe('test shallow copy update', () => {

    const englishBreakfast: Recipe = {
        name: 'englishBreakfast',
        description: 'Test Description',
        ingredients: [
            {
                name: 'Test Ingredient',
                quantity: 1,
                unit: 'g',
            },
        ],
        steps: [
            {
                order: 1,
                instruction: 'Test Step',
                minutes: 10,
            },
        ],
        portions: 4,
        categories: ["hot"]
    };
    // const swedishBreakfast: Recipe = {
    //     name: 'swedishBreakfast',
    //     description: 'Test Description',
    //     ingredients: [
    //         {
    //             name: 'Test Ingredient',
    //             quantity: 1,
    //             unit: 'g',
    //         },
    //     ],
    //     steps: [
    //         {
    //             order: 1,
    //             instruction: 'Test Step',
    //             minutes: 10,
    //         },
    //     ],
    //     portions: 4,
    //     categories: ["hot"]
    // }

    const breakfast1: Meal = {
        recipe: englishBreakfast,
        recipeId: "1",
        portions: 2
    }

    // const breakfast2: Meal = {
    //     recipe: swedishBreakfast,
    //     portions: 2
    // }

    const otherMeal: Meal = {
        recipe: englishBreakfast,
        recipeId: "2",
        portions: 1
    }
    const today = new Date();
    const tomorrow: Date = addDays(today, 1);

    const foodDay: FoodDay = { date: today, breakfast: breakfast1, lunch: otherMeal, dinner: otherMeal, bldToggle: {b: true, l: true, d: true } };

    const foodPlan: FoodPlan = {startDate: today, endDate: tomorrow, foodDays: [foodDay, foodDay, foodDay]}

    it('bla', () => {
        const firstDay: FoodDay = {...foodPlan.foodDays[0]};
        console.log(JSON.stringify(firstDay));
        const updatedFoodDay: FoodDay = {
            ...foodPlan.foodDays[0]
        };
        console.log(JSON.stringify(updatedFoodDay, null, 2))
        //expect(result.length).toBe(2);
    });
});
