export const CATEGORIES_I18N = {
  en: {
    technology: [
      'iOS',
      'Android',
      'Web',
      'Desktop',
      'Cross-platform',
      'AR/VR',
      'IoT',
      'Blockchain',
      'AI/ML',
    ],
    context: [
      'Health & Fitness',
      'Education',
      'Entertainment',
      'Productivity',
      'Social',
      'Finance',
      'Travel',
      'Food & Drink',
      'Shopping',
      'Business',
      'Gaming',
      'Lifestyle',
    ],
    monetization: [
      'Free',
      'Freemium',
      'Subscription',
      'One-time Purchase',
      'In-app Purchases',
      'Ads',
      'Affiliate',
      'Enterprise',
    ],
    targetAudience: [
      'Students',
      'Professionals',
      'Seniors',
      'Parents',
      'Teenagers',
      'Children',
      'Small Business',
      'Enterprise',
      'General Public',
    ],
  },
  tr: {
    technology: [
      'iOS',
      'Android',
      'Web',
      'Masaüstü',
      'Çapraz Platform',
      'AR/VR',
      'IoT',
      'Blockchain',
      'Yapay Zeka/ML',
    ],
    context: [
      'Sağlık ve Fitness',
      'Eğitim',
      'Eğlence',
      'Verimlilik',
      'Sosyal',
      'Finans',
      'Seyahat',
      'Yemek ve İçecek',
      'Alışveriş',
      'İş',
      'Oyun',
      'Yaşam Tarzı',
    ],
    monetization: [
      'Ücretsiz',
      'Freemium',
      'Abonelik',
      'Tek Seferlik Satın Alma',
      'Uygulama İçi Satın Alma',
      'Reklamlar',
      'İştirak',
      'Kurumsal',
    ],
    targetAudience: [
      'Öğrenciler',
      'Profesyoneller',
      'Yaşlılar',
      'Ebeveynler',
      'Gençler',
      'Çocuklar',
      'Küçük İşletme',
      'Kurumsal',
      'Genel Halk',
    ],
  },
};

// Helper function to get category value in target language
export function getCategoryTranslation(
  category: string,
  value: string,
  targetLang: 'en' | 'tr',
  currentLang: 'en' | 'tr'
): string {
  if (targetLang === currentLang) return value;

  const categoryKey = category as keyof typeof CATEGORIES_I18N.en;
  const currentCategories = CATEGORIES_I18N[currentLang][categoryKey];
  const targetCategories = CATEGORIES_I18N[targetLang][categoryKey];

  if (!currentCategories || !targetCategories) return value;

  const index = currentCategories.indexOf(value);
  if (index === -1) return value;

  return targetCategories[index] || value;
}

// Helper function to get all categories in a language
export function getCategoriesInLanguage(lang: 'en' | 'tr') {
  return CATEGORIES_I18N[lang];
}
