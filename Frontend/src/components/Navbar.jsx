import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaTint, FaBars, FaTimes } from "react-icons/fa";
import { onAuthStateChanged, signOut } from "firebase/auth";
import ThemeToggle from "../styles/components/ThemeToggle";
import { auth } from "../../firebase/config.js";
import Dialog from "../components/Dialog"; // ✅ import Dialog
import "../styles/components/Navbar.scss";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showDialog, setShowDialog] = useState(false); // dialog state
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

  // ✅ Handle Add Donor click
  const handleAddDonorClick = (e) => {
    e.preventDefault();
    if (!user) {
      setShowDialog(true); // show dialog if not logged in
    } else {
      navigate("/add-donor"); // navigate normally if logged in
    }
    setMenuOpen(false); // close mobile menu
  };

  // ✅ Close dialog and redirect to login
  const handleDialogClose = () => {
    setShowDialog(false);
    navigate("/login");
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
        <NavLink to="/add-donor" onClick={handleAddDonorClick}>
          Add Donor
        </NavLink>
        <NavLink to="/about" onClick={handleLinkClick}>
          About
        </NavLink>

        {user && (
          <NavLink to="/my-donations" onClick={handleLinkClick}>
            My Donations
          </NavLink>
        )}

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

      {/* ✅ Dialog for Add Donor if not logged in */}
      {showDialog && (
        <Dialog
          message="To add a donor, please login first."
          type="info"
          onClose={handleDialogClose}
        />
      )}
    </nav>
  );
};

export default Navbar;
