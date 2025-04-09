import React, { useEffect, useState } from 'react';
import { fetchRecipe } from '../../services/RecipeService';
import { Ingredient,  Step } from "../../types/Recipe.ts";
import { useParams } from "react-router-dom";
import { ErrorMessage } from './components/errorMessage.tsx';

interface OptionType {
    label: string;
    value: string;
}

interface ErrorType {
    title: string;
    message: string;
}

export const ViewRecipe: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState<boolean>(true);
    const [name, setName] = useState('');
    const [error, setError] = useState<ErrorType | null>(null);
    const [description, setDescription] = useState('');
    const [portions, setPortions] = useState(4);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [steps, setSteps] = useState<Step[]>([]);
    const [selectedOptions, setSelectedOptions] = useState<OptionType[]>([]);

    useEffect(() => {
        const fetchARecipe = async () => {
            if (id === undefined) {
                console.error("ID is undefined");
                setLoading(false);
                return;
            }
            try {
                const recipe = await fetchRecipe(id);
                setName(recipe.name);
                setDescription(recipe.description);
                setPortions(recipe.portions);
                setIngredients(recipe.ingredients);
                setSteps(recipe.steps);
                setSelectedOptions(recipe.categories.map<OptionType>(s => ({ label: s, value: s })));
            } catch (error) {
                console.error(error);
                setError({ title: 'Fetch Error', message: `Could not fetch recipe: ${error.message}` });
            } finally {
                setLoading(false);
            }
        };
        fetchARecipe();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <ErrorMessage title={error.title} message={error.message} />;
    }

    return (
        <div className="max-w-xl mx-auto p-4">
            <h1 className="text-3xl font-bold text-center my-6">{name}</h1>
            <p className="text-lg mb-4">{description}</p>
            <p className="text-lg mb-4"><strong>Servings:</strong> {portions}</p>
            <div className="mb-6">
                <h2 className="text-xl font-semibold">Ingredients</h2>
                {ingredients.map((ing, index) => (
                    <div key={index} className="p-2 border-b flex justify-between items-center">
                        <div>
                            {ing.name} - {ing.quantity}{ing.unit}
                        </div>
                    </div>
                ))}
            </div>
            <div className="mb-6">
                <h2 className="text-xl font-semibold">Cooking Steps</h2>
                {steps.map((stp, index) => (
                    <div key={index} className="p-2 border-b flex justify-between items-center">
                        <div>
                            {stp.order}. {stp.instruction} - {stp.minutes} min
                        </div>
                    </div>
                ))}
            </div>
            <div className="mb-6">
                <h2 className="text-xl font-semibold">Categories</h2>
                {selectedOptions.map((option, index) => (
                    <span key={index} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                        {option.label}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default ViewRecipe;