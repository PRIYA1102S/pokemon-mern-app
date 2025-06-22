import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PokemonDetails from '../components/PokemonDetails';

const DetailsPage = () => {
    const { id } = useParams(); // This will capture both ID and name from the route
    const [pokemon, setPokemon] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPokemonDetails = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(`/api/pokemon/details/${encodeURIComponent(id)}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch Pokémon details');
                }
                const response_data = await response.json();

                // Handle the new API response format
                let data;
                if (response_data.success && response_data.data) {
                    data = response_data.data;
                } else {
                    // Fallback for old format
                    data = response_data;
                }

                setPokemon(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchPokemonDetails();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="details-page loading">
                <div className="loading-content">
                    <h2>Loading Pokémon details...</h2>
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="details-page error">
                <div className="error-content">
                    <h2>Error loading Pokémon</h2>
                    <p>{error}</p>
                    <Link to="/" className="back-button">← Back to Home</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="details-page">
            <div className="navigation">
                <Link to="/" className="back-button">← Back to Home</Link>
            </div>
            {pokemon ? (
                <PokemonDetails pokemon={pokemon} />
            ) : (
                <div className="no-pokemon">
                    <h2>No Pokémon found</h2>
                    <p>The requested Pokémon could not be found.</p>
                    <Link to="/" className="back-button">← Back to Home</Link>
                </div>
            )}
        </div>
    );
};

export default DetailsPage;