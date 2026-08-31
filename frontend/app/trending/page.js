"use client";
import { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import Link from "next/link";

const COMMODITIES_DATA = {
  Onion: {
    name: "Onion",
    mandi: "Lasalgaon Mandi (Nashik)",
    icon: "🧅",
    currentPrice: 2450,
    changePct: +8.4,
    direction: "up",
    history7d: [
      { date: "Aug 18", min: 2100, max: 2400, modal: 2260, arrival: 420 },
      { date: "Aug 19", min: 2150, max: 2450, modal: 2300, arrival: 450 },
      { date: "Aug 20", min: 2120, max: 2420, modal: 2280, arrival: 390 },
      { date: "Aug 21", min: 2200, max: 2500, modal: 2350, arrival: 410 },
      { date: "Aug 22", min: 2250, max: 2550, modal: 2400, arrival: 480 },
      { date: "Aug 23", min: 2280, max: 2600, modal: 2420, arrival: 460 },
      { date: "Aug 24", min: 2300, max: 2650, modal: 2450, arrival: 510 },
    ],
    advice: "Arrivals at Lasalgaon Mandi are moderate while Mumbai & South export demand is strong. Prices projected to gain +4-6% this week.",
  },
  Tomato: {
    name: "Tomato",
    mandi: "Pune Mandi",
    icon: "🍅",
    currentPrice: 1800,
    changePct: -2.1,
    direction: "down",
    history7d: [
      { date: "Aug 18", min: 1700, max: 2000, modal: 1880, arrival: 650 },
      { date: "Aug 19", min: 1680, max: 1980, modal: 1860, arrival: 680 },
      { date: "Aug 20", min: 1650, max: 1950, modal: 1840, arrival: 710 },
      { date: "Aug 21", min: 1620, max: 1920, modal: 1820, arrival: 730 },
      { date: "Aug 22", min: 1600, max: 1900, modal: 1810, arrival: 750 },
      { date: "Aug 23", min: 1580, max: 1880, modal: 1800, arrival: 760 },
      { date: "Aug 24", min: 1580, max: 1880, modal: 1800, arrival: 780 },
    ],
    advice: "Fresh harvest arrivals from Narayangaon have increased supply by 15%. Prices likely to remain rangebound or drop slightly.",
  },
  Soybean: {
    name: "Soybean",
    mandi: "Nagpur Mandi",
    icon: "🌱",
    currentPrice: 4200,
    changePct: 0.0,
    direction: "stable",
    history7d: [
      { date: "Aug 18", min: 4000, max: 4350, modal: 4200, arrival: 310 },
      { date: "Aug 19", min: 4020, max: 4360, modal: 4200, arrival: 300 },
      { date: "Aug 20", min: 4000, max: 4350, modal: 4190, arrival: 320 },
      { date: "Aug 21", min: 4050, max: 4380, modal: 4210, arrival: 290 },
      { date: "Aug 22", min: 4040, max: 4370, modal: 4200, arrival: 305 },
      { date: "Aug 23", min: 4050, max: 4380, modal: 4200, arrival: 315 },
      { date: "Aug 24", min: 4050, max: 4390, modal: 4200, arrival: 310 },
    ],
    advice: "Crushing plants in Vidarbha are offering stable buying prices. Storage is recommended if waiting for festival season demand.",
  },
  Cotton: {
    name: "Cotton",
    mandi: "Akola Mandi",
    icon: "☁️",
    currentPrice: 7100,
    changePct: +4.2,
    direction: "up",
    history7d: [
      { date: "Aug 18", min: 6600, max: 7100, modal: 6810, arrival: 180 },
      { date: "Aug 19", min: 6650, max: 7150, modal: 6880, arrival: 175 },
      { date: "Aug 20", min: 6700, max: 7200, modal: 6940, arrival: 190 },
      { date: "Aug 21", min: 6750, max: 7250, modal: 7000, arrival: 160 },
      { date: "Aug 22", min: 6800, max: 7300, modal: 7050, arrival: 165 },
      { date: "Aug 23", min: 6820, max: 7350, modal: 7080, arrival: 170 },
      { date: "Aug 24", min: 6850, max: 7400, modal: 7100, arrival: 185 },
    ],
    advice: "Textile mill inquiries in Gujarat & Maharashtra have increased by 20%. Price trend is strongly positive.",
  },
  Tur: {
    name: "Tur (Pigeon Pea)",
    mandi: "Latur Mandi",
    icon: "🫛",
    currentPrice: 9800,
    changePct: +1.5,
    direction: "up",
    history7d: [
      { date: "Aug 18", min: 9400, max: 9900, modal: 9650, arrival: 210 },
      { date: "Aug 19", min: 9450, max: 9950, modal: 9680, arrival: 205 },
      { date: "Aug 20", min: 9500, max: 10000, modal: 9720, arrival: 200 },
      { date: "Aug 21", min: 9520, max: 10050, modal: 9750, arrival: 195 },
      { date: "Aug 22", min: 9550, max: 10100, modal: 9780, arrival: 215 },
      { date: "Aug 23", min: 9580, max: 10120, modal: 9790, arrival: 220 },
      { date: "Aug 24", min: 9600, max: 10150, modal: 9800, arrival: 225 },
    ],
    advice: "Pulse mills in Latur & Solapur are actively stocking. Prices expected to remain firm with high demand.",
  },
};

export default function TrendingPage() {
  const { lang, t } = useLanguage();
  const [selectedCommodity, setSelectedCommodity] = useState("Onion");
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const item = COMMODITIES_DATA[selectedCommodity];
  const history = item.history7d;

  // Calculate chart boundaries
  const modalPrices = history.map((h) => h.modal);
  const minVal = Math.min(...history.map((h) => h.min)) - 50;
  const maxVal = Math.max(...history.map((h) => h.max)) + 50;
  const priceRange = maxVal - minVal || 1;

  // SVG dimensions
  const svgWidth = 700;
  const svgHeight = 240;
  const paddingX = 40;
  const paddingY = 20;
  const chartW = svgWidth - paddingX * 2;
  const chartH = svgHeight - paddingY * 2;

  // Calculate coordinates for SVG points
  const points = history.map((h, i) => {
    const x = paddingX + (i / (history.length - 1)) * chartW;
    const y = paddingY + chartH - ((h.modal - minVal) / priceRange) * chartH;
    return { x, y, data: h };
  });

  // SVG polyline path string
  const pointsString = points.map((p) => `${p.x},${p.y}`).join(" ");

  // Gradient area path
  const areaString = `${paddingX},${paddingY + chartH} ${pointsString} ${
    paddingX + chartW
  },${paddingY + chartH}`;

  const avgPrice = Math.round(
    modalPrices.reduce((a, b) => a + b, 0) / modalPrices.length
  );
  const peakPrice = Math.max(...history.map((h) => h.max));
  const lowestPrice = Math.min(...history.map((h) => h.min));

  return (
    <div className="fade-in">
      <div className="dashboard-hero">
        <h1 className="hero-title">{t.trendingTitle}</h1>
        <p className="hero-subtitle">{t.trendingSubtitle}</p>
      </div>

      {/* Commodity Switcher Pills */}
      <div className="trending-switcher-bar">
        {Object.keys(COMMODITIES_DATA).map((cKey) => {
          const cObj = COMMODITIES_DATA[cKey];
          return (
            <button
              key={cKey}
              className={`commodity-pill-btn ${
                selectedCommodity === cKey ? "active" : ""
              }`}
              onClick={() => {
                setSelectedCommodity(cKey);
                setHoveredPoint(null);
              }}
            >
              <span className="pill-icon">{cObj.icon}</span>
              <span className="pill-name">
                {lang === "mr" && cKey === "Onion"
                  ? "कांदा"
                  : lang === "mr" && cKey === "Tomato"
                  ? "टोमॅटो"
                  : lang === "mr" && cKey === "Soybean"
                  ? "सोयाबीन"
                  : lang === "mr" && cKey === "Tur"
                  ? "तूर"
                  : cKey}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Chart Section Card */}
      <div className="chart-card-main">
        <div className="chart-card-header">
          <div>
            <span className="chart-mandi-tag">📍 {item.mandi}</span>
            <h2 className="chart-commodity-title">
              {item.icon} {item.name} {lang === "en" ? "Real-Time Trade Chart" : "लाइव्ह दर आलेख"}
            </h2>
          </div>
          <div className="chart-price-stat-box">
            <span className="chart-current-price">₹{item.currentPrice.toLocaleString("en-IN")}</span>
            <span className="chart-unit">{t.perQuintal}</span>
            <span
              className={`trend-badge ${
                item.direction === "up"
                  ? "trend-badge-up"
                  : item.direction === "down"
                  ? "trend-badge-down"
                  : "trend-badge-stable"
              }`}
            >
              {item.direction === "up"
                ? `+${item.changePct}%`
                : item.direction === "down"
                ? `${item.changePct}%`
                : "Stable"}
            </span>
          </div>
        </div>

        {/* Dynamic Interactive SVG Line Chart */}
        <div className="svg-chart-wrapper">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="realtime-svg-chart"
          >
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
              const yVal = paddingY + chartH * pct;
              const priceVal = Math.round(maxVal - pct * priceRange);
              return (
                <g key={idx}>
                  <line
                    x1={paddingX}
                    y1={yVal}
                    x2={paddingX + chartW}
                    y2={yVal}
                    stroke="#e2e8f0"
                    strokeDasharray="4,4"
                  />
                  <text
                    x={paddingX - 8}
                    y={yVal + 4}
                    fill="#94a3b8"
                    fontSize="10"
                    textAnchor="end"
                  >
                    ₹{priceVal}
                  </text>
                </g>
              );
            })}

            {/* Gradient Area Fill */}
            <polygon points={areaString} fill="url(#chartGrad)" />

            {/* Main Trend Line */}
            <polyline
              fill="none"
              stroke="#10b981"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={pointsString}
            />

            {/* Data Point Circles */}
            {points.map((p, idx) => (
              <g key={idx}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={hoveredPoint && hoveredPoint.x === p.x ? 7 : 5}
                  fill="#ffffff"
                  stroke="#10b981"
                  strokeWidth="3"
                  className="chart-point-circle"
                  onMouseEnter={() => setHoveredPoint(p)}
                  onClick={() => setHoveredPoint(p)}
                />
                {/* X-axis date labels */}
                <text
                  x={p.x}
                  y={svgHeight - 2}
                  fill="#64748b"
                  fontSize="11"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  {p.data.date}
                </text>
              </g>
            ))}
          </svg>

          {/* Interactive Tooltip Overlay */}
          {hoveredPoint && (
            <div
              className="chart-tooltip-box"
              style={{
                left: `${(hoveredPoint.x / svgWidth) * 100}%`,
                top: `${(hoveredPoint.y / svgHeight) * 100}%`,
              }}
            >
              <div className="tooltip-date">{hoveredPoint.data.date}</div>
              <div className="tooltip-modal">₹{hoveredPoint.data.modal}/qtl</div>
              <div className="tooltip-range">
                Min: ₹{hoveredPoint.data.min} | Max: ₹{hoveredPoint.data.max}
              </div>
              <div className="tooltip-arrival">
                Arrivals: {hoveredPoint.data.arrival} qtl
              </div>
            </div>
          )}
        </div>

        {/* Chart Summary Metrics Row */}
        <div className="chart-metrics-grid">
          <div className="metric-box">
            <span className="metric-label">{t.chartHighest}</span>
            <span className="metric-val peak-val">₹{peakPrice.toLocaleString("en-IN")}</span>
          </div>
          <div className="metric-box">
            <span className="metric-label">{t.chartLowest}</span>
            <span className="metric-val low-val">₹{lowestPrice.toLocaleString("en-IN")}</span>
          </div>
          <div className="metric-box">
            <span className="metric-label">{t.chartAvg}</span>
            <span className="metric-val avg-val">₹{avgPrice.toLocaleString("en-IN")}</span>
          </div>
          <div className="metric-box">
            <span className="metric-label">{t.chartArrivals}</span>
            <span className="metric-val arrival-val">
              {history[history.length - 1].arrival} qtl
            </span>
          </div>
        </div>

        {/* Market Insights AI Advice Box */}
        <div className={`advisory-box advisory-box-${item.direction}`} style={{ marginTop: 24 }}>
          <div className="advisory-icon">🤖</div>
          <div className="advisory-text">
            <strong>{lang === "en" ? "AI Market Signal:" : "AI बाजार अंदाज:"}</strong> {item.advice}
          </div>
        </div>
      </div>
    </div>
  );
}
