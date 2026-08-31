"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getPriceTrends } from "@/lib/api";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";
import AuthForm from "../components/AuthForm";

const COMMODITY_ICONS = {
  "Onion": "🧅",
  "Tomato": "🍅",
  "Soybean": "🌱",
  "Cotton": "☁️",
  "Tur": "🫛",
  "Tur (Pigeon Pea)": "🫛"
};

export default function DashboardPage() {
  const router = useRouter();
  const { lang, t } = useLanguage();
  const { user } = useAuth();
  const { intents, updateIntentStatus } = useNotifications();

  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cleanName = (name) => {
    if (!name) return "";
    return name.replace(/\s*\([^)]*\)/g, "").replace(/\s+/g, "").toLowerCase();
  };

  const myIntents = intents.filter(
    (i) => user && cleanName(i.seller_name) === cleanName(user.name)
  );

  const pendingIntents = myIntents.filter((i) => i.status === "pending");

  // If logged in as buyer, redirect to buyers page automatically
  useEffect(() => {
    if (user && user.role === "buyer") {
      router.push("/buyers");
    }
  }, [user, router]);

  useEffect(() => {
    if (user && user.role === "farmer") {
      getPriceTrends()
        .then((data) => {
          const formatted = data.map((item) => ({
            ...item,
            displayName: item.commodity === "Tur" ? "Tur (Pigeon Pea)" : item.commodity,
          }));
          setTrends(formatted);
        })
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    }
  }, [user]);

  // 1. Welcome Screen (No user logged in -> Show Auth/Login Page)
  if (!user) {
    return <AuthForm />;
  }

  // 2. Farmer View (Price Dashboard)
  const getAdvisory = (item) => {
    if (lang === "mr") {
      if (item.trend_direction === "up") {
        return `${item.displayName} चे दर ${item.trend_pct}% ने वाढत आहेत - चांगल्या नफ्यासाठी माल राखून ठेवा.`;
      } else if (item.trend_direction === "down") {
        return `${item.displayName} च्या दरात ${item.trend_pct}% घसरण होत आहे - अधिक नुकसान टाळण्यासाठी लवकर विक्री करा.`;
      } else {
        return `${item.displayName} चे दर स्थिर आहेत. सध्या विक्री करणे योग्य पर्याय आहे.`;
      }
    }
    return item.advisory_message;
  };

  const getTrendBadge = (item) => {
    if (item.trend_direction === "up") {
      return <span className="trend-badge trend-badge-up">+{item.trend_pct}%</span>;
    } else if (item.trend_direction === "down") {
      return <span className="trend-badge trend-badge-down">-{item.trend_pct}%</span>;
    } else {
      return <span className="trend-badge trend-badge-stable">{lang === "en" ? "Stable" : "स्थिर"}</span>;
    }
  };

  return (
    <div className="fade-in">
      <div className="dashboard-hero">
        <h1 className="hero-title">{t.dashboardTitle}</h1>
        <p className="hero-subtitle">{t.dashboardSubtitle}</p>
      </div>

      {/* Received Purchase Intents Banner for Farmer */}
      {myIntents.length > 0 && (
        <div style={{ marginBottom: 28, background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: 16, padding: 20, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 24 }}>📩</span>
              <div>
                <h3 style={{ margin: 0, fontSize: 18, color: "#002244" }}>
                  {lang === "en" ? "Received Purchase Intents & Buyer Offers" : "प्राप्त खरेदी प्रस्ताव व ऑफर"}
                </h3>
                <span style={{ fontSize: 13, color: "#64748b" }}>
                  {lang === "en" ? `You have ${pendingIntents.length} pending offer(s) from buyers` : `तुमच्याकडे ${pendingIntents.length} प्रलंबित प्रस्ताव आहेत`}
                </span>
              </div>
            </div>
            {pendingIntents.length > 0 && (
              <span style={{ background: "#fef3c7", color: "#b45309", padding: "4px 12px", borderRadius: 20, fontSize: 13, fontWeight: 700 }}>
                {pendingIntents.length} {lang === "en" ? "Action Required" : "कारवाई आवश्यक"}
              </span>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 14 }}>
            {myIntents.map((item) => (
              <div
                key={item.id}
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: 12,
                  padding: 16,
                  backgroundColor: item.status === "pending" ? "#f0fdf4" : item.status === "accepted" ? "#f8fafc" : "#fff1f2"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <strong style={{ color: "#002244" }}>🏢 {item.buyer_name}</strong>
                  <span style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: item.status === "pending" ? "#b45309" : item.status === "accepted" ? "#15803d" : "#b91c1c"
                  }}>
                    {item.status === "pending" ? "⏳ Pending" : item.status === "accepted" ? "✅ Accepted" : "❌ Declined"}
                  </span>
                </div>

                <div style={{ fontSize: 13, color: "#475569", margin: "6px 0" }}>
                  <div><strong>{lang === "en" ? "Crop & Quantity:" : "माल व प्रमाण:"}</strong> {item.commodity} ({item.quantity_kg} kg)</div>
                  <div><strong>{lang === "en" ? "Offered Rate:" : "दिलेला दर:"}</strong> <span style={{ color: "#006d3c", fontWeight: 700 }}>₹{item.offered_price.toLocaleString("en-IN")} / quintal</span></div>
                  {item.message && <div style={{ fontStyle: "italic", marginTop: 4, color: "#334155" }}>"{item.message}"</div>}
                </div>

                {/* Farmer Action Buttons */}
                {item.status === "pending" ? (
                  <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                    <button
                      className="contact-buyer-btn-filled"
                      style={{ flex: 1, padding: "6px 10px", fontSize: 12 }}
                      onClick={() => updateIntentStatus(item.id, "accepted")}
                    >
                      ✅ {lang === "en" ? "Accept Offer" : "स्वीकारा"}
                    </button>
                    <button
                      className="contact-buyer-btn-outline"
                      style={{ flex: 1, padding: "6px 10px", fontSize: 12, color: "#dc2626", borderColor: "#fca5a5" }}
                      onClick={() => updateIntentStatus(item.id, "rejected")}
                    >
                      ❌ {lang === "en" ? "Decline" : "नाकारा"}
                    </button>
                  </div>
                ) : item.status === "accepted" ? (
                  <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px dashed #cbd5e1", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12, color: "#006d3c", fontWeight: 700 }}>
                      📞 {item.buyer_phone}
                    </span>
                    <a
                      href={`tel:${item.buyer_phone}`}
                      className="welcome-action-btn farmer-action-btn"
                      style={{ textDecoration: "none", padding: "4px 10px", fontSize: 12 }}
                    >
                      📲 {lang === "en" ? "Call Buyer" : "फोन करा"}
                    </a>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>{t.loadingPrices}</p>
        </div>
      )}

      {error && (
        <div className="error-card">
          <div className="error-icon">⚠️</div>
          <div className="error-info">
            <h3>{t.errorTitle}</h3>
            <p>{t.errorSub} (Base: {process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000"})</p>
          </div>
        </div>
      )}

      {!loading && !error && (
        <div className="mandi-grid">
          {trends.map((item) => (
            <div className="mandi-card" key={`${item.commodity}-${item.district}`}>
              <div className="card-header">
                <div className="commodity-info">
                  <span className="commodity-avatar">
                    {COMMODITY_ICONS[item.commodity] || "🌾"}
                  </span>
                  <div>
                    <h2 className="commodity-name">{lang === "en" ? item.displayName : (item.commodity === "Onion" ? "कांदा" : item.commodity === "Tomato" ? "टोमॅटो" : item.commodity === "Soybean" ? "सोयाबीन" : item.commodity === "Tur" ? "तूर (Pigeon Pea)" : "कापूस")}</h2>
                    <span className="mandi-location">📍 {item.market} Mandi</span>
                  </div>
                </div>
                {getTrendBadge(item)}
              </div>

              <div className="price-section">
                <span className="price-val">₹{item.latest_modal_price.toLocaleString("en-IN")}</span>
                <span className="price-unit">{t.perQuintal}</span>
              </div>

              <div className={`advisory-box advisory-box-${item.trend_direction}`}>
                <div className="advisory-icon">
                  {item.trend_direction === "up" ? "📈" : item.trend_direction === "down" ? "📉" : "ℹ️"}
                </div>
                <div className="advisory-text">
                  {getAdvisory(item)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
