import React, { useState } from "react";
import axios from "axios";
import "./Login.css"; // Make sure to import the CSS file for styling
import ForgotPasswordModal from "./ForgotPasswordModal";
import SignupModal from "./SignupModal"; // Import the SignupModal component
import MessageModal from "./MessageModal"; // Import the MessageModal component

export default function Login({ closeModal }) {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false); // State for showing/hiding SignupModal
  const [showMessageModal, setShowMessageModal] = useState(false); // State for showing/hiding MessageModal
  const [message, setMessage] = useState(""); // State for the message to be shown in the MessageModal

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://trcnfx.com/api/register/Signup",
        credentials
      );
      const data = response.data;
      if (
        data.message === "No such user found" ||
        data.message === "Incorrect password"
      ) {
        setMessage(data.message);
        setShowMessageModal(true);
      } else {
        localStorage.setItem("authToken", data.authToken);
        localStorage.setItem("userId", data.userdata.userId);
        localStorage.setItem("_id", data.userdata._id);
        localStorage.setItem("walletAddress", data.userdata.walletAddress);
        setMessage("Successfully logged in!");
        setShowMessageModal(true);
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setMessage("Error logging in. Please try again.");
      setShowMessageModal(true);
    }
  };

  const handleCloseMessageModal = () => {
    setShowMessageModal(false);
    closeModal();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={closeModal}>
          &times;
        </span>
        <h2>Login</h2>
        <form id="loginForm" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="submit-button"
            style={{ backgroundColor: "#27ae60" }}
          >
            Login
          </button>
        </form>
        <div className="signup-link">
          Don't have an account?{" "}
          <span onClick={() => setShowSignupModal(true)}>Sign up</span>
        </div>
        <div className="forgot-password-link">
          <span onClick={() => setShowForgotPassword(true)}>
            Forgot Password?
          </span>
        </div>
      </div>

      {showForgotPassword && (
        <ForgotPasswordModal closeModal={() => setShowForgotPassword(false)} />
      )}
      {showSignupModal && (
        <SignupModal closemod={() => setShowSignupModal(false)} />
      )}
      {showMessageModal && (
        <MessageModal message={message} onClose={handleCloseMessageModal} />
      )}
    </div>
  );
}
