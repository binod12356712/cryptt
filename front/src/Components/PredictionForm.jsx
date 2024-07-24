import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import CryptoChart from "./CryptoChart";
import "../wallet/WalletDashboard.css"; // Import the CSS file for styling
import Login from "./Login"; // Import the Login component
import SignupModal from "./SignupModal"; // Import the SignupModal component
import resultimg from "./result.png";
import logo3 from "./logo3.png";
import usdtImg from "./usdtImg.png";
import "@fortawesome/fontawesome-free/css/all.min.css";

const PredictionForm = () => {
  const [direction, setDirection] = useState("up");
  const [amount, setAmount] = useState("");
  const [deliveryTime, setDeliveryTime] = useState(60);
  const [predictionId, setPredictionId] = useState(null);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [interest, setInterest] = useState(0); // State to hold interest rate
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to manage menu visibility
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to manage login status
  const [showLoginModal, setShowLoginModal] = useState(false); // State to manage login modal visibility
  const [showSignupModal, setShowSignupModal] = useState(false); // State to manage signup modal visibility
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location || {};
  const { value } = state || {};
  const walletAddress = localStorage.getItem("walletAddress");
  const sidebarRef = useRef();
  const uid = localStorage.getItem("userId");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // State for success popup
  const [modalIconColor, setModalIconColor] = useState("green"); // green for success, red for error
  const [modalMessage, setModalMessage] = useState("");

  // Delivery times with interest rates and minimum amounts
  const deliveryTimes = [
    { time: 60, interest: 0.1, minAmount: 50 },
    { time: 120, interest: 0.35, minAmount: 1000 },
    { time: 129600, interest: 2.15, minAmount: 50000 },
    { time: 604800, interest: 3.15, minAmount: 100000 },
    { time: 2592000, interest: 5.2, minAmount: 200000 },
  ];

  const formatDeliveryTime = (seconds) => {
    const days = seconds / 86400;
    if (days >= 1 && Number.isInteger(days)) return `${days}D`;
    if (days >= 1) return `${Math.floor(seconds / 3600)}H`; // Shows integer hours if days is not a whole number
    if (seconds >= 3600) return `${seconds / 3600}H`;
    // if (seconds >= 60) return `${seconds / 60} m`;
    return `${seconds}S`;
  };

  // Calculate and update interest when deliveryTime changes
  useEffect(() => {
    const selectedTime = deliveryTimes.find(
      (dt) => dt.time === Number(deliveryTime)
    );
    if (selectedTime) {
      setInterest(selectedTime.interest);
    }
  }, [deliveryTime]);

  useEffect(() => {
    // Check if the user is logged in by checking the localStorage for authToken
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      setIsLoggedIn(true);
    }
  }, []);

  // Effect to handle submitting prediction and fetching result
  useEffect(() => {
    if (predictionId) {
      const interval = setInterval(async () => {
        try {
          const response = await axios.get(
            `https://trcnfx.com/api/prediction/${predictionId}`
          );
          if (response.data) {
            setResult(response.data);
            clearInterval(interval); // Stop checking after getting the result
          }
        } catch (error) {
          console.error("Error fetching prediction result:", error);
        }
      }, 5000); // Check every 5 seconds

      return () => clearInterval(interval);
    }
  }, [predictionId]);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const userId = localStorage.getItem("_id");
    const walletAddress = localStorage.getItem("walletAddress");
    const uid = localStorage.getItem("userId"); // Get the uid here
    console.log(uid);
    try {
      const priceResponse = await axios.get(
        "https://api.coingecko.com/api/v3/coins/markets",
        {
          params: {
            vs_currency: "usd",
            ids: value.id,
            order: "market_cap_desc",
            per_page: 1,
            page: 1,
            sparkline: false,
          },
        }
      );
      const currentPrice = priceResponse.data[0].current_price;

      const response = await axios.post("https://trcnfx.com/api/predict", {
        symbol: value.id,
        direction,
        amount: Number(amount),
        deliveryTime,
        currentPrice,
        uid, // Pass uid here
        userId,
        walletAddress,
      });
      setPredictionId(response.data._id);
      setModalMessage("Order Submitted");
      setModalIconColor("green"); // Success color
      setShowSuccessPopup(true); // Show success popup
      closeModal(); // Close the modal after submission
    } catch (error) {
      console.error("Error submitting prediction:", error);
      if (error.response && error.response.data && error.response.data.error) {
        setModalMessage(error.response.data.error); // Display the error message
        setModalIconColor("red"); // Error color
        setShowSuccessPopup(true); // Show error popup
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Function to close the modal
  const closeModal = () => setShowModal(false);

  // Function to open the modal
  const openModal = () => setShowModal(true);

  // Function to toggle the sidebar menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleProtectedAction = (action) => {
    if (isLoggedIn) {
      action();
    } else {
      setShowLoginModal(true);
    }
  };

  // Retrieve selected delivery time details
  const selectedTime = deliveryTimes.find(
    (dt) => dt.time === Number(deliveryTime)
  );

  // Handle clicks outside the sidebar to close it
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
        </div>

        <div className="functions">
          <ul>
            <li>
              <button
                className="link"
                onClick={() => handleProtectedAction(() => navigate("/wallet"))}
              >
                <i className="fas fa-wallet"></i> Wallet
              </button>
            </li>
            <li>
              <button
                className="link"
                onClick={() =>
                  handleProtectedAction(() => navigate("/tradepage"))
                }
              >
                <i className="fas fa-exchange-alt"></i> Trade
              </button>
            </li>
            <li>
              <button
                className="link"
                onClick={() => handleProtectedAction(() => navigate("/result"))}
              >
                <i className="fas fa-chart-line"></i> Result
              </button>
            </li>
            <li>
              <button
                className="link"
                onClick={() =>
                  handleProtectedAction(() => navigate("/transaction"))
                }
              >
                <i className="fas fa-pen"></i> Transactions
              </button>
            </li>
            <li>
              <button
                className="link"
                onClick={() => handleProtectedAction(() => navigate("/terms"))}
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
        <div
          className="button-container"
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            width: "100%",
          }}
        >
          <button
            className="fa-solid fa-square-poll-vertical fa-2x"
            onClick={() => handleProtectedAction(() => navigate("/result"))}
            style={{
              color: "#4caf50",
              cursor: "pointer",
            }}
          ></button>
        </div>

        <div
          className="w-[100%] mx-auto bg-[#1b202d] p-6 items-center"
          style={{
            color: "black",
            backgroundColor: "white",
            margin: 0,
            padding: 0,
          }}
        >
          <div className="chart-container" style={{ margin: 0, padding: 0 }}>
            <CryptoChart symbol={value?.id} />
          </div>
          <button
            className="text-white font-bold py-2 px-4 rounded mb-4"
            onClick={() => handleProtectedAction(openModal)}
            style={{
              width: "300px",
              height: "50px",
              marginTop: "30px",
              background: "linear-gradient(to right, #4caf50, #81c784)",
            }}
          >
            Trade Now
          </button>
        </div>
      </div>
      {showSuccessPopup && (
        <div
          className="modal show"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            zIndex: "1000",
          }}
        >
          <div
            className="modal-content"
            style={{
              backgroundColor: "#fefefe",
              margin: "5% auto",
              padding: "20px",
              border: "1px solid #888",
              width: "80%",
              maxWidth: "400px",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              textAlign: "center",
            }}
          >
            <span
              className="close"
              onClick={() => setShowSuccessPopup(false)}
              style={{
                color: "#aaa",
                float: "right",
                fontSize: "28px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              &times;
            </span>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div
                className="success-animation"
                style={{ marginBottom: "20px" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={modalIconColor} // Use the modalIconColor
                  width="80px"
                  height="80px"
                >
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 6.63 5.37 12 12 12s12-5.37 12-12C24 5.37 18.63 0 12 0zm0 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10zM10 17.2l-5.3-5.3 1.4-1.4 3.9 3.9 7.9-7.9 1.4 1.4L10 17.2z" />
                  {modalIconColor === "red" && ( // If error, show cross icon
                    <path
                      d="M15.41 8.59L12 12l-3.41-3.41L7 10l5 5 5-5z"
                      fill="red"
                    />
                  )}
                </svg>
              </div>
            </div>
            <h2>{modalMessage}</h2>
            <p>
              {modalIconColor === "green"
                ? "Your order has been successfully submitted."
                : "There was an error with your submission."}
            </p>
            <button
              onClick={() => setShowSuccessPopup(false)}
              style={{
                display: "block",
                width: "100%",
                padding: "10px",
                background: "linear-gradient(to right, #4caf50, #81c784)",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "16px",
                marginTop: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <div
          id="entrustModal"
          className="modal show"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
          }}
        >
          <div
            className="modal-content"
            style={{
              backgroundColor: "#fefefe",
              margin: "5% auto",
              padding: "20px",
              border: "1px solid #888",
              width: "80%",
              maxWidth: "400px",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <span
              className="close"
              onClick={closeModal}
              style={{
                color: "#aaa",
                float: "right",
                fontSize: "28px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              &times;
            </span>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                textAlign: "center",
                alignItems: "center",
              }}
            >
              {" "}
              <h1
                style={{
                  color: "black",
                  fontSize: "30px",
                  marginBottom: "20px",
                }}
              >
                <b> {value.symbol.toUpperCase()} Coin Delivery</b>
              </h1>
            </div>
            <div style={{ display: "flex" }}>
              <div>
                <div style={{ display: "flex" }}>
                  <img
                    src={value.image}
                    alt={value.symbol}
                    style={{
                      width: "30px",
                      height: "30px",
                      marginRight: "10px",
                    }}
                  />
                  <p>{value?.symbol.toUpperCase()} / USDT</p>
                </div>{" "}
                <div style={{ marginLeft: "40px" }}>
                  {" "}
                  <h4
                    style={{
                      color: direction === "up" ? "white" : "green",
                      backgroundColor: direction === "up" ? "green" : "white",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      marginBottom: "5px",
                    }}
                  >
                    Buy / Long
                  </h4>
                  <h4
                    style={{
                      color: direction === "down" ? "white" : "red",
                      backgroundColor: direction === "down" ? "red" : "white",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      marginBottom: "5px",
                    }}
                  >
                    Sell / Short
                  </h4>
                </div>
              </div>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                  }}
                >
                  Delivery Time
                </label>
                <select
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(Number(e.target.value))}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "10px",
                    marginBottom: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    boxSizing: "border-box",
                    fontSize: "16px",
                  }}
                >
                  {deliveryTimes.map((dt) => (
                    <option key={dt.time} value={dt.time}>
                      {formatDeliveryTime(dt.time)}
                    </option>
                  ))}
                </select>

                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                  }}
                >
                  Direction
                </label>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "10px",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setDirection("up")}
                    style={{
                      flex: "1",
                      padding: "10px",
                      background: direction === "up" ? "green" : "#ccc",
                      border: "none",
                      color: "white",
                      borderRadius: "5px",
                      cursor: "pointer",
                      fontSize: "16px",
                      marginRight: "5px",
                    }}
                  >
                    Bullish
                  </button>
                  <button
                    type="button"
                    onClick={() => setDirection("down")}
                    style={{
                      flex: "1",
                      padding: "10px",
                      background: direction === "down" ? "red" : "#ccc",
                      border: "none",
                      color: "white",
                      borderRadius: "5px",
                      cursor: "pointer",
                      fontSize: "16px",
                      marginLeft: "5px",
                    }}
                  >
                    Bearish
                  </button>
                </div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                  }}
                >
                  Amount
                </label>
                <div style={{ display: "flex" }}>
                  <div
                    style={{
                      display: "flex",
                      width: "120px",
                      padding: "10px",
                      marginBottom: "10px",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      boxSizing: "border-box",
                      fontSize: "16px",
                      marginRight: "20px",
                    }}
                  >
                    <img
                      src={usdtImg}
                      alt="image"
                      style={{ width: "25px", height: "25px" }}
                    />
                    <h2>USDT</h2>
                  </div>

                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => {
                      const value = e.target.value;
                      setAmount(value === "" ? "" : Number(value));
                    }}
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "10px",
                      marginBottom: "10px",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      boxSizing: "border-box",
                      fontSize: "16px",
                    }}
                  />
                </div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                  }}
                >
                  Rate of Return
                </label>
                <input
                  type="text"
                  value={`${interest * 100}%`}
                  readOnly
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "10px",
                    marginBottom: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    boxSizing: "border-box",
                    fontSize: "16px",
                  }}
                />
                <div className="mt-4" style={{ marginTop: "10px" }}>
                  <p className="text-black" style={{ color: "black" }}>
                    Fee: {amount * 0.001} USD
                  </p>
                  <p className="text-black" style={{ color: "black" }}>
                    Minimum Amount: {selectedTime?.minAmount} USD
                  </p>
                </div>
                <div className="mt-4" style={{ marginTop: "10px" }}>
                  <button
                    type="submit"
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "10px",
                      background: "linear-gradient(to right, #4caf50, #81c784)",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      fontSize: "16px",
                      marginTop: "10px",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    }}
                    disabled={isLoading}
                  >
                    {isLoading ? "Submitting..." : "Submit Order"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {showLoginModal && <Login closeModal={() => setShowLoginModal(false)} />}

      {showSignupModal && (
        <SignupModal closeModal={() => setShowSignupModal(false)} />
      )}
    </div>
  );
};

export default PredictionForm;
