import React, { useEffect, useState } from "react";
import axios from "axios";

const Agents = () => {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/agents");
        setAgents(response.data);
      } catch (error) {
        console.error("Error fetching agents:", error);
      }
    };

    fetchAgents();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/agents/${id}`);
      setAgents(agents.filter((agent) => agent._id !== id));
      alert("Agent deleted successfully.");
    } catch (error) {
      console.error("Error deleting agent:", error);
      alert("Failed to delete agent.");
    }
  };

  return (
    <div className="admin-panel">
      <h2>Agents</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Agent ID</th>
            <th>Name</th>
            <th>Team</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {agents.map((agent) => (
            <tr key={agent._id}>
              <td>{agent.agentId}</td>
              <td>{agent.name}</td>
              <td>{agent.team}</td>
              <td>
                <button
                  style={{
                    border: "1px solid #007bff",
                    background: "none",
                    color: "#007bff",
                    padding: "5px 10px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    marginRight: "5px",
                  }}
                  onClick={() => handleDelete(agent._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Agents;
