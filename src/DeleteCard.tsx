import React, { useState, useEffect } from 'react';
import {useParams, useNavigate, useLocation} from 'react-router-dom';
import './DeleteCard.css';
import { Errors } from './errorEnums';

interface FlipCardData {
    id: number;
    question: string;
    concept: string;
    mnemonic: string;
}

const DeleteCards: React.FC = () => {
    const location = useLocation();
    const { userId, setId } = location.state || {};
    const navigate = useNavigate();
    const [cards, setCards] = useState<FlipCardData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCards = async () => {
            if (!setId) {
                setError(Errors.TITLE);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await fetch(`https://localhost:44372/api/Home/${userId}/${setId}/GetCardSet`);
                if (!response.ok) {
                    throw new Error(Errors.NETWORK);
                }
                const data = await response.json();
                if (data && Array.isArray(data.flipcardsList)) {
                    setCards(data.flipcardsList);
                } else {
                    setError(Errors.FORMAT + JSON.stringify(data));
                }
            } catch (error) {
                setError(Errors.CARDS + (error as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchCards();
    }, [setId, userId]);

    const deleteCard = async (cardId: number) => {
        if (!setId) {
            setError('Set ID is missing.');
            return;
        }

        try {
            const response = await fetch(`https://localhost:44372/api/Home/${userId},${setId}/${cardId}/DeleteCard`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete card.');
            }

            setCards(cards.filter((card) => card.id !== cardId));
        } catch (error) {
            setError('Error deleting card: ' + (error as Error).message);
        }
    };

    const goBack = () => {
        navigate(`/sets/set`, { state: { userId: userId, id: setId } });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="card-deletion-container">
            <div className="card-deletion-list">
                {Array.isArray(cards) && cards.length > 0 ? (
                    cards.map((card) => (
                        <div key={card.id} className="card-deletion-item">
                            <div className="card-details">
                                <p><strong>Question:</strong> {card.question}</p>
                                <p><strong>Mnemonic:</strong> {card.mnemonic}</p>
                                <p><strong>Concept:</strong> {card.concept}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => deleteCard(card.id)}
                                className="delete-card-button"
                            >
                                Delete
                            </button>
                        </div>
                    ))
                ) : (
                    <div>No cards available in this set.</div>
                )}
            </div>
            <button type="button" onClick={goBack} className="go-back-button">Back to Flip Cards</button>
        </div>
    );
};

export default DeleteCards;