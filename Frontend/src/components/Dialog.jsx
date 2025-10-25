// src/components/Dialog.jsx
import React from "react";
import { FaCheckCircle, FaTimesCircle, FaTimes } from "react-icons/fa";
import "../styles/components/dialog.scss";

const Dialog = ({ message, type, onClose, children }) => {
  return (
    <div className="dialog-backdrop">
      <div className={`dialog-box ${type || ""}`}>
        <button className="close-btn" onClick={onClose}>
          <FaTimes />
        </button>

        {children ? (
          children
        ) : (
          <>
            <div className={`icon ${type}`}>
              {type === "success" ? <FaCheckCircle /> : <FaTimesCircle />}
            </div>
            <p>{message}</p>
            <button className="ok-btn" onClick={onClose}>
              OK
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Dialog;
