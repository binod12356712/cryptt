import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../wallet/WalletDashboard.css"; // Reuse the CSS file for styling
import logo3 from "./logo3.png";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Login from "./Login"; // Import the Login component
import SignupModal from "./SignupModal"; // Import the SignupModal component
import axios from "axios";
import { useTheme } from "../ThemeContext"; // Import ThemeContext

export default function Settings() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to manage menu visibility
  const navigate = useNavigate();
  const sidebarRef = useRef();
  const uid = localStorage.getItem("_id");
  const [showLoginModal, setShowLoginModal] = useState(false); // State to manage login modal visibility
  const [showSignupModal, setShowSignupModal] = useState(false); // State to manage signup modal visibility
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to manage login status
  const [showKycModal, setShowKycModal] = useState(false); // State to manage KYC modal visibility
  const [kycStatus, setKycStatus] = useState(""); // State to manage KYC status
  const usersid = localStorage.getItem("userId");
  const { isDarkMode, toggleTheme } = useTheme(); // Use ThemeContext
  useEffect(() => {
    // Check if the user is logged in by checking the localStorage for authToken
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      setIsLoggedIn(true);
    }
  }, []);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const userss = localStorage.getItem("_id");
  const handleViewDetails = async () => {
    try {
      const response = await axios.get(`https://trcnfx.com/api/user/${userss}`);
      setUserDetails(response.data);
      setShowDetailsModal(true);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    const { oldPassword, newPassword, confirmNewPassword } = e.target.elements;

    if (newPassword.value !== confirmNewPassword.value) {
      alert("New passwords do not match");
      return;
    }

    try {
      await axios.post("https://trcnfx.com/api/change-password", {
        userId: userss,
        oldPassword: oldPassword.value,
        newPassword: newPassword.value,
      });
      setShowChangePasswordModal(false);
    } catch (error) {
      console.error("Error changing password:", error);
    }
  };
  const renderKycStatus1 = () => {
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

  const countries = [
    "Afghanistan",
    "Albania",
    "Algeria",
    "Andorra",
    "Angola",
    "Antigua and Barbuda",
    "Argentina",
    "Armenia",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bhutan",
    "Bolivia",
    "Bosnia and Herzegovina",
    "Botswana",
    "Brazil",
    "Brunei",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Cabo Verde",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Central African Republic",
    "Chad",
    "Chile",
    "China",
    "Colombia",
    "Comoros",
    "Congo",
    "Costa Rica",
    "Croatia",
    "Cuba",
    "Cyprus",
    "Czech Republic",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Eswatini",
    "Ethiopia",
    "Fiji",
    "Finland",
    "France",
    "Gabon",
    "Gambia",
    "Georgia",
    "Germany",
    "Ghana",
    "Greece",
    "Grenada",
    "Guatemala",
    "Guinea",
    "Guinea-Bissau",
    "Guyana",
    "Haiti",
    "Honduras",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Ireland",
    "Israel",
    "Italy",
    "Jamaica",
    "Japan",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "Korea (North)",
    "Korea (South)",
    "Kuwait",
    "Kyrgyzstan",
    "Laos",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands",
    "Mauritania",
    "Mauritius",
    "Mexico",
    "Micronesia",
    "Moldova",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Morocco",
    "Mozambique",
    "Myanmar",
    "Namibia",
    "Nauru",
    "Nepal",
    "Netherlands",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "North Macedonia",
    "Norway",
    "Oman",
    "Pakistan",
    "Palau",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines",
    "Poland",
    "Portugal",
    "Qatar",
    "Romania",
    "Russia",
    "Rwanda",
    "Saint Kitts and Nevis",
    "Saint Lucia",
    "Saint Vincent and the Grenadines",
    "Samoa",
    "San Marino",
    "Sao Tome and Principe",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Slovakia",
    "Slovenia",
    "Solomon Islands",
    "Somalia",
    "South Africa",
    "South Sudan",
    "Spain",
    "Sri Lanka",
    "Sudan",
    "Suriname",
    "Sweden",
    "Switzerland",
    "Syria",
    "Taiwan",
    "Tajikistan",
    "Tanzania",
    "Thailand",
    "Timor-Leste",
    "Togo",
    "Tonga",
    "Trinidad and Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Tuvalu",
    "Uganda",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom",
    "United States",
    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Vatican City",
    "Venezuela",
    "Vietnam",
    "Yemen",
    "Zambia",
    "Zimbabwe",
  ];

  useEffect(() => {
    const checkKycStatus = async () => {
      try {
        const response = await axios.get(`https://trcnfx.com/api/kyc/${uid}`);
        setKycStatus(response.data.status);
      } catch (error) {
        console.error("Error fetching KYC status:", error);
      }
    };
    checkKycStatus();
  }, [uid]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    navigate("/");
  };

  const handleKycSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append("userId", uid);

    try {
      const response = await axios.post(
        "https://trcnfx.com/api/kyc",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setKycStatus("pending");
      setShowKycModal(false);
    } catch (error) {
      console.error("Error submitting KYC:", error);
    }
  };

  const renderKycStatus = () => {
    switch (kycStatus) {
      case "approved":
        return (
          <p>
            KYC Verified{" "}
            <i className="fas fa-check-circle" style={{ color: "green" }}></i>
          </p>
        );
      case "pending":
        return (
          <p>
            KYC Pending{" "}
            <i
              className="fas fa-spinner fa-spin"
              style={{ color: "orange" }}
            ></i>
          </p>
        );
      case "rejected":
        return (
          <p>
            KYC Rejected{" "}
            <i className="fas fa-times-circle" style={{ color: "red" }}></i>
          </p>
        );
      default:
        return (
          <button
            onClick={() => setShowKycModal(true)}
            style={{
              backgroundColor: "var(--primary-color)",
              color: "var(--text-color)",
              padding: "10px 20px",
              border: "none",
              cursor: "pointer",
              marginTop: "20px",
            }}
          >
            Fill up KYC
          </button>
        );
    }
  };

  return (
    <div className="container">
      <header style={{ backgroundColor: "var(--primary-color)" }}>
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
            <b>UID: {usersid}</b>
          </p>
          {renderKycStatus1()}
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
          <h2>Account Settings</h2>
          <p>Manage your account settings and set preferences.</p>
        </div>
        <h1>
          <b className="text1" style={{ fontSize: "22px" }}>
            Account settings
          </b>
        </h1>
        <hr />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div>
            <button
              onClick={() => setShowChangePasswordModal(true)}
              style={{
                border: "1px solid",
                padding: "10px",
                marginTop: "10px",
                backgroundColor: "#50eb68",
                color: "white",
                width: "100%",
              }}
            >
              Change Password
            </button>
            {showChangePasswordModal && (
              <div className="modal show">
                <div className="modal-content">
                  <span
                    className="close"
                    onClick={() => setShowChangePasswordModal(false)}
                  >
                    &times;
                  </span>
                  <h2>Change Password</h2>
                  <form onSubmit={handleChangePasswordSubmit}>
                    <div className="form-group">
                      <label>Old Password:</label>
                      <input type="password" name="oldPassword" required />
                    </div>
                    <div className="form-group">
                      <label>New Password:</label>
                      <input type="password" name="newPassword" required />
                    </div>
                    <div className="form-group">
                      <label>Confirm New Password:</label>
                      <input
                        type="password"
                        name="confirmNewPassword"
                        required
                      />
                    </div>
                    <button type="submit">Submit</button>
                  </form>
                </div>
              </div>
            )}
          </div>
          <div>
            <button
              onClick={handleViewDetails}
              style={{
                border: "1px solid",
                padding: "10px",
                marginTop: "10px",
                width: "100%",
                backgroundColor: "#50eb68",
                color: "white",
              }}
            >
              View Details
            </button>
            {showDetailsModal && (
              <div className="modal show">
                <div className="modal-content">
                  <span
                    className="close"
                    onClick={() => setShowDetailsModal(false)}
                  >
                    &times;
                  </span>
                  <h2>User Details</h2>
                  <p>
                    <strong style={{ color: "black" }}>Email:</strong>{" "}
                    {userDetails.email}
                  </p>
                  <p>
                    <strong style={{ color: "black" }}>UID:</strong>{" "}
                    {userDetails.userId}
                  </p>
                </div>
              </div>
            )}
          </div>{" "}
          {renderKycStatus()}
        </div>
        <div className="settings-content" style={{ marginTop: "20px" }}>
          <h1>
            <b
              className="text1"
              style={{ fontSize: "22px", marginTop: "20px" }}
            >
              Appearance settings
            </b>
          </h1>
          <hr />
          <div className="theme-toggle">
            <button
              onClick={toggleTheme}
              className={`theme-toggle-button ${isDarkMode ? "active" : ""}`}
              style={{
                border: "1px solid",
                padding: "10px",
                marginTop: "10px",
                width: "100%",
                cursor: "pointer",
                backgroundColor: "#c4eb50",
                color: "black",
              }}
            >
              {isDarkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </div>
        <div>
          <Link to="/terms">
            <button
              style={{
                border: "1px solid",
                padding: "10px",
                marginTop: "10px",
                width: "100%",
                backgroundColor: "#c4eb50",
                color: "black",
              }}
            >
              Privacy Policy
            </button>
          </Link>
        </div>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "red",
            color: "white",
            padding: "10px",
            border: "none",
            cursor: "pointer",
            marginTop: "20px",
            width: "100%",
          }}
        >
          Logout
        </button>
      </div>
      {showKycModal && (
        <div
          className="modal show"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "fixed",
            zIndex: 1000,
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            overflow: "auto",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
          }}
        >
          <div
            className="modal-content"
            style={{
              backgroundColor: "var(--highlight-color)",
              padding: "20px",
              border: "1px solid #888",
              width: "80%",
              maxWidth: "400px",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              maxHeight: "80%", // Add maxHeight for scrolling
              overflowY: "auto", // Enable vertical scrolling
            }}
          >
            <span
              className="close"
              onClick={() => setShowKycModal(false)}
              style={{
                color: "#aaa",
                fontSize: "28px",
                fontWeight: "bold",
                position: "absolute",
                top: "10px",
                right: "20px",
                cursor: "pointer",
              }}
            >
              &times;
            </span>
            <h2>Fill up KYC</h2>
            <form onSubmit={handleKycSubmit}>
              <div className="form-group">
                <label>Date of Birth:</label>
                <input type="date" name="dob" required />
              </div>
              <div className="form-group">
                <label>Country:</label>
                <select name="country" required>
                  <option value="">Select your country</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Street Address:</label>
                <input type="text" name="address" required />
              </div>
              <div className="form-group">
                <label>Zip Code:</label>
                <input type="text" name="zip" required />
              </div>
              <div className="form-group">
                <label>Contact Number:</label>
                <input type="text" name="contact" required />
              </div>
              <div className="form-group">
                <label>Proof of Identity:</label>
                <input
                  type="file"
                  name="identityProof"
                  accept="image/*"
                  required
                />
              </div>
              <div className="form-group">
                <label>Photo (PP Size or selfie):</label>
                <input type="file" name="photo" accept="image/*" required />
              </div>
              <button
                type="submit"
                className="submit-button"
                style={{
                  backgroundColor: "var(--secondary-color)",
                  color: "var(--text-color)",
                }}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}

      {showLoginModal && <Login closeModal={() => setShowLoginModal(false)} />}
      {showSignupModal && (
        <SignupModal closeModal={() => setShowSignupModal(false)} />
      )}
    </div>
  );
}
