"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createLot } from "@/lib/api";
import { useLanguage } from "../../../context/LanguageContext";

const COMMODITIES = [
  { value: "Onion", en: "Onion", mr: "कांदा (Onion)" },
  { value: "Tomato", en: "Tomato", mr: "टोमॅटो (Tomato)" },
  { value: "Soybean", en: "Soybean", mr: "सोयाबीन (Soybean)" },
  { value: "Tur", en: "Tur", mr: "तूर (Tur)" },
  { value: "Cotton", en: "Cotton", mr: "कापूस (Cotton)" }
];

const DISTRICTS = [
  { value: "Nashik", en: "Nashik", mr: "नाशिक (Nashik)" },
  { value: "Pune", en: "Pune", mr: "पुणे (Pune)" },
  { value: "Latur", en: "Latur", mr: "लातूर (Latur)" },
  { value: "Akola", en: "Akola", mr: "अकोला (Akola)" },
  { value: "Aurangabad", en: "Aurangabad", mr: "औरंगाबाद (Aurangabad)" }
];

export default function NewLotPage() {
  const router = useRouter();
  const { lang, t } = useLanguage();
  
  const [form, setForm] = useState({
    seller_name: "",
    commodity: "Onion",
    quantity_kg: "",
    quality_grade: "B",
    district: "Nashik",
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.seller_name.trim()) return;
    if (!form.quantity_kg || parseFloat(form.quantity_kg) <= 0) return;

    setSubmitting(true);
    setError(null);
    try {
      const lot = await createLot({
        ...form,
        quantity_kg: parseFloat(form.quantity_kg),
      });
      // Save last lot ID in localStorage so the "Matches" nav link works
      localStorage.setItem("last_lot_id", lot.id);
      router.push(`/lots/${lot.id}/matches`);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <div className="fade-in">
      <div className="form-hero">
        <h1 className="hero-title">{t.listTitle}</h1>
        <p className="hero-subtitle">{t.listSubtitle}</p>
      </div>

      <div className="form-layout-grid">
        {/* Left Column: Form */}
        <div className="form-container-card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">{t.sellerNameLabel}</label>
              <input
                type="text"
                required
                className="form-input"
                value={form.seller_name}
                onChange={(e) => update("seller_name", e.target.value)}
                placeholder={t.sellerNamePlaceholder}
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t.commodityLabel}</label>
              <div className="select-wrapper">
                <select 
                  className="form-select"
                  value={form.commodity} 
                  onChange={(e) => update("commodity", e.target.value)}
                >
                  {COMMODITIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {lang === "en" ? c.en : c.mr}
                    </option>
                  ))}
                </select>
                <span className="select-arrow">▼</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">{t.quantityLabel}</label>
              <input
                required
                type="number"
                min="1"
                className="form-input"
                value={form.quantity_kg}
                onChange={(e) => update("quantity_kg", e.target.value)}
                placeholder={t.quantityPlaceholder}
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t.qualityGradeLabel}</label>
              <div className="grade-selector-group">
                <button
                  type="button"
                  className={`grade-btn ${form.quality_grade === "A" ? "active" : ""}`}
                  onClick={() => update("quality_grade", "A")}
                >
                  <span className="grade-letter">A</span>
                  <span className="grade-desc">{t.premiumGrade}</span>
                </button>
                <button
                  type="button"
                  className={`grade-btn ${form.quality_grade === "B" ? "active" : ""}`}
                  onClick={() => update("quality_grade", "B")}
                >
                  <span className="grade-letter">B</span>
                  <span className="grade-desc">{t.standardGrade}</span>
                </button>
                <button
                  type="button"
                  className={`grade-btn ${form.quality_grade === "C" ? "active" : ""}`}
                  onClick={() => update("quality_grade", "C")}
                >
                  <span className="grade-letter">C</span>
                  <span className="grade-desc">{t.fairGrade}</span>
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">{t.districtLabel}</label>
              <div className="select-wrapper">
                <select 
                  className="form-select"
                  value={form.district} 
                  onChange={(e) => update("district", e.target.value)}
                >
                  {DISTRICTS.map((d) => (
                    <option key={d.value} value={d.value}>
                      {lang === "en" ? d.en : d.mr}
                    </option>
                  ))}
                </select>
                <span className="select-arrow">▼</span>
              </div>
            </div>

            {error && <div className="error-box" style={{ marginTop: 18 }}>{error}</div>}

            <button type="submit" className="find-buyers-submit-btn" disabled={submitting}>
              <svg className="search-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <span>{submitting ? t.findingBuyersBtn : t.findBuyersBtn}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Decorative Card & Badge */}
        <div className="preview-container">
          <div className="preview-card-frame">
            {form.seller_name ? (
              <div className="live-preview-content">
                <div className="live-preview-header">
                  <span className="live-badge">{lang === "en" ? "Live Lot Preview" : "थेट माल पूर्वावलोकन"}</span>
                </div>
                <div className="live-preview-body">
                  <div className="preview-item">
                    <span className="preview-label">{t.sellerNameLabel}</span>
                    <span className="preview-val">{form.seller_name}</span>
                  </div>
                  <div className="preview-item">
                    <span className="preview-label">{t.commodityLabel}</span>
                    <span className="preview-val">
                      {lang === "en" 
                        ? COMMODITIES.find(c => c.value === form.commodity)?.en 
                        : COMMODITIES.find(c => c.value === form.commodity)?.mr.split(" (")[0]}
                    </span>
                  </div>
                  <div className="preview-item-row">
                    <div>
                      <span className="preview-label">{t.quantityLabel}</span>
                      <span className="preview-val">{parseFloat(form.quantity_kg || 0).toLocaleString("en-IN")} kg</span>
                    </div>
                    <div>
                      <span className="preview-label">{t.qualityGradeLabel}</span>
                      <span className="preview-val-grade">{form.quality_grade}</span>
                    </div>
                  </div>
                  <div className="preview-item">
                    <span className="preview-label">{t.districtLabel}</span>
                    <span className="preview-val">
                      📍 {lang === "en" 
                        ? DISTRICTS.find(d => d.value === form.district)?.en 
                        : DISTRICTS.find(d => d.value === form.district)?.mr.split(" (")[0]}
                    </span>
                  </div>
                </div>
                <div className="live-preview-footer">
                  <div className="preview-radar">
                    <div className="radar-circle-1"></div>
                    <div className="radar-circle-2"></div>
                    <span className="radar-text">{lang === "en" ? "Ready to Match" : "शोधण्यासाठी तयार"}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="empty-preview-state">
                <svg className="empty-preview-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                <p className="empty-preview-text">
                  {lang === "en" 
                    ? "Fill out the harvest details to generate your lot preview card in real-time."
                    : "रिअल-टाइममध्ये तुमच्या मालाचे पूर्वावलोकन कार्ड तयार करण्यासाठी माहिती भरा."}
                </p>
              </div>
            )}

            {/* Floating Active Buyers Badge */}
            <div className="active-buyers-floating-badge">
              <div className="active-badge-icon-box">
                <svg className="active-badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  <polyline points="9 11 11 13 15 9"></polyline>
                </svg>
              </div>
              <div className="active-badge-content">
                <span className="active-badge-title">{t.activeBuyersBadge}</span>
                <span className="active-badge-number">2,450+</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
