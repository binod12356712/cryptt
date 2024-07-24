import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminPanel.css";

const AdminDepositApproval = () => {
  const [pendingDeposits, setPendingDeposits] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentAction, setCurrentAction] = useState(null);
  const [currentDepositId, setCurrentDepositId] = useState(null);

  useEffect(() => {
    const fetchPendingDeposits = async () => {
      try {
        const response = await axios.get("https://trcnfx.com/api/deposits");
        setPendingDeposits(response.data);
      } catch (error) {
        console.error("Error fetching pending deposits:", error);
      }
    };

    fetchPendingDeposits();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.post(`https://trcnfx.com/api/deposits/${id}/approve`);
      alert("Deposit approved successfully");
      setPendingDeposits(
        pendingDeposits.filter((deposit) => deposit._id !== id)
      );
    } catch (error) {
      console.error("Error approving deposit:", error);
      alert("Failed to approve deposit");
    }
  };

  const handleDecline = async (id) => {
    try {
      await axios.delete(`https://trcnfx.com/api/deposits/${id}`);
      alert("Deposit declined successfully");
      setPendingDeposits(
        pendingDeposits.filter((deposit) => deposit._id !== id)
      );
    } catch (error) {
      console.error("Error declining deposit:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
      }
      alert("Failed to decline deposit");
    }
  };

  const handleActionClick = (action, id) => {
    setCurrentAction(action);
    setCurrentDepositId(id);
    setShowModal(true);
  };

  const handleConfirmAction = () => {
    if (currentAction === "approve") {
      handleApprove(currentDepositId);
    } else if (currentAction === "decline") {
      handleDecline(currentDepositId);
    }
    setShowModal(false);
  };

  const handleCancelAction = () => {
    setShowModal(false);
  };

  return (
    <div className="admin-panel">
      <h2>
        <b style={{ color: "black", fontSize: "18px" }}>Recharge Requests</b>
      </h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Amount</th>
            <th>Coin</th>
            <th>Status</th>
            <th>Proof</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pendingDeposits.map((deposit) => (
            <tr key={deposit._id}>
              <td>{deposit.uid}</td> {/* Display 7-digit user ID */}
              <td>
                {deposit.amount} {deposit.selectedSymbol}
              </td>
              <td>{deposit.selectedSymbol.toUpperCase()}</td>
              <td>{deposit.status}</td>
              <td>
                <a
                  href={deposit.proof}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Proof
                </a>
              </td>
              <td>
                <button
                  style={{ border: "1px solid #000" }}
                  onClick={() => handleActionClick("approve", deposit._id)}
                >
                  Approve
                </button>
                <button
                  style={{ border: "1px solid #000" }}
                  onClick={() => handleActionClick("decline", deposit._id)}
                >
                  Decline
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Confirmation</h3>
            <p>Are you sure you want to {currentAction} this deposit?</p>
            <button onClick={handleConfirmAction}>Yes</button>
            <button onClick={handleCancelAction}>No</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDepositApproval;
