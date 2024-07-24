import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "./Modal"; // Assuming Modal component is already created

const RechargeStatus = () => {
  const [clients, setClients] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/clients");
        setClients(response.data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };
    fetchClients();
  }, []);

  const fetchDeposits = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/transactions/${userId}`
      );
      setDeposits(response.data.deposits);
      setSelectedUserId(userId);
    } catch (error) {
      console.error("Error fetching deposits:", error);
    }
  };

  return (
    <div className="admin-recharge-status p-4">
      <h2 className="text-2xl font-bold mb-4">Recharge Status</h2>
      {selectedUserId ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow">
            <thead>
              <tr className="w-full bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">User ID</th>
                <th className="py-3 px-6 text-left">Amount</th>
                <th className="py-3 px-6 text-left">Coin</th>
                <th className="py-3 px-6 text-left">Status</th>
                <th className="py-3 px-6 text-left">Proof</th>
                <th className="py-3 px-6 text-left">Date</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {deposits.map((deposit) => (
                <tr
                  key={deposit._id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-6 text-left">{deposit.uid}</td>
                  <td className="py-3 px-6 text-left">
                    <b style={{ color: "black", fontWeight: "700" }}>
                      {deposit.amount}
                    </b>
                  </td>
                  <td className="py-3 px-6 text-left">
                    {deposit.selectedSymbol}
                  </td>
                  <td className="py-3 px-6 text-left">{deposit.status}</td>
                  <td className="py-3 px-6 text-left">
                    <a
                      href={deposit.proof}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Proof
                    </a>
                  </td>
                  <td className="py-3 px-6 text-left">
                    {new Date(deposit.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            className="mt-4 bg-gray-500 text-white py-1 px-3 rounded"
            onClick={() => setSelectedUserId(null)}
          >
            Back to Users
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow">
            <thead>
              <tr className="w-full bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">User ID</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {clients.map((client) => (
                <tr
                  key={client._id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-6 text-left">{client.userId}</td>
                  <td className="py-3 px-6 text-left">{client.email}</td>
                  <td className="py-3 px-6 text-left">
                    <button
                      className="bg-blue-500 text-white py-1 px-3 rounded"
                      onClick={() => fetchDeposits(client._id)}
                    >
                      Recharge Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RechargeStatus;
