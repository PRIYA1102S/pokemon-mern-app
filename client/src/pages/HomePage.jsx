import React from 'react';
import { useNavigate } from 'react-router-dom';
import DailyPokemonCard from '../components/DailyPokemonCard';
import PokemonSearchBar from '../components/PokemonSearchBar';

const HomePage = () => {
    const navigate = useNavigate();

    const handleSearch = (searchTerm) => {
        // Navigate to results page with search query
        navigate('/results', { state: { searchQuery: searchTerm } });
    };

    return (
        <div className="home-page">
            <div className="header">
                <h1>🔍 Pokémon Search App</h1>
                <p>Discover and explore the world of Pokémon!</p>
            </div>

            <div className="search-section">
                <PokemonSearchBar onSearch={handleSearch} />
            </div>

            <div className="daily-section">
                <DailyPokemonCard />
            </div>
        </div>
    );
};

export default HomePage;