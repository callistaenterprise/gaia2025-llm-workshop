import React from 'react';
import { Ingredient } from "../../types/Recipe.ts";
import { InputHeader } from './components/inputHeader.tsx';
import { Button } from './components/button.tsx';

interface IngredientFormProps {
    ingredientName: string;
    setIngredientName: (name: string) => void;
    quantity: number;
    setQuantity: (quantity: number) => void;
    unit: string;
    setUnit: (unit: string) => void;
    handleSaveIngredient: (event: React.MouseEvent<HTMLButtonElement>) => void;
    cancelEditIngredient: () => void;
    editIngredient: boolean | undefined;
}

const Unit = Object.freeze({
    LITER: "l",
    DECILITER: "dl",
    CENTILITER: "cl",
    MILLILITER: "ml",
    MATSKED: "msk",
    TESKED: "tsk",
    KRYDDMATT: "krm",
    KILOGRAM: "kg",
    GRAM: "g",
    STYCK: "st"
});

export const IngredientForm: React.FC<IngredientFormProps> = ({
    ingredientName,
    setIngredientName,
    quantity,
    setQuantity,
    unit,
    setUnit,
    handleSaveIngredient,
    cancelEditIngredient,
    editIngredient
}) => {
    return (
        <div className="flex gap-2 mt-2">
            <div className="h-14">
                <InputHeader title="Ingredient:" />
                <input
                    type="text"
                    placeholder="Ingredient"
                    value={ingredientName}
                    onChange={e => setIngredientName(e.target.value)}
                    className="p-2 border rounded w-auto flex-grow-1 md:w-50"
                />
            </div>
            <div className="h-14">
                <InputHeader title="No:" />
                <input
                    type="number"
                    placeholder="Quantity"
                    value={quantity}
                    onChange={e => setQuantity(parseInt(e.target.value))}
                    className="p-2 border rounded w-auto flex-grow-0 md:w-20"
                />
            </div>
            <div className="h-14">
                <InputHeader title="Unit:" />
                <select
                    value={unit}
                    onChange={e => setUnit(e.target.value)}
                    className="p-2 border rounded w-auto h-10 flex-grow-0 md:w-16"
                >
                    {Object.values(Unit).map(value => (
                        <option key={value} value={value}>
                            {value}
                        </option>
                    ))}
                </select>
            </div>
            {editIngredient && (
                <div className="h-14 space-y-5 space-x-2">
                    <Button onClick={cancelEditIngredient}>Cancel</Button>
                    <Button onClick={handleSaveIngredient}>Save</Button>
                </div>
            )}
            {!editIngredient && (
                <div className="h-14">
                    <label className="block text-sm font-medium text-gray-700">&nbsp;</label>
                    <Button onClick={handleSaveIngredient}>Add +</Button>
                </div>
            )}
        </div>
    );
};
