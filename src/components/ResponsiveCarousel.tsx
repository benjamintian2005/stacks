import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ITEM_WIDTH = 256; // matches w-64

type ResponsiveCarouselProps<T> = {
  title: string;
  items: T[];
  itemKey: (item: T) => string;
  renderItem: (item: T) => ReactNode;
};

export default function ResponsiveCarousel<T>({ title, items, itemKey, renderItem }: ResponsiveCarouselProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(0);

  useEffect(() => {
    const updateItemsPerView = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        setItemsPerView(Math.max(1, Math.floor(containerWidth / ITEM_WIDTH)));
      }
    };
    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, [items.length]);

  const showControls = items.length > itemsPerView;

  const scroll = (direction: 'prev' | 'next') => {
    const container = containerRef.current;
    if (!container) return;
    const scrollAmount = ITEM_WIDTH * itemsPerView;
    const maxScroll = Math.max(0, (items.length - itemsPerView) * ITEM_WIDTH);
    const newPosition =
      direction === 'next'
        ? Math.min(scrollPosition + scrollAmount, maxScroll)
        : Math.max(0, scrollPosition - scrollAmount);

    container.scrollTo({ left: newPosition, behavior: 'smooth' });
    setScrollPosition(newPosition);
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
      <div className="flex items-center">
        {showControls && (
          <button
            type="button"
            onClick={() => scroll('prev')}
            disabled={scrollPosition === 0}
            className="mr-2 shrink-0 rounded-full bg-slate-200 p-2 hover:bg-slate-300 disabled:opacity-40 dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}

        <div
          ref={containerRef}
          className="flex overflow-hidden scroll-smooth"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {items.map((item) => (
            <div key={itemKey(item)} className="w-64 shrink-0 p-2" style={{ scrollSnapAlign: 'start' }}>
              {renderItem(item)}
            </div>
          ))}
        </div>

        {showControls && (
          <button
            type="button"
            onClick={() => scroll('next')}
            className="ml-2 shrink-0 rounded-full bg-slate-200 p-2 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}
