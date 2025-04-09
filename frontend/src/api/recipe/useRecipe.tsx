import { useState, useEffect} from 'react';
import {Recipe} from "/types/Recipe.ts";
import { deleteTheRecipe,  getRecipes} from "./RecipeService.ts";

export const useRecipe = () => {
const [recipes, setRecipes] = useState<Recipe[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<unknown>(null);


useEffect(() => {
    fetchRecipes();
}, []);
const fetchRecipes = async () => {
    setLoading(true);
    setError(null);
    try {
      const updatedRecipes = await getRecipes();
      setRecipes(updatedRecipes);
    } catch (error) {
      setLoading(false);
      setError(error);
    }
    setLoading(false);
};
const addRecipe = async (recipe: Recipe) => {
    await addRecipe(recipe);
    const updatedRecipes = [...recipes, recipe];
    setRecipes(updatedRecipes);
};

const deleteRecipe = async (id: String) => {
  await deleteTheRecipe(id);
  const updatedRecipes = recipes.filter(recipe => recipe.id !== id);
  setRecipes(updatedRecipes); 
};

const updateRecipe = async (recipe: Recipe) => {
  await updateRecipe(recipe);
  const updatedRecipes = recipes.map(prevRecipe => prevRecipe.id === recipe.id ? recipe : prevRecipe);
  setRecipes(updatedRecipes);
};

return { recipes, loading, error, reloadRecipes : fetchRecipes, addRecipe, deleteRecipe, updateRecipe };
};
