"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import AuthForm from "../../components/AuthForm";

export default function LoginPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { lang, t } = useLanguage();

  if (user) {
    return (
      <div className="fade-in" style={{ textAlign: "center", padding: "60px 0" }}>
        <div className="card" style={{ maxWidth: 480, margin: "0 auto", padding: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>
            {user.role === "farmer" ? "🌾" : "🏢"}
          </div>
          <h2>{user.name}</h2>
          <p style={{ color: "#64748b", margin: "8px 0 20px" }}>
            {lang === "en"
              ? `You are logged in as a ${user.role === "farmer" ? "Farmer" : "Buyer"}`
              : `तुम्ही ${user.role === "farmer" ? "शेतकरी" : "खरेदीदार"} म्हणून लॉग इन आहात`}
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            {user.role === "farmer" ? (
              <button
                className="contact-buyer-btn-filled"
                onClick={() => router.push("/lots/new")}
              >
                {t.listProduce}
              </button>
            ) : (
              <button
                className="contact-buyer-btn-filled"
                onClick={() => router.push("/buyers")}
              >
                {t.buyerDashboard}
              </button>
            )}
            <button
              className="contact-buyer-btn-outline"
              onClick={() => router.push("/")}
            >
              {t.priceDashboard}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <AuthForm />;
}
