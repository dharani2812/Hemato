import React from "react";
import "../styles/components/footer.scss";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__content">
        <h2>Hemato</h2>
        <p>Connecting donors, saving lives.</p>{" "}
        <p>© {new Date().getFullYear()} Hemato. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
