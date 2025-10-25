import { useEffect, useState } from "react";
import "./ThemeToggle.scss";
import { FaMoon, FaSun } from "react-icons/fa";

const ThemeToggle = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.remove("light");
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      document.body.classList.add("light");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
      <div className={`toggle-circle ${darkMode ? "dark" : "light"}`}>
        <span key={darkMode ? "moon" : "sun"} className="icon-wrapper">
          {darkMode ? <FaMoon /> : <FaSun />}
        </span>
      </div>
    </div>
  );
};

export default ThemeToggle;
