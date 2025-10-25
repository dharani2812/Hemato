import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";
import CustomDropdown from "../components/customDropdown";
import "../styles/pages/donate.scss";

const Donate = () => {
  const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
  const genders = ["Male", "Female", "Other"];

  const [bloodGroup, setBloodGroup] = useState("");
  const [gender, setGender] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    district: "",
    age: "",
  });

  const auth = getAuth();
  const db = getFirestore();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bloodGroup || !gender) {
      setMessage("Please select both gender and blood group.");
      return;
    }

    if (!auth.currentUser) {
      setMessage("You must be logged in to add a donor.");
      return;
    }

    setLoading(true);
    try {
      await setDoc(doc(db, "donors", `${Date.now()}-${auth.currentUser.uid}`), {
        ...formData,
        email: auth.currentUser.email, // ✅ Use logged-in user's email
        gender,
        bloodGroup,
        uid: auth.currentUser.uid,
        isVerified: true, // no extra verification needed
        createdAt: serverTimestamp(),
        createdBy: auth.currentUser.uid,
      });

      setMessage("✅ Donor added successfully!");
      setFormData({ name: "", district: "", age: "" });
      setBloodGroup("");
      setGender("");
    } catch (error) {
      console.error(error);
      setMessage(`❌ ${error.message}`);
    }
    setLoading(false);
  };

  return (
    <div className="donate-blood">
      <h1>Donate Blood</h1>
      <form className="donate-form" onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </label>

        <label>
          Email:
          <input
            type="email"
            value={auth.currentUser?.email || ""}
            disabled
            readOnly
          />
        </label>

        <label>
          Gender:
          <CustomDropdown
            value={gender}
            setValue={setGender}
            options={genders}
            placeholder="Select Gender"
          />
        </label>

        <label>
          Age:
          <input
            type="number"
            name="age"
            value={formData.age || ""}
            onChange={handleChange}
            required
            disabled={loading}
            min="0"
            max="120"
          />
        </label>

        <label>
          Blood Group:
          <CustomDropdown
            value={bloodGroup}
            setValue={setBloodGroup}
            options={bloodGroups}
            placeholder="Select Blood Group"
            disabled={loading}
          />
        </label>

        <label>
          District:
          <input
            type="text"
            name="district"
            value={formData.district}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </label>

        <button type="submit" className="btn submit-btn" disabled={loading}>
          {loading ? "Adding..." : "Submit"}
        </button>
      </form>

      {message && (
        <p
          className={`form-message ${
            message.includes("successfully") ? "success" : "error"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default Donate;
