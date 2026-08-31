"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";

const DISTRICTS = ["Nashik", "Pune", "Latur", "Akola", "Aurangabad"];
const COMMODITIES = [
  { value: "Onion", icon: "🧅" },
  { value: "Tomato", icon: "🍅" },
  { value: "Soybean", icon: "🌱" },
  { value: "Cotton", icon: "☁️" },
  { value: "Tur", icon: "🫛" },
];
const GRADES = ["A", "B", "C"];

export default function BuyerProfilePage() {
  const router = useRouter();
  const { user, updateUser } = useAuth();
  const { lang } = useLanguage();

  const [companyName, setCompanyName] = useState("");
  const [contact, setContact] = useState("");
  const [district, setDistrict] = useState("");
  const [commodity, setCommodity] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [qualityGrade, setQualityGrade] = useState("B");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }
    if (user.role !== "buyer") {
      router.push("/");
      return;
    }
    // Pre-fill company name from signup name
    if (user.name) {
      setCompanyName(user.name.replace(/\s*\([^)]*\)/g, ""));
    }
  }, [user, router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!companyName.trim() || !contact.trim() || !district || !commodity || !maxPrice) {
      setError(lang === "en" ? "Please fill all required fields." : "कृपया सर्व आवश्यक फील्ड भरा.");
      return;
    }

    setSaving(true);

    const profile = {
      id: `bp_${Date.now()}`,
      user_id: user.id,
      company_name: companyName.trim(),
      contact: contact.trim(),
      district,
      commodity,
      max_price: Number(maxPrice),
      quality_grade: qualityGrade,
      reliability_rating: 4.0, // default for new buyers
      created_at: new Date().toISOString(),
    };

    // Save to localStorage
    const existing = JSON.parse(localStorage.getItem("kisan_buyer_profiles") || "[]");
    const updated = [...existing, profile];
    localStorage.setItem("kisan_buyer_profiles", JSON.stringify(updated));

    // Mark user as profile-completed
    if (updateUser) {
      updateUser({ ...user, profileComplete: true, companyName: companyName.trim() });
    }

    setTimeout(() => {
      setSaving(false);
      router.push("/buyers");
    }, 600);
  };

  if (!user || user.role !== "buyer") return null;

  return (
    <div className="fade-in">
      <div className="dashboard-hero">
        <h1 className="hero-title">
          {lang === "en" ? "Complete Your Buyer Profile" : "तुमचे खरेदीदार प्रोफाइल पूर्ण करा"}
        </h1>
        <p className="hero-subtitle">
          {lang === "en"
            ? "Help farmers find you — fill in your requirements so we can match you with the right produce."
            : "शेतकऱ्यांना तुम्हाला शोधण्यात मदत करा — तुमच्या गरजा भरा जेणेकरून आम्ही तुम्हाला योग्य मालाशी जोडू शकू."}
        </p>
      </div>

      <div className="buyer-profile-container">
        <div className="profile-form-card">
          <div className="profile-form-header">
            <span className="profile-form-icon">🏢</span>
            <div>
              <h2 className="profile-form-title">
                {lang === "en" ? "Buyer Requirements" : "खरेदीदार आवश्यकता"}
              </h2>
              <p className="profile-form-subtitle">
                {lang === "en"
                  ? "This information will be visible to farmers when matching."
                  : "हा तपशील शेतकऱ्यांना मॅचिंगमध्ये दिसेल."}
              </p>
            </div>
          </div>

          {error && <div className="error-box" style={{ marginBottom: 20 }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* Company Name */}
            <div className="form-group">
              <label className="form-label">
                {lang === "en" ? "Company / Business Name *" : "कंपनी / व्यवसायाचे नाव *"}
              </label>
              <input
                type="text"
                required
                className="form-input"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder={lang === "en" ? "e.g. Nashik AgroFresh Pvt Ltd" : "उदा. नाशिक अॅग्रोफ्रेश प्रा. लि."}
              />
            </div>

            {/* Contact Number */}
            <div className="form-group">
              <label className="form-label">
                {lang === "en" ? "Contact Number *" : "संपर्क क्रमांक *"}
              </label>
              <input
                type="tel"
                required
                className="form-input"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="+91 98230 45678"
              />
            </div>

            {/* District */}
            <div className="form-group">
              <label className="form-label">
                {lang === "en" ? "Location (District) *" : "स्थान (जिल्हा) *"}
              </label>
              <select
                required
                className="form-input"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
              >
                <option value="">{lang === "en" ? "Select District" : "जिल्हा निवडा"}</option>
                {DISTRICTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Commodity */}
            <div className="form-group">
              <label className="form-label">
                {lang === "en" ? "Commodity You Want to Buy *" : "तुम्हाला खरेदी करायचा माल *"}
              </label>
              <div className="commodity-selector-grid">
                {COMMODITIES.map((c) => (
                  <button
                    type="button"
                    key={c.value}
                    className={`commodity-select-btn ${commodity === c.value ? "active" : ""}`}
                    onClick={() => setCommodity(c.value)}
                  >
                    <span className="commodity-select-icon">{c.icon}</span>
                    <span>{c.value}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Max Price */}
            <div className="form-group">
              <label className="form-label">
                {lang === "en" ? "Maximum Price per Quintal (₹) *" : "प्रति क्विंटल कमाल किंमत (₹) *"}
              </label>
              <div className="price-input-wrapper">
                <span className="price-input-prefix">₹</span>
                <input
                  type="number"
                  required
                  className="form-input price-input-field"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="2000"
                  min="100"
                />
                <span className="price-input-suffix">{lang === "en" ? "/ quintal" : "/ क्विंटल"}</span>
              </div>
            </div>

            {/* Quality Grade */}
            <div className="form-group">
              <label className="form-label">
                {lang === "en" ? "Minimum Quality Grade Required *" : "किमान गुणवत्ता श्रेणी आवश्यक *"}
              </label>
              <div className="grade-selector-group">
                {GRADES.map((g) => (
                  <button
                    type="button"
                    key={g}
                    className={`grade-select-btn ${qualityGrade === g ? "active" : ""} grade-select-btn-${g}`}
                    onClick={() => setQualityGrade(g)}
                  >
                    <span className="grade-select-letter">{g}</span>
                    <span className="grade-select-desc">
                      {g === "A"
                        ? lang === "en" ? "Premium" : "प्रीमियम"
                        : g === "B"
                        ? lang === "en" ? "Standard" : "प्रमाणित"
                        : lang === "en" ? "Economy" : "किफायतशीर"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="find-buyers-submit-btn" disabled={saving}>
              {saving
                ? lang === "en" ? "Saving Profile..." : "प्रोफाइल जतन करत आहे..."
                : lang === "en" ? "Save Profile & Continue →" : "प्रोफाइल जतन करा आणि पुढे जा →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
