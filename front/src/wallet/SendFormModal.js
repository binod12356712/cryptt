import React, { useState } from "react";
import axios from "axios";
import "./Modal.css";

const SendFormModal = ({ symbol, walletData, onClose }) => {
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const userId = localStorage.getItem("userId");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("https://trcnfx.com/api/send", {
        userId,
        symbol,
        amount: parseFloat(amount),
        address,
      });
      alert("Send request submitted successfully");
      onClose();
    } catch (error) {
      console.error("Error submitting send request:", error);
      alert("Failed to submit send request");
    }
  };

  const handlePaste = async () => {
    const text = await navigator.clipboard.readText();
    setAddress(text);
  };

  const handleMax = () => {
    const maxAmount = walletData.balances[symbol] || 0;
    setAmount(maxAmount);
  };

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ color: "black" }}>
        <h2>Send {symbol.toUpperCase()}</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Amount:</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <button type="button" onClick={handleMax}>
              Max
            </button>
          </div>
          <div>
            <label>Wallet Address:</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
            <button type="button" onClick={handlePaste}>
              Paste
            </button>
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

export default SendFormModal;
