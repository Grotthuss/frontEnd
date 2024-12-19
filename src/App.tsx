import React from 'react';
import './App.css';
import FlipCard from './FlipCard';
import CardSetSelection from './CardSetSelection';
import QuizFlipcard from './QuizFlipcard';
import DeleteSets from "./DeleteSet";
import DeleteCards from './DeleteCard';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./Login";
import Signup from "./Signup";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/sets" element={<CardSetSelection />} />
                <Route path="/sets/set" element={<FlipCard />} />
                <Route path="/sets/set/quiz" element={<QuizFlipcard />} />
                <Route path="/sets/set/delete-sets" element={<DeleteSets />} />
                <Route path="/sets/set/delete-cards" element={<DeleteCards />} />
            </Routes>
        </Router>
    );
}
export default App;