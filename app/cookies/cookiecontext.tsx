"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type CookieConsentStatus = "accepted" | "rejected" | "unknown";

interface CookieContextType {
  consentStatus: CookieConsentStatus;
  setConsentStatus: (status: CookieConsentStatus) => void;
}

const CookieContext = createContext<CookieContextType | undefined>(undefined);

export const CookieProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [consentStatus, setConsentStatus] = useState<CookieConsentStatus>("unknown");

  return (
    <CookieContext.Provider value={{ consentStatus, setConsentStatus }}>
      {children}
    </CookieContext.Provider>
  );
};

export const useCookieContext = () => {
  const context = useContext(CookieContext);
  if (!context) {
    throw new Error("useCookieContext must be used within a CookieProvider");
  }
  return context;
};
