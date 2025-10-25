// firestoreService.js
import { db, auth } from "./config";
import { collection, addDoc, getDocs } from "firebase/firestore";

const donorsCollection = collection(db, "donors");

// ✅ Add donor with createdBy UID
export const addDonor = async (donorData) => {
  try {
    if (!auth.currentUser) throw new Error("User not authenticated");

    const docRef = await addDoc(donorsCollection, {
      ...donorData,
      createdBy: auth.currentUser.uid,
      createdAt: new Date(),
    });

    console.log("Donor added with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding donor:", error);
    // Friendly error message
    if (error.message.includes("ERR_BLOCKED_BY_CLIENT")) {
      throw new Error(
        "Your browser or an extension is blocking Firestore requests. Please disable ad blockers and try again."
      );
    }
    throw new Error(error.message);
  }
};

// ✅ Fetch all donors
export const getDonors = async () => {
  try {
    const snapshot = await getDocs(donorsCollection);
    const donors = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("All Donors:", donors);
    return donors;
  } catch (error) {
    console.error("Error fetching donors:", error);
    if (error.message.includes("ERR_BLOCKED_BY_CLIENT")) {
      throw new Error(
        "Your browser or an extension is blocking Firestore requests. Please disable ad blockers and try again."
      );
    }
    throw new Error(error.message);
  }
};
