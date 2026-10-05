import { useState, type SubmitEvent } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import type { DocumentItem } from '../types';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/documents/search', { params: { q: query } });
      setResults(data.results);
      setSearched(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/30">
          <span className="text-2xl">🔍</span>
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
            Semantic Search
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Find documents by meaning, not just keywords.
          </p>
        </div>
      </div>

      {/* Search Form */}
      <form
        onSubmit={handleSearch}
        className="relative bg-white/95 backdrop-blur-lg rounded-2xl border border-gray-100 shadow-lg overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
        <div className="p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 pointer-events-none">
                🔎
              </span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search your documents..."
                className="w-full border border-gray-300 rounded-xl pl-11 pr-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-indigo-400"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <span className="text-sm">🚀</span>
                  Search
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl animate-pulse">
          <span className="text-xl leading-none">⚠️</span>
          <div>
            <p className="font-semibold text-sm">Search failed</p>
            <p className="text-sm mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Results */}
      {searched && (
        <div className="space-y-4">
          {/* Results count */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 shadow-md">
              <span className="text-lg">📊</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                {results.length} result{results.length !== 1 ? 's' : ''} found
              </h2>
              <p className="text-xs text-gray-500">
                for &quot;{query}&quot;
              </p>
            </div>
          </div>

          {results.length === 0 ? (
            /* Empty state */
            <div className="relative bg-white/95 backdrop-blur-lg rounded-2xl border border-dashed border-gray-300 p-12 text-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-transparent to-purple-50/50 pointer-events-none" />
              <div className="relative">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 mb-4">
                  <span className="text-3xl">🔍</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  No matching documents
                </h3>
                <p className="text-sm text-gray-500 max-w-sm mx-auto">
                  Try different keywords or upload more documents to search
                  across.
                </p>
              </div>
            </div>
          ) : (
            /* Results list */
            <div className="space-y-3">
              {results.map((doc) => (
                <Link
                  key={doc._id}
                  to={`/documents/${doc._id}`}
                  className="group relative block bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="p-5 flex items-start gap-4">
                    {/* File icon */}
                    <div className="flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 text-xl shadow-sm group-hover:scale-105 transition-transform duration-300">
                      📄
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 truncate group-hover:text-indigo-600 transition-colors">
                        {doc.originalName}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2 leading-relaxed">
                        {doc.summary || 'No summary'}
                      </p>
                    </div>

                    {/* Arrow indicator */}
                    <span className="flex-shrink-0 text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all duration-200 text-lg">
                      →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;