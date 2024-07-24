import React, { useState } from "react";
import axios from "axios";
import "./Modal.css";

const DepositFormModal = ({ onClose, selectedSymbol }) => {
  const [amount, setAmount] = useState("");
  const [proof, setProof] = useState(null);
  const userId = localStorage.getItem("userId");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("amount", amount);
    formData.append("proof", proof);
    formData.append("userId", userId);

    try {
      await axios.post("https://trcnfx.com/api/deposit", formData);
      alert("Deposit request submitted successfully");
      onClose();
    } catch (error) {
      console.error("Error submitting deposit request:", error);
      alert("Failed to submit deposit request");
    }
  };

  const triggerFileUpload = () => {
    document.getElementById("file-upload").click();
  };

  const displayUploadedFile = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById("uploaded-image").src = e.target.result;
      document.getElementById("uploaded-image").style.display = "block";
      document.getElementById("upload-text").style.display = "none";
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Submit Recharge Order</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Currency</label>
            <input type="text" value={selectedSymbol.toUpperCase()} readOnly />
          </div>
          <div className="form-group">
            <label>Network</label>
            <input type="text" value={selectedSymbol.toUpperCase()} readOnly />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              value="3Fc54JEceHDhNUkdktZ2N3iHB6orwdDao4"
              readOnly
            />
          </div>
          <div className="form-group">
            <label>Amount</label>
            <input
              type="number"
              placeholder="Please enter the amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Upload Screenshot</label>
            <div className="upload-screenshot" onClick={triggerFileUpload}>
              <span className="upload-icon">&#128247;</span>
              <p id="upload-text">
                Please upload a screenshot of your successful transfer
              </p>
              <img
                id="uploaded-image"
                style={{ display: "none", maxWidth: "100%", height: "auto" }}
              />
            </div>
            <input
              type="file"
              id="file-upload"
              style={{ display: "none" }}
              accept="image/*"
              onChange={displayUploadedFile}
              required
            />
          </div>
          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default DepositFormModal;
