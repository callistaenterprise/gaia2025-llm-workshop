import mongoose from 'mongoose';

type Unit = "l" | "dl" | "cl" | "ml" | "msk" | "tsk" | "krm" | "kg" | "g" | "st" | "efter smak" | "port";
const UnitEnum = Object.freeze({
    LITER : "l",
    DECILITER: "dl",
    CENTILITER: "cl",
    MILLILITER: "ml",
    MATSKED: "msk",
    TESKED: "tsk",
    KRYDDMATT: "krm",
    KILOGRAM: "kg",
    GRAM: "g",
    STYCK: "st",
    EFTER_SMAK: "efter smak",
    PORTIONER: "port"
});

// Define an interface for Ingredient
interface Ingredient {
    name: string;
    quantity: number;
    unit: Unit;
}

// Define an interface for Step
interface Step {
    order: number;
    instruction: string;
    minutes: number;
}

// Create a schema for Ingredients
const ingredientSchema = new mongoose.Schema<Ingredient>({
    name: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
    unit: { type: String, required: true, enum: Object.values(UnitEnum), default: UnitEnum.STYCK }
});

// Create a schema for Steps
const stepSchema = new mongoose.Schema<Step>({
    order: { type: Number, required: true },
    instruction: { type: String,  required: true },
    minutes: {type: Number, required: false}
});

// Recipe Schema
const recipeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    ingredients: {type: [ingredientSchema], required: true},
    steps: {type: [stepSchema], required: false},
    portions: { type: Number, required: true },
    stars: { type: Number, required: false },
    categories: {type: [String], required: false}
});

// Creating the model
const Recipe = mongoose.model('Recipe', recipeSchema);

export default Recipe;
