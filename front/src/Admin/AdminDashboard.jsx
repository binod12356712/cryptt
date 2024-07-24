import React from "react";
import { Route, Routes, Link, Navigate } from "react-router-dom";
import Clients from "./Clients";
import TradeControl from "./TradeControl";
import WalletDetails from "./WalletDetails";
import RechargeStatus from "./RechargeStatus";
import ProfitLoss from "./ProfitLoss";
import "./Dashboard.css"; // Import CSS file for styling
import AdminDepositApproval from "./AdminDepositApproval";
import AdminSendApproval from "./AdminSendApproval";
import AdminAgentApproval from "./AdminAgentApproval";
import Agents from "./Agents";
const AdminDashboard = () => {
  return (
    <div className="flex min-h-screen">
      <div className="w-1/6 bg-gray-800 text-white p-5">
        <div className="mb-8">
          <img
            src="https://res.coinpaper.com/coinpaper/bitcoin_btc_logo_62c59b827e.png"
            alt="Logo"
            className="h-24 w-24 mx-auto"
          />
        </div>
        <nav className="flex flex-col space-y-2">
          <Link to="clients" className="text-lg hover:bg-gray-700 p-2 rounded">
            Clients
          </Link>
          <Link
            to="trade-control"
            className="text-lg hover:bg-gray-700 p-2 rounded"
          >
            Trade Control
          </Link>
          <Link
            to="wallet-details"
            className="text-lg hover:bg-gray-700 p-2 rounded"
          >
            Wallet Details
          </Link>
          <Link
            to="recharge-requests"
            className="text-lg hover:bg-gray-700 p-2 rounded"
          >
            Recharge Requests
          </Link>
          <Link
            to="recharge-status"
            className="text-lg hover:bg-gray-700 p-2 rounded"
          >
            Recharge status
          </Link>
          <Link
            to="send-approval"
            className="text-lg hover:bg-gray-700 p-2 rounded"
          >
            Withdraw requests
          </Link>
          <Link
            to="agent-approval"
            className="text-lg hover:bg-gray-700 p-2 rounded"
          >
            Agent Approval
          </Link>
          <Link
            to="agent-list"
            className="text-lg hover:bg-gray-700 p-2 rounded"
          >
            Agent List
          </Link>
          <Link
            to="profit-loss"
            className="text-lg hover:bg-gray-700 p-2 rounded"
          >
            Profit/Loss
          </Link>
        </nav>
      </div>
      <div className="w-5/6 p-6">
        <Routes>
          <Route path="clients" element={<Clients />} />
          <Route path="trade-control" element={<TradeControl />} />
          <Route path="wallet-details" element={<WalletDetails />} />
          <Route path="recharge-status" element={<RechargeStatus />} />
          <Route path="profit-loss" element={<ProfitLoss />} />
          <Route path="recharge-requests" element={<AdminDepositApproval />} />
          <Route path="send-approval" element={<AdminSendApproval />} />
          <Route path="agent-approval" element={<AdminAgentApproval />} />
          <Route path="agent-list" element={<Agents />} />

          {/* <Route path="*" element={<Navigate to="clients" />} />{" "} */}
          {/* Redirect to default route */}
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
