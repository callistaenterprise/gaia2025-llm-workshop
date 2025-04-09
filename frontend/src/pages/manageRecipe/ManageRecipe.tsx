import React, { useEffect, useState } from 'react';
import { addRecipe, fetchParsedRecipe, fetchRecipe, updateRecipe } from '../../services/RecipeService';
import { Ingredient, Recipe, Step } from "../../types/Recipe.ts";
import { addCategory, getCategoryOptions } from "../../services/CategoryService.ts";
import CategorySelect from "./CategorySelect.tsx";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiTrash } from "react-icons/fi";
import { FaPeopleGroup } from 'react-icons/fa6';
import { InputHeader } from './components/inputHeader.tsx';
import { Button } from './components/button.tsx';
import { ErrorMessage } from './components/errorMessage.tsx';
import { LoadingSpinner } from './components/loadingSpinner.tsx';
import { IngredientForm } from './IngredientForm.tsx';
import { StepForm } from './StepForm.tsx';
import { UrlInput } from './components/urlInput.tsx';

interface OptionType {
    label: string;
    value: string;
}

interface ErrorType {
    title: string;
    message: string;
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

export const ManageRecipe: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState<boolean>(true);
    const [name, setName] = useState('');
    const [error, setError] = useState<ErrorType | null>(null);
    const [description, setDescription] = useState('');
    const [portions, setPortions] = useState(4);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [ingredientIndex, setIngredientIndex] = useState<number>(-1);
    const [ingredientName, setIngredientName] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [unit, setUnit] = useState("st");
    const [steps, setSteps] = useState<Step[]>([]);
    const [stepIndex, setStepIndex] = useState<number>(-1);
    const [order, setOrder] = useState(1);
    const [instruction, setInstruction] = useState('');
    const [minutes, setMinutes] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState<OptionType[]>([]);
    const [url, setUrl] = useState<string>("");
    const [editIngredient, setEditIngredient] = useState<boolean>();
    const [editStep, setEditStep] = useState<boolean>();
    const [loadingUrl, setLoadingUrl] = useState<boolean>(false);

    const navigate = useNavigate();

    const setStateByRecipe = (recipe: Recipe) => {
        setName(recipe.name);
                setDescription(recipe.description);
                setPortions(recipe.portions);
                setIngredients(recipe.ingredients);
                setSteps(recipe.steps);
                setSelectedOptions(recipe?.categories.map<OptionType>(s => ({ label: s, value: s })))
    }
    useEffect(() => {
        const fetchARecipe = async () => {
            if (id === undefined) {
                console.error("ID is undefined");
                setLoading(false);
                return;
            }
            try {
                const recipe = await fetchRecipe(id);
                setStateByRecipe(recipe);
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false);
            }
        };
        if (id) {
            fetchARecipe();
        } else {
            console.log('No id new recipe');
            setLoading(false);
        }
    }, [id]);

    if (loading) {
        return (<LoadingSpinner />);
    }

    const cancelEditIngredient = () => {
        setIngredientIndex(-1);
        setIngredientName("");
        setQuantity(1);
        setUnit("st");
        setEditIngredient(false);
    }

    const cancelEditStep = () => {
        setStepIndex(-1);
        setOrder(0);
        setInstruction("");
        setMinutes(0)
        setEditStep(false);
    }

    const handleSaveIngredient = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (-1 === ingredientIndex) { // add new
            const ingredientToSave = { name: ingredientName, quantity: quantity, unit: unit };
            setIngredients([...ingredients, ingredientToSave]);
        } else { // edit
            const ingredientsToSave = [...ingredients];
            const _id = ingredientsToSave[ingredientIndex]._id;
            ingredientsToSave[ingredientIndex] = { _id: _id, name: ingredientName, quantity: quantity, unit: unit }
            setIngredients(ingredientsToSave);
        }
        setIngredientIndex(-1);
        setIngredientName('');
        setQuantity(1);
        setUnit("st");
        setEditIngredient(false);
    }

    const handleEditIngredient = (ingredient: Ingredient, index: number) => {
        setIngredientIndex(index);
        setIngredientName(ingredient.name);
        setUnit(ingredient.unit);
        setQuantity(ingredient.quantity);
        setEditIngredient(true);
    }

    const handleDeleteIngredient = (index: number) => {
        const ingredientsToUpdate: Ingredient[] = [...ingredients] as Ingredient[];
        if (index > -1) {
            ingredientsToUpdate.splice(index, 1);
        }
        setIngredients(ingredientsToUpdate);
    }

    const handleSaveStep = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (-1 === stepIndex) { // add new
            const newStep = { order: order, instruction: instruction, minutes: minutes };
            setSteps([...steps, newStep]);
        } else { // edit
            const stepsToSave = [...steps];
            const _id = stepsToSave[stepIndex]._id;
            stepsToSave[stepIndex] = { _id: _id, order: order, instruction: instruction, minutes: minutes }
            setSteps(stepsToSave);
        }
        setStepIndex(-1);
        setOrder(1);
        setInstruction('');
        setMinutes(0);
        setEditStep(false);
    }

    const handleEditStep = (step: Step, index: number) => {
        setStepIndex(index);
        setOrder(step.order);
        setInstruction(step.instruction);
        setMinutes(step.minutes);
        setEditStep(true);
    }

    const handleDeleteStep = (index: number) => {
        const stepsToUpdate: Step[] = [...steps] as Step[];
        if (index > -1) {
            stepsToUpdate.splice(index, 1);
        }
        setSteps(stepsToUpdate);
    }

    const handleSubmit = async (event: React.FormEvent) => {
        console.log('handleSubmit called');
        if (id == undefined) {
            event.preventDefault();
            const categories: string[] = selectedOptions.map<string>(s => (s.value));
            console.log('addRecipe called');
            try {
                await addRecipe({ name, description, portions, ingredients, steps, categories });
                console.log('addRecipe made');
                setName('');
                setDescription('');
                setPortions(4);
                setIngredients([]);
                setIngredientName('');
                setQuantity(1);
                setUnit(Unit.STYCK);
                setSteps([]);
                setOrder(1);
                setInstruction('');
                setMinutes(0);
                setSelectedOptions([]);
                navigate("/");
            } catch (error) {
                setError({ title: 'Save Error', message: `Could not save recipe ${error}` });
            }
        } else {
            event.preventDefault();
            const categories: string[] = selectedOptions.map<string>(s => (s.value))
            await updateRecipe({ id, name, description, portions, ingredients, steps, categories });
            navigate("/");
        }
    };

    const handleFetchParsedRecipe = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        console.log(`url: ${url}`);
        setError(null);
        setLoadingUrl(true);
        try {
            const recipe: Recipe = await fetchParsedRecipe(url);
            console.log({ recipe });
            if (!recipe || typeof recipe === 'string') {
                throw new Error(recipe);
            }
            // Validate the recipe object
            const requiredFields = ['name', 'description', 'portions', 'ingredients', 'steps', 'categories'];
            for (const field of requiredFields) {
                if (!recipe.hasOwnProperty(field)) {
                    throw new Error(`Invalid recipe data missing required field: ${field}`);
                }
            }
            setLoadingUrl(false);
            setStateByRecipe(recipe);
        } catch (error) {
            console.log(`Could not parse recipe from ${url}`);
            setUrl("");
            setLoadingUrl(false);
            setError({
                title: 'function HandleFetchParsedRecipe', message: `Could not parse recipe from url: ${url}
                ${error}`
            });
        }
    };

    const handleCopyUrl = () => {
        setUrl("https://www.arla.se/recept/janssons-frestelse/");
    };

    const createOption = async (inputValue: string): Promise<OptionType> => {
        const response = await addCategory({ name: inputValue })
        if (response.status != 201) {
            throw new Error('Failed to create option');
        }
        return { label: inputValue, value: inputValue };
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-4">
            {id == undefined ?
                <div className="flex flex-row gap-3">
                    <h1 className="text-2xl font-semibold">Add new recipe</h1>
                    <Button onClick={handleCopyUrl}>Use Favorite</Button>
                </div>
                :
                <h1 className="text-2xl font-semibold">Edit recipe</h1>
            }
            {id == undefined && (
                <UrlInput
                    url={url}
                    setUrl={setUrl}
                    handleFetchParsedRecipe={handleFetchParsedRecipe}
                    loadingUrl={loadingUrl}
                    error={error}
                />
            )}
            <br />
            <div className="mb-4">
                <InputHeader title="Title:" />
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
            </div>
            <div className="mb-6">
                <InputHeader title="Ingress:" />
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
            </div>
            <div className="mb-6">
                <div className="flex items-center">
                    <FaPeopleGroup className="mr-2" />
                    <InputHeader title="Servings:" />
                </div>
                <input
                    type="text"
                    value={portions}
                    onChange={(e) => setPortions(parseInt(e.target.value))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
            </div>
            <div className="mb-6">
                <h2 className="text-xl font-semibold">Ingredients</h2>
                {ingredients.map((ing, index) => (
                    <div key={index} className="p-2 border-b flex justify-between items-center">
                        <div>
                            {ing.name} - {ing.quantity}{ing.unit}
                        </div>
                        <div className="flex space-x-2">
                            <FiEdit onClick={() => handleEditIngredient(ing, index)} />
                            <FiTrash onClick={() => handleDeleteIngredient(index)} />
                        </div>
                    </div>
                ))}
                <IngredientForm
                    ingredientName={ingredientName}
                    setIngredientName={setIngredientName}
                    quantity={quantity}
                    setQuantity={setQuantity}
                    unit={unit}
                    setUnit={setUnit}
                    cancelEditIngredient={cancelEditIngredient}
                    handleSaveIngredient={handleSaveIngredient}
                    editIngredient={editIngredient}
                />
            </div>
            <div className="mb-6">
                <h2 className="text-xl font-semibold">Cooking Steps</h2>
                {steps.map((stp, index) => (
                    <div key={index} className="p-2 border-b flex justify-between items-center">
                        <div>
                            {stp.order} - {stp.instruction} - {stp.minutes}min
                        </div>
                        <div className="flex space-x-2">
                            <FiEdit onClick={() => handleEditStep(stp, index)} />
                            <FiTrash onClick={() => handleDeleteStep(index)} />
                        </div>
                    </div>
                ))}
                <StepForm
                    order={order}
                    setOrder={setOrder}
                    instruction={instruction}
                    setInstruction={setInstruction}
                    minutes={minutes}
                    setMinutes={setMinutes}
                    handleSaveStep={handleSaveStep}
                    cancelEditStep={cancelEditStep}
                    editStep={editStep}
                />
            </div>
            <div className="mb-6">
                <h2 className="text-xl font-semibold">Categories:</h2>
                <CategorySelect
                    loadOptions={getCategoryOptions}
                    createOption={createOption}
                    selectedOptions={selectedOptions}
                    setSelectedOptions={setSelectedOptions}
                />
            </div>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
                Save the recipe
            </button>
        </form>
    );
};

export default ManageRecipe;