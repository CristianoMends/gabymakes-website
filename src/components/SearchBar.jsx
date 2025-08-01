import React, { useState, useEffect, useRef } from 'react';
import { FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export default function SearchBar({ showMobile, onToggleMobileSearch }) {
    const [searchQuery, setSearchQuery] = useState('');
    const searchContainerRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                searchContainerRef.current &&
                !searchContainerRef.current.contains(event.target)
            ) {
                
                if (showMobile) {
                    onToggleMobileSearch(false); 
                }
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showMobile, onToggleMobileSearch]); 

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/busca?q=${encodeURIComponent(searchQuery)}`);
            onToggleMobileSearch(false); 
            setSearchQuery(''); 
        }
    };

    return (
        <>
            {/* Busca - Desktop */}
            <div className="hidden md:flex flex-grow justify-center">
                <form
                    onSubmit={handleSearchSubmit}
                    className="flex items-center bg-pink-100 rounded-full shadow-inner px-4 h-10 w-96 max-w-full"
                >
                    <input
                        type="text"
                        placeholder="Buscar produtos, marcas..."
                        className="flex-grow bg-transparent focus:outline-none text-gray-700 placeholder-gray-400 text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" aria-label="Buscar">
                        <FiSearch className="text-gray-700 cursor-pointer hover:text-pink-600 transition-colors" size={18} />
                    </button>
                </form>
            </div>

            {showMobile && (
                <div ref={searchContainerRef} className="absolute top-full left-0 w-full bg-pink-100 px-4 py-2 z-40 shadow-lg">
                    <form
                        onSubmit={handleSearchSubmit}
                        className="flex items-center bg-white rounded-full px-4 h-10 shadow-inner border border-pink-200"
                    >
                        <input
                            type="text"
                            placeholder="Buscar..."
                            className="flex-grow bg-transparent focus:outline-none text-gray-700 placeholder-gray-400 text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            autoFocus 
                        />
                        <button type="submit" aria-label="Buscar">
                            <FiSearch className="text-gray-700 cursor-pointer hover:text-pink-600 transition-colors" size={18} />
                        </button>
                    </form>
                </div>
            )}
        </>
    );
}