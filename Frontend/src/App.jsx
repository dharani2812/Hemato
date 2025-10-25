import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dialog from "./components/Dialog";
import Home from "./pages/Home";
import Donate from "./pages/Donate";
import Donors from "./pages/Donors";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import { addDonor, getDonors } from "../firebase/firestoreService";
import "./styles/components/navbar.scss";
import About from "./pages/About";
import Footer from "./components/Footer";
import MyDonations from "./pages/MyDonations";

function App() {
  const [donors, setDonors] = useState([]);
  const [dialog, setDialog] = useState({ show: false, message: "", type: "" });

  // Show dialog helper
  const showDialog = (message, type = "error") => {
    setDialog({ show: true, message, type });
    setTimeout(() => setDialog({ show: false, message: "", type: "" }), 3000);
  };

  // Fetch donors on app load
  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const allDonors = await getDonors();
        setDonors(allDonors);
      } catch (error) {
        showDialog(error.message);
      }
    };
    fetchDonors();
  }, []);

  // Add new donor
  const handleAddDonor = async (donorData) => {
    try {
      await addDonor(donorData);
      const allDonors = await getDonors();
      setDonors(allDonors);
      showDialog("✅ Donor added successfully!", "success");
    } catch (error) {
      showDialog(error.message);
    }
  };

  return (
    <div>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/my-donations" element={<MyDonations />} />

        <Route path="/about" element={<About />} />


        {/* Donors page */}
        <Route path="/donors" element={<Donors donors={donors} />} />

        {/* Protected route for adding donors */}
        <Route
          path="/add-donor"
          element={
            <ProtectedRoute>
              <Donate onAddDonor={handleAddDonor} />
            </ProtectedRoute>
          }
        />

        {/* Catch-all for unmatched routes */}
        <Route
          path="*"
          element={
            <h2 style={{ textAlign: "center", marginTop: "2rem" }}>
              Page Not Found
            </h2>
          }
        />
      </Routes>
       <Footer /> {/* Footer included globally */}

      {dialog.show && (
        <Dialog
          message={dialog.message}
          type={dialog.type}
          onClose={() => setDialog({ show: false, message: "", type: "" })}
        />
      )}
    </div>
  );
}

export default App;
