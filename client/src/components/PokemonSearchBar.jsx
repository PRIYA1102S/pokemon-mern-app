import React, { useState, useEffect, useRef } from 'react';

const PokemonSearchBar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [activeSuggestion, setActiveSuggestion] = useState(-1);
    const searchRef = useRef(null);
    const suggestionsRef = useRef(null);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (searchTerm.length >= 2) {
                try {
                    const response = await fetch(`/api/pokemon/suggestions/${encodeURIComponent(searchTerm)}`);
                    if (response.ok) {
                        const data = await response.json();
                        setSuggestions(data);
                        setShowSuggestions(true);
                    }
                } catch (error) {
                    console.error('Error fetching suggestions:', error);
                    setSuggestions([]);
                }
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        };

        const timeoutId = setTimeout(fetchSuggestions, 300); // Debounce
        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
                setActiveSuggestion(-1);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
        setActiveSuggestion(-1);
    };

    const handleSearch = (event) => {
        event.preventDefault();
        const term = searchTerm.trim();
        if (term) {
            onSearch(term);
            setSearchTerm('');
            setShowSuggestions(false);
            setSuggestions([]);
            setActiveSuggestion(-1);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchTerm(suggestion);
        setShowSuggestions(false);
        setSuggestions([]);
        setActiveSuggestion(-1);
        onSearch(suggestion);
        setSearchTerm('');
    };

    const handleKeyDown = (event) => {
        if (!showSuggestions || suggestions.length === 0) return;

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                setActiveSuggestion(prev =>
                    prev < suggestions.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                event.preventDefault();
                setActiveSuggestion(prev => prev > 0 ? prev - 1 : -1);
                break;
            case 'Enter':
                event.preventDefault();
                if (activeSuggestion >= 0) {
                    handleSuggestionClick(suggestions[activeSuggestion]);
                } else {
                    handleSearch(event);
                }
                break;
            case 'Escape':
                setShowSuggestions(false);
                setActiveSuggestion(-1);
                break;
            default:
                break;
        }
    };

    return (
        <div className="search-container" ref={searchRef}>
            <form onSubmit={handleSearch} className="pokemon-search-bar">
                <input
                    type="text"
                    placeholder="Search for a Pokémon..."
                    value={searchTerm}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                    className="search-input"
                    autoComplete="off"
                />
                <button type="submit" className="search-button">
                    🔍 Search
                </button>
            </form>

            {showSuggestions && suggestions.length > 0 && (
                <div className="suggestions-dropdown" ref={suggestionsRef}>
                    {suggestions.map((suggestion, index) => (
                        <div
                            key={suggestion}
                            className={`suggestion-item ${index === activeSuggestion ? 'active' : ''}`}
                            onClick={() => handleSuggestionClick(suggestion)}
                            onMouseEnter={() => setActiveSuggestion(index)}
                        >
                            {suggestion.charAt(0).toUpperCase() + suggestion.slice(1)}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PokemonSearchBar;