import React from 'react';
import { useLocation } from 'react-router-dom';
import SearchResults from '../components/SearchResults';

const ResultsPage = () => {
    const location = useLocation();
    const { searchQuery } = location.state || { searchQuery: '' };

    return (
        <div>
            <h1>Search Results for: {searchQuery}</h1>
            <SearchResults query={searchQuery} />
        </div>
    );
};

export default ResultsPage;