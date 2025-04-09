import React, { useEffect, useState } from 'react';
import { Link, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { fetchRecipes, askQuestionAboutRecipe } from '../../services/RecipeService';
import { Recipe } from "../../types/Recipe.ts";
import ViewRecipe from '../manageRecipe/ViewRecipe';
import { RecipeQuestionInput } from './QuestionInput.tsx';

export const CookPage: React.FC = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [question, setQuestion] = useState<string>('');
    const [response, setResponse] = useState<string | null>(null);
    const navigate = useNavigate();
    const [recipeId, setRecipeId] = useState<string | null>(null);
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        const fetchAllRecipes = async () => {
            try {
                const fetchedRecipes = await fetchRecipes();
                setRecipes(fetchedRecipes);
            } catch (error) {
                console.error(error);
                setError('Could not fetch recipes');
            } finally {
                setLoading(false);
            }
        };
        fetchAllRecipes();
    }, []);
    useEffect(() => {

        if(id && id !== recipeId) {
          setRecipeId(id);
        }
    }
    , [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }
    console.log('id',id);

    return (
        <div className="container mx-auto p-6 flex">
            <div className="w-1/4 p-4 border-r">
                <h2 className="text-xl font-semibold mb-4">Recipes</h2>
                <ul>
                    {recipes.map((recipe) => (
                        <li key={recipe.id} className={`mb-2 ${id === recipe.id ? 'bg-gray-200' : ''}`}>
                            <Link
                                to={`/cook/${recipe.id}`}
                                className={`text-blue-500 hover:text-blue-700 ${recipeId === recipe.id ? 'font-bold' : ''}`}
                                onClick={() => {
                                    setRecipeId(recipe.id);
                                  navigate(`/cook/${recipe.id}`)}
                                }
                            >
                                {recipe.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="w-3/4 p-4">
                 <Routes>
                    <Route path="/:id" element={<ViewRecipe />} />
                    <Route
                        path="/"
                        element={
                            <p className="text-center text-lg">
                                Select a recipe to view the details and follow the instructions to make an excellent dish.
                            </p>
                        }
                    />
                </Routes>
                <Routes>
                  <Route path="/:id" element={<RecipeQuestionInput recipeId={recipeId} />} />
                </Routes>
            </div>
        </div>
    );
};

export default CookPage;