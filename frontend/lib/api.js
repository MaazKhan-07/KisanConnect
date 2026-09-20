const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://kisanconnectt.onrender.com";
//"http://localhost:8000"

export async function getPriceTrends() {
  const res = await fetch(`${API_BASE}/prices/`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch price trends");
  return res.json();
}

export async function createLot(lot) {
  const res = await fetch(`${API_BASE}/lots/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(lot),
  });
  if (!res.ok) throw new Error("Failed to create lot");
  return res.json();
}

export async function getMatches(lotId) {
  const res = await fetch(`${API_BASE}/lots/${lotId}/matches`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch matches");
  return res.json();
}

export async function getLot(lotId) {
  const res = await fetch(`${API_BASE}/lots/${lotId}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch lot details");
  return res.json();
}

export async function getLots() {
  const res = await fetch(`${API_BASE}/lots/`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch crop lots");
  return res.json();
}


