import React from 'react';
import { Link } from "react-router-dom";
import { FiEdit, FiPlusSquare, FiTrash, FiBookOpen, FiChevronRight } from "react-icons/fi";
import { FaPeopleGroup } from "react-icons/fa6";
import { useRecipe } from '../api/recipe/useRecipe';

interface RecipeCardProps {
    recipe: {
        id: string;
        name: string;
        description: string;
        portions: number;
    };
    onDeleteRecipe: (id: string) => void;
}
const truncateText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
    }
    return text;
};

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onDeleteRecipe }) => {
    return (
        <Link to={`/cook/${recipe.id}`} className="block">
        <div key={recipe.id} className="bg-gray-100 p-4 shadow-lg rounded-lg border border-gray-300 flex justify-between items-center hover:bg-gray-200 transition duration-200">
            <div>
            <h2 className="text-xl font-bold flex gap-3">
                {recipe.name} &nbsp;
                <Link to={`/add/${recipe.id}`}><FiEdit /></Link>
                <Link to={`/cook/${recipe.id}`}><FiBookOpen /></Link>
                <FiTrash onClick={() => onDeleteRecipe(recipe.id)} />
            </h2>
            <p className="text-gray-600">{truncateText(recipe.description, 140)}</p>
            <div className="flex items-center text-gray-600">
                <FaPeopleGroup className="mr-2" />
                <p>{recipe.portions}</p>
            </div>
            </div>
            <FiChevronRight size={24} className="text-gray-600" />
        </div>
        </Link>
    );
};

export const RecipesPages: React.FC = () => {
    const { recipes, loading, deleteRecipe } = useRecipe();
    console.log('render RecipesPage ', recipes);
    console.log('loading', loading);

    async function onDeleteRecipe(id: string) {
        deleteRecipe(id);
    }

    return (
        <div>
            <h1 className="text-xl font-semibold flex items-center gap-5">
                Recipes
                <Link to={`/add`} className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-200">
                    <FiPlusSquare className="mr-2" />
                    Add New Recipe
                </Link>
            </h1>
            <div className="grid grid-cols-1 gap-4 mt-4">
                {recipes.map(recipe => (
                    <RecipeCard key={recipe.id} recipe={recipe} onDeleteRecipe={onDeleteRecipe} />
                ))}
            </div>
        </div>
    );
    // return (
    //     <div>
    //         <h1 className="text-2xl font-semibold flex">
    //             Recipe &nbsp; <Link to={`/add`}><FiPlusSquare /></Link>
    //         </h1>
    //         <div className="grid grid-cols-1 gap-4 mt-4">
    //             {recipes.map(recipe => (
    //                 <RecipeCard key={recipe.id} recipe={recipe} onDeleteRecipe={onDeleteRecipe} />
    //             ))}
    //         </div>
    //     </div>
    // );
};