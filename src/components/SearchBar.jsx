import { useState, useRef, useEffect } from 'react';
import { Search, Clock, Loader2, MapPin } from 'lucide-react';

export const SearchBar = ({ 
  onSearch, 
  recentSearches, 
  onRecentClick, 
  loading,
  onGetLocation
}) => {
  const [query, setQuery] = useState("");
  const [showRecent, setShowRecent] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowRecent(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setQuery("");
      setShowRecent(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (recentSearches.length > 0) setShowRecent(true);
          }}
          placeholder="Search any city worldwide..."
          className="w-full px-6 py-4 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all text-lg shadow-lg"
          disabled={loading}
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
          {onGetLocation && (
            <button
              type="button"
              onClick={onGetLocation}
              disabled={loading}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all disabled:opacity-50"
              title="Use my location"
            >
              <MapPin className="w-5 h-5 text-white" />
            </button>
          )}
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 text-white animate-spin" />
            ) : (
              <Search className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </form>
      
      {/* Recent Searches */}
      {showRecent && recentSearches.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 overflow-hidden z-50">
          <div className="p-2">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3 py-2">
              Recent Searches
            </p>
            {recentSearches.map((city, index) => (
              <button
                key={index}
                onClick={() => {
                  onRecentClick(city);
                  setShowRecent(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 text-gray-700 dark:text-gray-200"
              >
                <Clock className="w-4 h-4 text-gray-400" />
                {city}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};