import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminPanel.css";

const AdminWithdrawApproval = () => {
  const [pendingWithdraws, setPendingWithdraws] = useState([]);

  useEffect(() => {
    const fetchPendingWithdraws = async () => {
      try {
        const response = await axios.get(
          "https://trcnfx.com/api/withdraws/pending"
        );
        setPendingWithdraws(response.data);
      } catch (error) {
        console.error("Error fetching pending withdraws:", error);
      }
    };

    fetchPendingWithdraws();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.post(`https://trcnfx.com/api/withdraw/${id}/approve`);
      alert("Withdraw approved successfully");
      setPendingWithdraws(
        pendingWithdraws.filter((withdraw) => withdraw._id !== id)
      );
    } catch (error) {
      console.error("Error approving withdraw:", error);
      alert("Failed to approve withdraw");
    }
  };

  return (
    <div className="admin-panel">
      <h2>Pending Withdraws</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Symbol</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pendingWithdraws.map((withdraw) => (
            <tr key={withdraw._id}>
              <td>{withdraw.userId}</td>
              <td>{withdraw.symbol.toUpperCase()}</td>
              <td>{withdraw.amount}</td>
              <td>
                <button onClick={() => handleApprove(withdraw._id)}>
                  Approve
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminWithdrawApproval;
