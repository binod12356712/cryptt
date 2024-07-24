import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import TransactionSummary from "./TransactionSummary";
import logo3 from "./logo3.png";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Login from "./Login"; // Import the Login component
import SignupModal from "./SignupModal"; // Import the SignupModal component
const Transactions = () => {
  const [transactions, setTransactions] = useState({
    deposits: [],
    sends: [],
    conversions: [],
  });
  const [logos, setLogos] = useState({});
  const [selectedTab, setSelectedTab] = useState("deposits");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const uidd = localStorage.getItem("userId");
  const userId = localStorage.getItem("_id");
  const navigate = useNavigate();
  const sidebarRef = useRef();
  const [showLoginModal, setShowLoginModal] = useState(false); // State to manage login modal visibility
  const [showSignupModal, setShowSignupModal] = useState(false); // State to manage signup modal visibility
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to manage login status
  const [kycStatus, setKycStatus] = useState(""); // State to manage KYC status

  const id1 = localStorage.getItem("_id");
  const uid = localStorage.getItem("userId");
  useEffect(() => {
    // Check if the user is logged in by checking the localStorage for authToken
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      setIsLoggedIn(true);
    }
  }, []);
  useEffect(() => {
    // Check if the user is logged in by checking the localStorage for authToken
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      setIsLoggedIn(true);
    }

    const fetchKycStatus = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/kyc/${id1}`
        );
        setKycStatus(response.data.status);
      } catch (error) {
        console.error("Error fetching KYC status:", error);
      }
    };

    if (uid) {
      fetchKycStatus();
    }
  }, [uid]);
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!userId) {
        console.error("User ID is not available in localStorage");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:3001/api/transactions/${userId}`
        );
        if (response && response.data) {
          setTransactions(response.data);
        } else {
          console.error("No data returned from the API");
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [userId]);

  useEffect(() => {
    const fetchLogos = async () => {
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets",
          {
            params: {
              vs_currency: "usd",
              order: "market_cap_desc",
              per_page: 250,
              page: 1,
              sparkline: false,
            },
          }
        );
        const logoMap = {};
        response.data.forEach((coin) => {
          logoMap[coin.symbol.toUpperCase()] = coin.image;
        });
        setLogos(logoMap);
      } catch (error) {
        console.error("Error fetching logos:", error);
      }
    };

    fetchLogos();
  }, []);

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

  const renderDeposits = () =>
    transactions.deposits.map((transaction) => (
      <li key={transaction._id} className="transaction-item">
        <TransactionSummary
          transaction={transaction}
          logo={logos[transaction.selectedSymbol?.toUpperCase()]}
        />
      </li>
    ));

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
  const renderSends = () =>
    transactions.sends.map((transaction) => (
      <li key={transaction._id} className="transaction-item">
        <TransactionSummary
          transaction={transaction}
          logo={logos[transaction.symbol?.toUpperCase()]}
        />
      </li>
    ));

  const renderConversions = () =>
    transactions.conversions.map((transaction) => (
      <li key={transaction._id} className="transaction-item">
        <TransactionSummary
          transaction={transaction}
          logo={logos[transaction.fromSymbol?.toUpperCase()]}
        />
      </li>
    ));

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <header>
        <div
          className="title-container"
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            width: "100%",
          }}
        >
          <h1>
            <Link to="/">TrustCoinFX</Link>
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
            <b>UID: {uidd}</b>
          </p>
          {renderKycStatus()}
        </div>
        <div className="functions">
          <ul>
            <li>
              <Link to="/wallet" className="link">
                <i className="fas fa-wallet"></i> Wallet
              </Link>
            </li>
            <li>
              <Link to="/tradepage">
                <i className="fas fa-exchange-alt"></i> Trade
              </Link>
            </li>
            <li>
              <Link to="/result">
                <i className="fas fa-chart-line"></i> Result
              </Link>
            </li>
            <li>
              <Link to="/transaction">
                <i className="fas fa-pen"></i> Transactions
              </Link>
            </li>
            <li>
              <Link to="/terms">
                <i className="fas fa-book"></i> Privacy Policy
              </Link>
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
              {isLoggedIn ? (
                <li>
                  <Link to="/settings">
                    <i className="fa-solid fa-gear"></i> Settings
                  </Link>
                </li>
              ) : (
                <li>
                  <button onClick={() => setShowLoginModal(true)}>
                    <i className="fa-solid fa-person"></i> Login
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="banner">
          <h2>Transaction History</h2>
          <p>Manage your deposits, withdraws, and conversions</p>
        </div>
        <div className="button-group">
          <button
            className={`tab-button ${
              selectedTab === "deposits" ? "active" : ""
            }`}
            onClick={() => setSelectedTab("deposits")}
          >
            Deposits
          </button>
          <button
            className={`tab-button ${selectedTab === "sends" ? "active" : ""}`}
            onClick={() => setSelectedTab("sends")}
          >
            Withdraws
          </button>
          <button
            className={`tab-button ${
              selectedTab === "conversions" ? "active" : ""
            }`}
            onClick={() => setSelectedTab("conversions")}
          >
            Conversions
          </button>
        </div>
        <ul className="transaction-list">
          {transactions[selectedTab].length === 0 ? (
            <p className="no-transactions">
              No {selectedTab} found for this user.
            </p>
          ) : (
            (selectedTab === "deposits" && renderDeposits()) ||
            (selectedTab === "sends" && renderSends()) ||
            (selectedTab === "conversions" && renderConversions())
          )}
        </ul>
      </div>
      {showLoginModal && <Login closeModal={() => setShowLoginModal(false)} />}

      {showSignupModal && (
        <SignupModal closeModal={() => setShowSignupModal(false)} />
      )}
    </div>
  );
};

export default Transactions;
