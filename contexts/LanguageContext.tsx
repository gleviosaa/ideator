'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'tr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem('ideator-language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'tr')) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('ideator-language', lang);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }

    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

const translations = {
  en: {
    // Common
    common: {
      back: 'Back',
      backToDashboard: 'Back to Dashboard',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      loading: 'Loading...',
      search: 'Search',
      filter: 'Filter',
      all: 'All',
      create: 'Create',
      add: 'Add',
      close: 'Close',
      confirm: 'Confirm',
      edit: 'Edit',
      remove: 'Remove',
      export: 'Export',
    },

    // Auth
    auth: {
      login: 'Login',
      signup: 'Sign up',
      logout: 'Log Out',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      enterEmail: 'Enter your email and password to access your account',
      enterInfo: 'Enter your information to get started',
      alreadyHaveAccount: 'Already have an account?',
      dontHaveAccount: "Don't have an account?",
      createAccount: 'Create an account',
      loggingIn: 'Logging in...',
      creatingAccount: 'Creating account...',
    },

    // Menu
    menu: {
      savedIdeas: 'Saved Ideas',
      pastSearches: 'Past Searches',
      about: 'About',
      language: 'Language',
    },

    // Dashboard
    dashboard: {
      title: 'What kind of app do you want to build?',
      subtitle: 'Describe your idea or select categories',
      searchPlaceholder: 'E.g., "A fitness tracking app for beginners"',
      searchButton: 'Generate Ideas',
      or: 'or',
      searchByCategory: 'Search by Category',
      generatingIdeas: 'Generating Ideas...',
      generatingMessage: 'Our AI is crafting personalized app ideas just for you. This may take a few moments.',
      savedCount: 'You saved {count} idea!',
      savedCountPlural: 'You saved {count} ideas!',
      noIdeasSaved: 'No ideas saved',
      viewSaved: 'View your saved ideas or start a new search',
      startNewSearch: 'Start a new search to discover more ideas',
      newSearch: 'New Search',
      viewAllSaved: 'View All Saved Ideas',
      reviewLater: 'Ideas to Review Later',
      reviewLaterNote: '(Not saved - for this session only)',
      swipeHint: '👆 Tap buttons or swipe left/right on the card',
      skip: 'Skip',
      reviewLaterBtn: 'Review Later',
      saveBtn: 'Save',
    },

    // Category Search
    categorySearch: {
      title: 'Category Search',
      selectPreferences: 'Select your preferences',
      subtitle: 'Choose at least one option from any category to get personalized app ideas',
      filterOptions: 'Filter Options',
      helperText: 'Select at least one option from any category below to generate ideas',
      selected: 'Selected',
      addCustom: 'Add Custom',
      additionalComments: 'Additional Comments',
      additionalCommentsPlaceholder: 'Add any specific requirements, features, or details you\'d like to include...',
      additionalCommentsHelper: 'Provide additional context to refine your app ideas',
      generateIdeas: 'Generate Ideas',
      generatingIdeas: 'Generating Ideas...',
    },

    // Categories
    categories: {
      technology: 'Technology/Platform',
      context: 'Context',
      monetization: 'Monetization',
      targetAudience: 'Target Audience',
    },

    // Saved Ideas
    saved: {
      title: 'Saved Ideas',
      idea: 'idea',
      ideas: 'ideas',
      filtered: '(filtered)',
      exportPDF: 'Export PDF',
      newFolder: 'New Folder',
      searchPlaceholder: 'Search saved ideas...',
      folders: 'Folders:',
      tags: 'Tags:',
      noIdeasFiltered: 'No ideas match your filters',
      noIdeasYet: 'No saved ideas yet',
      discoverIdeas: 'Discover Ideas',
      createNewFolder: 'Create New Folder',
      createNewFolderDesc: 'Organize your ideas into folders',
      folderName: 'Folder name',
      color: 'Color:',
      addToFolder: 'Add to Folder',
      addToFolderDesc: 'Select a folder to add this idea to',
      noFoldersYet: 'No folders yet. Create one first!',
      addTags: 'Add Tags',
      addTagsDesc: 'Create and add tags to organize your ideas',
      newTagName: 'New tag name',
      existingTags: 'Existing tags:',
      noTagsYet: 'No tags yet',
      removeFromSaved: 'Remove from saved',
    },

    // History
    history: {
      title: 'Search History',
      searchCount: '{count} search in your history',
      searchCountPlural: '{count} searches in your history',
      noHistory: 'No search history yet',
      startSearching: 'Start Searching',
      viewResults: 'View Results',
      more: 'more',
    },

    // About
    about: {
      title: 'About Ideator',
      subtitle: 'Your AI-powered companion for discovering and organizing creative project ideas',
      faq: 'Frequently Asked Questions',
      moreQuestions: 'Have more questions? Feel free to explore the app and discover all its features!',
    },

    // Idea Detail
    ideaDetail: {
      loading: 'Loading idea...',
      technology: 'Technology',
      complexity: 'Complexity',
      timeToBuild: 'Time to Build',
      monetization: 'Monetization',
      targetAudience: 'Target Audience',
      saveIdea: 'Save Idea',
      unsaveIdea: 'Unsave Idea',
      viewDetails: 'View Details',
      description: 'Description',
      implementationSteps: 'Implementation Steps',
      implementationStepsDesc: 'Follow these steps to build your app',
      techStack: 'Recommended Tech Stack',
      techStackDesc: 'Technologies and tools to use',
      suggestions: 'Additional Suggestions',
      suggestionsDesc: 'Tips and considerations for your project',
      shareText: 'Check out this app idea on Ideator!',
    },

    // Toast messages
    toast: {
      ideasGenerated: 'Ideas generated!',
      ideaSaved: 'Idea saved!',
      ideaSkipped: 'Idea skipped',
      savedForLater: 'Saved for later',
      undoSuccessful: 'Undo successful',
      customAdded: 'Added custom {category}: {value}',
      folderCreated: 'Folder created successfully',
      tagCreated: 'Tag created successfully',
      ideaUnsaved: 'Idea removed from saved',
      searchDeleted: 'Search deleted from history',
      loggedOut: 'Logged out successfully',
      loggedIn: 'Logged in successfully!',
      accountCreated: 'Account created! Please check your email to verify.',
      passwordsNoMatch: 'Passwords do not match',
      passwordTooShort: 'Password must be at least 6 characters',
      failed: 'Failed to {action}. Please try again.',
      copiedToClipboard: 'Copied to clipboard!',
      pdfExported: 'PDF exported successfully!',
    },
    // Confirm Modal
    confirmModal: {
      title: 'Confirm Your Search',
      subtitle: 'Review your search criteria before generating ideas',
      searchSummary: 'Search Summary',
      searchQuery: 'Search Query',
      technology: 'Technology',
      category: 'Category',
      monetization: 'Monetization',
      targetAudience: 'Target Audience',
      additionalComments: 'Additional Comments',
      noCriteria: 'No search criteria provided',
      promptPreview: 'This information will be used to generate 10 personalized app ideas using AI.',
      editSearch: 'Edit Search',
      confirmButton: 'Confirm & Generate Ideas',
    },
  },

  tr: {
    // Common
    common: {
      back: 'Geri',
      backToDashboard: 'Panoya Dön',
      save: 'Kaydet',
      cancel: 'İptal',
      delete: 'Sil',
      loading: 'Yükleniyor...',
      search: 'Ara',
      filter: 'Filtrele',
      all: 'Tümü',
      create: 'Oluştur',
      add: 'Ekle',
      close: 'Kapat',
      confirm: 'Onayla',
      edit: 'Düzenle',
      remove: 'Kaldır',
      export: 'Dışa Aktar',
    },

    // Auth
    auth: {
      login: 'Giriş Yap',
      signup: 'Kayıt Ol',
      logout: 'Çıkış Yap',
      email: 'E-posta',
      password: 'Şifre',
      confirmPassword: 'Şifreyi Onayla',
      enterEmail: 'Hesabınıza erişmek için e-posta ve şifrenizi girin',
      enterInfo: 'Başlamak için bilgilerinizi girin',
      alreadyHaveAccount: 'Zaten hesabınız var mı?',
      dontHaveAccount: 'Hesabınız yok mu?',
      createAccount: 'Hesap oluştur',
      loggingIn: 'Giriş yapılıyor...',
      creatingAccount: 'Hesap oluşturuluyor...',
    },

    // Menu
    menu: {
      savedIdeas: 'Kaydedilen Fikirler',
      pastSearches: 'Geçmiş Aramalar',
      about: 'Hakkında',
      language: 'Dil',
    },

    // Dashboard
    dashboard: {
      title: 'Ne tür bir uygulama yapmak istiyorsunuz?',
      subtitle: 'Fikrinizi tanımlayın veya kategorileri seçin',
      searchPlaceholder: 'Örn: "Yeni başlayanlar için fitness takip uygulaması"',
      searchButton: 'Fikir Üret',
      or: 'veya',
      searchByCategory: 'Kategoriye Göre Ara',
      generatingIdeas: 'Fikirler Üretiliyor...',
      generatingMessage: 'Yapay zekamız sizin için özelleştirilmiş uygulama fikirleri hazırlıyor. Bu birkaç dakika sürebilir.',
      savedCount: '{count} fikir kaydettiniz!',
      savedCountPlural: '{count} fikir kaydettiniz!',
      noIdeasSaved: 'Kaydedilen fikir yok',
      viewSaved: 'Kaydedilen fikirlerinizi görüntüleyin veya yeni arama yapın',
      startNewSearch: 'Daha fazla fikir keşfetmek için yeni bir arama başlatın',
      newSearch: 'Yeni Arama',
      viewAllSaved: 'Tüm Kayıtlı Fikirleri Gör',
      reviewLater: 'Daha Sonra İncelenecek Fikirler',
      reviewLaterNote: '(Kaydedilmedi - sadece bu oturum için)',
      swipeHint: '👆 Düğmelere dokunun veya kartı sola/sağa kaydırın',
      skip: 'Geç',
      reviewLaterBtn: 'Sonra İncele',
      saveBtn: 'Kaydet',
    },

    // Category Search
    categorySearch: {
      title: 'Kategori Araması',
      selectPreferences: 'Tercihlerinizi seçin',
      subtitle: 'Kişiselleştirilmiş uygulama fikirleri almak için herhangi bir kategoriden en az bir seçenek seçin',
      filterOptions: 'Filtre Seçenekleri',
      helperText: 'Fikir üretmek için aşağıdaki kategorilerden en az birinden seçim yapın',
      selected: 'Seçildi',
      addCustom: 'Özel Ekle',
      additionalComments: 'Ek Yorumlar',
      additionalCommentsPlaceholder: 'Eklemek istediğiniz belirli gereksinimler, özellikler veya detaylar...',
      additionalCommentsHelper: 'Uygulama fikirlerinizi iyileştirmek için ek bağlam sağlayın',
      generateIdeas: 'Fikir Üret',
      generatingIdeas: 'Fikirler Üretiliyor...',
    },

    // Categories
    categories: {
      technology: 'Teknoloji/Platform',
      context: 'Bağlam',
      monetization: 'Gelir Modeli',
      targetAudience: 'Hedef Kitle',
    },

    // Saved Ideas
    saved: {
      title: 'Kaydedilen Fikirler',
      idea: 'fikir',
      ideas: 'fikir',
      filtered: '(filtrelenmiş)',
      exportPDF: 'PDF Olarak Dışa Aktar',
      newFolder: 'Yeni Klasör',
      searchPlaceholder: 'Kaydedilen fikirlerde ara...',
      folders: 'Klasörler:',
      tags: 'Etiketler:',
      noIdeasFiltered: 'Hiçbir fikir filtrelerinizle eşleşmiyor',
      noIdeasYet: 'Henüz kaydedilen fikir yok',
      discoverIdeas: 'Fikir Keşfet',
      createNewFolder: 'Yeni Klasör Oluştur',
      createNewFolderDesc: 'Fikirlerinizi klasörlere ayırın',
      folderName: 'Klasör adı',
      color: 'Renk:',
      addToFolder: 'Klasöre Ekle',
      addToFolderDesc: 'Bu fikri eklemek için bir klasör seçin',
      noFoldersYet: 'Henüz klasör yok. Önce bir tane oluşturun!',
      addTags: 'Etiket Ekle',
      addTagsDesc: 'Fikirlerinizi düzenlemek için etiketler oluşturun ve ekleyin',
      newTagName: 'Yeni etiket adı',
      existingTags: 'Mevcut etiketler:',
      noTagsYet: 'Henüz etiket yok',
      removeFromSaved: 'Kayıtlılardan kaldır',
    },

    // History
    history: {
      title: 'Arama Geçmişi',
      searchCount: 'Geçmişinizde {count} arama',
      searchCountPlural: 'Geçmişinizde {count} arama',
      noHistory: 'Henüz arama geçmişi yok',
      startSearching: 'Aramaya Başla',
      viewResults: 'Sonuçları Görüntüle',
      more: 'daha fazla',
    },

    // About
    about: {
      title: 'Ideator Hakkında',
      subtitle: 'Yaratıcı proje fikirlerini keşfetmek ve düzenlemek için yapay zeka destekli yardımcınız',
      faq: 'Sıkça Sorulan Sorular',
      moreQuestions: 'Daha fazla sorunuz mu var? Uygulamayı keşfetmekten ve tüm özelliklerini keşfetmekten çekinmeyin!',
    },

    // Idea Detail
    ideaDetail: {
      loading: 'Fikir yükleniyor...',
      technology: 'Teknoloji',
      complexity: 'Karmaşıklık',
      timeToBuild: 'Geliştirme Süresi',
      monetization: 'Gelir Modeli',
      targetAudience: 'Hedef Kitle',
      saveIdea: 'Fikri Kaydet',
      unsaveIdea: 'Kaydı Kaldır',
      viewDetails: 'Detayları Gör',
      description: 'Açıklama',
      implementationSteps: 'Uygulama Adımları',
      implementationStepsDesc: 'Uygulamanızı oluşturmak için bu adımları izleyin',
      techStack: 'Önerilen Teknoloji Yığını',
      techStackDesc: 'Kullanılacak teknolojiler ve araçlar',
      suggestions: 'Ek Öneriler',
      suggestionsDesc: 'Projeniz için ipuçları ve dikkat edilmesi gerekenler',
      shareText: 'Ideator\'da bu uygulama fikrine göz atın!',
    },

    // Toast messages
    toast: {
      ideasGenerated: 'Fikirler üretildi!',
      ideaSaved: 'Fikir kaydedildi!',
      ideaSkipped: 'Fikir atlandı',
      savedForLater: 'Daha sonra için kaydedildi',
      undoSuccessful: 'Geri alma başarılı',
      customAdded: 'Özel {category} eklendi: {value}',
      folderCreated: 'Klasör başarıyla oluşturuldu',
      tagCreated: 'Etiket başarıyla oluşturuldu',
      ideaUnsaved: 'Fikir kayıtlılardan kaldırıldı',
      searchDeleted: 'Arama geçmişten silindi',
      loggedOut: 'Başarıyla çıkış yapıldı',
      loggedIn: 'Başarıyla giriş yapıldı!',
      accountCreated: 'Hesap oluşturuldu! Lütfen doğrulamak için e-postanızı kontrol edin.',
      passwordsNoMatch: 'Şifreler eşleşmiyor',
      passwordTooShort: 'Şifre en az 6 karakter olmalıdır',
      failed: '{action} başarısız oldu. Lütfen tekrar deneyin.',
      copiedToClipboard: 'Panoya kopyalandı!',
      pdfExported: 'PDF başarıyla dışa aktarıldı!',
    },
    // Confirm Modal
    confirmModal: {
      title: 'Aramanızı Onaylayın',
      subtitle: 'Fikir üretmeden önce arama kriterlerinizi gözden geçirin',
      searchSummary: 'Arama Özeti',
      searchQuery: 'Arama Sorgusu',
      technology: 'Teknoloji',
      category: 'Kategori',
      monetization: 'Gelir Modeli',
      targetAudience: 'Hedef Kitle',
      additionalComments: 'Ek Yorumlar',
      noCriteria: 'Arama kriteri sağlanmadı',
      promptPreview: 'Bu bilgiler yapay zeka kullanılarak 10 kişiselleştirilmiş uygulama fikri üretmek için kullanılacak.',
      editSearch: 'Aramayı Düzenle',
      confirmButton: 'Onayla ve Fikir Üret',
    },
  },
};
