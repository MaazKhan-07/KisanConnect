"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getMatches, getLot } from "@/lib/api";
import { useLanguage } from "../../../../context/LanguageContext";
import Link from "next/link";

const GRADE_RANK = { A: 3, B: 2, C: 1 };

/**
 * Client-side matching: scores a local buyer profile against a lot
 * using the same algorithm as the backend matching.py
 */
function scoreLocalBuyer(profile, lot) {
  let score = 0;
  const reasons = [];

  // Location match
  if (profile.district === lot.district) {
    score += 40;
    reasons.push(`Same district (${lot.district})`);
  } else {
    score += 15;
    reasons.push(`Different district (${profile.district})`);
  }

  // Quality match
  const lotRank = GRADE_RANK[lot.quality_grade] || 1;
  const reqRank = GRADE_RANK[profile.quality_grade] || 1;
  if (lotRank >= reqRank) {
    score += 30;
    reasons.push(`Grade ${lot.quality_grade} meets requirement (min ${profile.quality_grade})`);
  } else {
    score += 5;
    reasons.push(`Grade ${lot.quality_grade} below requirement (min ${profile.quality_grade})`);
  }

  // Quantity fit – local profiles don't specify quantity_needed, so give partial credit
  score += 10;
  reasons.push("Quantity match pending verification");

  // Reliability – new buyers default to 4.0
  const rating = profile.reliability_rating || 4.0;
  score += rating * 3;
  reasons.push(`Buyer rating ${rating}/5`);

  return {
    buyer_id: profile.id || `local_${Date.now()}`,
    buyer_name: profile.company_name,
    match_score: Math.round(Math.min(score, 100) * 10) / 10,
    reasons,
    district: profile.district,
    max_price: profile.max_price,
    reliability_rating: rating,
    contact: profile.contact,
    quality_grade: profile.quality_grade,
    is_local_profile: true,
  };
}

export default function MatchesPage() {
  const { lotId } = useParams();
  const router = useRouter();
  const { lang, t } = useLanguage();
  
  const [matches, setMatches] = useState([]);
  const [lot, setLot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [sortBy, setSortBy] = useState("price");

  useEffect(() => {
    Promise.all([getLot(lotId), getMatches(lotId)])
      .then(([lotData, matchesData]) => {
        setLot(lotData);

        // Load local buyer profiles from localStorage
        let localProfiles = [];
        try {
          const stored = localStorage.getItem("kisan_buyer_profiles");
          if (stored) {
            localProfiles = JSON.parse(stored);
          }
        } catch {
          localProfiles = [];
        }

        // Filter local profiles that match the lot's commodity & score them
        const localMatches = localProfiles
          .filter((p) => p.commodity === lotData.commodity)
          .map((p) => scoreLocalBuyer(p, lotData));

        // Merge: combine API matches with local buyer profile matches
        const combined = [...matchesData, ...localMatches];
        
        // Sort by match score descending
        combined.sort((a, b) => b.match_score - a.match_score);

        setMatches(combined);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [lotId]);

  const handleContactBuyer = (buyer) => {
    setSelectedBuyer(buyer);
  };

  const getTags = (m) => {
    const tags = [];
    
    // Distance or location tag
    if (m.is_local_profile) {
      tags.push(lang === "en" ? `📍 ${m.district}` : `📍 ${m.district}`);
    } else {
      const distMap = { 1: "3km away", 2: "45km away", 3: "15km away", 4: "8km away" };
      tags.push(distMap[m.buyer_id] || `${(typeof m.buyer_id === 'number' ? (m.buyer_id * 11) % 40 + 2 : 12)}km away`);
    }

    // Quality Grade
    if (m.reasons.some(r => r.includes("meets requirement") || r.includes("Grade"))) {
      tags.push(lang === "en" ? `Grade ${lot?.quality_grade || "A"} Accepted` : `श्रेणी ${lot?.quality_grade || "A"} स्वीकृत`);
    }

    // Quantity Match
    if (m.reasons.some(r => r.includes("fully covers"))) {
      tags.push(lang === "en" ? "Bulk Quantity Match" : "घाऊक प्रमाण मॅच");
    }

    // Reliability
    if (m.reliability_rating >= 4.5) {
      tags.push(lang === "en" ? "High Reliability" : "उच्च विश्वासार्हता");
    }

    // Local profile tag
    if (m.is_local_profile) {
      tags.push(lang === "en" ? "🆕 New Buyer" : "🆕 नवीन खरेदीदार");
    }

    // Transport Mock (only for seeded buyers)
    if (!m.is_local_profile && typeof m.buyer_id === 'number' && m.buyer_id % 2 === 1) {
      tags.push(lang === "en" ? "Transport Provided" : "वाहतूक उपलब्ध");
    }

    return tags;
  };

  const sortedMatches = [...matches].sort((a, b) => {
    if (sortBy === "score") {
      return b.match_score - a.match_score;
    } else if (sortBy === "price") {
      return b.max_price - a.max_price;
    } else {
      return b.reliability_rating - a.reliability_rating;
    }
  });

  const getCommodityName = (cName) => {
    if (lang === "mr") {
      const maps = { Onion: "कांदा", Tomato: "टोमॅटो", Soybean: "सोयाबीन", Tur: "तूर", Cotton: "कापूस" };
      return maps[cName] || cName;
    }
    return cName;
  };

  return (
    <div className="fade-in">
      {/* Back button */}
      <Link href="/" className="back-link">
        <span className="back-arrow">←</span> {t.backToDashboard}
      </Link>

      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>{t.findingBuyersBtn}</p>
        </div>
      )}

      {error && (
        <div className="error-card">
          <div className="error-icon">⚠️</div>
          <div className="error-info">
            <h3>{t.errorTitle}</h3>
            <p>{error}</p>
          </div>
        </div>
      )}

      {!loading && !error && (
        <div className="matches-layout">
          {/* Header row */}
          <div className="matches-header-row">
            <h1 className="matches-title">
              {matches.length} {lang === "en" ? t.buyersFound : "खरेदीदार सापडले, तुमच्या"} {getCommodityName(lot?.commodity)} {lang === "en" ? t.lotSuffix : "साठी"}
            </h1>
            <div className="sort-wrapper">
              <label htmlFor="sort-select" style={{ display: "none" }}>{t.sortBy}</label>
              <select 
                id="sort-select"
                className="sort-select" 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="score">{lang === "en" ? "Sort by: Match Score" : "क्रमवारी: मॅच स्कोअर"}</option>
                <option value="price">{lang === "en" ? "Sort by: Price Offer" : "क्रमवारी: किंमत ऑफर"}</option>
                <option value="rating">{lang === "en" ? "Sort by: Buyer Rating" : "क्रमवारी: खरेदीदार रेटिंग"}</option>
              </select>
            </div>
          </div>

          {matches.length === 0 ? (
            <div className="empty-matches-card">
              <p>{t.noMatches}</p>
              <Link href="/lots/new" className="action-btn-primary" style={{ display: "inline-block", marginTop: 14 }}>
                {t.listProduce}
              </Link>
            </div>
          ) : (
            <div className="matches-list">
              {sortedMatches.map((m, idx) => {
                const isBest = idx === 0;
                return (
                  <div className={`match-card ${isBest ? "best-match-border" : ""}`} key={m.buyer_id}>
                    {isBest && (
                      <div className="best-match-tag">
                        ⭐ {lang === "en" ? "Best Match" : "सर्वोत्तम खरेदीदार"}
                      </div>
                    )}

                    <div className="match-card-content">
                      {/* Left: Circle Match Score */}
                      <div className="match-circle-container">
                        <div className={`match-score-ring ${isBest ? "score-ring-green" : "score-ring-grey"}`}>
                          <span className="score-pct-num">{Math.round(m.match_score)}%</span>
                          <span className="score-pct-label">{lang === "en" ? "MATCH" : "जुळणी"}</span>
                        </div>
                      </div>

                      {/* Middle: Info */}
                      <div className="match-info-container">
                        <div className="buyer-name-row">
                          <h2 className="buyer-name">{m.buyer_name}</h2>
                          {m.reliability_rating >= 4.4 && (
                            <span className="verified-badge" title="Verified Buyer">
                              <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
                              </svg>
                            </span>
                          )}
                          {m.is_local_profile && (
                            <span style={{
                              background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
                              color: "#15803d",
                              padding: "2px 10px",
                              borderRadius: 20,
                              fontSize: 11,
                              fontWeight: 700,
                              marginLeft: 6,
                              border: "1px solid #bbf7d0"
                            }}>
                              {lang === "en" ? "New Profile" : "नवीन"}
                            </span>
                          )}
                        </div>

                        <div className="buyer-meta-row">
                          <span>📍 {lang === "en" ? `${m.district} District` : `${m.district} जिल्हा`}</span>
                          <span className="meta-dot">•</span>
                          <span className="rating-span">★ {m.reliability_rating}</span>
                          {!m.is_local_profile && (
                            <span className="deal-count-span">
                              {lang === "en" ? `(${typeof m.buyer_id === 'number' ? m.buyer_id * 24 + 12 : 12} deals)` : `(${typeof m.buyer_id === 'number' ? m.buyer_id * 24 + 12 : 12} व्यवहार)`}
                            </span>
                          )}
                          {m.is_local_profile && m.contact && (
                            <span className="deal-count-span">
                              📞 {m.contact}
                            </span>
                          )}
                        </div>

                        {/* Buyer Requirements (for local profiles) */}
                        {m.is_local_profile && m.quality_grade && (
                          <div style={{
                            fontSize: 12,
                            color: "#475569",
                            marginTop: 4,
                            display: "flex",
                            gap: 12,
                            flexWrap: "wrap"
                          }}>
                            <span>
                              <strong>{lang === "en" ? "Min Grade:" : "किमान श्रेणी:"}</strong> {m.quality_grade}
                            </span>
                            <span>
                              <strong>{lang === "en" ? "Max Price:" : "कमाल किंमत:"}</strong> ₹{m.max_price?.toLocaleString("en-IN")}/qtl
                            </span>
                          </div>
                        )}

                        {/* Tags */}
                        <div className="match-tags-row">
                          {getTags(m).map((tag, i) => (
                            <span className="match-pill" key={i}>{tag}</span>
                          ))}
                        </div>
                      </div>

                      {/* Right: Price & Button */}
                      <div className="match-action-container">
                        <div className="price-offer-box">
                          <span className="offer-label">{lang === "en" ? "Max Price Offer" : "कमाल किंमत ऑफर"}</span>
                          <span className="offer-price">₹{m.max_price.toLocaleString("en-IN")}<span className="offer-unit">{t.perQtl}</span></span>
                        </div>

                        <button 
                          onClick={() => handleContactBuyer(m)}
                          className={isBest ? "contact-buyer-btn-filled" : "contact-buyer-btn-outline"}
                        >
                          {isBest ? t.contactBuyer : t.viewDetails}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Load More Button */}
          <div className="load-more-container">
            <button className="load-more-btn" onClick={() => alert(lang === "en" ? "All matched buyers loaded!" : "सर्व खरेदीदार लोड झाले आहेत!")}>
              <span>{t.loadMoreBuyers}</span>
              <span className="arrow-down">▼</span>
            </button>
          </div>
        </div>
      )}

      {/* Contact modal */}
      {selectedBuyer && (
        <div className="modal-overlay">
          <div className="modal-card">
            <button className="modal-close" onClick={() => setSelectedBuyer(null)}>×</button>
            <div className="modal-icon">🎉</div>
            <h2 className="modal-title">
              {lang === "en" ? "Connect with Buyer!" : "खरेदीदाराशी संपर्क साधा!"}
            </h2>
            <p className="modal-desc">
              {lang === "en"
                ? `An SMS and WhatsApp notification has been sent to ${selectedBuyer.buyer_name} containing your harvest information.`
                : `तुमच्या शेतमालाची माहिती ${selectedBuyer.buyer_name} ला SMS आणि WhatsApp द्वारे पाठवली गेली आहे.`}
            </p>
            <div className="modal-buyer-details">
              <div><strong>{lang === "en" ? "Buyer:" : "खरेदीदार:"}</strong> {selectedBuyer.buyer_name}</div>
              <div><strong>{lang === "en" ? "District:" : "जिल्हा:"}</strong> {selectedBuyer.district}</div>
              <div><strong>{lang === "en" ? "Price Offer:" : "किंमत ऑफर:"}</strong> ₹{selectedBuyer.max_price}/qtl</div>
              <div><strong>{lang === "en" ? "Rating:" : "रेटिंग:"}</strong> ★ {selectedBuyer.reliability_rating}</div>
              {selectedBuyer.is_local_profile && selectedBuyer.contact && (
                <div><strong>{lang === "en" ? "Contact:" : "संपर्क:"}</strong> {selectedBuyer.contact}</div>
              )}
              {selectedBuyer.is_local_profile && selectedBuyer.quality_grade && (
                <div><strong>{lang === "en" ? "Quality Required:" : "गुणवत्ता:"}</strong> Grade {selectedBuyer.quality_grade}</div>
              )}
            </div>
            <p className="modal-phone">
              📞 {selectedBuyer.is_local_profile && selectedBuyer.contact
                ? (lang === "en" ? `Buyer Contact: ${selectedBuyer.contact}` : `खरेदीदार संपर्क: ${selectedBuyer.contact}`)
                : (lang === "en" ? "Buyer Contact: +91 98765 43210" : "खरेदीदार संपर्क: +९१ ९८७६५ ४३२१०")}
            </p>
            <button className="modal-confirm-btn" onClick={() => setSelectedBuyer(null)}>
              {lang === "en" ? "Done" : "पूर्ण"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
