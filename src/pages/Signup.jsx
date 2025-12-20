import { useState } from "react";
import "./Signup.css";
// import axios from "axios";

export default function Signup() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/accounts/register/",
        form
      );
      alert("Account created successfully");
    } catch (error) {
      alert("Signup failed");
    }
  };

  return (
    <div className="signup-layout">
      {/* LEFT PANEL */}
      {/* LEFT PANEL */}
        <div className="signup-left">
        <div className="welcome-block">
            <h1 className="welcome-heading">
                <span className="welcome-text">Welcome to</span>
                <span className="welcome-brand">EngiFlow</span>
                </h1>


            <p className="tagline">
            Your engineering workflow, simplified
            </p>
        </div>

        {/* <div className="benefits">
            <h3>What you'll get:</h3>
            <ul>
            <li>Streamlined project management designed for engineers</li>
            <li>Real-time collaboration with your team</li>
            <li>Powerful tools to track progress and boost productivity</li>
            </ul>
        </div> */}
        </div>


      {/* RIGHT PANEL */}
      <div className="signup-right">
        <div className="signup-card">
          <h1 className="title">Create Account</h1>
          <p className="subtitle">Enter your details to get started</p>

          <div className="tabs">
            <button className="tab inactive">Login</button>
            <button className="tab active">Sign Up</button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="name-row">
              <div className="input-group">
                <input
                  name="first_name"
                  placeholder="First name"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <input
                  name="last_name"
                  placeholder="Last name"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <input
                name="username"
                placeholder="Username"
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <input
                type="email"
                name="email"
                placeholder="Email address"
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="signup-btn">
              Create Account →
            </button>
          </form>

          <p className="terms">
            By continuing, you agree to our{" "}
            <span>Terms of Service</span> and{" "}
            <span>Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
