import React from "react";
import { useNavigate } from "react-router-dom";
import "./MessageModal.css"; // Create a CSS file for styling the modal

export default function MessageModal({ message, onClose }) {
  const navigate = useNavigate();

  const handleClose = () => {
    onClose();
    navigate("/");
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={handleClose}>
          &times;
        </span>
        <p>{message}</p>
        <button onClick={handleClose} className="ok-button">
          OK
        </button>
      </div>
    </div>
  );
}
