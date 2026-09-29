import type { Review } from '@/types';

export interface ReviewStats {
  count: number;
  average: number;
  distribution: [number, number, number, number, number]; // 5星 -> 1星的数量
  percentages: [number, number, number, number, number];
}

/** 根据评价数据计算平均分与星级分布；无评价时返回静态评分兜底 */
export function getReviewStats(reviews: Review[], fallbackRating: number): ReviewStats {
  const count = reviews.length;
  const distribution: [number, number, number, number, number] = [0, 0, 0, 0, 0];

  reviews.forEach((review) => {
    if (review.rating >= 1 && review.rating <= 5) {
      distribution[5 - review.rating] += 1;
    }
  });

  if (count === 0) {
    return {
      count: 0,
      average: fallbackRating,
      distribution,
      percentages: [0, 0, 0, 0, 0],
    };
  }

  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  const average = Math.round((total / count) * 10) / 10;

  return {
    count,
    average,
    distribution,
    percentages: distribution.map((n) => Math.round((n / count) * 100)) as [
      number, number, number, number, number,
    ],
  };
}
