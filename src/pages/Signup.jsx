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
  const [activeTab, setActiveTab] = useState("signup"); // 'signup' | 'login'
  const [showForgot, setShowForgot] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (activeTab === "signup") {
      try {
        // await axios.post("http://127.0.0.1:8000/api/accounts/register/", form);
        alert("Account created successfully (stub)");
      } catch (error) {
        alert("Signup failed");
      }
    } else {
      try {
        // await axios.post("http://127.0.0.1:8000/api/accounts/login/", form);
        alert("Logged in (stub)");
      } catch (error) {
        alert("Login failed");
      }
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
            <button
              className={"tab " + (activeTab === "login" ? "active" : "inactive")}
              onClick={() => setActiveTab("login")}
              type="button"
            >
              Login
            </button>
            <button
              className={"tab " + (activeTab === "signup" ? "active" : "inactive")}
              onClick={() => setActiveTab("signup")}
              type="button"
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {activeTab === "signup" ? (
              <>
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
              </>
            ) : (
              <>
                {!showForgot ? (
                  <>
                    <div className="input-group">
                      <input
                        type="email"
                        name="email"
                        placeholder="Email address"
                        onChange={handleChange}
                        required
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
                      Login →
                    </button>

                    <p className="forgot-link">
                      <button
                        type="button"
                        className="link-btn"
                        onClick={() => setShowForgot(true)}
                      >
                        Forgot password?
                      </button>
                    </p>
                  </>
                ) : (
                  // Forgot password form
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      // stubbed handler — wire to API as needed
                      alert(
                        `Password reset link sent to ${form.email || "(no email)"} (stub)`
                      );
                      setShowForgot(false);
                    }}
                  >
                    <div className="input-group">
                      <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <button type="submit" className="signup-btn">
                      Send Reset Link
                    </button>

                    <p className="forgot-link">
                      <button
                        type="button"
                        className="link-btn"
                        onClick={() => setShowForgot(false)}
                      >
                        Back to Login
                      </button>
                    </p>
                  </form>
                )}
              </>
            )}
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
