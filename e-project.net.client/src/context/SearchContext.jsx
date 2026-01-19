import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { songAPI } from '../services/api';

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const navigate = useNavigate();

    const handleSearch = async (query) => {
        if (!query?.trim()) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            const response = await songAPI.searchSongs(query);
            setSearchResults(response.data);
            // Navigate to music page with search results
            navigate('/music?search=' + encodeURIComponent(query));
        } catch (error) {
            console.error('Search error:', error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const clearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
    };

    return (
        <SearchContext.Provider value={{
            searchQuery,
            setSearchQuery,
            searchResults,
            setSearchResults,
            isSearching,
            handleSearch,
            clearSearch
        }}>
            {children}
        </SearchContext.Provider>
    );
};

export const useSearch = () => useContext(SearchContext);
