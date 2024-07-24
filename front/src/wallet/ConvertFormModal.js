import React, { useState } from "react";
import axios from "axios";
import "./Modal.css";

const ConvertFormModal = ({ symbol, onClose }) => {
  const [amount, setAmount] = useState("");
  const userId = localStorage.getItem("userId");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("https://trcnfx.com/api/convert", {
        userId,
        symbol,
        amount: parseFloat(amount),
      });
      alert("Conversion request submitted successfully");
      onClose();
    } catch (error) {
      console.error("Error submitting conversion request:", error);
      alert("Failed to submit conversion request");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ color: "black" }}>
        <h2>Convert {symbol.toUpperCase()}</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Amount:</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <button type="submit">Submit</button>
          <button type="button" onClick={onClose}>
            Close
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConvertFormModal;
