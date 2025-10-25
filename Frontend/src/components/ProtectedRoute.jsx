import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Navigate } from "react-router-dom";
import { auth, db } from "../../firebase/config.js";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // 🔹 Check login & email verification
  if (!user) {
    return <Navigate to="/login" replace />;
  } else if (!user.emailVerified && user.providerData[0]?.providerId === "password") {
    return (
      <div className="verify-warning">
        <h2>Please verify your email</h2>
        <p>Check your inbox for a verification link before accessing this page.</p>
        <a href="/login" className="btn">Back to Login</a>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
