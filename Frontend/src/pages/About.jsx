import React from "react";
import { FaHandshake, FaShieldAlt, FaBolt, FaUsers, FaRegClock } from "react-icons/fa";
import "../styles/pages/about.scss";

const About = () => {
  return (
    <div className="about-page">

      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-content">
          <h1>About <span>Hemato</span></h1>
          <p>
            Hemato is a next-generation platform connecting blood donors with those in need.
            Our mission is to make blood donation **efficient, secure, and life-saving**.
          </p>
        </div>
        <div className="hero-shapes">
          <span className="shape shape1"></span>
          <span className="shape shape2"></span>
        </div>
      </section>

      {/* Mission Section */}
      <section className="about-mission">
        <h2>Our Mission</h2>
        <p>
          To ensure no patient suffers due to lack of blood, Hemato provides a verified donor network
          enabling quick, safe, and reliable requests. We aim to **streamline the process**, reduce
          delays, and save lives with every donation.
        </p>
      </section>

      {/* Vision Section */}
      <section className="about-vision">
        <h2>Our Vision</h2>
        <p>
          We envision a world where blood donation is effortless and accessible to everyone,
          where communities are empowered to respond to emergencies, and patients never face
          shortages due to lack of donors.
        </p>
      </section>

      {/* How It Works Section */}
      <section className="about-how">
        <h2>How It Works</h2>
        <div className="how-grid">
          <div className="how-card">
            <div className="icon"><FaUsers /></div>
            <h3>Register as a Donor</h3>
            <p>Create a verified profile with your blood group and location to be ready for requests.</p>
          </div>
          <div className="how-card">
            <div className="icon"><FaRegClock /></div>
            <h3>Request Blood</h3>
            <p>Requesters submit a request with blood group and location, instantly notifying nearby donors.</p>
          </div>
          <div className="how-card">
            <div className="icon"><FaBolt /></div>
            <h3>Instant Notifications</h3>
            <p>Donors receive instant notifications, and requesters get quick responses for timely support.</p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="about-values">
        <h2>Our Core Values</h2>
        <div className="values-grid">
          <div className="value-card">
            <div className="icon"><FaHandshake /></div>
            <h3>Transparency</h3>
            <p>All donor information is verified and handled securely to maintain complete transparency.</p>
          </div>
          <div className="value-card">
            <div className="icon"><FaShieldAlt /></div>
            <h3>Trust</h3>
            <p>Secure communication ensures that donors and requesters can rely on each other confidently.</p>
          </div>
          <div className="value-card">
            <div className="icon"><FaBolt /></div>
            <h3>Efficiency</h3>
            <p>Requests reach donors instantly, minimizing delays and maximizing lives saved.</p>
          </div>
        </div>
      </section>

      {/* Closing Note */}
      <section className="about-note">
        <p>
          Hemato is not just a platform, but a community of volunteers, donors, and supporters
          working together to save lives. Join us and be part of this life-saving movement.
        </p>
      </section>

    </div>
  );
};

export default About;
