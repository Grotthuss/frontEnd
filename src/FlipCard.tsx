import React from 'react';
import './FlipCard.css';
import AddFlipCard from "./AddFlipcard";
import {useParams, useNavigate, useLocation} from 'react-router-dom';
import { Errors } from "./errorEnums";

interface FlipCardData {
    id: number;
    question: string;
    concept: string;
    mnemonic: string;
}

interface CardSet {
    id: number;
    userId: number;
    name: string;
    flipcardsList: FlipCardData[];
}

const FlipCard: React.FC = () => {
    const location = useLocation();
    const { userId, id } = location.state || {};
    const navigate = useNavigate();
    const [cards, setCards] = React.useState<FlipCardData[]>([]);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [error, setError] = React.useState<string | null>(null);

    const fetchCards = async () => {
        if (!id) {
            setError(Errors.TITLE);
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`https://flipcardsbc.azurewebsites.net/api/Home/${userId}/${id}/GetCardSet`);

            if (!response.ok) {
                throw new Error(Errors.NETWORK);
            }

            const data: CardSet = await response.json();

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

    React.useEffect(() => {
        fetchCards();
    }, [userId, id]);

    const handleAddFlipCard = async (question: string, concept: string, mnemonic: string) => {
        const newCard: Omit<FlipCardData, 'id'> = {
            question: question,
            concept: concept,
            mnemonic: mnemonic,
        };

        try {
            const response = await fetch(`https://flipcardsbc.azurewebsites.net/api/Home/${userId}/${id}/CreateCard`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCard),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                console.error("Error response:", errorMessage);
                throw new Error(`${Errors.CARD} Server response: ${errorMessage}`);
            }

            await fetchCards();
            setError(null);

        } catch (err) {
            setError(Errors.CARD + (err as Error).message);
        }
    };

    const handleFlip = (index: number) => {
        const flipCard = document.getElementById(`flipCard-${index}`);
        if (flipCard) {
            flipCard.classList.toggle('flipped');
        }
    };

    const goToQuiz = () => {
        if (cards.length === 0) {
            setError("No cards available for the quiz.");
            return;
        }
        navigate(`/sets/set/quiz`, { state: { userId: userId, setId: id } });
    };

    const goBack = () => {
        navigate(`/sets`, { state: { userId: userId } } );
    };

    const goToDeleteCards = () => {
        navigate(`/sets/set/delete-cards`, { state: { userId: userId, setId: id } });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="flip-card-page">
            <div className="cards-container">
                {cards.length > 0 ? (
                    cards.map((card, index) => (
                        <div
                            className="flip-card"
                            key={card.id}
                            id={`flipCard-${index}`}
                            onClick={() => handleFlip(index)}
                        >
                            <div className="flip-card-inner">
                                <div className="flip-card-front">
                                    <p>{card.question}</p>
                                    <h2>{card.mnemonic}</h2>
                                </div>
                                <div className="flip-card-back">
                                    <h2>{card.concept}</h2>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div>No cards available</div>
                )}
            </div>
            <AddFlipCard onAddFlipCard={handleAddFlipCard}/>
            <button onClick={goToQuiz}>Go to Quiz</button>
            <button onClick={goBack}>Back to Card Sets</button>
            <button onClick={goToDeleteCards} className="delete-cards-button">Delete Cards</button>
        </div>
    );
};

export default FlipCard;