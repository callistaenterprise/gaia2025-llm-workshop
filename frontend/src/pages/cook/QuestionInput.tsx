import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { askQuestionAboutRecipe } from '../../services/RecipeService';

interface QuestionInputProps {
    recipeId: string;
}

export const RecipeQuestionInput: React.FC<QuestionInputProps> = () => {
  const { id } = useParams<{ id: string }>();
    const [question, setQuestion] = useState<string>('');
    const [response, setResponse] = useState<string | null>(null);
    const [recipeId, setRecipeId] = useState<string | null>(null);

    useEffect(() => {
        if (id && recipeId !== id) {
            setRecipeId(id);
            setQuestion('');
            setResponse(null);
        }
    }, [id]);

    const handleAskQuestion = async () => {
        if (!recipeId || !question) return;

        try {
            console.log('handleAskQuestion start', recipeId);
            const response = await askQuestionAboutRecipe(recipeId, question);
            console.log('handleAskQuestion end', recipeId);
            setResponse(response.data);
        } catch (error) {
            console.error('Error asking question:', error);
            setResponse('Failed to get a response.');
        }
    };

    return (
        <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Ask a Question About the Recipe</h2>
            <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full p-2 border rounded mb-4"
                placeholder="Enter your question here... How do I make this recipe vegan?"
            />
            <button
                onClick={handleAskQuestion}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
                Ask Question
            </button>
            {response && (
                <div className="mt-4 p-4 border rounded bg-gray-100">
                    <h3 className="text-lg font-semibold">Response:</h3>
                    <p>{response}</p>
                </div>
            )}
        </div>
    );
};
