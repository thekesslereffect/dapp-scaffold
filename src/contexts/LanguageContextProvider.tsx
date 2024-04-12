import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';


const fontMappings = {
    'en': {titleFont: '"Sniglet", sans-serif', bodyFont: '"Jua", sans-serif'},
    'zh-tw': {titleFont: '"zen-medium",sans-serif', bodyFont: '"zen-medium",sans-serif'},
    'zh': {titleFont: '"zen-medium",sans-serif', bodyFont: '"zen-medium",sans-serif'},
    'id': {titleFont: '"Sniglet", sans-serif', bodyFont: '"Jua", sans-serif'},
    'fr': {titleFont: '"Sniglet", sans-serif', bodyFont: '"Jua", sans-serif'},
    'ro': {titleFont: '"Sniglet", sans-serif', bodyFont: '"Jua", sans-serif'},
    'vn': {titleFont: '"Sniglet", sans-serif', bodyFont: '"Jua", sans-serif'},
    // Add more as needed
  };


type LanguageContextType = {
  language: string;
  setLanguage: (language: string) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [language, setLanguage] = useState('en'); // default language
  

  useEffect(() => {
    // Apply font change
    const {titleFont, bodyFont} = fontMappings[language] || fontMappings['en']; // Fallback to English if undefined
    document.documentElement.style.setProperty('--title-font', titleFont);
    document.documentElement.style.setProperty('--body-font', bodyFont);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

