import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/config.js";
import Dialog from "../components/Dialog";
import "../styles/pages/login.scss";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [dialog, setDialog] = useState({ show: false, message: "", type: "" });
  const [loading, setLoading] = useState(false); // ✅ Add loading state
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const showError = (error) => {
    let message = "";
    switch (error.code) {
      case "auth/user-not-found":
        message = "User not found. Please register first.";
        break;
      case "auth/wrong-password":
        message = "Incorrect password. Try again.";
        break;
      case "auth/invalid-email":
        message = "Invalid email address format.";
        break;
      case "auth/too-many-requests":
        message = "Too many attempts. Please try again later.";
        break;
      case "auth/popup-closed-by-user":
        message = "Google login was cancelled. Try again.";
        break;
      case "auth/credential-already-in-use":
        message = "This Google account is already linked with another user.";
        break;
      case "auth/invalid-credential":
        message = "Unable to login with Google. Please try again.";
        break;
      default:
        message = "Something went wrong. Please try again.";
    }
    setDialog({
      show: true,
      message: message + ` (Error: ${error.code})`,
      type: "error",
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return; // ✅ Prevent double-click

    setLoading(true); // ✅ Disable button
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      if (!user.emailVerified) {
        await signOut(auth);
       setDialog({
  show: true,
  message: `ℹ️ Please verify your email.
Check your inbox for the verification link. 
If you don't see it, kindly check your Spam or Promotions folder.`,
  type: "info",
});

        setLoading(false);
        return;
      }

      setDialog({
        show: true,
        message: "✅ Logged in successfully!",
        type: "success",
      });
      setFormData({ email: "", password: "" });

      setTimeout(() => {
        setDialog({ show: false, message: "", type: "" });
        navigate("/");
      }, 1500);
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false); // ✅ Re-enable after backend finishes
    }
  };

  const handleGoogleLogin = async () => {
    if (loading) return;
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (!user.emailVerified) {
        await signOut(auth);
        setDialog({
          show: true,
          message:
            "⚠️ Your Google account email is not verified. Please verify your email first.",
          type: "error",
        });
        setLoading(false);
        return;
      }

      const userDoc = doc(db, "users", user.uid);
      const docSnap = await getDoc(userDoc);
      if (!docSnap.exists()) {
        await setDoc(userDoc, {
          name: user.displayName,
          email: user.email,
          verified: user.emailVerified,
          provider: "google",
          createdAt: new Date(),
        });
      }

      setDialog({
        show: true,
        message: "✅ Logged in with Google successfully!",
        type: "success",
      });
      setTimeout(() => {
        setDialog({ show: false, message: "", type: "" });
        navigate("/");
      }, 1500);
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

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
            disabled={loading} // ✅ Disable input when loading
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
