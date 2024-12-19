import React from 'react';
import './QuizFlipcard.css';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
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

const QuizFlipCard: React.FC = () => {
    const location = useLocation();
    const { userId, setId } = location.state || {};
    const navigate = useNavigate();
    const [cards, setCards] = React.useState<FlipCardData[]>([]);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [error, setError] = React.useState<string | null>(null);
    const [inputValue, setInputValue] = React.useState('');
    const currentCardIndex = React.useRef<number>(0);
    const [score, setScore] = React.useState<number>(0);
    const [feedback, setFeedback] = React.useState<string | null>(null);
    const [flipped, setFlipped] = React.useState<boolean>(false);
    const [activePlayers, setActivePlayers] = React.useState<number>(0);

    const fetchCards = async () => {
        if (!setId) {
            setError(Errors.TITLE);
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`https://localhost:44372/api/Home/${userId}/${setId}/GetCardSet`);
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

    const fetchActivePlayers = async () => {
        try {
            const response = await fetch('https://localhost:44372/api/Home/ActivePlayerCount');
            if (!response.ok) {
                throw new Error('Failed to fetch active players count.');
            }
            const count = await response.json();
            setActivePlayers(count);
        } catch (error) {
            console.error(`Error fetching active players: ${(error as Error).message}`);
        }
    };

    const startGame = async () => {
        try {
            const response = await fetch(`https://localhost:44372/api/Home/${userId}/StartGame`, {
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error('Failed to start game.');
            }
        } catch (error) {
            setError(`Start Game Error: ${(error as Error).message}`);
        }
    };

    const endGame = async () => {
        try {
            const response = await fetch(`https://localhost:44372/api/Home/${userId}/EndGame`, {
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error('Failed to end game.');
            }
        } catch (error) {
            setError(`End Game Error: ${(error as Error).message}`);
        }
    };

    React.useEffect(() => {
        fetchCards();
    }, [setId, userId]);

    React.useEffect(() => {
        startGame();

        return () => {
            endGame();
        };
    }, [userId]);

    React.useEffect(() => {
        fetchActivePlayers();
        const interval = setInterval(fetchActivePlayers, 500);
        return () => clearInterval(interval);
    }, []);

    const flipAnsweredCard = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleAnswerSubmit = () => {
        if (currentCardIndex.current >= cards.length) {
            return;
        }

        const correctAnswer = cards[currentCardIndex.current].concept.toLowerCase();

        if (inputValue.toLowerCase() === correctAnswer) {
            setFeedback("Correct!");
            setScore(prevScore => prevScore + 1);
        } else {
            setFeedback(`Incorrect! The correct answer is: ${cards[currentCardIndex.current].concept}`);
        }

        setInputValue('');
        setFlipped(true);
    };

    const handleNextCard = () => {
        setFlipped(false);
        setFeedback(null);

        if (currentCardIndex.current < cards.length) {
            currentCardIndex.current++;
        } else {
            setFeedback(`Quiz finished! Your score: ${score} / ${cards.length}`);
        }
    };

    const goBackToFlipCards = () => {
        navigate(`/sets/set`, { state: { userId: userId, id: setId } });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const isQuizFinished = currentCardIndex.current >= cards.length;

    return (
        <div className="flip-card-page">
            {/*<div className="active-players-count">
                Active Players: {activePlayers}
            </div>*/}

            <h2>Quiz Score: {score} / {cards.length}</h2>
            <div className="cards-container">
                {cards.length > 0 && currentCardIndex.current < cards.length ? (
                    <>
                        <div className={`flip-card ${flipped ? 'flipped' : ''}`} id={`flipCard-${currentCardIndex}`}>
                            <div className="flip-card-inner">
                                <div className="flip-card-front">
                                    <p className="card-question">{cards[currentCardIndex.current].question}</p>
                                    <h2>{cards[currentCardIndex.current].mnemonic}</h2>
                                </div>
                                <div className="flip-card-back">
                                    {flipped && <h2>{cards[currentCardIndex.current].concept}</h2>}
                                </div>
                            </div>
                        </div>
                        <div className="input-container">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={flipAnsweredCard}
                                placeholder="Your answer here"
                                disabled={flipped || isQuizFinished}
                            />
                            <button onClick={handleAnswerSubmit} disabled={flipped || isQuizFinished}>Submit Answer
                            </button>
                        </div>
                        <div className="feedback-message-container">
                            {feedback && <div className="feedback-message">{feedback}</div>}
                        </div>
                        {flipped && (
                            <button onClick={handleNextCard} disabled={isQuizFinished}>{
                                currentCardIndex.current < cards.length - 1 ? "Next" : "Finish Quiz"
                            }</button>
                        )}
                    </>
                ) : (
                    <div className="feedback-message">Quiz finished! Your score: {score} / {cards.length}</div>
                )}
            </div>
            <button onClick={goBackToFlipCards}>Back to Flip Cards</button>
        </div>
    );
};

export default QuizFlipCard;
