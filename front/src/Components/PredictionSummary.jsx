import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Countdown from "./Countdown"; // Import Countdown component
import "./PredictionSummary.css"; // Import the CSS file

const cryptoNameToSymbol = {
  ethereum: "ETH",
  bitcoin: "BTC",
  // Add more mappings as needed
};

const PredictionSummary = ({ prediction, showResult }) => {
  const navigate = useNavigate();
  const [logoBase64, setLogoBase64] = useState("");

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const symbol =
          cryptoNameToSymbol[prediction.symbol.toLowerCase()] ||
          prediction.symbol.toLowerCase();
        const logoResponse = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${symbol}`
        );
        const imageResponse = await axios.get(logoResponse.data.image.large, {
          responseType: "arraybuffer",
        });
        const base64Flag = "data:image/jpeg;base64,";
        const imageStr = arrayBufferToBase64(imageResponse.data);
        setLogoBase64(base64Flag + imageStr);
      } catch (error) {
        console.error("Error fetching logo:", error);
      }
    };

    fetchLogo();
  }, [prediction.symbol]);

  const arrayBufferToBase64 = (buffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const handleNavigateToDetails = () => {
    if (showResult) {
      navigate(`/prediction/${prediction._id}`);
    }
  };

  const isProfit = prediction.result && prediction.result.success;
  const profitLossAmount = prediction.result ? prediction.result.profit : 0;

  const profitLossClass = isProfit ? "profit" : "loss";
  const profitLossIcon = isProfit ? "↑" : "↓";
  const profitLossMessage = prediction.result
    ? isProfit
      ? `You have won ${profitLossAmount} USD`
      : `You have lost all your money`
    : "Pending";

  return (
    <div
      className="prediction-summary"
      onClick={handleNavigateToDetails}
      style={{
        backgroundColor: "#f0f0f0be",
        cursor: showResult ? "pointer" : "default",
      }}
    >
      <div className="summary-header">
        <div>
          <img
            style={{ height: "30px", width: "30px" }}
            src={logoBase64}
            alt={`${prediction.symbol} logo`}
            className="logo"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/50"; // Fallback image if logo is not found
            }}
          />
          <h1>{prediction.symbol.toUpperCase()}</h1>
        </div>
        <div>
          <p>{new Date(prediction.predictedAt).toLocaleString()}</p>
          {showResult && prediction.result ? (
            <p className={`profit-loss ${profitLossClass}`}>
              {profitLossIcon}{" "}
              {isProfit ? (
                <span>{profitLossAmount}</span>
              ) : (
                <span className="loss-amount">{prediction.amount}</span>
              )}
            </p>
          ) : (
            <p className="pending">Pending</p>
          )}
          {!showResult && (
            <p>
              Time Left:{" "}
              <Countdown
                deliveryTime={prediction.deliveryTime}
                predictedAt={prediction.predictedAt}
              />
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PredictionSummary;
