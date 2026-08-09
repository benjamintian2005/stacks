import { useState } from 'react';
import { Star } from 'lucide-react';

type StarRatingProps = {
  /** 0-10 scale, half-point increments (Letterboxd-style half stars out of 5). */
  value: number | null;
  onChange: (value: number) => void;
  disabled?: boolean;
};

export default function StarRating({ value, onChange, disabled }: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const displayValue = (hoverValue ?? value ?? 0) / 2; // 0-5 scale for rendering

  const handleClick = (starIndex: number, half: 'left' | 'right') => {
    if (disabled) return;
    onChange(half === 'left' ? starIndex * 2 - 1 : starIndex * 2);
  };

  return (
    <div className="flex items-center gap-1" onMouseLeave={() => setHoverValue(null)}>
      {[1, 2, 3, 4, 5].map((starIndex) => {
        const fillPercent = Math.max(0, Math.min(1, displayValue - (starIndex - 1))) * 100;
        return (
          <div key={starIndex} className="relative h-6 w-6">
            <Star className="absolute h-6 w-6 text-slate-300 dark:text-slate-700" />
            <div className="absolute h-6 overflow-hidden" style={{ width: `${fillPercent}%` }}>
              <Star className="h-6 w-6 fill-amber-400 text-amber-400" />
            </div>
            {!disabled && (
              <>
                <button
                  type="button"
                  className="absolute left-0 top-0 h-6 w-3 cursor-pointer"
                  onMouseEnter={() => setHoverValue(starIndex * 2 - 1)}
                  onClick={() => handleClick(starIndex, 'left')}
                  aria-label={`Rate ${starIndex - 0.5} of 5 stars`}
                />
                <button
                  type="button"
                  className="absolute right-0 top-0 h-6 w-3 cursor-pointer"
                  onMouseEnter={() => setHoverValue(starIndex * 2)}
                  onClick={() => handleClick(starIndex, 'right')}
                  aria-label={`Rate ${starIndex} of 5 stars`}
                />
              </>
            )}
          </div>
        );
      })}
      {value != null && (
        <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">{(value / 2).toFixed(1)}</span>
      )}
    </div>
  );
}
