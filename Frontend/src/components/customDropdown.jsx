import React, { useState, useRef, useEffect } from "react";
import { IoChevronDown } from "react-icons/io5";
import "../styles/components/customDropdown.scss";

const CustomDropdown = ({ label = "Select Option", options = [], value, setValue }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="custom-dropdown" ref={dropdownRef}>
      <div
        className={`dropdown-selected ${open ? "open" : ""}`}
        onClick={() => setOpen(!open)}
      >
        <span>{value || label}</span>
        <IoChevronDown className={`arrow ${open ? "rotate" : ""}`} />
      </div>

      {open && (
        <ul className="dropdown-options">
          {options.map((option) => (
            <li
              key={option}
              onClick={() => {
                setValue(option);
                setOpen(false);
              }}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomDropdown;
