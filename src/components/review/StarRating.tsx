import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  value: number;
  size?: number;
  interactive?: boolean;
  onChange?: (value: number) => void;
  className?: string;
}

const RATING_LABELS = ['', '非常差', '不太满意', '一般', '比较满意', '非常满意'];

/**
 * 星级展示/选择组件。
 * - 只读模式支持小数评分（按宽度裁剪金色星层）
 * - 交互模式支持悬停预览与点击选择 1-5 星
 */
export default function StarRating({
  value,
  size = 18,
  interactive = false,
  onChange,
  className,
}: StarRatingProps) {
  const [hover, setHover] = useState(0);

  if (interactive) {
    const active = hover || value;

    return (
      <div className={cn('flex items-center gap-2.5', className)}>
        <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              aria-label={`${star} 星`}
              onClick={() => onChange?.(star)}
              onMouseEnter={() => setHover(star)}
              className="p-0.5 transition-transform duration-150 hover:scale-125 focus:outline-none"
            >
              <Star
                style={{ width: size, height: size }}
                className={cn(
                  'transition-colors',
                  star <= active
                    ? 'fill-gold-400 text-gold-400'
                    : 'fill-gray-700/40 text-gray-600'
                )}
              />
            </button>
          ))}
        </div>
        {active > 0 && (
          <span className="text-sm font-medium text-gold-400 w-16">
            {RATING_LABELS[active]}
          </span>
        )}
      </div>
    );
  }

  const percent = Math.max(0, Math.min(100, (value / 5) * 100));

  return (
    <div className={cn('relative inline-flex align-middle', className)}>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            style={{ width: size, height: size }}
            className="fill-gray-700/50 text-gray-700"
          />
        ))}
      </div>
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${percent}%` }}>
        <div className="flex gap-0.5 w-max">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              style={{ width: size, height: size }}
              className="fill-gold-400 text-gold-400 flex-shrink-0"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
