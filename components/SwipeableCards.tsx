'use client'

import { useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { X, Heart, Info, Clock, Undo2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Idea } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import toast from 'react-hot-toast';

interface SwipeableCardsProps {
  ideas: Idea[];
  onSwipeComplete: (savedIdeas: Idea[], maybeLaterIdeas: Idea[]) => void;
  onViewDetails: (idea: Idea) => void;
}

export function SwipeableCards({ ideas, onSwipeComplete, onViewDetails }: SwipeableCardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [savedIdeas, setSavedIdeas] = useState<Idea[]>([]);
  const [maybeLaterIdeas, setMaybeLaterIdeas] = useState<Idea[]>([]);
  const [exitX, setExitX] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | 'down' | null>(null);
  const [swipeHistory, setSwipeHistory] = useState<Array<{action: 'left' | 'right' | 'down', idea: Idea, index: number}>>([]);
  const { t } = useLanguage();

  const currentIdea = ideas[currentIndex];
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 100;

    if (Math.abs(info.offset.x) > threshold) {
      // Swiped
      const direction = info.offset.x > 0 ? 'right' : 'left';
      setSwipeDirection(direction);
      setExitX(direction === 'right' ? 300 : -300);

      // Show toast and handle save
      toast.dismiss(); // Dismiss any existing toasts
      if (direction === 'right') {
        setSavedIdeas(prev => [...prev, currentIdea]);
        toast.success(t('toast.ideaSaved'), { icon: '❤️', duration: 1500 });
      } else {
        toast(t('toast.ideaSkipped'), { icon: '👋', duration: 1500 });
      }

      // Move to next card
      setTimeout(() => {
        if (currentIndex === ideas.length - 1) {
          // All cards swiped
          const finalSaved = direction === 'right' ? [...savedIdeas, currentIdea] : savedIdeas;
          onSwipeComplete(finalSaved, maybeLaterIdeas);
        } else {
          setCurrentIndex(prev => prev + 1);
          setExitX(0);
          setSwipeDirection(null);
        }
      }, 200);
    }
  };

  const handleSwipe = (direction: 'left' | 'right' | 'down') => {
    setSwipeDirection(direction);

    if (direction === 'down') {
      setExitX(0); // No horizontal exit for "maybe later"
    } else {
      setExitX(direction === 'right' ? 300 : -300);
    }

    // Record to history
    setSwipeHistory(prev => [...prev, { action: direction, idea: currentIdea, index: currentIndex }]);

    // Show toast and handle save
    toast.dismiss(); // Dismiss any existing toasts
    if (direction === 'right') {
      setSavedIdeas(prev => [...prev, currentIdea]);
      toast.success(t('toast.ideaSaved'), { icon: '❤️', duration: 1500 });
    } else if (direction === 'left') {
      toast(t('toast.ideaSkipped'), { icon: '👋', duration: 1500 });
    } else if (direction === 'down') {
      setMaybeLaterIdeas(prev => [...prev, currentIdea]);
      toast(t('toast.savedForLater'), { icon: '🕒', duration: 1500 });
    }

    setTimeout(() => {
      if (currentIndex === ideas.length - 1) {
        const finalSaved = direction === 'right' ? [...savedIdeas, currentIdea] : savedIdeas;
        const finalMaybeLater = direction === 'down' ? [...maybeLaterIdeas, currentIdea] : maybeLaterIdeas;
        onSwipeComplete(finalSaved, finalMaybeLater);
      } else {
        setCurrentIndex(prev => prev + 1);
        setExitX(0);
        setSwipeDirection(null);
      }
    }, 200);
  };

  const handleUndo = () => {
    if (swipeHistory.length === 0 || currentIndex === 0) return;

    const lastAction = swipeHistory[swipeHistory.length - 1];

    // Remove from appropriate array
    if (lastAction.action === 'right') {
      setSavedIdeas(prev => prev.filter(idea => idea.id !== lastAction.idea.id));
    } else if (lastAction.action === 'down') {
      setMaybeLaterIdeas(prev => prev.filter(idea => idea.id !== lastAction.idea.id));
    }

    // Go back to previous card
    setCurrentIndex(prev => prev - 1);
    setSwipeHistory(prev => prev.slice(0, -1));
    setExitX(0);
    setSwipeDirection(null);

    toast.dismiss();
    toast(t('toast.undoSuccessful'), { icon: '↩️', duration: 1000 });
  };

  if (!currentIdea) {
    return null;
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Card counter */}
      <div className="text-center text-gray-600 font-medium">
        {currentIndex + 1} / {ideas.length}
      </div>

      {/* Swipeable card */}
      <div className="relative w-full max-w-md">
        <motion.div
          className="w-full"
          style={{
            x,
            rotate,
            opacity,
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          animate={{ x: exitX }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <Card className="cursor-grab active:cursor-grabbing">
          <CardHeader>
            <CardTitle className="text-2xl">{currentIdea.title}</CardTitle>
            {currentIdea.technology && (
              <div className="flex gap-2 flex-wrap mt-2">
                {currentIdea.technology && (
                  <span className="text-xs px-3 py-1.5 bg-black text-white rounded-uber font-medium">
                    {currentIdea.technology}
                  </span>
                )}
                {currentIdea.complexity && (
                  <span className="text-xs px-3 py-1.5 bg-black text-white rounded-uber font-medium">
                    {currentIdea.complexity}
                  </span>
                )}
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <CardDescription className="text-base">
              {currentIdea.description}
            </CardDescription>

            <div className="space-y-2 text-sm text-gray-700">
              {currentIdea.time_to_build && (
                <div>
                  <span className="text-gray-600 font-medium">{t('ideaDetail.timeToBuild')}:</span>{' '}
                  <span className="text-gray-800">{currentIdea.time_to_build}</span>
                </div>
              )}
              {currentIdea.monetization && (
                <div>
                  <span className="text-gray-600 font-medium">{t('ideaDetail.monetization')}:</span>{' '}
                  <span className="text-gray-800">{currentIdea.monetization}</span>
                </div>
              )}
              {currentIdea.target_audience && (
                <div>
                  <span className="text-gray-600 font-medium">{t('ideaDetail.targetAudience')}:</span>{' '}
                  <span className="text-gray-800">{currentIdea.target_audience}</span>
                </div>
              )}
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => onViewDetails(currentIdea)}
            >
              <Info className="mr-2 h-4 w-4" />
              {t('ideaDetail.viewDetails') || 'View Details'}
            </Button>
          </CardContent>
        </Card>
        </motion.div>
      </div>

      {/* Swipe hint on first card */}
      {currentIndex === 0 && (
        <div className="text-center text-gray-700 text-sm px-4 font-medium">
          {t('dashboard.swipeHint')}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex justify-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <Button
              size="icon"
              variant="outline"
              className={`h-16 w-16 rounded-full border-2 shadow-uber transition-all duration-200 ${
                swipeDirection === 'left'
                  ? 'border-red-500 bg-red-500 scale-110'
                  : 'border-red-500 hover:bg-red-500/10'
              }`}
              onClick={() => handleSwipe('left')}
            >
              <X className={`h-8 w-8 ${swipeDirection === 'left' ? 'text-white' : 'text-red-500'}`} />
            </Button>
            <span className="text-xs text-gray-600 font-medium">{t('dashboard.skip')}</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Button
              size="icon"
              variant="outline"
              className={`h-16 w-16 rounded-full border-2 shadow-uber transition-all duration-200 ${
                swipeDirection === 'down'
                  ? 'border-yellow-500 bg-yellow-500 scale-110'
                  : 'border-yellow-500 hover:bg-yellow-500/10'
              }`}
              onClick={() => handleSwipe('down')}
              title={t('dashboard.reviewLaterNote')}
            >
              <Clock className={`h-8 w-8 ${swipeDirection === 'down' ? 'text-white' : 'text-yellow-500'}`} />
            </Button>
            <span className="text-xs text-gray-600 font-medium">{t('dashboard.reviewLaterBtn')}</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Button
              size="icon"
              variant="outline"
              className={`h-16 w-16 rounded-full border-2 shadow-uber transition-all duration-200 ${
                swipeDirection === 'right'
                  ? 'border-green-500 bg-green-500 scale-110'
                  : 'border-green-500 hover:bg-green-500/10'
              }`}
              onClick={() => handleSwipe('right')}
            >
              <Heart className={`h-8 w-8 ${swipeDirection === 'right' ? 'text-white' : 'text-green-500'}`} />
            </Button>
            <span className="text-xs text-gray-600 font-medium">{t('dashboard.saveBtn')}</span>
          </div>
        </div>

        {/* Undo button */}
        {swipeHistory.length > 0 && currentIndex > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleUndo}
            className="text-gray-600 hover:text-black"
          >
            <Undo2 className="h-4 w-4 mr-2" />
            {t('common.back') || 'Undo'}
          </Button>
        )}
      </div>
    </div>
  );
}
