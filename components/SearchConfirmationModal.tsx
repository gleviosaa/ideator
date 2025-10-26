'use client'

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface SearchConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  searchMode: 'free_text' | 'category_select';
  query?: string;
  filters?: any;
  additionalComments?: string;
}

export function SearchConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  searchMode,
  query,
  filters,
  additionalComments,
}: SearchConfirmationModalProps) {
  const { t } = useLanguage();

  if (!isOpen) return null;

  const buildSummary = () => {
    const parts: string[] = [];

    if (searchMode === 'free_text' && query) {
      parts.push(`${t('confirmModal.searchQuery')}: "${query}"`);
    }

    if (filters) {
      if (filters.technology) parts.push(`${t('confirmModal.technology')}: ${filters.technology}`);
      if (filters.context) parts.push(`${t('confirmModal.category')}: ${filters.context}`);
      if (filters.monetization) parts.push(`${t('confirmModal.monetization')}: ${filters.monetization}`);
      if (filters.targetAudience) parts.push(`${t('confirmModal.targetAudience')}: ${filters.targetAudience}`);
    }

    if (additionalComments) {
      parts.push(`${t('confirmModal.additionalComments')}: "${additionalComments}"`);
    }

    return parts;
  };

  const summaryParts = buildSummary();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl shadow-uber-xl">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-2xl">{t('confirmModal.title')}</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {t('confirmModal.subtitle')}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Summary */}
          <div className="bg-gray-50 rounded-uber-lg p-4 space-y-3">
            <h3 className="font-semibold text-black mb-3">{t('confirmModal.searchSummary')}:</h3>
            {summaryParts.length > 0 ? (
              <div className="space-y-2">
                {summaryParts.map((part, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-black font-bold mt-0.5">•</span>
                    <span className="text-gray-700">{part}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">{t('confirmModal.noCriteria')}</p>
            )}
          </div>

          {/* Prompt Preview */}
          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-600">
              {t('confirmModal.promptPreview')}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              variant="outline"
              size="lg"
              onClick={onClose}
              className="flex-1"
            >
              {t('confirmModal.editSearch')}
            </Button>
            <Button
              size="lg"
              onClick={onConfirm}
              className="flex-1"
            >
              {t('confirmModal.confirmButton')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
