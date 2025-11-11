import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-lg">
      <div className="relative flex items-center group">
        <input
          className="w-full bg-gray-900/50 border border-gray-600/50 rounded-full py-3 pl-5 pr-32 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
          type="text"
          placeholder="e.g., Monarch Butterfly"
          aria-label="Insect name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={isLoading}
        />
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 h-[calc(100%-1rem)] flex-shrink-0 bg-emerald-600 hover:bg-emerald-700 border-emerald-600 hover:border-emerald-700 text-sm border-2 text-white font-semibold py-1 px-4 rounded-full disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-300"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>
    </form>
  );
};

export default SearchBar;