import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const DailyPokemonCard = () => {
    const [pokemon, setPokemon] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDailyPokemon = async () => {
            try {
                const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
                const cacheKey = `dailyPokemon_${today}`;

                // Check localStorage for today's Pokemon
                const cachedPokemon = localStorage.getItem(cacheKey);
                if (cachedPokemon) {
                    setPokemon(JSON.parse(cachedPokemon));
                    setLoading(false);
                    return;
                }

                // Fetch from server
                const response = await fetch('/api/pokemon/daily');
                if (!response.ok) {
                    throw new Error('Failed to fetch daily Pokemon');
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

                // Cache the result for today
                localStorage.setItem(cacheKey, JSON.stringify(data));

                // Clean up old cache entries (keep only today's)
                Object.keys(localStorage).forEach(key => {
                    if (key.startsWith('dailyPokemon_') && key !== cacheKey) {
                        localStorage.removeItem(key);
                    }
                });

                setPokemon(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDailyPokemon();
    }, []);

    if (loading) {
        return <div className="pokemon-card loading">Loading today's Pokemon...</div>;
    }

    if (error) {
        return <div className="pokemon-card error">Error: {error}</div>;
    }

    if (!pokemon) {
        return <div className="pokemon-card">No Pokemon available</div>;
    }

    return (
        <div className="pokemon-card daily-pokemon">
            <h2>🌟 Daily Pokemon 🌟</h2>
            <h3>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
            <Link to={`/details/${pokemon.name}`}>
                <img
                    src={pokemon.sprites?.front_default || pokemon.imageUrl || 'https://via.placeholder.com/150x150/f0f0f0/999999?text=Pokemon'}
                    alt={pokemon.name}
                    className="pokemon-image"
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/150x150/f0f0f0/999999?text=Pokemon';
                    }}
                />
            </Link>
            <div className="pokemon-info">
                <p><strong>Height:</strong> {pokemon.height / 10} m</p>
                <p><strong>Weight:</strong> {pokemon.weight / 10} kg</p>
                {pokemon.base_experience && (
                    <p><strong>Base Experience:</strong> {pokemon.base_experience}</p>
                )}
            </div>
            <div className="pokemon-types">
                <h4>Types:</h4>
                <div className="type-list">
                    {(pokemon.types || []).map((typeInfo, index) => (
                        <span
                            key={index}
                            className={`type-badge ${typeof typeInfo === 'string' ? typeInfo : typeInfo.type.name}`}
                        >
                            {typeof typeInfo === 'string' ? typeInfo : typeInfo.type.name}
                        </span>
                    ))}
                </div>
            </div>
            <p className="daily-note">Click the image to see more details!</p>
        </div>
    );
};

export default DailyPokemonCard;