import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import ProfitChart from "./ProfitChart";
import logo3 from "./logo3.png";
import axios from "axios";

const ProfitStatistics = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("_id");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const sidebarRef = useRef();
  const uid = localStorage.getItem("userId");
  const id1 = localStorage.getItem("_id");
  const [kycStatus, setKycStatus] = useState(""); // State to manage KYC status
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to manage login status

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Check if the user is logged in by checking the localStorage for authToken
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      setIsLoggedIn(true);
    }

    const fetchKycStatus = async () => {
      try {
        const response = await axios.get(`https://trcnfx.com/api/kyc/${id1}`);
        setKycStatus(response.data.status);
      } catch (error) {
        console.error("Error fetching KYC status:", error);
      }
    };

    if (uid) {
      fetchKycStatus();
    }
  }, [uid]);
  const renderKycStatus = () => {
    if (kycStatus === "approved") {
      return (
        <p className="kyc-status">
          Verified{" "}
          <i className="fas fa-check-circle" style={{ color: "white" }}></i>
        </p>
      );
    }
    return null;
  };
  return (
    <div className="container">
      <header style={{ borderRadius: "0px" }}>
        <div
          className="title-container"
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            width: "100%",
            borderRadius: "0px",
          }}
        >
          <button
            className="back-button"
            onClick={() => navigate(-1)}
            style={{
              marginRight: "10px",
              fontSize: "24px",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "white",
            }}
          >
            &#8592;
          </button>
          <h1>
            <Link to="/" style={{ color: "white", textDecoration: "none" }}>
              TrustCoinFX
            </Link>
          </h1>
          <button className="menu-button" onClick={toggleMenu}>
            &#9776;
          </button>
        </div>
      </header>

      <div
        id="sidebar"
        className={`sidebar ${isMenuOpen ? "open" : ""}`}
        ref={sidebarRef}
      >
        <div className="sidebar-header">
          <img src={logo3} alt="logo" />
          <p>
            <b>UID: {uid}</b>
          </p>
          {renderKycStatus()}
        </div>

        <div className="functions">
          <ul>
            <li>
              <button className="link" onClick={() => navigate("/wallet")}>
                <i className="fas fa-wallet"></i> Wallet
              </button>
            </li>
            <li>
              <button className="link" onClick={() => navigate("/tradepage")}>
                <i className="fas fa-exchange-alt"></i> Trade
              </button>
            </li>
            <li>
              <button className="link" onClick={() => navigate("/result")}>
                <i className="fas fa-chart-line"></i> Result
              </button>
            </li>
            <li>
              <button className="link" onClick={() => navigate("/transaction")}>
                <i className="fas fa-pen"></i> Transactions
              </button>
            </li>
            <li>
              <button className="link" onClick={() => navigate("/terms")}>
                <i className="fas fa-book"></i> Privacy Policy
              </button>
            </li>
            <li>
              <button
                className="link"
                onClick={() => navigate("/profit-stats")}
              >
                <i className="fas fa-chart-bar"></i> Profit Statistics
              </button>
            </li>
          </ul>
          <div className="more-options">
            <ul>
              <li>
                <Link to="/settings">
                  <i className="fa-solid fa-gear"></i> Settings
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="main-content">
        <ProfitChart userId={userId} />
      </div>
    </div>
  );
};

export default ProfitStatistics;
