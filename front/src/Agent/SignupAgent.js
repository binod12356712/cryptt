import React, { useState } from "react";
import axios from "axios";
import "./Auth.css"; // Import CSS file for styling

const SignupAgent = () => {
  const [name, setName] = useState("");
  const [team, setTeam] = useState("A");
  const [password, setPassword] = useState("");
  const [reenterPassword, setReenterPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== reenterPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post("https://trcnfx.com/api/agent/signup", {
        name,
        team,
        password,
      });
      console.log(response.data); // Handle signup success
    } catch (error) {
      console.error(error.response.data); // Handle signup error
    }
  };

  return (
    <div className="auth-container">
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Team:</label>
          <select value={team} onChange={(e) => setTeam(e.target.value)}>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
            <option value="E">E</option>
          </select>
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Re-enter Password:</label>
          <input
            type="password"
            value={reenterPassword}
            onChange={(e) => setReenterPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn">
          Signup
        </button>
      </form>
    </div>
  );
};

export default SignupAgent;
