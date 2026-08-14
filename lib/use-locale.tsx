'use client';

import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import type { CurrencyCode, LanguageCode, LocaleSettings } from './locale-currency';

const STORAGE_KEY = 'havenly-locale';
const EXCHANGE_RATE_USD_TO_INR = 83.50; // Added exchange rate

const DEFAULT_SETTINGS: LocaleSettings = {
  language: 'en-IN',
  currency: 'INR',
};

// 1. Updated the type to include formatPrice
type LocaleContextValue = {
  settings: LocaleSettings;
  setLanguage: (language: LanguageCode) => void;
  setCurrency: (currency: CurrencyCode) => void;
  formatPrice: (priceInUSD: number) => string; 
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function safeParseSettings(raw: string | null): LocaleSettings | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<LocaleSettings>;
    if (!parsed.language || !parsed.currency) return null;
    return {
      language: parsed.language as LanguageCode,
      currency: parsed.currency as CurrencyCode,
    };
  } catch {
    return null;
  }
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<LocaleSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const stored = safeParseSettings(localStorage.getItem(STORAGE_KEY));
    if (stored) setSettings(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  // 2. Added the formatPrice logic wrapped in useCallback
  const formatPrice = useCallback((priceInUSD: number) => {
    if (settings.currency === 'INR') {
      const converted = priceInUSD * EXCHANGE_RATE_USD_TO_INR;
      return new Intl.NumberFormat(settings.language || 'en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }).format(converted);
    }
    
    return new Intl.NumberFormat(settings.language || 'en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(priceInUSD);
  }, [settings.currency, settings.language]);

  const value = useMemo<LocaleContextValue>(
    () => ({
      settings,
      setLanguage: (language) => setSettings((s) => ({ ...s, language })),
      setCurrency: (currency) => setSettings((s) => ({ ...s, currency })),
      formatPrice, // 3. Exposed formatPrice to the rest of the app
    }),
    [settings, formatPrice]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error('useLocale must be used within LocaleProvider');
  }
  return ctx;
}
