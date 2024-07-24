import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../wallet/WalletDashboard.css"; // Import the CSS file for styling
import { Sparklines, SparklinesLine } from "react-sparklines"; // Import Sparklines for the graphs
import Login from "./Login"; // Import the Login component
import SignupModal from "./SignupModal"; // Import the SignupModal component
import logo3 from "./logo3.png";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function Card() {
  const url =
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true";
  const [info, setInfo] = useState([]);
  const [showCryptoModal, setShowCryptoModal] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to manage menu visibility
  const [showLoginModal, setShowLoginModal] = useState(false); // State to manage login modal visibility
  const [showSignupModal, setShowSignupModal] = useState(false); // State to manage signup modal visibility
  const navigate = useNavigate();
  const sidebarRef = useRef();
  const uid = localStorage.getItem("_id");
  const userrid = localStorage.getItem("userId");
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to manage login status
  const [kycStatus, setKycStatus] = useState(""); // State to manage KYC status

  useEffect(() => {
    axios.get(url).then((response) => {
      setInfo(response.data.filter((crypto) => crypto.symbol !== "usdt")); // Filter out USDT
    });

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
        const response = await axios.get(
          `http://localhost:3001/api/kyc/${uid}`
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const getGraphIndicator = (sparkline, priceChange) => {
    const color = priceChange >= 0 ? "green" : "red";
    return (
      <Sparklines data={sparkline} svgWidth={100} svgHeight={30}>
        <SparklinesLine color={color} />
      </Sparklines>
    );
  };

  const handleNavigation = (route) => {
    if (isLoggedIn) {
      navigate(route);
    } else {
      setShowLoginModal(true);
    }
  };

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

  if (info.length === 0) {
    return <div>Loading...</div>;
  } else {
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
              <b>UID: {userrid}</b>
            </p>
            {renderKycStatus()}
          </div>

          <div className="functions">
            <ul>
              <li>
                <button
                  className="link"
                  onClick={() => handleNavigation("/wallet")}
                >
                  <i className="fas fa-wallet"></i> Wallet
                </button>
              </li>
              <li>
                <button
                  className="link"
                  onClick={() => handleNavigation("/tradepage")}
                >
                  <i className="fas fa-exchange-alt"></i> Trade
                </button>
              </li>
              <li>
                <button
                  className="link"
                  onClick={() => handleNavigation("/result")}
                >
                  <i className="fas fa-chart-line"></i> Result
                </button>
              </li>
              <li>
                <button
                  className="link"
                  onClick={() => handleNavigation("/transaction")}
                >
                  <i className="fas fa-pen"></i> Transactions
                </button>
              </li>
              <li>
                <button
                  className="link"
                  onClick={() => handleNavigation("/terms")}
                >
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
            <h2>Discover Seamless Crypto Trading</h2>
            <h2>With TrustCoinFX</h2>
            <p>Where Your Trust is Our Currency</p>
          </div>
          <div className="market-tabs">
            <button className="active">Digital Market</button>
          </div>
          <div className="market-list">
            {info.map((value, key) => {
              if (key < 20) {
                return (
                  <div
                    key={key}
                    className="market-item"
                    onClick={() => navigate("/predict", { state: { value } })}
                  >
                    <div className="market-info" style={{ display: "flex" }}>
                      <img
                        src={value.image}
                        alt={`${value.symbol} logo`}
                        style={{
                          width: "24px",
                          height: "24px",
                          marginRight: "10px",
                        }}
                      />
                      <div>
                        <h3>{value.symbol.toUpperCase()} Coin</h3>
                        <p>USDT</p>
                      </div>
                    </div>
                    <div className="market-graph">
                      {getGraphIndicator(
                        value.sparkline_in_7d.price,
                        value.price_change_percentage_24h
                      )}
                    </div>
                    <div className="market-stats">
                      <p>US$ {value.current_price.toFixed(2)}</p>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          textAlign: "center",
                          alignItems: "center",
                        }}
                      >
                        <p
                          className={
                            value.price_change_percentage_24h < 0
                              ? "negative"
                              : "positive"
                          }
                          style={{ fontSize: "13px", marginRight: "10px" }}
                        >
                          {value.price_change_percentage_24h.toFixed(2)}%
                        </p>
                        <p>24 Hrs</p>
                      </div>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </div>

        {showCryptoModal && selectedCrypto && (
          <div className="modal" id="crypto-modal">
            <div className="modal-content">
              <span className="close" onClick={() => setShowCryptoModal(false)}>
                &times;
              </span>
              <div className="wallet">
                <div className="wallet-header">
                  <h1>{selectedCrypto.name} Wallet</h1>
                </div>
                <div className="wallet-balance">
                  <p>${selectedCrypto.current_price}</p>
                  <p>
                    Available: {selectedCrypto.circulating_supply}{" "}
                    {selectedCrypto.symbol.toUpperCase()}
                  </p>
                  <p>High 24h: ${selectedCrypto.high_24h}</p>
                  <p>Low 24h: ${selectedCrypto.low_24h}</p>
                </div>
                <div className="wallet-qr">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?data=${selectedCrypto.symbol}Address&size=150x150`}
                      alt="QR Code"
                    />
                  </div>
                  <p id="btc-address">3ghadsb893p2lsand</p>
                  <p
                    className="copy-address"
                    onClick={() =>
                      navigator.clipboard.writeText("3ghadsb893p2lsand")
                    }
                  >
                    Copy address
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {showLoginModal && (
          <Login closeModal={() => setShowLoginModal(false)} />
        )}

        {showSignupModal && (
          <SignupModal closeModal={() => setShowSignupModal(false)} />
        )}
      </div>
    );
  }
}
