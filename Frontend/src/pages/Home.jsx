import React, { useRef, useState } from "react";
import "../styles/pages/home.scss";

import Lottie from "lottie-react";
import HeroAnimation from "../assets/heroAnimation.json";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import Dialog from "../components/Dialog"; // ✅ import Dialog

const featuresData = [
  {
    id: 1,
    title: "Find Donors Easily",
    description: "Locate nearby blood donors in real-time.",
    icon: "💉",
  },
  {
    id: 2,
    title: "Safe & Verified",
    description: "All donors and recipients are verified for safety.",
    icon: "✔️",
  },
  {
    id: 3,
    title: "Track Donations",
    description: "Track requests, donations, and status updates.",
    icon: "📊",
  },
];

const factsData = [
  {
    id: 1,
    number: "Every 2 seconds",
    description: "Someone in the world needs blood.",
    icon: "💉",
  },
  {
    id: 2,
    number: "1 unit = 3 lives",
    description: "One blood donation can save up to 3 people.",
    icon: "❤️",
  },
  {
    id: 3,
    number: "O- in demand",
    description: "Most common blood type needed in emergencies.",
    icon: "🩸",
  },
  {
    id: 4,
    number: "Rare donors matter",
    description: "People with rare blood types rely on dedicated donors.",
    icon: "🌟",
  },
];

const stepsData = [
  { id: 1, step: "1", desc: "Sign up and verify your profile." },
  { id: 2, step: "2", desc: "Find or register a blood request." },
  { id: 3, step: "3", desc: "Connect with donors/recipients instantly." },
];

const Home = () => {
  const navigate = useNavigate();
  const auth = getAuth();

  const [showDialog, setShowDialog] = useState(false); // dialog state

  const featureRef = useRef(null);
  const stepsRef = useRef(null);
  const factsRef = useRef(null);

  // ✅ Handle Donate Now button click
  const handleDonateClick = () => {
    if (!auth.currentUser) {
      setShowDialog(true); // show dialog if not logged in
    } else {
      navigate("/add-donor"); // navigate if logged in
    }
  };

  // ✅ Close dialog and redirect to login
  const handleDialogClose = () => {
    setShowDialog(false);
    navigate("/login");
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero__content">
          <h1>
            Donate <span className="red-color"> Blood</span> , Save Lives
          </h1>
          <p>Connect with verified donors and make a difference today.</p>
          <div className="hero__buttons">
            <button className="btn btn-primary" onClick={handleDonateClick}>
              Donate Now
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate("/donors")}
            >
              Request Blood
            </button>
          </div>
        </div>
        <div className="hero__animation">
          <Lottie animationData={HeroAnimation} loop={true} />
        </div>
      </section>

      {/* Features Section */}
      <section className="features" ref={featureRef}>
        <h2 className="features__title">Features</h2>
        <div className="features__grid">
          {featuresData.map((feature) => (
            <div className="feature__card fade-in" key={feature.id}>
              <div className="feature__icon">{feature.icon}</div>
              <div className="feature__title">{feature.title}</div>
              <div className="feature__desc">{feature.description}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works" ref={stepsRef}>
        <h2>How It Works</h2>
        <div className="steps">
          {stepsData.map((step) => (
            <div className="step fade-in" key={step.id}>
              <span className="step__number">{step.step}</span>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Facts Section */}
      <section className="facts" ref={factsRef}>
        <h2 className="facts__title">Blood Donation Facts</h2>
        <div className="facts__grid">
          {factsData.map((fact) => (
            <div className="fact__card fade-in" key={fact.id}>
              <div className="fact__icon">{fact.icon}</div>
              <div className="fact__number">{fact.number}</div>
              <div className="fact__desc">{fact.description}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ✅ Dialog for Donate Now if not logged in */}
      {showDialog && (
        <Dialog
          message="To donate, please login first."
          type="info"
          onClose={handleDialogClose}
        />
      )}
    </div>
  );
};

export default Home;
