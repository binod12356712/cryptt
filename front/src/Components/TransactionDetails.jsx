import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import html2canvas from "html2canvas";
import "./TransactionDetails.css";
import logo1 from "./logoResult.png";
import logo3 from "./logo3.png";
import "@fortawesome/fontawesome-free/css/all.min.css";

const TransactionDetails = () => {
  const { transactionId } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [logo, setLogo] = useState("");
  const [logoBase64, setLogoBase64] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const sidebarRef = useRef();
  const mainContentRef = useRef();
  const downloadButtonRef = useRef();
  const [logoLoaded, setLogoLoaded] = useState(false);
  const uid = localStorage.getItem("userId");

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response = await axios.get(
          `https://trcnfx.com/api/transaction/${transactionId}`
        );
        setTransaction(response.data);

        let symbol = "";
        if (response.data.type === "conversion") {
          symbol = response.data.toSymbol;
        } else {
          symbol = response.data.selectedSymbol || response.data.symbol;
        }

        const logoResponse = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${symbol}`
        );
        setLogo(logoResponse.data.image.large);
        const imageResponse = await axios.get(logoResponse.data.image.large, {
          responseType: "arraybuffer",
        });
        const base64Flag = "data:image/jpeg;base64,";
        const imageStr = arrayBufferToBase64(imageResponse.data);
        setLogoBase64(base64Flag + imageStr);
      } catch (error) {
        console.error("Error fetching transaction:", error);
      }
    };

    fetchTransaction();
  }, [transactionId]);

  const arrayBufferToBase64 = (buffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
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

  const captureScreenshot = useCallback(async () => {
    if (mainContentRef.current && logoLoaded) {
      downloadButtonRef.current.style.display = "none";
      const canvas = await html2canvas(mainContentRef.current);
      downloadButtonRef.current.style.display = "block";

      const imgData = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = imgData;
      link.download = "transaction_report.png";
      link.click();
    }
  }, [logoLoaded]);

  const handleLogoLoad = () => {
    setLogoLoaded(true);
  };

  if (!transaction) {
    return <div>Loading...</div>;
  }

  const symbol =
    transaction.toSymbol || transaction.selectedSymbol || transaction.symbol;
  const amount = transaction.amount || transaction.convertedAmount;
  const transactionType =
    transaction.type ||
    (transaction.fromSymbol && transaction.toSymbol ? "conversion" : "send");

  const isCompleted =
    transaction.status === "completed" ||
    transaction.status === "complete" ||
    transaction.approved === true;
  const statusClass = isCompleted ? "completed" : "pending";
  const statusIcon = isCompleted ? "✓" : "⏳";
  const statusMessage = isCompleted ? "Completed" : "Pending";

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
          <h1>Transaction Details</h1>
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
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "10px",
        }}
      >
        <button
          onClick={captureScreenshot}
          ref={downloadButtonRef}
          style={{
            padding: "10px",
            fontSize: "16px",
            cursor: "pointer",
            background: "none",
            border: "none",
            marginTop: "30px",
          }}
          disabled={!logoLoaded} // Disable button until logo is loaded
        >
          <i className="fas fa-download" style={{ fontSize: "24px" }}></i>
        </button>
      </div>

      <div className="main-content" ref={mainContentRef}>
        <div className="transaction-details">
          <h1 className="report-title" style={{ color: "black" }}>
            Transaction Report
            <hr
              style={{
                width: "100%",
                margin: "0 auto 20px",
                border: "1px solid #000",
              }}
            />
          </h1>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              textAlign: "center",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <img
              src={logo1}
              alt="logo"
              style={{ height: "100px", width: "140px" }}
            />
          </div>

          <div className="report-header">
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src={logoBase64}
                alt={`${symbol} logo`}
                className="logo-top-left"
                onLoad={handleLogoLoad} // Ensure logo is loaded before capturing screenshot
              />
            </div>
            <div
              className="symbol-timestamp"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <span className="symbol" style={{ fontSize: "15px" }}>
                {symbol?.toUpperCase()}/USDT
              </span>
              <span className="timestamp">
                {new Date(transaction.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
          <div className="content">
            <div>
              <p className="label">
                Amount: <span className="value">{amount} USDT</span>
              </p>
              <p className="label">
                Status:{" "}
                <span className={`value ${statusClass}`}>
                  {statusIcon} {statusMessage}
                </span>
              </p>
              <p className="label">
                Transaction Type:{" "}
                <span className="value">{transactionType}</span>
              </p>
              <p className="label">
                Date:{" "}
                <span className="value">
                  {new Date(transaction.createdAt).toLocaleString()}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetails;
