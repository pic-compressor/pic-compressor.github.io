"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type Locale = "zh" | "en";
type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setCurrentLocale] = useState<Locale>("zh");

  useEffect(() => {
    try {
      const savedLocale = localStorage.getItem("pic-compressor:locale");
      if (savedLocale === "zh" || savedLocale === "en")
        setCurrentLocale(savedLocale);
    } catch {}
  }, []);

  const setLocale = (nextLocale: Locale) => {
    setCurrentLocale(nextLocale);
    try {
      localStorage.setItem("pic-compressor:locale", nextLocale);
    } catch {}
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocale must be used within LocaleProvider");
  return context;
}