import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Admin.css"; // Import CSS file for styling

const AdminAgentApproval = () => {
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [actionType, setActionType] = useState("");

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/admin/agents"
        );
        setAgents(response.data);
      } catch (error) {
        console.error("Error fetching agents:", error);
      }
    };

    fetchAgents();
  }, []);

  const handleAction = async (id, action) => {
    setSelectedAgent(id);
    setActionType(action);
  };

  const confirmAction = async () => {
    try {
      if (actionType === "approve") {
        await axios.post(
          `http://localhost:3001/api/admin/agents/${selectedAgent}/approve`
        );
      } else if (actionType === "decline") {
        await axios.post(
          `http://localhost:3001/api/admin/agents/${selectedAgent}/decline`
        );
      }
      setAgents((prevAgents) =>
        prevAgents.filter((agent) => agent._id !== selectedAgent)
      );
      setSelectedAgent(null);
      setActionType("");
    } catch (error) {
      console.error("Error updating agent status:", error);
    }
  };

  const cancelAction = () => {
    setSelectedAgent(null);
    setActionType("");
  };

  return (
    <div className="admin-container">
      <h2>Admin Agent Approval</h2>
      <div className="table-container">
        <table className="agent-table">
          <thead>
            <tr>
              <th>Agent ID</th>
              <th>Name</th>
              <th>Team</th>
              <th>Approved</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent) => (
              <tr key={agent._id}>
                <td>{agent.agentId}</td>
                <td>{agent.name}</td>
                <td>{agent.team}</td>
                <td>{agent.approved ? "Yes" : "No"}</td>
                <td>{new Date(agent.date).toLocaleString()}</td>
                <td>
                  <button
                    className="btn-approve"
                    onClick={() => handleAction(agent._id, "approve")}
                  >
                    Approve
                  </button>
                  <button
                    className="btn-decline"
                    onClick={() => handleAction(agent._id, "decline")}
                  >
                    Decline
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedAgent && (
        <div className="modal">
          <div className="modal-content">
            <h3>Confirm {actionType === "approve" ? "Approval" : "Decline"}</h3>
            <p>Are you sure you want to {actionType} this agent?</p>
            <button className="btn-confirm" onClick={confirmAction}>
              Confirm
            </button>
            <button className="btn-cancel" onClick={cancelAction}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAgentApproval;
