// src/components/RequestFormDialog.jsx
import React, { useState } from "react";
import Dialog from "./Dialog";
import "../styles/components/requestFormDialog.scss";
import emailjs from "@emailjs/browser";

const RequestFormDialog = ({ donor, onClose }) => {
  const [phone, setPhone] = useState("");
  const [urgency, setUrgency] = useState("");
  const [sending, setSending] = useState(false);
  const [statusDialog, setStatusDialog] = useState({ show: false, message: "", type: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") setPhone(value);
    else if (name === "urgency") setUrgency(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone || !urgency) {
      setStatusDialog({ show: true, message: "Please fill all fields.", type: "error" });
      return;
    }

    setSending(true);
    try {
      const templateParams = {
        donor_name: donor.name,
        donor_email: donor.email,
        requester_phone: phone,
        requester_message: urgency,
      };

      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        templateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      setStatusDialog({ show: true, message: `Request sent to ${donor.name}! ✅`, type: "success" });
    } catch (error) {
      console.error(error);
      setStatusDialog({ show: true, message: "Failed to send request. ❌", type: "error" });
    } finally {
      setSending(false);
    }
  };

  const handleStatusDialogClose = () => {
    setStatusDialog({ show: false, message: "", type: "" });
    onClose(); // close the request form
  };

  return (
    <>
      {/* Main Request Form Dialog */}
      <Dialog onClose={onClose}>
        <form onSubmit={handleSubmit} className="request-form-dialog">
          <h2 className="form-heading">
            Request <span>{donor?.name || "Donor"}</span>
          </h2>

          <p className="form-subtext">
            Fill in your details. Your request will be securely sent.
          </p>

          <div className="input-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={phone}
              onChange={handleChange}
              placeholder="Enter your contact number"
              maxLength="10"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="urgency">Urgency / Message</label>
            <textarea
              id="urgency"
              name="urgency"
              value={urgency}
              onChange={handleChange}
              placeholder="Describe your urgency or location..."
              required
            />
          </div>

          <button type="submit" className="send-request-btn" disabled={sending}>
            {sending ? "Sending..." : "Send Request"}
          </button>
        </form>
      </Dialog>

      {/* Status Dialog */}
      {statusDialog.show && (
        <Dialog
          message={statusDialog.message}
          type={statusDialog.type}
          onClose={handleStatusDialogClose}
        />
      )}
    </>
  );
};

export default RequestFormDialog;
