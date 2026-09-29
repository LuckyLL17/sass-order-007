import type { Review, ReviewSort } from '@/types';

export interface StarDistributionItem {
  star: number;
  count: number;
  percent: number;
}

export interface ReviewStats {
  total: number;
  average: number;
  distribution: StarDistributionItem[];
}

/** 根据评价数据计算平均分与 5-1 星分布；无评价时由调用方回退到静态评分 */
export function getReviewStats(reviews: Review[], fallbackRating = 0): ReviewStats {
  const total = reviews.length;
  const counts = [0, 0, 0, 0, 0];

  reviews.forEach((review) => {
    if (review.rating >= 1 && review.rating <= 5) {
      counts[review.rating - 1] += 1;
    }
  });

  const average = total > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / total
    : fallbackRating;

  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: counts[star - 1],
    percent: total > 0 ? Math.round((counts[star - 1] / total) * 100) : 0,
  }));

  return { total, average, distribution };
}

/** 按最新 / 点赞 / 评分排序评价 */
export function sortReviews(reviews: Review[], sortBy: ReviewSort): Review[] {
  const copy = [...reviews];

  switch (sortBy) {
    case 'likes':
      copy.sort((a, b) => {
        const diff = b.likedBy.length - a.likedBy.length;
        return diff !== 0 ? diff : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      break;
    case 'rating':
      copy.sort((a, b) => {
        const diff = b.rating - a.rating;
        return diff !== 0 ? diff : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      break;
    case 'newest':
    default:
      copy.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
  }

  return copy;
}

/** 将 ISO 时间格式化为相对时间，如「刚刚」「3 小时前」，超过 7 天显示日期 */
export function formatRelativeTime(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diff = Math.max(0, now - then);

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) return '刚刚';
  if (diff < hour) return `${Math.floor(diff / minute)} 分钟前`;
  if (diff < day) return `${Math.floor(diff / hour)} 小时前`;
  if (diff < 7 * day) return `${Math.floor(diff / day)} 天前`;

  return new Date(iso).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}
