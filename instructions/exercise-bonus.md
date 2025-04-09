# Bonus exercises

[&#x25c0; Go back to Exercise 5](./exercise-5.md)

Congratulations on reaching the final exercise!

If you have completed everything and still have time, here is an optional bonus challenge to deepen your understanding of LLM integration and further elevate the user experience in your recipe app.

### 1. Enhance the chat feature to modify recipes (frontend & backend)

When navigating to an existing recipe inside the cook view at http://localhost:5173/cook,
you’ll notice that the page already includes a chat interface where users can interact with the recipe assistant by asking questions about the recipe. 

In this bonus task, your goal is to extend the existing chat functionality so that users can also **issue commands to modify the recipe**, for example, adjusting ingredients, changing portions, or adapting to dietary preferences.


#### Example interactions:
* "Make this recipe vegan."
* "Adapt this recipe to serve 10 people instead of 4."
* "Turn this into a low-carb version by adjusting ingredients."

#### Relevant implementation files:
* [`frontend/src/pages/cook/QuestionInput.tsx`](../frontend/src/pages/cook/QuestionInput.tsx) 
* [`frontend/src/pages/cook/Cook.tsx`](../frontend/src/pages/cook/Cook.tsx) 
* [`backend/src/services/questionrecipe.ts`](../backend/src/services/questionrecipe.ts) 

#### Implementation:

Update both the `frontend` and `backend` code to support LLM function calling, so the model can decide when it should apply modifications to a recipe. 