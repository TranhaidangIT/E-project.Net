import { useContext } from 'react';
import { SearchContext } from '../context/SearchContextDef';

export const useSearch = () => useContext(SearchContext);
