
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

// Replace these values with your Firebase project's web configuration.
const firebaseConfig = {
     apiKey: "AIzaSyBSW_DYLMOY8IE4hEivDXz4R5eZvdR-PD4",
    authDomain: "student-registration-58c90.firebaseapp.com",
    projectId: "student-registration-58c90",
    storageBucket: "student-registration-58c90.firebasestorage.app",
    messagingSenderId: "366227272399",
    appId: "1:366227272399:web:cdda1e75a758d142073dba",
    measurementId: "G-FFYRB31NPG"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const form = document.getElementById("registrationForm");
const statusMessage = document.getElementById("status");
const submitBtn = document.getElementById("submitBtn");
const dobInput = document.getElementById("dob");

// Prevent selecting a future date of birth.
dobInput.max = new Date().toLocaleDateString("en-CA");

function showStatus(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = type;
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const dob = dobInput.value;
    const gender = document.getElementById("gender").value;
    const course = document.getElementById("course").value;

    if (fullName.length < 2) {
        showStatus("Please enter your full name.", "error");
        return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
        showStatus("Enter a valid 10-digit phone number.", "error");
        return;
    }

    if (dob > new Date().toISOString().slice(0, 10)) {
        showStatus("Date of birth cannot be in the future.", "error");
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Registering...";
    showStatus("", "");

    try {
        await addDoc(collection(db, "studentRegistrations"), {
            fullName,
            email,
            phone,
            dob,
            gender,
            course,
            createdAt: serverTimestamp()
        });

        showStatus(
            "Registration successful! Your details have been saved.",
            "success"
        );

        form.reset();
    } catch (error) {
        console.error("Registration error:", error);
        showStatus(
            "Registration failed. Check your Firebase configuration, internet connection, and Firestore rules.",
            "error"
        );
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Register Now";
    }
});
