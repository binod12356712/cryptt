import React, { useState } from "react";
import axios from "axios";
// import "./ForgotPassword.css"; // Make sure to import the CSS file for styling

export default function ForgotPasswordModal({ closeModal }) {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1); // Step 1: Enter email, Step 2: Enter verification code, Step 3: Enter new password

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://trcnfx.com/api/forgot-password", {
        email,
      });
      setStep(2);
    } catch (error) {
      console.error("Error sending verification code:", error);
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://trcnfx.com/api/verify-code", {
        email,
        code: verificationCode,
      });
      if (response.data.success) {
        setStep(3);
      } else {
        alert("Invalid verification code");
      }
    } catch (error) {
      console.error("Error verifying code:", error);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      await axios.post("https://trcnfx.com/api/reset-password", {
        email,
        newPassword,
      });
      alert("Password reset successfully");
      closeModal();
    } catch (error) {
      console.error("Error resetting password:", error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={closeModal}>
          &times;
        </span>
        {step === 1 && (
          <>
            <h2>Forgot Password</h2>
            <form onSubmit={handleEmailSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <button
                type="submit"
                className="submit-button"
                style={{ backgroundColor: "#27ae60" }}
              >
                Send Verification Code
              </button>
            </form>
          </>
        )}
        {step === 2 && (
          <>
            <h2>Enter Verification Code</h2>
            <form onSubmit={handleCodeSubmit}>
              <div className="form-group">
                <label htmlFor="verificationCode">Verification Code</label>
                <input
                  type="text"
                  id="verificationCode"
                  name="verificationCode"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter the code sent to your email"
                  required
                />
              </div>
              <button
                type="submit"
                className="submit-button"
                style={{ backgroundColor: "#27ae60" }}
              >
                Verify Code
              </button>
            </form>
          </>
        )}
        {step === 3 && (
          <>
            <h2>Reset Password</h2>
            <form onSubmit={handlePasswordSubmit}>
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  required
                />
              </div>
              <button
                type="submit"
                className="submit-button"
                style={{ backgroundColor: "#27ae60" }}
              >
                Reset Password
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
