import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const SearchResults = ({ query }) => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!query || query.trim() === '') {
                setResults([]);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const response = await fetch(`/api/pokemon/search/${encodeURIComponent(query.trim())}`);

                if (!response.ok) {
                    throw new Error('Failed to search for Pokemon');
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

                // Ensure data is always an array
                const resultsArray = Array.isArray(data) ? data : [data];
                setResults(resultsArray);
            } catch (err) {
                setError(err.message);
                setResults([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [query]);

    if (loading) {
        return <div className="search-results loading">Searching for Pokemon...</div>;
    }

    if (error) {
        return <div className="search-results error">Error: {error}</div>;
    }

    return (
        <div className="search-results">
            <h2>Search Results for "{query}"</h2>
            {results.length > 0 ? (
                <div className="results-grid">
                    {results.map((pokemon, index) => (
                        <div key={pokemon.id || pokemon.name || index} className="pokemon-result-card">
                            <Link to={`/details/${pokemon.name || pokemon.id}`}>
                                <div className="pokemon-card-content">
                                    <h3>{(pokemon.name || '').charAt(0).toUpperCase() + (pokemon.name || '').slice(1)}</h3>
                                    <img
                                        src={pokemon.sprites?.front_default || pokemon.imageUrl || 'https://via.placeholder.com/150x150/f0f0f0/999999?text=Pokemon'}
                                        alt={pokemon.name}
                                        className="pokemon-image"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/150x150/f0f0f0/999999?text=Pokemon';
                                        }}
                                    />
                                    <div className="pokemon-basic-info">
                                        <p><strong>Height:</strong> {pokemon.height ? (pokemon.height / 10) + ' m' : 'Unknown'}</p>
                                        <p><strong>Weight:</strong> {pokemon.weight ? (pokemon.weight / 10) + ' kg' : 'Unknown'}</p>
                                    </div>
                                    <div className="pokemon-types">
                                        {(pokemon.types || []).map((typeInfo, typeIndex) => (
                                            <span
                                                key={typeIndex}
                                                className={`type-badge ${typeof typeInfo === 'string' ? typeInfo : typeInfo.type?.name || typeInfo}`}
                                            >
                                                {typeof typeInfo === 'string' ? typeInfo : typeInfo.type?.name || typeInfo}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-results">
                    <p>No Pokémon found matching "{query}". Please try a different search term.</p>
                    <p>Try searching for Pokemon names like "pikachu", "charizard", or "bulbasaur".</p>
                </div>
            )}
        </div>
    );
};

export default SearchResults;