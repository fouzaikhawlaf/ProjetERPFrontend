import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: { language: 'Language', settings: 'Settings', welcome: 'Welcome to the application!' } },
      fr: { translation: { language: 'Langue', settings: 'Paramètres', welcome: 'Bienvenue dans l’application!' } },
      ar: { translation: { language: 'اللغة', settings: 'الإعدادات', welcome: 'مرحبا بك في التطبيق!' } },
    
    },
    lng: 'fr', // Default language
    fallbackLng: 'en', // Fallback language
    interpolation: { escapeValue: false }, // React already handles escaping
  });

export default i18n;
