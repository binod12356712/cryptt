import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PredictionSummary from "./PredictionSummary";
import "../wallet/WalletDashboard.css";
import { Link } from "react-router-dom";
import Login from "./Login"; // Import the Login component
import SignupModal from "./SignupModal"; // Import the SignupModal component
import "@fortawesome/fontawesome-free/css/all.min.css";
import logo3 from "./logo3.png";

const Result = () => {
  const [predictions, setPredictions] = useState([]);
  const [logos, setLogos] = useState({});
  const [selectedTab, setSelectedTab] = useState("wait");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const userId = localStorage.getItem("_id");
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false); // State to manage login modal visibility
  const [showSignupModal, setShowSignupModal] = useState(false); // State to manage signup modal visibility
  const sidebarRef = useRef();
  const uid = localStorage.getItem("userId");
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to manage login status
  const [kycStatus, setKycStatus] = useState(""); // State to manage KYC status
  const id1 = localStorage.getItem("_id");
  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/predictions/user/${userId}`
        );
        console.log("Fetched predictions:", response.data);
        const sortedPredictions = response.data.sort(
          (a, b) => new Date(b.predictedAt) - new Date(a.predictedAt)
        );
        setPredictions(sortedPredictions);
      } catch (error) {
        console.error("Error fetching predictions:", error);
      }
    };

    fetchPredictions();
  }, [userId]);

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

  const renderPredictions = (filterFn, showResult) =>
    predictions.filter(filterFn).map((prediction) => (
      <li key={prediction._id} className="prediction-item">
        <PredictionSummary
          prediction={prediction}
          logo={logos[prediction.symbol.toUpperCase()]}
          showResult={showResult}
        />
      </li>
    ));

  const isCountdownOver = (prediction) => {
    const timeElapsed = Math.floor(
      (Date.now() - new Date(prediction.predictedAt)) / 1000
    );
    return timeElapsed >= prediction.deliveryTime;
  };

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

  return (
    <div>
      <header>
        <div
          className="title-container"
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            width: "100%",
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
            <b>UID: {uid}</b>
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

      <div>
        <h2 className="title" style={{ marginTop: "5px" }}>
          My Contract
        </h2>
        <div className="button-group">
          <button
            className={`tab-button ${selectedTab === "wait" ? "active" : ""}`}
            onClick={() => setSelectedTab("wait")}
            style={
              selectedTab === "wait"
                ? { backgroundColor: "#4caf50", color: "white" }
                : { backgroundColor: "white", color: "#4caf50" }
            }
          >
            Wait
          </button>
          <button
            className={`tab-button ${
              selectedTab === "finished" ? "active" : ""
            }`}
            onClick={() => setSelectedTab("finished")}
            style={
              selectedTab === "finished"
                ? { backgroundColor: "#4caf50", color: "white" }
                : { backgroundColor: "white", color: "#4caf50" }
            }
          >
            Finished
          </button>
        </div>
        {selectedTab === "wait" ? (
          <ul className="prediction-list">
            {predictions.filter((prediction) => !isCountdownOver(prediction))
              .length === 0 ? (
              <p className="no-predictions">
                No pending predictions found for this user.
              </p>
            ) : (
              renderPredictions(
                (prediction) => !isCountdownOver(prediction),
                false
              )
            )}
          </ul>
        ) : (
          <ul className="prediction-list">
            {predictions.filter((prediction) => isCountdownOver(prediction))
              .length === 0 ? (
              <p className="no-predictions">
                No finished predictions found for this user.
              </p>
            ) : (
              renderPredictions(
                (prediction) => isCountdownOver(prediction),
                true
              )
            )}
          </ul>
        )}
      </div>
      {showLoginModal && <Login closeModal={() => setShowLoginModal(false)} />}

      {showSignupModal && (
        <SignupModal closeModal={() => setShowSignupModal(false)} />
      )}
    </div>
  );
};

export default Result;
