"use client";
import React, { useState } from "react";

interface CharitySearchProps {
    onSearch: (searchTerm: string) => void; // Define prop type for search handler
    onClear: () => void; // Add prop type for clear handler
}

const CharitySearch: React.FC<CharitySearchProps> = ({ onSearch, onClear }) => {
    const [searchTerm, setSearchTerm] = useState<string>(""); // State to hold the search term
    const [errorMessage, setErrorMessage] = useState<string>(""); // State for error message

    // Update state as user types
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
        setErrorMessage(""); // Clear error message on input change

        if (value.trim() === "") { // Check if input is cleared
            onClear(); // Call onClear to reset charity list
        }
    };

    // Call the onSearch function with the current search term
    const handleSearch = () => {
        if (searchTerm.trim().length < 3) { // Check if search term is less than 3 characters
            setErrorMessage("Please write at least 3 characters or more"); // Set error message
            return; // Stop execution if invalid
        }
        onSearch(searchTerm); // Call search handler
    };

    // Call search on Enter key press
    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") { // Check for Enter key
            event.preventDefault(); // Prevent form submission
            handleSearch(); // Call the search handler
        }
    };

    return (
        <div className="flex justify-center mt-8">
            <form onSubmit={(e) => e.preventDefault()} className="flex w-full max-w-[542px] mx-auto"> {/* Prevent default form submission */}
                <input
                    type="text"
                    placeholder="Search a charity"
                    className="text-[12px] search-border py-2 px-2 w-full max-w-full focus:outline-none"
                    value={searchTerm} // Controlled input
                    onChange={handleInputChange} // Handle input change
                    onKeyPress={handleKeyPress} // Handle key press for Enter
                />
                <button
                    type="button" // Ensure button doesn't submit form by default
                    className="bg-[#0B0112] text-white py-2 px-4"
                    onClick={handleSearch} // Handle button click
                >
                    Go
                </button>
            </form>
            {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>} {/* Display error message */}
        </div>
    );
};

export default CharitySearch;
