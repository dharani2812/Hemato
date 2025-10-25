import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config.js";
import Dialog from "../components/Dialog";
import RequestFormDialog from "../components/RequestFormDialog.jsx";
import Footer from "../components/Footer.jsx";
import "../styles/pages/donors.scss";

const Donors = () => {
  const [donors, setDonors] = useState([]);
  const [filteredDonors, setFilteredDonors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState({ show: false, message: "", type: "" });
  const [selectedDonor, setSelectedDonor] = useState(null);

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const donorsCol = collection(db, "donors");
        const donorSnapshot = await getDocs(donorsCol);
        const donorList = donorSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDonors(donorList);
        setFilteredDonors(donorList);
      } catch (error) {
        console.error("Error fetching donors:", error);
        showDialog("Failed to fetch donors.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchDonors();
  }, []);

  const showDialog = (message, type = "success") => {
    setDialog({ show: true, message, type });
    setTimeout(() => setDialog({ show: false, message: "", type: "" }), 3000);
  };

  // 🔍 Filter donors in real-time
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = donors.filter(
      (donor) =>
        donor.name?.toLowerCase().includes(term) ||
        donor.bloodGroup?.toLowerCase().includes(term) ||
        donor.district?.toLowerCase().includes(term)
    );
    setFilteredDonors(filtered);
  }, [searchTerm, donors]);

  return (
    <>
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading donors...</p>
        </div>
      ) : (
        <>
          <div className="donors-page">
            <h2>Available Donors</h2>

            {/* 🔍 Search Bar */}
            <div className="search-container">
              <input
                type="text"
                placeholder="Search by name, blood group, or district..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            {filteredDonors.length === 0 ? (
              <p className="no-donors">No donors found.</p>
            ) : (
              <div className="donor-cards">
                {filteredDonors.map((donor) => (
                  <div className="donor-card" key={donor.id}>
                    <div className="donor-info">
                      <h3>{donor.name || "Anonymous"}</h3>

                      <div className="donor-details">
                        <p><strong>Gender:</strong> {donor.gender || "N/A"}</p>
                        <p><strong>Age:</strong> {donor.age || "N/A"}</p>
                        <p><strong>Blood Group:</strong> {donor.bloodGroup || "N/A"}</p>
                        <p><strong>District:</strong> {donor.district || "N/A"}</p>
                        <p><strong>Email:</strong> {donor.email || "N/A"}</p>
                      </div>

                      <button
                        className="request-btn"
                        onClick={() => setSelectedDonor(donor)}
                      >
                        Request
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedDonor && (
              <RequestFormDialog
                donor={selectedDonor}
                onClose={() => setSelectedDonor(null)}
                onSuccess={(message) => showDialog(message, "success")}
                onError={(message) => showDialog(message, "error")}
              />
            )}

            {dialog.show && (
              <Dialog
                message={dialog.message}
                type={dialog.type}
                onClose={() => setDialog({ show: false, message: "", type: "" })}
              />
            )}
          </div>

          <Footer />
        </>
      )}
    </>
  );
};

export default Donors;
