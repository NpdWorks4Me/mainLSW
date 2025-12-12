"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CookieConsentContext = createContext(null);

export const useCookieConsent = () => useContext(CookieConsentContext);

export const CookieConsentProvider = ({ children }) => {
  const [consent, setConsent] = useState(null); // null: undecided, 'accepted': all, 'rejected': essential only

  useEffect(() => {
    const storedConsent = localStorage.getItem('cookie_consent');
    if (storedConsent) {
      setConsent(storedConsent);
    }
  }, []);

  const updateConsent = useCallback((newConsent) => {
    setConsent(newConsent);
    localStorage.setItem('cookie_consent', newConsent);
  }, []);

  const value = {
    consent,
    updateConsent,
    hasMadeChoice: consent !== null,
    canUseNonEssentialCookies: consent === 'accepted',
  };

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  );
};