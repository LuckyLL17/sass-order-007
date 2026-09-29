import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  Clock,
  ThumbsUp,
  TrendingUp,
  MessageSquareOff,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
} from 'lucide-react';
import type { ReviewSort, Tool } from '@/types';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { getReviewStats, sortReviews } from '@/lib/reviews';
import StarRating from './StarRating';
import ReviewForm from './ReviewForm';
import ReviewItem from './ReviewItem';
import ImageLightbox from './ImageLightbox';

interface ReviewsSectionProps {
  tool: Tool;
}

const SORT_OPTIONS: { value: ReviewSort; label: string; icon: typeof Clock }[] = [
  { value: 'newest', label: '最新', icon: Clock },
  { value: 'likes', label: '点赞最多', icon: ThumbsUp },
  { value: 'rating', label: '评分最高', icon: TrendingUp },
];

type Toast = { id: number; type: 'success' | 'error' | 'permission'; message: string };

export default function ReviewsSection({ tool }: ReviewsSectionProps) {
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const reviews = useStore((state) => state.reviews);
  const currentUserId = useStore((state) => state.user?.id);
  const [sortBy, setSortBy] = useState<ReviewSort>('newest');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number } | null>(null);

  const allReviews = useMemo(
    () => reviews.filter((review) => review.toolId === tool.id),
    [reviews, tool.id]
  );
  const myReview = useMemo(
    () => allReviews.find((review) => review.userId === currentUserId),
    [allReviews, currentUserId]
  );
  const stats = useMemo(() => getReviewStats(allReviews, tool.rating), [allReviews, tool.rating]);
  const sortedReviews = useMemo(() => sortReviews(allReviews, sortBy), [allReviews, sortBy]);

  // 切换工具详情页时重置模块自身状态，避免排序/弹层等状态串到新页面
  useEffect(() => {
    setSortBy('newest');
    setLightbox(null);
    setToasts([]);
  }, [tool.id]);

  const pushToast = (type: Toast['type'], message: string) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, message }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  };

  const handlePermissionDenied = (action: 'like' | 'reply') => {
    pushToast(
      'permission',
      action === 'like' ? '请先登录后再点赞' : '请先登录后再回复'
    );
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mb-12"
    >
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2.5">
        <Star className="w-6 h-6 text-gold-400 fill-gold-400" />
        用户评价
        {stats.total > 0 && (
          <span className="text-base font-normal text-gray-500">({stats.total})</span>
        )}
      </h2>

      {/* 评分概览：有评价时按评价数据计算，无评价时沿用静态评分 */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8">
          <div className="flex flex-col items-center justify-center md:min-w-[180px] md:border-r md:border-gray-800 md:pr-8">
            <div className="text-5xl font-bold text-white mb-2">
              {stats.average.toFixed(1)}
            </div>
            <StarRating value={stats.average} size={20} className="mb-2" />
            <p className="text-sm text-gray-500">
              {stats.total > 0 ? `共 ${stats.total} 条评价` : '暂无用户评价'}
            </p>
          </div>

          <div className="space-y-2">
            {stats.distribution.map((item) => (
              <div key={item.star} className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-xs text-gray-400 w-10 flex-shrink-0">
                  {item.star}
                  <Star className="w-3 h-3 fill-gold-400 text-gold-400" />
                </span>
                <div className="flex-1 h-2 rounded-full bg-dark-900 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percent}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-r from-gold-500 to-amber-400"
                  />
                </div>
                <span className="text-xs text-gray-500 w-14 text-right flex-shrink-0">
                  {item.count} 条 · {item.percent}%
                </span>
              </div>
            ))}
            {stats.total === 0 && (
              <p className="text-xs text-gray-600 pt-1">
                订阅用户发布评价后，这里将展示真实的星级分布
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 发表评价：已评价则展示提示，避免重复提交 */}
      {myReview ? (
        <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-5 mb-6 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-white">你已评价过这款工具</p>
            <p className="text-xs text-gray-400 mt-1">
              你给出了 {myReview.rating} 星评价，可在下方评价列表中查看。每位用户对同一工具仅可评价一次。
            </p>
          </div>
        </div>
      ) : (
        <div className="mb-6">
          <ReviewForm
            toolId={tool.id}
            onError={(message) => pushToast('error', message)}
            onSuccess={() => pushToast('success', '评价发布成功，感谢你的分享！')}
          />
        </div>
      )}

      {/* 排序 */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h3 className="text-lg font-semibold text-white">全部评价</h3>
        <div className="flex items-center gap-1 p-1 bg-dark-800 rounded-lg border border-gray-800">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setSortBy(option.value)}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all',
                sortBy === option.value
                  ? 'bg-primary-500 text-white shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              )}
            >
              <option.icon className="w-3.5 h-3.5" />
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* 评价列表 */}
      {sortedReviews.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-800 bg-dark-900/30 py-14 px-6 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gray-700/20 flex items-center justify-center">
            <MessageSquareOff className="w-7 h-7 text-gray-500" />
          </div>
          <p className="text-gray-300 font-medium mb-1">还没有评价</p>
          <p className="text-sm text-gray-500">
            {isAuthenticated
              ? '成为该工具的有效订阅用户后，第一个分享使用体验吧'
              : '登录并订阅后，发表第一条评价吧'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {sortedReviews.map((review) => (
              <ReviewItem
                key={review.id}
                review={review}
                isAuthor={!!myReview && review.id === myReview.id}
                onPermissionDenied={handlePermissionDenied}
                onPreviewImage={(images, index) => setLightbox({ images, index })}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* 图片灯箱 */}
      <AnimatePresence>
        {lightbox && (
          <ImageLightbox
            images={lightbox.images}
            index={lightbox.index}
            onClose={() => setLightbox(null)}
            onIndexChange={(index) => setLightbox((prev) => (prev ? { ...prev, index } : null))}
          />
        )}
      </AnimatePresence>

      {/* 全局提示：成功 / 错误 / 权限 */}
      <div className="fixed bottom-6 right-6 z-[70] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.95 }}
              className={cn(
                'flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-xl backdrop-blur-md text-sm max-w-xs',
                toast.type === 'success' && 'bg-green-500/15 border-green-500/30 text-green-300',
                toast.type === 'error' && 'bg-red-500/15 border-red-500/30 text-red-300',
                toast.type === 'permission' && 'bg-amber-500/15 border-amber-500/30 text-amber-300'
              )}
            >
              {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 flex-shrink-0" />}
              {toast.type === 'error' && <AlertCircle className="w-4 h-4 flex-shrink-0" />}
              {toast.type === 'permission' && <ShieldAlert className="w-4 h-4 flex-shrink-0" />}
              <span>{toast.message}</span>
              {toast.type === 'permission' && (
                <Link
                  to="/login"
                  className="ml-1 underline underline-offset-2 hover:text-white whitespace-nowrap"
                >
                  去登录
                </Link>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
