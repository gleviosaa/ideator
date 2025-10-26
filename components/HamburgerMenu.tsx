'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, X, Clock, Heart, LogOut, Info, Languages } from 'lucide-react';
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
    setIsOpen(false);
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
      icon: Languages,
      label: `${t('menu.language')}: ${language === 'en' ? 'English' : 'Türkçe'}`,
      onClick: toggleLanguage
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
