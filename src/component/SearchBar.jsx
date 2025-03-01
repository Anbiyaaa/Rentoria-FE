import React, { useState } from 'react'

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState("");

    const handleChange = (e) => {
        setQuery(e.target.value);
        onSearch(e.target.value);
    };
    return (
        <>
            <div className="flex items-center w-full max-w-md mx-auto bg-white border border-gray-300 rounded-lg shadow-md">
                <input
                    type="text"
                    value={query}
                    onChange={handleChange}
                    placeholder="Cari sesuatu..."
                    className="w-full px-4 py-2 text-gray-700 rounded-l-lg focus:outline-none"
                />
                <button className="px-4 py-2 text-white bg-orange-500 rounded-r-lg hover:bg-orange-600">
                    🔍
                </button>
            </div>
        </>
    )
}

export default SearchBar