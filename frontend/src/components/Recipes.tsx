import React, { useEffect, useState } from 'react';
import {deleteTheRecipe, fetchRecipes} from '../services/RecipeService';
import { Recipe } from '../types/Recipe';
import {Link} from "react-router-dom";
import { FiEdit, FiPlusSquare, FiTrash} from "react-icons/fi";

const Recipes: React.FC = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);

    useEffect(() => {
        const fetchAllRecipes = async () => {
            const response = await fetchRecipes();
            setRecipes(response);
        };
        fetchAllRecipes();
    }, []);

    async function deleteRecipe(id:String) {
        console.log(id);
        const response = await deleteTheRecipe(id);
        if (response.status == 202) {
            setRecipes(recipes.filter(recipe => recipe.id !== id));
            alert("Successfully deleted recipe with id " + id);
        } else {
            alert("Could not delete recipe with id " + id);
        }
    }
    return (
        <div>
            <h1 className="text-2xl font-semibold flex">Recipe &nbsp; <Link to={`/add`}><FiPlusSquare /></Link></h1>
            <div className="grid grid-cols-1 gap-4 mt-4">
                {recipes.map(recipe => (
                    <div key={recipe.id} className="bg-white p-4 shadow rounded-lg">
                        <h2 className="text-xl font-bold flex">{recipe.name} &nbsp; <Link to={`/add/${recipe.id}`}><FiEdit /></Link><FiTrash onClick={() => deleteRecipe(recipe.id!)}/></h2>
                        <p className="text-gray-600">{recipe.description}</p>
                        <p className="text-gray-600">{recipe.portions}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Recipes;
