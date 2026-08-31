"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { lang, toggleLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  const { intents, updateIntentStatus, markAllAsRead } = useNotifications();

  const [showNotifs, setShowNotifs] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cleanName = (name) => {
    if (!name) return "";
    return name.replace(/\s*\([^)]*\)/g, "").replace(/\s+/g, "").toLowerCase();
  };

  const myIntents = intents.filter(
    (i) => user && cleanName(i.seller_name) === cleanName(user.name)
  );

  const unreadCount = myIntents.filter((i) => !i.is_read).length;

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const isActive = (path) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  const getMatchesPath = () => {
    if (typeof window !== "undefined") {
      const lastLotId = localStorage.getItem("last_lot_id");
      if (lastLotId) {
        return `/lots/${lastLotId}/matches`;
      }
    }
    return "/lots/new";
  };

  const getFirstName = () => {
    if (!user || !user.name) return "";
    const clean = user.name.replace(/\s*\([^)]*\)/, "").trim();
    return clean.split(" ")[0];
  };

  const handleToggleNotifs = () => {
    if (!showNotifs) {
      markAllAsRead();
    }
    setShowNotifs(!showNotifs);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link href="/" className="nav-brand">
          <svg className="nav-logo-leaf" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 22 2c-2.48 5-3 6.5-4.1 12.2A7 7 0 0 1 11 20z"></path>
            <path d="M9 22v-4h4v4"></path>
            <path d="M22 2L11 13"></path>
          </svg>
          <span className="brand-text-kisan">KisanConnect</span>
        </Link>

        <div className="nav-links">
          {user && (
            user.role === "buyer" ? (
              <Link href="/buyers" className={`nav-link ${isActive("/buyers") ? "active" : ""}`}>
                {t.buyerDashboard}
              </Link>
            ) : (
              <>
                <Link href="/" className={`nav-link ${isActive("/") ? "active" : ""}`}>
                  {t.priceDashboard}
                </Link>
                <Link href="/trending" className={`nav-link ${isActive("/trending") ? "active" : ""}`}>
                  📈 {t.trending}
                </Link>
                <Link href="/lots/new" className={`nav-link ${isActive("/lots/new") ? "active" : ""}`}>
                  {t.listProduce}
                </Link>
                <Link href={getMatchesPath()} className={`nav-link ${isActive("/matches") || pathname.includes("/matches") ? "active" : ""}`}>
                  {t.matches}
                </Link>
              </>
            )
          )}
        </div>

        <div className="nav-right">
          {/* Notification Bell ONLY for Farmer Role */}
          {user && user.role === "farmer" && (
            <div style={{ position: "relative" }}>
              <button
                className="lang-toggle-btn"
                onClick={handleToggleNotifs}
                title={lang === "en" ? "Purchase Intent Notifications" : "खरेदी सूचना"}
                style={{
                  position: "relative",
                  padding: "8px 14px",
                  borderColor: unreadCount > 0 ? "#f59e0b" : "var(--border-light)",
                  backgroundColor: unreadCount > 0 ? "#fffbeb" : "transparent"
                }}
              >
                <span>🔔</span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>
                  {lang === "en" ? "Offers" : "प्रस्ताव"}
                </span>
                {unreadCount > 0 && (
                  <span style={{
                    backgroundColor: "#ef4444",
                    color: "#ffffff",
                    borderRadius: "10px",
                    padding: "1px 6px",
                    fontSize: "11px",
                    fontWeight: "bold",
                    marginLeft: 4
                  }}>
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
          )}

          <button className="lang-toggle-btn" onClick={toggleLanguage} title={t.langToggle}>
            <svg className="globe-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
            <span>{lang === "en" ? "Marathi" : "English"}</span>
          </button>

          {user ? (
            <div className="user-profile-badge">
              <span className="user-name">
                {user.role === "farmer" ? "🌾 " : "🏢 "}
                {getFirstName()}
              </span>
              <button className="logout-btn" onClick={handleLogout} title={t.logout}>
                {t.logout}
              </button>
            </div>
          ) : (
            <Link href="/login" className="login-nav-btn">
              {t.login}
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
        >
          {isMobileMenuOpen ? (
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Collapsible Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-drawer">
          <div className="mobile-drawer-links">
            {user && (
              user.role === "buyer" ? (
                <Link
                  href="/buyers"
                  className={`mobile-drawer-link ${isActive("/buyers") ? "active" : ""}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t.buyerDashboard}
                </Link>
              ) : (
                <>
                  <Link
                    href="/"
                    className={`mobile-drawer-link ${isActive("/") ? "active" : ""}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t.priceDashboard}
                  </Link>
                  <Link
                    href="/trending"
                    className={`mobile-drawer-link ${isActive("/trending") ? "active" : ""}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    📈 {t.trending}
                  </Link>
                  <Link
                    href="/lots/new"
                    className={`mobile-drawer-link ${isActive("/lots/new") ? "active" : ""}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t.listProduce}
                  </Link>
                  <Link
                    href={getMatchesPath()}
                    className={`mobile-drawer-link ${isActive("/matches") || pathname.includes("/matches") ? "active" : ""}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t.matches}
                  </Link>
                </>
              )
            )}
          </div>

          <div className="mobile-drawer-actions">
            {/* Notification Bell ONLY for Farmer Role in Mobile Drawer */}
            {user && user.role === "farmer" && (
              <button
                className="mobile-action-btn-styled"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleToggleNotifs();
                }}
                style={{
                  borderColor: unreadCount > 0 ? "#f59e0b" : "var(--border-light)",
                  backgroundColor: unreadCount > 0 ? "#fffbeb" : "transparent"
                }}
              >
                <span>🔔</span>
                <span style={{ fontWeight: 600 }}>
                  {lang === "en" ? "Offers" : "प्रस्ताव"}
                </span>
                {unreadCount > 0 && (
                  <span className="mobile-unread-badge">{unreadCount}</span>
                )}
              </button>
            )}

            {/* Language Switcher */}
            <button
              className="mobile-action-btn-styled"
              onClick={() => {
                setIsMobileMenuOpen(false);
                toggleLanguage();
              }}
            >
              <svg className="globe-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
              <span>{lang === "en" ? "Marathi" : "English"}</span>
            </button>

            {/* Profile & Logout */}
            {user ? (
              <div className="mobile-user-profile-badge">
                <span className="user-name">
                  {user.role === "farmer" ? "🌾 " : "🏢 "}
                  {getFirstName()}
                </span>
                <button className="logout-btn" onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }} title={t.logout}>
                  {t.logout}
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="login-nav-btn"
                style={{ display: "block", textAlign: "center", width: "100%" }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t.login}
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Notifications Drawer Modal */}
      {showNotifs && (
        <div className="modal-overlay" style={{ zIndex: 999 }}>
          <div className="modal-card" style={{ maxWidth: 540, textAlign: "left" }}>
            <button className="modal-close" onClick={() => setShowNotifs(false)}>×</button>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: 24 }}>📩</span>
              <div>
                <h2 className="modal-title" style={{ margin: 0 }}>
                  {lang === "en" ? "Received Purchase Intents" : "प्राप्त खरेदी प्रस्ताव"}
                </h2>
                <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
                  {lang === "en"
                    ? "Direct offers submitted by buyers for your produce lots"
                    : "तुमच्या मालासाठी खरेदीदारांनी पाठवलेले प्रस्ताव"}
                </p>
              </div>
            </div>

            {myIntents.length === 0 ? (
              <div style={{ textAlign: "center", padding: "32px 0", color: "#64748b" }}>
                <p>{lang === "en" ? "No purchase intents received yet." : "अद्याप कोणतेही खरेदी प्रस्ताव आले नाहीत."}</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14, maxHeight: 400, overflowY: "auto", paddingRight: 4 }}>
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
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                      <div>
                        <strong style={{ fontSize: 15, color: "#002244" }}>🏢 {item.buyer_name}</strong>
                        <div style={{ fontSize: 12, color: "#64748b" }}>
                          📍 {item.district} District • {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      <span style={{
                        padding: "4px 10px",
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 700,
                        backgroundColor: item.status === "pending" ? "#fef3c7" : item.status === "accepted" ? "#dcfce7" : "#fee2e2",
                        color: item.status === "pending" ? "#b45309" : item.status === "accepted" ? "#15803d" : "#b91c1c"
                      }}>
                        {item.status === "pending"
                          ? (lang === "en" ? "⏳ Pending Review" : "⏳ प्रलंबित")
                          : item.status === "accepted"
                          ? (lang === "en" ? "✅ Deal Accepted" : "✅ स्वीकारले")
                          : (lang === "en" ? "❌ Offer Declined" : "❌ नाकारले")}
                      </span>
                    </div>

                    <div style={{ fontSize: 14, margin: "8px 0", color: "#334155" }}>
                      <div><strong>{lang === "en" ? "Crop:" : "शेतमाल:"}</strong> {item.commodity} ({item.quantity_kg} kg)</div>
                      <div><strong>{lang === "en" ? "Offered Price:" : "दिलेला दर:"}</strong> <span style={{ color: "#006d3c", fontWeight: 700 }}>₹{item.offered_price.toLocaleString("en-IN")} / quintal</span></div>
                      {item.message && (
                        <div style={{ fontStyle: "italic", fontSize: 13, background: "#ffffff", padding: "6px 10px", borderRadius: 6, margin: "6px 0", border: "1px solid #cbd5e1" }}>
                          "{item.message}"
                        </div>
                      )}
                    </div>

                    {/* Action buttons for Farmer */}
                    {item.status === "pending" && (
                      <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                        <button
                          className="contact-buyer-btn-filled"
                          style={{ flex: 1, padding: "8px 12px", fontSize: 13 }}
                          onClick={() => updateIntentStatus(item.id, "accepted")}
                        >
                          ✅ {lang === "en" ? "Accept Offer" : "स्वीकारा"}
                        </button>
                        <button
                          className="contact-buyer-btn-outline"
                          style={{ flex: 1, padding: "8px 12px", fontSize: 13, color: "#dc2626", borderColor: "#fca5a5" }}
                          onClick={() => updateIntentStatus(item.id, "rejected")}
                        >
                          ❌ {lang === "en" ? "Decline" : "नाकारा"}
                        </button>
                      </div>
                    )}

                    {item.status === "accepted" && (
                      <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px dashed #cbd5e1", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#006d3c" }}>
                          📞 {lang === "en" ? "Buyer Contact:" : "खरेदीदार संपर्क:"} {item.buyer_phone}
                        </span>
                        <a
                          href={`tel:${item.buyer_phone}`}
                          className="welcome-action-btn farmer-action-btn"
                          style={{ textDecoration: "none", padding: "6px 12px", fontSize: 12 }}
                        >
                          📲 {lang === "en" ? "Call Buyer" : "फोन करा"}
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <button
              className="find-buyers-submit-btn"
              style={{ marginTop: 16 }}
              onClick={() => setShowNotifs(false)}
            >
              {lang === "en" ? "Close" : "बंद करा"}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
