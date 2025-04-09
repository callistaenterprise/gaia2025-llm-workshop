
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