import { Lightbulb } from 'lucide-react';

interface IdeatorLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export function IdeatorLogo({ size = 'md', showText = true, className = '' }: IdeatorLogoProps) {
  const sizes = {
    sm: { icon: 'h-5 w-5', text: 'text-lg' },
    md: { icon: 'h-6 w-6', text: 'text-xl' },
    lg: { icon: 'h-8 w-8', text: 'text-2xl' }
  };

  const sizeClasses = sizes[size];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="bg-black rounded-uber p-1.5 flex items-center justify-center">
        <Lightbulb className={`${sizeClasses.icon} text-white fill-white`} />
      </div>
      {showText && (
        <span className={`${sizeClasses.text} font-bold text-black`}>
          Ideator
        </span>
      )}
    </div>
  );
}
