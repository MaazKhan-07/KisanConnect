"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export const translations = {
  en: {
    brandName: "KisanConnect",
    priceDashboard: "Price Dashboard",
    listProduce: "List Produce",
    matches: "Matches",
    trending: "Price Trends & Charts",
    buyerDashboard: "Find Sellers",
    login: "Login / Sign Up",
    logout: "Logout",
    langToggle: "English/Marathi",
    dashboardTitle: "Know your price. Sell with confidence.",
    dashboardSubtitle: "Real-time Mandi rates powered by AI forecasting, helping you make the right decisions for your harvest.",
    listTitle: "List Your Produce",
    listSubtitle: "Provide details about your harvest to find the best buyers in your district.",
    sellerNameLabel: "Seller Name",
    sellerNamePlaceholder: "Enter your full name",
    commodityLabel: "Commodity",
    selectCommodity: "Select a commodity",
    quantityLabel: "Quantity (kg)",
    quantityPlaceholder: "e.g. 500",
    qualityGradeLabel: "Quality Grade",
    premiumGrade: "Premium",
    standardGrade: "Standard",
    fairGrade: "Fair",
    districtLabel: "District",
    selectDistrict: "Select your district",
    findBuyersBtn: "Find Matching Buyers",
    findingBuyersBtn: "Finding matching buyers...",
    activeBuyersBadge: "Active Buyers",
    backToDashboard: "Back to Dashboard",
    buyersFound: "buyers found for your",
    lotSuffix: "lot",
    sortBy: "Sort by: Match Score",
    contactBuyer: "Contact Buyer",
    viewDetails: "View Details",
    loadMoreBuyers: "Load more buyers",
    perQuintal: "/quintal",
    perQtl: "/qtl",
    trendingUp: "Prices trending up",
    trendingDown: "Slight downward trend detected",
    stable: "Market is holding steady",
    holdingAdvise: "consider holding if storage allows.",
    sellingAdvise: "Best to clear current stock.",
    stableAdvise: "Normal selling patterns advised.",
    stableFluctuation: "Prices stable. Monitor weather reports for potential fluctuations.",
    exportDemand: "Export demand rising. Favorable time to negotiate bulk deals.",
    footerText: "Made for Maharashtra Farmers © 2024 KisanConnect",
    aboutUs: "About Us",
    support: "Support",
    privacyPolicy: "Privacy Policy",
    terms: "Terms",
    loadingPrices: "Loading prices...",
    errorTitle: "Couldn't reach the backend",
    errorSub: "Make sure the FastAPI server is running.",
    matchingBuyersTitle: "Matching Buyers",
    matchingBuyersSubtitle: "Ranked by fit — location, quality, quantity, and buyer reliability.",
    noMatches: "No matching buyers found for this lot yet.",

    // Auth & Buyer Page Translations
    loginTitle: "Welcome to KisanConnect",
    loginSubtitle: "Sign in to your account or create a new account as a Farmer or Buyer",
    tabLogin: "Sign In",
    tabSignup: "Create Account",
    roleLabel: "I am a:",
    roleFarmer: "Farmer / Seller",
    roleBuyer: "Trader / Buyer",
    emailLabel: "Email Address",
    passwordLabel: "Password",
    fullNameLabel: "Full Name / Organization Name",
    quickDemoLogins: "Quick Demo Credentials",
    loginAsFarmerDemo: "Login as Demo Farmer",
    loginAsBuyerDemo: "Login as Demo Buyer",
    buyerTitle: "Find Best Sellers & Crop Lots",
    buyerSubtitle: "Browse active farm produce listed directly by Maharashtra farmers & FPOs",
    filterCommodity: "All Commodities",
    filterDistrict: "All Districts",
    contactSeller: "Contact Seller",
    sellerListed: "Listed by",
    sellerGrade: "Grade",
    sellerQty: "Quantity",

    // Trending Page Translations
    trendingTitle: "Real-Time Mandi Price Charts & Trends",
    trendingSubtitle: "Interactive price analytics & AI forecasting for Maharashtra agricultural markets",
    selectTimeframe: "Timeframe:",
    timeframe7d: "Last 7 Days",
    timeframe14d: "Last 14 Days",
    timeframe30d: "Last 30 Days",
    chartHighest: "Peak Modal Price",
    chartLowest: "Lowest Price",
    chartAvg: "Avg Price",
    chartArrivals: "Mandi Arrivals (Quintals)"
  },
  mr: {
    brandName: "किसानकनेक्ट",
    priceDashboard: "किंमत डॅशबोर्ड",
    listProduce: "मालाची नोंदणी",
    matches: "खरेदीदार शोध",
    trending: "दर विश्लेषण आलेख",
    buyerDashboard: "विक्रेते शोधा",
    login: "साइन इन / नोंदणी",
    logout: "लॉगआउट",
    langToggle: "English/Marathi",
    dashboardTitle: "दर जाणून घ्या. आत्मविश्वासाने विक्री करा.",
    dashboardSubtitle: "AI अंदाजावर आधारित रिअल-टाइम मंडी दर, तुम्हाला तुमच्या कापणीसाठी योग्य निर्णय घेण्यास मदत करतात.",
    listTitle: "तुमच्या शेतमालाची नोंदणी करा",
    listSubtitle: "तुमच्या जिल्ह्यातील सर्वोत्तम खरेदीदार शोधण्यासाठी तुमच्या कापणीचा तपशील द्या.",
    sellerNameLabel: "विक्रेत्याचे नाव",
    sellerNamePlaceholder: "तुमचे पूर्ण नाव प्रविष्ट करा",
    commodityLabel: "शेतमाल (Commodity)",
    selectCommodity: "शेतमाल निवडा",
    quantityLabel: "प्रमाण (किलो)",
    quantityPlaceholder: "उदा. ५००",
    qualityGradeLabel: "गुणवत्ता श्रेणी (Grade)",
    premiumGrade: "उत्कृष्ट (Premium)",
    standardGrade: "सामान्य (Standard)",
    fairGrade: "साधारण (Fair)",
    districtLabel: "जिल्हा",
    selectDistrict: "तुमचा जिल्हा निवडा",
    findBuyersBtn: "योग्य खरेदीदार शोधा",
    findingBuyersBtn: "खरेदीदार शोधत आहे...",
    activeBuyersBadge: "सक्रिय खरेदीदार",
    backToDashboard: "डॅशबोर्डवर परत जा",
    buyersFound: "खरेदीदार सापडले, तुमच्या",
    lotSuffix: "साठी",
    sortBy: "क्रमवारी: मॅच स्कोअर",
    contactBuyer: "खरेदीदाराशी संपर्क साधा",
    viewDetails: "तपशील पहा",
    loadMoreBuyers: "आणखी खरेदीदार दाखवा",
    perQuintal: "/क्विंटल",
    perQtl: "/क्विंटल",
    trendingUp: "किंमती वाढण्याची शक्यता आहे",
    trendingDown: "किंमतीमध्ये थोडी घसरण दिसून येत आहे",
    stable: "बाजार स्थिर आहे",
    holdingAdvise: "शक्य असल्यास काही दिवस माल राखून ठेवा.",
    sellingAdvise: "माल त्वरित विकणे फायदेशीर ठरेल.",
    stableAdvise: "नियमितपणे माल विक्रीचा सल्ला दिला जातो.",
    stableFluctuation: "दर स्थिर आहेत. संभाव्य बदलांसाठी हवामान अहवालावर लक्ष ठेवा.",
    exportDemand: "निर्यात मागणी वाढत आहे. घाऊक सौद्यांसाठी अनुकूल वेळ.",
    footerText: "महाराष्ट्र शेतकऱ्यांसाठी बनवले गेले आहे © २०२४ किसानकनेक्ट",
    aboutUs: "आमच्याबद्दल",
    support: "मदत",
    privacyPolicy: "गोपनीयता धोरण",
    terms: "अटी व शर्ती",
    loadingPrices: "किमती लोड होत आहेत...",
    errorTitle: "बॅकएंडशी संपर्क साधू शकलो नाही",
    errorSub: "FastAPI सर्व्हर चालू असल्याची खात्री करा.",
    matchingBuyersTitle: "जुळणारे खरेदीदार",
    matchingBuyersSubtitle: "स्थान, गुणवत्ता, प्रमाण आणि खरेदीदाराची विश्वासार्हता यावर आधारित क्रमवारी.",
    noMatches: "या मालासाठी अद्याप कोणतेही खरेदीदार सापडले नाहीत.",

    // Auth & Buyer Page Translations
    loginTitle: "किसानकनेक्टवर आपले स्वागत आहे",
    loginSubtitle: "शेतकरी किंवा खरेदीदार म्हणून तुमच्या खात्यात साइन इन करा किंवा नवीन खाते तयार करा",
    tabLogin: "साइन इन (Sign In)",
    tabSignup: "नवीन खाते तयार करा (Sign Up)",
    roleLabel: "मी आहे:",
    roleFarmer: "शेतकरी / विक्रेता (Farmer)",
    roleBuyer: "व्यापारी / खरेदीदार (Buyer)",
    emailLabel: "ईमेल पत्ता",
    passwordLabel: "पासवर्ड",
    fullNameLabel: "पूर्ण नाव / संस्थेचे नाव",
    quickDemoLogins: "डेमो खाती (Quick Login)",
    loginAsFarmerDemo: "डेमो शेतकरी म्हणून साइन इन करा",
    loginAsBuyerDemo: "डेमो खरेदीदार म्हणून साइन इन करा",
    buyerTitle: "सर्वोत्तम विक्रेते आणि माल शोधा",
    buyerSubtitle: "महाराष्ट्रातील शेतकऱ्यांनी थेट नोंदवलेला शेतमाल पहा",
    filterCommodity: "सर्व शेतमाल",
    filterDistrict: "सर्व जिल्हे",
    contactSeller: "विक्रेत्याशी संपर्क साधा",
    sellerListed: "विक्रेता:",
    sellerGrade: "श्रेणी",
    sellerQty: "प्रमाण",

    // Trending Page Translations
    trendingTitle: "रिअल-टाइम मंडी दर आलेख व विश्लेषण",
    trendingSubtitle: "महाराष्ट्रातील कृषी बाजारांचे परस्परसंवादी दर आलेख व AI अंदाज",
    selectTimeframe: "कालावधी:",
    timeframe7d: "गेले ७ दिवस",
    timeframe14d: "गेले १४ दिवस",
    timeframe30d: "गेले ३० दिवस",
    chartHighest: "कमाल दर",
    chartLowest: "किमान दर",
    chartAvg: "सरासरी दर",
    chartArrivals: "मंडी आवक (क्विंटल)"
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("kisan_lang");
    if (savedLang) {
      setLang(savedLang);
    }
  }, []);

  const toggleLanguage = () => {
    const newLang = lang === "en" ? "mr" : "en";
    setLang(newLang);
    localStorage.setItem("kisan_lang", newLang);
  };

  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
