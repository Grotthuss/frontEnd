import React, { useState } from 'react';
import './AddFlipcard.css';

interface AddFlipCardProps {
    onAddFlipCard: (question: string, concept: string, mnemonic: string) => void;
}

const AddFlipCard: React.FC<AddFlipCardProps> = ({ onAddFlipCard }) => {
    const [question, setQuestion] = useState('');
    const [concept, setConcept] = useState('');
    const [mnemonic, setMnemonic] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (question.trim() && concept.trim() && mnemonic.trim()) {
            onAddFlipCard(question.trim(), concept.trim(), mnemonic.trim());
            setQuestion('');
            setConcept('');
            setMnemonic('');
        }
    };

    return (
        <form className="add-flip-card-container" onSubmit={handleSubmit}>
            <h2>Add New Flip Card</h2>

            <input
                type="text"
                placeholder="Enter question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
            />

            <input
                type="text"
                placeholder="Enter concept"
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
            />

            <input
                type="text"
                placeholder="Enter mnemonic"
                value={mnemonic}
                onChange={(e) => setMnemonic(e.target.value)}
            />

            <button type="submit">Add Flip Card</button>
        </form>
    );
};

export default AddFlipCard;
