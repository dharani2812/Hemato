import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/config.js";
import Dialog from "../components/Dialog";
import "../styles/pages/register.scss";

const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [dialog, setDialog] = useState({ show: false, message: "", type: "" });
  const [loading, setLoading] = useState(false); // ✅ Added
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const showDialog = (message, type = "success", redirect = null) => {
    setDialog({ show: true, message, type });
    setTimeout(() => {
      setDialog({ show: false, message: "", type: "" });
      if (redirect) navigate(redirect);
    }, 2500);
  };

  const friendlyError = (code) => {
    switch (code) {
      case "auth/email-already-in-use":
        return "This email is already registered. Please login instead.";
      case "auth/weak-password":
        return "Password must be at least 6 characters.";
      case "auth/invalid-email":
        return "Invalid email address format.";
      case "auth/popup-closed-by-user":
        return "Google sign-in was closed before completion.";
      default:
        return `An unexpected error occurred: ${code}`;
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true); // ✅ Disable submit while processing

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);

      try {
        await sendEmailVerification(userCredential.user);
        console.log("Verification email sent successfully");
      } catch (err) {
        console.error("Failed to send verification email:", err);
        showDialog("⚠️ Failed to send verification email. Please check your email settings.", "error");
        setLoading(false);
        return;
      }

      await setDoc(doc(db, "users", userCredential.user.uid), {
        name: formData.name,
        email: formData.email,
        verified: false,
        createdAt: new Date(),
      });

      showDialog("✅ Verification email sent! Please check your inbox before logging in.", "success", "/login");
      setFormData({ name: "", email: "", password: "" });

    } catch (error) {
      showDialog(friendlyError(error.code), "error");
    } finally {
      setLoading(false); // ✅ Re-enable after process
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    setLoading(true); // ✅ Disable Google button too
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (!user.emailVerified) {
        await signOut(auth);
        showDialog("⚠️ Your Google email is not verified. Please verify before logging in.", "error");
        return;
      }

      await setDoc(
        doc(db, "users", user.uid),
        {
          name: user.displayName,
          email: user.email,
          verified: user.emailVerified,
          provider: "google",
          createdAt: new Date(),
        },
        { merge: true }
      );

      showDialog("✅ Logged in with Google successfully!", "success", "/");
    } catch (error) {
      showDialog(friendlyError(error.code), "error");
    } finally {
      setLoading(false); // ✅ Re-enable buttons
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Create Account</h2>
        <form onSubmit={handleRegister}>
          <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Please wait..." : "Register"}
          </button>
        </form>

        <div className="divider">or</div>

        <button onClick={handleGoogleSignIn} className="btn-google" disabled={loading}>
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
          {loading ? "Processing..." : "Sign Up with Google"}
        </button>

        <p className="login-text">
          Already have an account? <NavLink to="/login" className="login-link">Login</NavLink>
        </p>
      </div>

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

export default Register;
