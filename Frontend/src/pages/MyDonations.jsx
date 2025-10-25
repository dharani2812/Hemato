import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where, doc, deleteDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../firebase/config.js";
import Dialog from "../components/Dialog";
import "../styles/pages/myDonations.scss";

const MyDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState({ show: false, message: "", type: "" });

  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchMyDonations = async () => {
      if (!currentUser) return;
      try {
        const donationsCol = collection(db, "donors");
        const q = query(donationsCol, where("uid", "==", currentUser.uid));
        const snapshot = await getDocs(q);
        const myDonations = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setDonations(myDonations);
      } catch (error) {
        console.error("Error fetching donations:", error);
        showDialog("Failed to fetch your donations.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchMyDonations();
  }, [currentUser]);

  const handleDelete = async (donorId) => {
    if (window.confirm("Are you sure you want to delete this donation?")) {
      try {
        await deleteDoc(doc(db, "donors", donorId));
        setDonations((prev) => prev.filter((d) => d.id !== donorId));
        showDialog("Donation deleted successfully.", "success");
      } catch (error) {
        console.error("Error deleting donation:", error);
        showDialog("Failed to delete donation.", "error");
      }
    }
  };

  const showDialog = (message, type = "success") => {
    setDialog({ show: true, message, type });
    setTimeout(() => setDialog({ show: false, message: "", type: "" }), 3000);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your donations...</p>
      </div>
    );
  }

  return (
    <div className="my-donations-page">
      <h2>My Donation History</h2>

      {donations.length === 0 ? (
        <p className="no-donations">You haven't donated yet.</p>
      ) : (
        <div className="donation-cards">
          {donations.map((donor) => (
            <div className="donation-card" key={donor.id}>
              <div className="donation-info">
                <h3>{donor.name}</h3>
                <p><strong>Blood Group:</strong> {donor.bloodGroup || "N/A"}</p>
                <p><strong>District:</strong> {donor.district || "N/A"}</p>
                <p><strong>Email:</strong> {donor.email || "N/A"}</p>
                <p><strong>Gender:</strong> {donor.gender || "N/A"}</p>
                <p><strong>Age:</strong> {donor.age || "N/A"}</p>

                <button className="delete-btn" onClick={() => handleDelete(donor.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {dialog.show && (
        <Dialog
          message={dialog.message}
          type={dialog.type}
          onClose={() => setDialog({ show: false, message: "", type: "" })}
        />
      )}
    </div>
  );
};

export default MyDonations;
