import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Modal.css";

const WithdrawFormModal = ({ symbol, onClose }) => {
  const [amount, setAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState(0);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const response = await axios.get(
          `https://trcnfx.com/api/wallet/${userId}`
        );
        const wallet = response.data;
        setMaxAmount(wallet.balances[symbol] || 0);
      } catch (error) {
        console.error("Error fetching wallet data:", error);
      }
    };

    fetchWalletData();
  }, [userId, symbol]);

  const handleMaxClick = () => {
    setAmount(maxAmount);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("https://trcnfx.com/api/withdraw", {
        userId,
        symbol,
        amount: parseFloat(amount),
      });
      alert(
        `Withdraw completed successfully: You received ${response.data.usdAmount} USD`
      );
      onClose();
    } catch (error) {
      console.error("Error submitting withdraw request:", error);
      alert("Failed to submit withdraw request");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Withdraw {symbol.toUpperCase()}</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Amount:</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <button type="button" onClick={handleMaxClick}>
              Max
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

export default WithdrawFormModal;
