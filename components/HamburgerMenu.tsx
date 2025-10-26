'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, X, Clock, Heart, LogOut, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import toast from 'react-hot-toast';

export function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const { language, setLanguage, t } = useLanguage();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success(t('toast.loggedOut'));
      router.push('/auth/login');
    } catch (error) {
      toast.error(t('toast.failed').replace('{action}', 'log out'));
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'tr' : 'en');
    // Keep menu open when toggling language
  };

  const menuItems = [
    {
      icon: Heart,
      label: t('menu.savedIdeas'),
      onClick: () => {
        router.push('/saved');
        setIsOpen(false);
      }
    },
    {
      icon: Clock,
      label: t('menu.pastSearches'),
      onClick: () => {
        router.push('/history');
        setIsOpen(false);
      }
    },
    {
      icon: Info,
      label: t('menu.about'),
      onClick: () => {
        router.push('/about');
        setIsOpen(false);
      }
    },
    {
      icon: LogOut,
      label: t('auth.logout'),
      onClick: () => {
        handleLogout();
        setIsOpen(false);
      }
    }
  ];

  return (
    <>
      {/* Hamburger Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="rounded-full"
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Side Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-black">Menu</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="rounded-full"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Menu Items */}
        <nav className="p-4">
          {/* Language Toggle */}
          <div className="mb-4 px-4 py-4 bg-gray-50 rounded-uber">
            <div className="flex items-center justify-between">
              <span className="text-base font-medium text-gray-700">{t('menu.language')}</span>
              <button
                onClick={toggleLanguage}
                className="relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                style={{ backgroundColor: language === 'en' ? '#e5e7eb' : '#000000' }}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    language === 'en' ? 'translate-x-1' : 'translate-x-9'
                  }`}
                />
                <span className={`absolute left-2 text-xs font-semibold ${language === 'en' ? 'text-black' : 'text-gray-400'}`}>
                  EN
                </span>
                <span className={`absolute right-2 text-xs font-semibold ${language === 'tr' ? 'text-white' : 'text-gray-400'}`}>
                  TR
                </span>
              </button>
            </div>
          </div>

          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.label}>
                  <Button
                    variant="ghost"
                    onClick={item.onClick}
                    className="w-full justify-start text-left px-4 py-6 hover:bg-gray-100 rounded-uber"
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    <span className="text-base font-medium">{item.label}</span>
                  </Button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
}
