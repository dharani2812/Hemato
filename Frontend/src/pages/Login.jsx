import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/config.js";
import Dialog from "../components/Dialog";
import "../styles/pages/login.scss";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [dialog, setDialog] = useState({ show: false, message: "", type: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ----------------------------
  // Handle input changes
  // ----------------------------
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ----------------------------
  // Centralized error handler
  // ----------------------------
 const showError = (error, method = "email") => {
  setDialog({
    show: true,
    message: "Please Enter valid email and password.",
    type: "info",
  });

  // Optional: still log the actual error for debugging
  console.error("Login error:", error.code, error.message);
};


  // ----------------------------
  // Email/password login
  // ----------------------------
  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // Check email verification
      if (!user.emailVerified) {
        await signOut(auth);
        setDialog({
          show: true,
          message: `Please verify your email before logging in. 
Check your inbox for the verification link. 
If you don’t see it, check your Spam or Promotions folder.`,
          type: "info",
        });
        setLoading(false);
        return;
      }

      // Successful login
      setDialog({
        show: true,
        message: "You’ve successfully logged in!",
        type: "success",
      });
      setFormData({ email: "", password: "" });

      setTimeout(() => {
        setDialog({ show: false, message: "", type: "" });
        navigate("/");
      }, 1500);
    } catch (error) {
      showError(error, "email");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------
  // Google login
  // ----------------------------
  const handleGoogleLogin = async () => {
    if (loading) return;
    setLoading(true);
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Email verification check
      if (!user.emailVerified) {
        await signOut(auth);
        setDialog({
          show: true,
          message: `Please verify your email before logging in. 
Check your inbox for the verification link. 
If you don’t see it, check your Spam or Promotions folder.`,
          type: "info",
        });
        setLoading(false);
        return;
      }

      // Check if user exists in Firestore
      const userDoc = doc(db, "users", user.uid);
      const docSnap = await getDoc(userDoc);

      if (!docSnap.exists()) {
        await signOut(auth);
        setDialog({
          show: true,
          message: "No account found with this email. Please register first.",
          type: "info",
        });
        setLoading(false);
        return;
      }

      // Successful Google login
      setDialog({
        show: true,
        message: "You’ve successfully signed in with Google!",
        type: "success",
      });

      setTimeout(() => {
        setDialog({ show: false, message: "", type: "" });
        navigate("/");
      }, 1500);
    } catch (error) {
      showError(error, "google");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------
  // Render
  // ----------------------------
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Welcome Back</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="divider">or</div>

        <div className="google-wrapper">
          <button
            onClick={handleGoogleLogin}
            className="btn-google"
            disabled={loading}
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
            />
            {loading ? "Please wait..." : "Continue with Google"}
          </button>
        </div>

        <p className="register-text">
          Don’t have an account?{" "}
          <NavLink to="/register" className="register-link">
            Register
          </NavLink>
        </p>
      </div>

      {/* Dialog component */}
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

export default Login;
