import React from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
// import Recipes from './components/Recipes';
// import {ManageRecipe } from './components/ManageRecipe.tsx';
import { ManageRecipe } from './pages/manageRecipe'
import { RecipesPages } from './pages/Recipes.tsx';
import { CookPage } from './pages/cook/Cook.tsx';
import ViewRecipe from './pages/manageRecipe/ViewRecipe';

const App: React.FC = () => (
    <Router future={{
        v7_relativeSplatPath: true, // Enables relative paths in nested routes
        v7_startTransition: true, // Enables startTransition for concurrent mode
      }}>
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-center my-6">My Recipes</h1>
            <nav className="flex justify-center space-x-4 mb-6">
                <NavLink to="/" className={({ isActive }) => isActive ? "text-blue-700 font-bold text-lg transition duration-200" : "text-blue-500 hover:text-blue-700 text-lg transition duration-200"}>Recipes</NavLink>
                <NavLink to="/cook" className={({ isActive }) => isActive ? "text-blue-700 font-bold text-lg transition duration-200" : "text-blue-500 hover:text-blue-700 text-lg transition duration-200"}>Cook</NavLink>
            </nav>
            <Routes>
                <Route path="/" element={<RecipesPages />} />
                {/* <Route path="/old" element={<Recipes />} /> */}
                <Route path="/add" element={<ManageRecipe />} />
                <Route path="/add/:id" element={<ManageRecipe />} />
                <Route path="/cook/*" element={<CookPage />} />
                <Route path="/view/:id" element={<ViewRecipe />} />
            </Routes>
        </div>
    </Router>
);

export default App;

