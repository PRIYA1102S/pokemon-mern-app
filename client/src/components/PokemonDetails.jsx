import React from 'react';

const PokemonDetails = ({ pokemon }) => {
    if (!pokemon) {
        return <div className="pokemon-details">No Pokemon data available</div>;
    }

    return (
        <div className="pokemon-details">
            <div className="pokemon-header">
                <h1>{(pokemon.name || '').charAt(0).toUpperCase() + (pokemon.name || '').slice(1)}</h1>
                <div className="pokemon-id">#{pokemon.id || 'Unknown'}</div>
            </div>

            <div className="pokemon-main-info">
                <div className="pokemon-image-section">
                    <img
                        src={pokemon.sprites?.front_default || pokemon.imageUrl || 'https://via.placeholder.com/200x200/f0f0f0/999999?text=Pokemon'}
                        alt={pokemon.name}
                        className="pokemon-main-image"
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/200x200/f0f0f0/999999?text=Pokemon';
                        }}
                    />
                    {pokemon.sprites?.back_default && (
                        <img
                            src={pokemon.sprites.back_default}
                            alt={`${pokemon.name} back view`}
                            className="pokemon-back-image"
                        />
                    )}
                </div>

                <div className="pokemon-basic-stats">
                    <h2>Basic Information</h2>
                    <div className="stat-grid">
                        <div className="stat-item">
                            <span className="stat-label">Height:</span>
                            <span className="stat-value">
                                {pokemon.height ? (pokemon.height / 10) + ' m' : 'Unknown'}
                            </span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Weight:</span>
                            <span className="stat-value">
                                {pokemon.weight ? (pokemon.weight / 10) + ' kg' : 'Unknown'}
                            </span>
                        </div>
                        {pokemon.base_experience && (
                            <div className="stat-item">
                                <span className="stat-label">Base Experience:</span>
                                <span className="stat-value">{pokemon.base_experience}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="pokemon-types-section">
                <h2>Types</h2>
                <div className="types-container">
                    {(pokemon.types || []).map((typeInfo, index) => (
                        <span
                            key={index}
                            className={`type-badge large ${typeof typeInfo === 'string' ? typeInfo : typeInfo.type?.name || typeInfo}`}
                        >
                            {typeof typeInfo === 'string' ? typeInfo : typeInfo.type?.name || typeInfo}
                        </span>
                    ))}
                </div>
            </div>

            {pokemon.abilities && pokemon.abilities.length > 0 && (
                <div className="pokemon-abilities-section">
                    <h2>Abilities</h2>
                    <div className="abilities-container">
                        {pokemon.abilities.map((abilityInfo, index) => (
                            <span key={index} className="ability-badge">
                                {typeof abilityInfo === 'string' ? abilityInfo : abilityInfo.ability?.name || abilityInfo}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {pokemon.stats && pokemon.stats.length > 0 && (
                <div className="pokemon-stats-section">
                    <h2>Base Stats</h2>
                    <div className="stats-container">
                        {pokemon.stats.map((statInfo, index) => {
                            const statName = typeof statInfo === 'object' && statInfo.stat
                                ? (typeof statInfo.stat === 'string' ? statInfo.stat : statInfo.stat.name)
                                : statInfo;
                            const statValue = typeof statInfo === 'object' && statInfo.base_stat
                                ? statInfo.base_stat
                                : 0;

                            return (
                                <div key={index} className="stat-bar">
                                    <div className="stat-info">
                                        <span className="stat-name">{statName}</span>
                                        <span className="stat-number">{statValue}</span>
                                    </div>
                                    <div className="stat-progress">
                                        <div
                                            className="stat-fill"
                                            style={{ width: `${Math.min((statValue / 255) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PokemonDetails;