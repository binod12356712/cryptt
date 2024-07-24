import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminKyc.css"; // Import the CSS file for styling

const AdminKyc = () => {
  const [kycRequests, setKycRequests] = useState([]);

  useEffect(() => {
    const fetchKycRequests = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/kyc");
        setKycRequests(response.data);
      } catch (error) {
        console.error("Error fetching KYC requests:", error);
      }
    };
    fetchKycRequests();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.post(`http://localhost:3001/api/kyc/${id}/approve`);
      setKycRequests(kycRequests.filter((request) => request._id !== id));
    } catch (error) {
      console.error("Error approving KYC:", error);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.post(`http://localhost:3001/api/kyc/${id}/reject`);
      setKycRequests(kycRequests.filter((request) => request._id !== id));
    } catch (error) {
      console.error("Error rejecting KYC:", error);
    }
  };

  return (
    <div className="container">
      <h2>KYC Requests</h2>
      <table className="kyc-table">
        <thead>
          <tr>
            {/* <th>UID</th> */}
            <th>Date of Birth</th>
            <th>Country</th>
            <th>Address</th>
            <th>Zip</th>
            <th>Contact</th>
            <th>Identity Proof</th>
            <th>Photo</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {kycRequests.map((request) => (
            <tr key={request._id}>
              {/* <td>{request.userId}</td> */}
              <td>{new Date(request.dob).toLocaleDateString()}</td>
              <td>{request.country}</td>
              <td>{request.address}</td>
              <td>{request.zip}</td>
              <td>{request.contact}</td>
              <td>
                <img
                  src={`http://localhost:3001/${request.identityProof}`}
                  alt="Identity Proof"
                  width="100"
                />
              </td>
              <td>
                <img
                  src={`http://localhost:3001/${request.photo}`}
                  alt="Photo"
                  width="100"
                />
              </td>
              <td>
                <button
                  className="approve-button"
                  onClick={() => handleApprove(request._id)}
                >
                  Approve
                </button>
                <button
                  className="reject-button"
                  onClick={() => handleReject(request._id)}
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminKyc;
