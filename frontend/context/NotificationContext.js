"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

const NotificationContext = createContext();

const DEFAULT_INTENTS = [
  {
    id: "intent_demo_1",
    lot_id: 101,
    seller_name: "Ramesh Patil",
    buyer_name: "Nashik AgroFresh (Trader)",
    buyer_email: "buyer@kisan.com",
    buyer_phone: "+91 98230 45678",
    commodity: "Onion",
    quantity_kg: 5000,
    offered_price: 2100,
    message: "We need 5000 kg Grade A onions urgently. Ready for farm pickup in Nashik.",
    district: "Nashik",
    status: "pending", // 'pending' | 'accepted' | 'rejected'
    is_read: false,
    created_at: new Date(Date.now() - 3600000).toISOString(),
  }
];

export const NotificationProvider = ({ children }) => {
  const [intents, setIntents] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("kisan_intents");
      if (stored) {
        try {
          setIntents(JSON.parse(stored));
        } catch {
          setIntents(DEFAULT_INTENTS);
        }
      } else {
        setIntents(DEFAULT_INTENTS);
        localStorage.setItem("kisan_intents", JSON.stringify(DEFAULT_INTENTS));
      }
      setLoaded(true);
    }
  }, []);

  const saveIntents = (updatedIntents) => {
    setIntents(updatedIntents);
    if (typeof window !== "undefined") {
      localStorage.setItem("kisan_intents", JSON.stringify(updatedIntents));
    }
  };

  const sendPurchaseIntent = (intentData) => {
    const newIntent = {
      id: `intent_${Date.now()}`,
      seller_name: intentData.seller_name || "Ramesh Patil",
      buyer_name: intentData.buyer_name || "Verified Trader",
      buyer_email: intentData.buyer_email || "buyer@kisan.com",
      buyer_phone: intentData.buyer_phone || "+91 98230 12345",
      commodity: intentData.commodity,
      quantity_kg: intentData.quantity_kg,
      offered_price: intentData.offered_price || 2000,
      message: intentData.message || "Purchase intent submitted for your produce lot.",
      district: intentData.district,
      status: "pending",
      is_read: false,
      created_at: new Date().toISOString(),
    };

    const updated = [newIntent, ...intents];
    saveIntents(updated);
    return newIntent;
  };

  const updateIntentStatus = (intentId, status) => {
    const updated = intents.map((item) => {
      if (item.id === intentId) {
        return { ...item, status, is_read: true };
      }
      return item;
    });
    saveIntents(updated);
  };

  const markAllAsRead = () => {
    const updated = intents.map((item) => ({ ...item, is_read: true }));
    saveIntents(updated);
  };

  return (
    <NotificationContext.Provider
      value={{
        intents,
        sendPurchaseIntent,
        updateIntentStatus,
        markAllAsRead,
        loaded,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
