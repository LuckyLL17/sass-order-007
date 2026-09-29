import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  MessageSquare,
  Lock,
  BadgeCheck,
  Crown,
  LogIn,
  AlertCircle,
  X,
} from 'lucide-react';
import type { Tool, ReviewSort } from '@/types';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { getReviewStats } from '@/lib/reviews';
import StarRating from './StarRating';
import ReviewForm from './ReviewForm';
import ReviewItem from './ReviewItem';

interface ReviewsProps {
  tool: Tool;
}

interface Toast {
  message: string;
  actionLabel?: string;
  actionTo?: string;
}

const sortOptions: { key: ReviewSort; label: string }[] = [
  { key: 'newest', label: '最新' },
  { key: 'likes', label: '点赞最多' },
  { key: 'rating', label: '评分最高' },
];

export default function Reviews({ tool }: ReviewsProps) {
  const {
    isAuthenticated,
    subscriptions,
    getReviewsByTool,
    hasUserReviewedTool,
  } = useStore();

  const [sortBy, setSortBy] = useState<ReviewSort>('newest');
  const [toast, setToast] = useState<Toast | null>(null);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const reviews = getReviewsByTool(tool.id);
  const stats = useMemo(() => getReviewStats(reviews, tool.rating), [reviews, tool.rating]);

  const activeSubscription = subscriptions.find(
    (sub) => sub.toolId === tool.id && sub.status === 'active',
  );
  const canReview = isAuthenticated && !!activeSubscription;
  const alreadyReviewed = isAuthenticated && hasUserReviewedTool(tool.id);

  const sortedReviews = useMemo(() => {
    const list = [...reviews];
    switch (sortBy) {
      case 'likes':
        return list.sort(
          (a, b) =>
            b.likedBy.length - a.likedBy.length ||
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
      case 'rating':
        return list.sort(
          (a, b) =>
            b.rating - a.rating ||
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
      case 'newest':
      default:
        return list.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
    }
  }, [reviews, sortBy]);

  const showToast = (next: Toast) => {
    setToast(next);
    window.setTimeout(() => {
      setToast((current) => (current?.message === next.message ? null : current));
    }, 2800);
  };

  const requireAuth = (action: string) => {
    showToast({
      message: `请先登录后再${action}`,
      actionLabel: '去登录',
      actionTo: '/login',
    });
  };

  const scrollToSubscribe = () => {
    document.getElementById('subscribe-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="card"
    >
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-6 h-6 text-primary-400" />
        <h2 className="text-2xl font-bold text-white">用户评价</h2>
        {stats.count > 0 && (
          <span className="px-2 py-0.5 rounded-full bg-primary-500/15 text-primary-300 text-xs font-medium">
            {stats.count} 条
          </span>
        )}
      </div>

      {/* 评分总览 + 星级分布 */}
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 p-5 rounded-xl bg-dark-900/50 border border-gray-800/80 mb-6">
        <div className="flex flex-col items-center justify-center sm:border-r sm:border-gray-800 sm:pr-10">
          <span className="text-5xl font-bold text-white">{stats.average.toFixed(1)}</span>
          <StarRating value={Math.round(stats.average)} size="sm" className="mt-2" />
          <span className="text-sm text-gray-500 mt-1">
            {stats.count > 0 ? `共 ${stats.count} 条评价` : '暂无用户评价'}
          </span>
        </div>
        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((star, index) => (
            <div key={star} className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-xs text-gray-400 w-8 flex-shrink-0">
                {star}
                <Star className="w-3 h-3 text-gold-400 fill-gold-400" />
              </span>
              <div className="flex-1 h-2 rounded-full bg-dark-800 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.percentages[index]}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-gold-500 to-amber-400"
                />
              </div>
              <span className="text-xs text-gray-500 w-10 text-right flex-shrink-0">
                {stats.count > 0 ? `${stats.percentages[index]}%` : '—'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 发表评价：权限分流 */}
      {!isAuthenticated ? (
        <div className="p-6 rounded-xl border border-dashed border-gray-700 bg-dark-900/30 text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary-500/10 flex items-center justify-center">
            <Lock className="w-6 h-6 text-primary-400" />
          </div>
          <h3 className="text-white font-semibold mb-1">登录后即可评价</h3>
          <p className="text-sm text-gray-400 mb-4">仅有效订阅用户可发表星级与评论</p>
          <div className="flex items-center justify-center gap-3">
            <Link to="/login" className="btn-primary px-5 py-2 text-sm">
              <LogIn className="w-4 h-4" />
              登录
            </Link>
            <Link to="/register" className="btn-outline px-5 py-2 text-sm">
              注册
            </Link>
          </div>
        </div>
      ) : alreadyReviewed ? (
        <div className="p-5 rounded-xl border border-green-500/25 bg-green-500/5 flex items-center gap-3 mb-6">
          <BadgeCheck className="w-5 h-5 text-green-400 flex-shrink-0" />
          <p className="text-sm text-gray-300">
            您已对 <span className="text-white font-medium">{tool.name}</span> 发表过评价，每位有效订阅用户仅可评价一次。
          </p>
        </div>
      ) : !activeSubscription ? (
        <div className="p-6 rounded-xl border border-dashed border-gray-700 bg-dark-900/30 text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gold-500/10 flex items-center justify-center">
            <Crown className="w-6 h-6 text-gold-400" />
          </div>
          <h3 className="text-white font-semibold mb-1">订阅后即可发表评价</h3>
          <p className="text-sm text-gray-400 mb-4">
            当前账号还没有 {tool.name} 的有效订阅，订阅成功后即可参与评价
          </p>
          <button type="button" onClick={scrollToSubscribe} className="btn-primary px-5 py-2 text-sm">
            查看订阅方案
          </button>
        </div>
      ) : (
        <div className="mb-6">
          <ReviewForm toolId={tool.id} />
        </div>
      )}

      {/* 排序 */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">全部评价</h3>
        <div className="flex items-center gap-1 p-1 bg-dark-900 rounded-lg border border-gray-800">
          {sortOptions.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setSortBy(option.key)}
              className={cn(
                'px-3 py-1.5 rounded-md text-sm font-medium transition-all',
                sortBy === option.key
                  ? 'bg-primary-500 text-white shadow'
                  : 'text-gray-400 hover:text-white',
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* 评价列表 */}
      {sortedReviews.length === 0 ? (
        <div className="py-14 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-dark-900 flex items-center justify-center">
            <MessageSquare className="w-7 h-7 text-gray-600" />
          </div>
          <p className="text-gray-400 font-medium mb-1">还没有评价</p>
          <p className="text-sm text-gray-500">
            {canReview ? '成为第一个分享使用体验的用户吧！' : '订阅后成为第一个评价的用户吧！'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedReviews.map((review) => (
            <ReviewItem
              key={review.id}
              review={review}
              onRequireAuth={requireAuth}
              onOpenImage={setLightboxSrc}
            />
          ))}
        </div>
      )}

      {/* 权限提示 Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-[60] flex items-center gap-3 pl-4 pr-2 py-2.5 rounded-xl bg-dark-800 border border-gray-700 shadow-card-hover"
          >
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <span className="text-sm text-gray-200">{toast.message}</span>
            {toast.actionTo && (
              <Link
                to={toast.actionTo}
                onClick={() => setToast(null)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary-500 text-white text-sm font-medium hover:bg-primary-400 transition-colors"
              >
                {toast.actionLabel}
              </Link>
            )}
            <button
              type="button"
              onClick={() => setToast(null)}
              className="p-1.5 text-gray-500 hover:text-white rounded-lg hover:bg-white/5"
              aria-label="关闭提示"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 图片大图预览 */}
      <AnimatePresence>
        {lightboxSrc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4"
            onClick={() => setLightboxSrc(null)}
          >
            <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />
            <motion.img
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              src={lightboxSrc}
              alt="评价图片大图"
              className="relative max-w-full max-h-[85vh] rounded-xl border border-gray-700 object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              type="button"
              onClick={() => setLightboxSrc(null)}
              className="absolute top-5 right-5 p-2.5 rounded-full bg-dark-800/80 border border-gray-700 text-white hover:bg-dark-700 transition-colors"
              aria-label="关闭预览"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
