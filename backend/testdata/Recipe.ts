export interface Ingredient {
    name: string;
    quantity: number;
    unit: string;
}

export interface Step {
    order: number;
    instruction: string;
    minutes: number;
}

export interface Recipe {
    name: string;
    description: string;
    portions: number;
    ingredients: Ingredient[];
    steps: Step[];
    categories: string[];
}