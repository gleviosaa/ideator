'use client'

import { useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { X, Heart, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Idea } from '@/types';
import toast from 'react-hot-toast';

interface SwipeableCardsProps {
  ideas: Idea[];
  onSwipeComplete: (savedIdeas: Idea[]) => void;
  onViewDetails: (idea: Idea) => void;
}

export function SwipeableCards({ ideas, onSwipeComplete, onViewDetails }: SwipeableCardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [savedIdeas, setSavedIdeas] = useState<Idea[]>([]);
  const [exitX, setExitX] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

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
      if (direction === 'right') {
        setSavedIdeas(prev => [...prev, currentIdea]);
        toast.success('Idea saved!', { icon: '❤️' });
      } else {
        toast('Idea skipped', { icon: '👋' });
      }

      // Move to next card
      setTimeout(() => {
        if (currentIndex === ideas.length - 1) {
          // All cards swiped
          onSwipeComplete(direction === 'right' ? [...savedIdeas, currentIdea] : savedIdeas);
        } else {
          setCurrentIndex(prev => prev + 1);
          setExitX(0);
          setSwipeDirection(null);
        }
      }, 200);
    }
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    setSwipeDirection(direction);
    setExitX(direction === 'right' ? 300 : -300);

    // Show toast and handle save
    if (direction === 'right') {
      setSavedIdeas(prev => [...prev, currentIdea]);
      toast.success('Idea saved!', { icon: '❤️' });
    } else {
      toast('Idea skipped', { icon: '👋' });
    }

    setTimeout(() => {
      if (currentIndex === ideas.length - 1) {
        onSwipeComplete(direction === 'right' ? [...savedIdeas, currentIdea] : savedIdeas);
      } else {
        setCurrentIndex(prev => prev + 1);
        setExitX(0);
        setSwipeDirection(null);
      }
    }, 200);
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
                  <span className="text-xs px-2 py-1 bg-gray-800 rounded">
                    {currentIdea.technology}
                  </span>
                )}
                {currentIdea.complexity && (
                  <span className="text-xs px-2 py-1 bg-gray-800 rounded">
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

            <div className="space-y-2 text-sm">
              {currentIdea.time_to_build && (
                <div>
                  <span className="text-gray-400">Time to Build:</span>{' '}
                  <span>{currentIdea.time_to_build}</span>
                </div>
              )}
              {currentIdea.monetization && (
                <div>
                  <span className="text-gray-400">Monetization:</span>{' '}
                  <span>{currentIdea.monetization}</span>
                </div>
              )}
              {currentIdea.target_audience && (
                <div>
                  <span className="text-gray-400">Target Audience:</span>{' '}
                  <span>{currentIdea.target_audience}</span>
                </div>
              )}
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => onViewDetails(currentIdea)}
            >
              <Info className="mr-2 h-4 w-4" />
              View Details
            </Button>
          </CardContent>
        </Card>
        </motion.div>
      </div>

      {/* Swipe hint on first card */}
      {currentIndex === 0 && (
        <div className="text-center text-gray-500 text-sm px-4">
          Swipe right to save, left to skip
        </div>
      )}

      {/* Action buttons */}
      <div className="flex justify-center gap-8 pt-2">
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
      </div>
    </div>
  );
}
