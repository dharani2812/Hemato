import React, { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { FaTint, FaBars, FaTimes } from "react-icons/fa";
import { onAuthStateChanged, signOut } from "firebase/auth";
import ThemeToggle from "../styles/components/ThemeToggle";
import { auth } from "../../firebase/config.js";
import "../styles/components/Navbar.scss";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Toggle Menu
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  // Close menu when clicking a nav link
  const handleLinkClick = () => setMenuOpen(false);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="nav-logo" onClick={() => navigate("/")}>
        <FaTint className="logo-icon" />
        <span className="logo-text">Hemato</span>
      </div>

      {/* Navigation Links */}
      <div className={`nav-links ${menuOpen ? "active" : ""}`}>
        <NavLink to="/" end onClick={handleLinkClick}>
          Home
        </NavLink>
        <NavLink to="/donors" onClick={handleLinkClick}>
          Donors
        </NavLink>
        <NavLink to="/add-donor" onClick={handleLinkClick}>
          Add Donor
        </NavLink>
        <NavLink to="/about" onClick={handleLinkClick}>
          About
        </NavLink>

        {/* My Donations link visible only to logged-in users */}
        {user && (
          <NavLink to="/my-donations" onClick={handleLinkClick}>
            My Donations
          </NavLink>
        )}

        {/* Login / Logout Link */}
        {user && user.emailVerified ? (
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <NavLink to="/login" onClick={handleLinkClick}>
            Login
          </NavLink>
        )}
      </div>

      {/* Right Side (Theme Toggle + Mobile Menu) */}
      <div className="nav-right">
        <ThemeToggle />
        <button
          className="menu-toggle"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
