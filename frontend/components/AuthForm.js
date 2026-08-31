"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

export default function AuthForm() {
  const router = useRouter();
  const { user, login, signup } = useAuth();
  const { lang, t } = useLanguage();

  const [activeTab, setActiveTab] = useState("login"); // "login" | "signup"
  const [role, setRole] = useState("farmer"); // "farmer" | "buyer"

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError(null);
    const res = login(loginEmail, loginPassword);
    if (!res.success) {
      setError(res.error);
    } else {
      if (res.user.role === "buyer") {
        router.push("/buyers");
      }
    }
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    setError(null);
    if (!signupName.trim() || !signupEmail.trim() || !signupPassword.trim()) {
      setError("Please fill out all fields.");
      return;
    }
    const res = signup(signupName, signupEmail, signupPassword, role);
    if (!res.success) {
      setError(res.error);
    } else {
      setSuccess("Account created successfully!");
      setTimeout(() => {
        if (role === "buyer") {
          router.push("/buyer-profile");
        }
      }, 800);
    }
  };

  const handleQuickLogin = (roleType) => {
    setError(null);
    if (roleType === "farmer") {
      setLoginEmail("farmer@kisan.com");
      setLoginPassword("farmer123");
      login("farmer@kisan.com", "farmer123");
    } else {
      setLoginEmail("buyer@kisan.com");
      setLoginPassword("buyer123");
      const res = login("buyer@kisan.com", "buyer123");
      if (res.success) router.push("/buyers");
    }
  };

  return (
    <div className="fade-in" style={{ maxWidth: 460, margin: "20px auto 60px" }}>
      <div className="dashboard-hero" style={{ marginBottom: 24 }}>
        <h1 className="hero-title" style={{ fontSize: 32 }}>
          {t.loginTitle}
        </h1>
        <p className="hero-subtitle">{t.loginSubtitle}</p>
      </div>

      <div className="auth-card">
        {/* Sign In vs Sign Up Tabs */}
        <div className="auth-tabs">
          <button
            className={`auth-tab-btn ${activeTab === "login" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("login");
              setError(null);
            }}
          >
            {t.tabLogin}
          </button>
          <button
            className={`auth-tab-btn ${activeTab === "signup" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("signup");
              setError(null);
            }}
          >
            {t.tabSignup}
          </button>
        </div>

        {error && <div className="error-box" style={{ marginBottom: 20 }}>{error}</div>}
        {success && (
          <div className="advisory-box advisory-box-up" style={{ marginBottom: 20 }}>
            ✅ {success}
          </div>
        )}

        {activeTab === "login" ? (
          /* Sign In Form */
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label className="form-label">{t.emailLabel}</label>
              <input
                type="email"
                required
                className="form-input"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="farmer@kisan.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t.passwordLabel}</label>
              <input
                type="password"
                required
                className="form-input"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <button type="submit" className="find-buyers-submit-btn">
              {t.tabLogin}
            </button>
          </form>
        ) : (
          /* Sign Up Form */
          <form onSubmit={handleSignupSubmit}>
            <div className="form-group">
              <label className="form-label">{t.roleLabel}</label>
              <div className="role-selector-group">
                <button
                  type="button"
                  className={`role-btn ${role === "farmer" ? "active" : ""}`}
                  onClick={() => setRole("farmer")}
                >
                  <span className="role-icon">🌾</span>
                  <span>{t.roleFarmer}</span>
                </button>
                <button
                  type="button"
                  className={`role-btn ${role === "buyer" ? "active" : ""}`}
                  onClick={() => setRole("buyer")}
                >
                  <span className="role-icon">🏢</span>
                  <span>{t.roleBuyer}</span>
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">{t.fullNameLabel}</label>
              <input
                type="text"
                required
                className="form-input"
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                placeholder={role === "farmer" ? "e.g. Ramesh Patil" : "e.g. Nashik Traders"}
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t.emailLabel}</label>
              <input
                type="email"
                required
                className="form-input"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                placeholder="user@kisan.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t.passwordLabel}</label>
              <input
                type="password"
                required
                className="form-input"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <button type="submit" className="find-buyers-submit-btn">
              {t.tabSignup}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
