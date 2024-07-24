import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const timePeriods = {
  "1H": { label: "1 H" },
  "6H": { label: "6 H" },
  "1D": { label: "1 D" },
  "1W": { label: "1 W" },
  "1M": { label: "1 M" },
};

const ProfitChart = ({ userId }) => {
  const [chartData, setChartData] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("1H");
  const [isProfit, setIsProfit] = useState(true);
  const [noDataMessage, setNoDataMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/profit-stats/${userId}`,
          { params: { period: selectedPeriod } }
        );

        const predictions = response.data;
        if (!predictions.length) {
          setNoDataMessage(
            `No data found for ${timePeriods[selectedPeriod].label}`
          );
          setChartData([]);
          return;
        }

        const transformedData = predictions.map((prediction) => ({
          time: new Date(prediction.predictedAt).toLocaleString(),
          value: prediction.result.totalProfit,
        }));

        setChartData(transformedData);
        setIsProfit(
          predictions.reduce((acc, curr) => acc + curr.result.totalProfit, 0) >
            0
        );
        setNoDataMessage("");
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setNoDataMessage(error.response.data.error);
        } else {
          console.error("Error fetching data:", error);
          setNoDataMessage("An error occurred while fetching data");
        }
        setChartData([]);
      }
    };

    fetchData();
  }, [userId, selectedPeriod]);

  const topPeriods = ["1H", "6H", "1D", "1W", "1M"];

  return (
    <div style={{ width: "100%" }}>
      {noDataMessage ? (
        <div style={{ textAlign: "center", margin: "20px 0" }}>
          {noDataMessage}
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={isProfit ? "#388e3c" : "#d32f2f"}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={isProfit ? "#388e3c" : "#d32f2f"}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" tick={false} />
            <YAxis domain={["auto", "auto"]} />
            <Tooltip contentStyle={{ fontSize: 12 }} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={isProfit ? "#81c784" : "#ef5350"}
              fillOpacity={1}
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginBottom: 10,
        }}
      >
        {topPeriods.map((period) => (
          <button
            key={period}
            onClick={() => setSelectedPeriod(period)}
            style={{
              padding: "5px 10px",
              backgroundColor: selectedPeriod === period ? "#4caf50" : "#ccc",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {timePeriods[period].label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProfitChart;
