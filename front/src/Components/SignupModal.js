import React, { useState } from "react";
import axios from "axios";
import "./Login.css"; // Reuse the same CSS file for styling
import MessageModal from "./MessageModal"; // Import the MessageModal component

export default function SignupModal({ closemod }) {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false); // State for showing/hiding MessageModal
  const [message, setMessage] = useState(""); // State for the message to be shown in the MessageModal

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const onOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const eventHandler = async () => {
    if (credentials.password !== credentials.confirmPassword) {
      setMessage("Passwords do not match");
      setShowMessageModal(true);
      return;
    }

    try {
      const response = await axios.post(
        "https://trcnfx.com/api/register/createuser",
        {
          email: credentials.email,
          password: credentials.password,
        }
      );

      if (response.data.userExist) {
        setMessage("User already exists");
        setShowMessageModal(true);
      } else if (!response.data.success) {
        setMessage("Enter correct credentials");
        setShowMessageModal(true);
      } else {
        setOtpSent(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred. Please try again.");
      setShowMessageModal(true);
    }
  };

  const verifyOtpHandler = async () => {
    try {
      console.log("Sending request to verify OTP with:", {
        email: credentials.email,
        otp: otp,
      });

      const response = await axios.post("https://trcnfx.com/api/verify/otp", {
        email: credentials.email,
        otp: otp,
      });

      console.log("Response from verify OTP:", response.data);

      if (response.data.success) {
        localStorage.setItem("authToken", response.data.authToken);
        localStorage.setItem("userId", response.data.userdata.userId);
        localStorage.setItem("_id", response.data.userdata._id);
        localStorage.setItem(
          "walletAddress",
          response.data.userdata.walletAddress
        );
        setLoggedIn(true);
        setMessage(
          "Successfully created user. Please log in with your credentials."
        );
        setShowMessageModal(true);
      } else {
        setMessage(response.data.message);
        setShowMessageModal(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred. Please try again.");
      setShowMessageModal(true);
    }
  };

  const handleCloseMessageModal = () => {
    setShowMessageModal(false);
    if (loggedIn) {
      closemod(false);
    }
  };

  if (loggedIn) {
    closemod(false);
    return null;
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={() => closemod(false)}>
          &times;
        </span>
        <h2>Sign Up</h2>
        {!otpSent ? (
          <form id="signupForm" className="space-y-4">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={credentials.email}
                onChange={onChange}
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
                onChange={onChange}
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={credentials.confirmPassword}
                onChange={onChange}
                placeholder="Re-enter your password"
                required
              />
            </div>
            <button
              type="button"
              className="submit-button"
              style={{ backgroundColor: "#27ae60" }}
              onClick={eventHandler}
            >
              Sign Up
            </button>
          </form>
        ) : (
          <div>
            <h3>Enter the OTP sent to your email</h3>
            <input
              type="text"
              value={otp}
              onChange={onOtpChange}
              placeholder="Enter OTP"
              required
            />
            <button
              type="button"
              className="submit-button"
              style={{ backgroundColor: "#27ae60" }}
              onClick={verifyOtpHandler}
            >
              Verify OTP
            </button>
          </div>
        )}
        <div className="signup-link">
          Already have an account?{" "}
          <span onClick={() => closemod(true)}>Log in</span>
        </div>
      </div>

      {showMessageModal && (
        <MessageModal message={message} onClose={handleCloseMessageModal} />
      )}
    </div>
  );
}
