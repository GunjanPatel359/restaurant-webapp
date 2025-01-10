/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";

const SelectInput = ({ options = [], selectedOption, onOptionSelect, placeholder = "Select an option" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("");
  const selectRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const closeDropdown = (e) => {
      if (selectRef.current && !selectRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", closeDropdown);
    return () => document.removeEventListener("mousedown", closeDropdown);
  }, []);

  // Update selected label when selectedOption or options change
  useEffect(() => {
    const selected = options.find(option => option === selectedOption);
    setSelectedLabel(selected ? selected : placeholder);
  }, [selectedOption, options, placeholder]);

  const handleOptionClick = (option) => {
    onOptionSelect(option);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div ref={selectRef} className="relative w-full max-w-sm">
      <button
        onClick={toggleDropdown}
        className="w-full text-left px-4 py-2 border border-color3 text-color5 rounded-md bg-white focus:outline-none flex justify-between items-center"
      >
        <span className="truncate">{selectedLabel || placeholder}</span>
        <svg
          className={`w-4 h-4 transform transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-full bg-white border border-color2 rounded-md shadow-lg">
          {options.length > 0 ? (
            options.map((option) => (
              <div
                key={option}
                onClick={() => handleOptionClick(option)}
                className="px-4 text-color5 py-2 cursor-pointer hover:bg-color0 transition-colors"
              >
                {option}
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-color5">No options available</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SelectInput;
