import React, { useState, useEffect } from 'react';
import {Link, useLocation, useNavigate, useParams} from 'react-router-dom';
import './DeleteSet.css';
import { Errors } from './errorEnums';

interface CardAttribute {
    id: number;
    question: string;
    concept: string;
    mnemonic: string;
}

interface CardSet {
    id: number;
    userId: number;
    name: string;
    flipcardsList: CardAttribute[];
}

const DeleteSets: React.FC = () => {
    const [cardSets, setCardSets] = useState<CardSet[]>([]);
    const location = useLocation();
    const { userId } = location.state || {};
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchCardSets = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`https://flipcardsbc.azurewebsites.net/api/Home/${userId}/GetAllSets`);
                if (!response.ok) {
                    throw new Error(Errors.NETWORK);
                }
                const data: CardSet[] = await response.json();
                setCardSets(data);
            } catch (error) {
                setError(Errors.SETS + (error as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchCardSets();
    }, [location, userId]);

    const deleteCardSet = async (setId: number) => {
        try {
            const response = await fetch(`https://flipcardsbc.azurewebsites.net/api/Home/${userId}/${setId}/DeleteSet`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete set');
            }
            setCardSets(cardSets.filter((set) => set.id !== setId));
        } catch (error) {
            setError('Error deleting set: ' + (error as Error).message);
        }
    };

    const goBack = () => {
        navigate(`/sets`, { state: { userId: userId } });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="card-set-deletion-container">
            <div className="card-set-deletion-list">
                {Array.isArray(cardSets) && cardSets.length > 0 ? (
                    cardSets.map((cardSet) => (
                        <div key={cardSet.id} className="card-set-deletion">
                            <Link to={`/card-set/${cardSet.id}`}>
                                <div className="card">
                                    <h2>{cardSet.name}</h2>
                                </div>
                            </Link>
                            <button
                                onClick={() => deleteCardSet(cardSet.id)}
                                className="delete-set-button"
                            >
                                Delete
                            </button>
                        </div>
                    ))
                ) : (
                    <div>No card sets available</div>
                )}
            </div>
            <button onClick={goBack} className="go-back-button">Back to Card Sets</button>
        </div>
    );
};

export default DeleteSets;
