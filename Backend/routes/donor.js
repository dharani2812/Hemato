import express from "express";
import { db } from "../db.js"; // your Firestore instance
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Gmail address
    pass: process.env.EMAIL_PASS  // Gmail app password
  }
});

// Add donor & send verification email
router.post("/add", async (req, res) => {
  const { name, email, bloodGroup, district, dob } = req.body; // added dob if needed

  if (!name || !email || !bloodGroup || !district) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const token = uuidv4(); // unique verification token
    const donorData = {
      name,
      email,
      bloodGroup,
      district,
      dob: dob || "",        // optional DOB
      isVerified: false,
      verificationToken: token,
      createdAt: new Date()
    };

    // Save donor in Firestore
    const docRef = await db.collection("donors").add(donorData);

    // Send verification email
    const verificationUrl = `https://yourdomain.com/verify-email?token=${token}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify your email for Hemato Donation",
      html: `
        <p>Hi ${name},</p>
        <p>Thanks for registering as a blood donor. Please verify your email by clicking the link below:</p>
        <a href="${verificationUrl}">Verify Email</a>
        <p>If you did not register, ignore this email.</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Donor added. Verification email sent." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Email verification route
router.get("/verify-email", async (req, res) => {
  const { token } = req.query;

  if (!token) return res.status(400).send("Invalid request");

  try {
    const donorQuery = db.collection("donors").where("verificationToken", "==", token);
    const snapshot = await donorQuery.get();

    if (snapshot.empty) return res.status(404).send("Invalid token");

    // Update all matching documents
    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.update(doc.ref, {
        isVerified: true,
        verificationToken: ""
      });
    });
    await batch.commit();

    res.send("Email verified successfully! You can close this page.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

export default router;
