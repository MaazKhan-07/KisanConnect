"use client";
import { useEffect, useState } from "react";
import { getLots } from "@/lib/api";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import Link from "next/link";

const COMMODITY_ICONS = {
  "Onion": "🧅",
  "Tomato": "🍅",
  "Soybean": "🌱",
  "Cotton": "☁️",
  "Tur": "🫛",
};

// Fallback demo seller lots if database is fresh
const DEMO_SELLER_LOTS = [
  {
    id: 101,
    seller_name: "Ramesh Patil (Nashik Farmer Coop)",
    commodity: "Onion",
    quantity_kg: 5000,
    quality_grade: "A",
    district: "Nashik",
    created_at: "2026-08-24T10:00:00Z",
  },
  {
    id: 102,
    seller_name: "Suresh Deshmukh (Pune FPO)",
    commodity: "Tomato",
    quantity_kg: 3000,
    quality_grade: "B",
    district: "Pune",
    created_at: "2026-08-24T09:30:00Z",
  },
  {
    id: 103,
    seller_name: "Latur Organic Farmers Producer Co.",
    commodity: "Soybean",
    quantity_kg: 8000,
    quality_grade: "A",
    district: "Latur",
    created_at: "2026-08-24T08:15:00Z",
  },
  {
    id: 104,
    seller_name: "Vidarbha Cotton Collective",
    commodity: "Cotton",
    quantity_kg: 12000,
    quality_grade: "B",
    district: "Akola",
    created_at: "2026-08-24T11:10:00Z",
  },
];

export default function BuyerDashboardPage() {
  const { lang, t } = useLanguage();
  const { user } = useAuth();
  const { sendPurchaseIntent } = useNotifications();

  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterCommodity, setFilterCommodity] = useState("all");
  const [filterDistrict, setFilterDistrict] = useState("all");
  const [selectedSeller, setSelectedSeller] = useState(null);

  // Intent form fields
  const [offeredPrice, setOfferedPrice] = useState("2100");
  const [buyerPhone, setBuyerPhone] = useState("+91 98230 45678");
  const [intentNote, setIntentNote] = useState("");
  const [intentSuccess, setIntentSuccess] = useState(null);

  useEffect(() => {
    getLots()
      .then((data) => {
        // Merge fetched backend lots with sample lots if empty
        if (data && data.length > 0) {
          setLots(data);
        } else {
          setLots(DEMO_SELLER_LOTS);
        }
      })
      .catch(() => {
        // Fallback to sample demo lots if API fails
        setLots(DEMO_SELLER_LOTS);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredLots = lots.filter((item) => {
    const matchCommodity =
      filterCommodity === "all" || item.commodity === filterCommodity;
    const matchDistrict =
      filterDistrict === "all" || item.district === filterDistrict;
    return matchCommodity && matchDistrict;
  });

  const handleSendIntent = (e) => {
    e.preventDefault();
    if (!selectedSeller) return;

    sendPurchaseIntent({
      lot_id: selectedSeller.id,
      seller_name: selectedSeller.seller_name,
      buyer_name: user?.name || "Nashik AgroFresh (Trader)",
      buyer_email: user?.email || "buyer@kisan.com",
      buyer_phone: buyerPhone,
      commodity: selectedSeller.commodity,
      quantity_kg: selectedSeller.quantity_kg,
      offered_price: Number(offeredPrice) || 2100,
      message: intentNote || "Interested in purchasing your produce lot. Ready for inspection.",
      district: selectedSeller.district,
    });

    const sellerTitle = selectedSeller.seller_name;
    setSelectedSeller(null);
    setIntentNote("");
    setIntentSuccess(
      lang === "en"
        ? `✅ Purchase Intent sent to ${sellerTitle}! The farmer has received a real-time notification.`
        : `✅ ${sellerTitle} यांना खरेदी प्रस्ताव पाठवला! शेतकऱ्याला सूचना प्राप्त झाली आहे.`
    );
    setTimeout(() => setIntentSuccess(null), 7000);
  };

  return (
    <div className="fade-in">
      <div className="dashboard-hero">
        <h1 className="hero-title">{t.buyerTitle}</h1>
        <p className="hero-subtitle">{t.buyerSubtitle}</p>
      </div>

      {intentSuccess && (
        <div className="advisory-box advisory-box-up" style={{ marginBottom: 24 }}>
          {intentSuccess}
        </div>
      )}

      {/* Role Banner if logged in */}
      {user && (
        <div
          className="advisory-box advisory-box-up"
          style={{ marginBottom: 24, justifyContent: "space-between", alignItems: "center" }}
        >
          <div>
            <strong>🏢 {lang === "en" ? "Logged in as Buyer:" : "खरेदीदार म्हणून साइन इन:"}</strong> {user.name} ({user.email})
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, opacity: 0.8 }}>
            {lang === "en" ? "Verified Buyer Badge Active" : "सक्रिय खरेदीदार खाते"}
          </span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="buyer-filter-bar">
        <div className="filter-group">
          <label className="filter-label">{t.commodityLabel}:</label>
          <select
            className="sort-select"
            value={filterCommodity}
            onChange={(e) => setFilterCommodity(e.target.value)}
          >
            <option value="all">{t.filterCommodity}</option>
            <option value="Onion">🧅 {lang === "en" ? "Onion" : "कांदा"}</option>
            <option value="Tomato">🍅 {lang === "en" ? "Tomato" : "टोमॅटो"}</option>
            <option value="Soybean">🌱 {lang === "en" ? "Soybean" : "सोयाबीन"}</option>
            <option value="Cotton">☁️ {lang === "en" ? "Cotton" : "कापूस"}</option>
            <option value="Tur">🫛 {lang === "en" ? "Tur" : "तूर"}</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">{t.districtLabel}:</label>
          <select
            className="sort-select"
            value={filterDistrict}
            onChange={(e) => setFilterDistrict(e.target.value)}
          >
            <option value="all">{t.filterDistrict}</option>
            <option value="Nashik">Nashik (नाशिक)</option>
            <option value="Pune">Pune (पुणे)</option>
            <option value="Latur">Latur (लातूर)</option>
            <option value="Akola">Akola (अकोला)</option>
            <option value="Aurangabad">Aurangabad (औरंगाबाद)</option>
          </select>
        </div>
      </div>

      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>{t.loadingPrices}</p>
        </div>
      )}

      {!loading && (
        <div className="seller-lots-grid">
          {filteredLots.length === 0 ? (
            <div className="empty-matches-card" style={{ gridColumn: "1 / -1" }}>
              <p>{lang === "en" ? "No seller lots match your current filters." : "तुमच्या फिल्टरनुसार कोणतेही माल सापडले नाहीत."}</p>
            </div>
          ) : (
            filteredLots.map((lotItem) => (
              <div className="seller-card" key={lotItem.id}>
                <div className="seller-card-header">
                  <div className="seller-avatar-box">
                    <span className="seller-icon">{COMMODITY_ICONS[lotItem.commodity] || "🌾"}</span>
                  </div>
                  <div className="seller-title-group">
                    <h3 className="seller-name">{lotItem.seller_name}</h3>
                    <span className="seller-location">📍 {lotItem.district} District</span>
                  </div>
                  <span className={`grade-tag grade-tag-${lotItem.quality_grade}`}>
                    {t.sellerGrade} {lotItem.quality_grade}
                  </span>
                </div>

                <div className="seller-card-body">
                  <div className="seller-detail-row">
                    <span className="detail-key">{t.commodityLabel}:</span>
                    <span className="detail-val">{lotItem.commodity}</span>
                  </div>
                  <div className="seller-detail-row">
                    <span className="detail-key">{t.sellerQty}:</span>
                    <span className="detail-val-highlight">
                      {lotItem.quantity_kg.toLocaleString("en-IN")} kg
                    </span>
                  </div>
                </div>

                <div className="seller-card-footer">
                  <button
                    className="contact-buyer-btn-filled"
                    style={{ width: "100%" }}
                    onClick={() => setSelectedSeller(lotItem)}
                  >
                    🤝 {t.contactSeller}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Seller Contact Modal */}
      {selectedSeller && (
        <div className="modal-overlay">
          <div className="modal-card">
            <button className="modal-close" onClick={() => setSelectedSeller(null)}>×</button>
            <div className="modal-icon">📲</div>
            <h2 className="modal-title">
              {lang === "en" ? "Send Purchase Intent" : "खरेदी प्रस्ताव पाठवा"}
            </h2>
            <p className="modal-desc">
              {lang === "en"
                ? `Send an official purchase offer to ${selectedSeller.seller_name} for ${selectedSeller.quantity_kg} kg of ${selectedSeller.commodity}.`
                : `${selectedSeller.seller_name} यांच्या ${selectedSeller.quantity_kg} किलो ${selectedSeller.commodity} मालासाठी खरेदी प्रस्ताव पाठवा.`}
            </p>

            <form onSubmit={handleSendIntent} style={{ textAlign: "left", marginTop: 16 }}>
              <div className="modal-buyer-details" style={{ marginBottom: 16 }}>
                <div><strong>{lang === "en" ? "Seller:" : "विक्रेता:"}</strong> {selectedSeller.seller_name}</div>
                <div><strong>{lang === "en" ? "Lot Details:" : "मालाचा तपशील:"}</strong> {selectedSeller.commodity} ({selectedSeller.quantity_kg} kg) - Grade {selectedSeller.quality_grade}</div>
                <div><strong>{lang === "en" ? "District:" : "जिल्हा:"}</strong> {selectedSeller.district}</div>
              </div>

              <div className="form-group" style={{ marginBottom: 12 }}>
                <label className="form-label" style={{ fontSize: 13 }}>
                  {lang === "en" ? "Offered Price (₹ / Quintal):" : "प्रस्तावित दर (₹ / क्विंटल):"}
                </label>
                <input
                  type="number"
                  required
                  className="form-input"
                  value={offeredPrice}
                  onChange={(e) => setOfferedPrice(e.target.value)}
                  placeholder="e.g. 2100"
                />
              </div>

              <div className="form-group" style={{ marginBottom: 12 }}>
                <label className="form-label" style={{ fontSize: 13 }}>
                  {lang === "en" ? "Your Phone Number:" : "तुमचा फोन नंबर:"}
                </label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  placeholder="+91 98230 45678"
                />
              </div>

              <div className="form-group" style={{ marginBottom: 16 }}>
                <label className="form-label" style={{ fontSize: 13 }}>
                  {lang === "en" ? "Message for Farmer (Optional):" : "शेतकऱ्यासाठी संदेश (पर्यायी):"}
                </label>
                <textarea
                  className="form-input"
                  rows={2}
                  style={{ resize: "none" }}
                  value={intentNote}
                  onChange={(e) => setIntentNote(e.target.value)}
                  placeholder={lang === "en" ? "e.g. Ready for farm inspection and direct payment." : "उदा. थेट शेतावर येऊन रोख रक्कम देण्यास तयार."}
                />
              </div>

              <button type="submit" className="modal-confirm-btn">
                {lang === "en" ? "Send Purchase Intent →" : "खरेदीचा प्रस्ताव पाठवा →"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
