import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp, MessageSquare, CornerDownRight, Send, Lock } from 'lucide-react';
import type { Review } from '@/types';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { formatRelativeTime } from '@/lib/reviews';
import StarRating from './StarRating';

interface ReviewItemProps {
  review: Review;
  isAuthor: boolean;
  onPermissionDenied: (action: 'like' | 'reply') => void;
  onPreviewImage: (images: string[], index: number) => void;
}

export default function ReviewItem({
  review,
  isAuthor,
  onPermissionDenied,
  onPreviewImage,
}: ReviewItemProps) {
  const location = useLocation();
  const { user, isAuthenticated, toggleReviewLike, addReviewReply } = useStore();
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showReplies, setShowReplies] = useState(false);

  const liked = !!user && review.likedBy.includes(user.id);

  const handleLike = () => {
    if (!isAuthenticated) {
      onPermissionDenied('like');
      return;
    }
    toggleReviewLike(review.id);
  };

  const handleReplyClick = () => {
    if (!isAuthenticated) {
      onPermissionDenied('reply');
      return;
    }
    setReplyOpen((prev) => !prev);
    setShowReplies(true);
  };

  const submitReply = () => {
    const text = replyText.trim();
    if (!text) return;
    addReviewReply(review.id, text);
    setReplyText('');
    setReplyOpen(false);
    setShowReplies(true);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 rounded-xl border border-gray-800 bg-dark-900/40 hover:border-gray-700/70 transition-colors"
    >
      <div className="flex items-start gap-3">
        <img
          src={review.userAvatar}
          alt={review.userName}
          className="w-10 h-10 rounded-full object-cover border border-gray-700 flex-shrink-0"
        />
        <div className="flex-grow min-w-0">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <span className="font-medium text-white text-sm">{review.userName}</span>
            {isAuthor && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary-500/20 text-primary-300 border border-primary-500/30">
                我的评价
              </span>
            )}
            <StarRating value={review.rating} size={13} />
            <span className="text-xs text-gray-500 ml-auto">{formatRelativeTime(review.createdAt)}</span>
          </div>

          {review.content && (
            <p className="mt-2.5 text-sm text-gray-300 leading-relaxed whitespace-pre-wrap break-words">
              {review.content}
            </p>
          )}

          {review.images.length > 0 && (
            <div
              className={cn(
                'mt-3 grid gap-2',
                review.images.length === 1 && 'grid-cols-1 max-w-xs',
                review.images.length === 2 && 'grid-cols-2 max-w-md',
                review.images.length >= 3 && 'grid-cols-3 max-w-lg'
              )}
            >
              {review.images.map((src, index) => (
                <button
                  key={index}
                  onClick={() => onPreviewImage(review.images, index)}
                  className={cn(
                    'relative overflow-hidden rounded-lg border border-gray-800 bg-dark-800 group',
                    review.images.length === 1 ? 'aspect-video' : 'aspect-square'
                  )}
                >
                  <img
                    src={src}
                    alt={`评价图片 ${index + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 mt-3.5">
            <button
              onClick={handleLike}
              className={cn(
                'inline-flex items-center gap-1.5 text-xs font-medium transition-colors',
                liked ? 'text-primary-400' : 'text-gray-500 hover:text-gray-300'
              )}
            >
              <ThumbsUp className={cn('w-3.5 h-3.5', liked && 'fill-primary-400')} />
              {liked ? '已点赞' : '点赞'}
              {review.likedBy.length > 0 && (
                <span className={cn('px-1.5 py-0.5 rounded-full text-[10px]',
                  liked ? 'bg-primary-500/15' : 'bg-gray-700/40'
                )}>
                  {review.likedBy.length}
                </span>
              )}
            </button>
            <button
              onClick={handleReplyClick}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-300 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              回复
            </button>
            {review.replies.length > 0 && (
              <button
                onClick={() => setShowReplies((prev) => !prev)}
                className="text-xs text-gray-500 hover:text-primary-400 transition-colors ml-auto"
              >
                {showReplies ? '收起回复' : `查看 ${review.replies.length} 条回复`}
              </button>
            )}
          </div>

          {!isAuthenticated && (
            <p className="mt-2.5 flex items-center gap-1.5 text-[11px] text-gray-600">
              <Lock className="w-3 h-3" />
              <Link to="/login" state={{ from: location.pathname }} className="hover:text-primary-400 underline-offset-2 hover:underline">
                登录
              </Link>
              后可点赞与回复
            </p>
          )}

          <AnimatePresence>
            {replyOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="flex items-start gap-2 mt-3">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value.slice(0, 200))}
                    placeholder={`回复 ${review.userName}…`}
                    rows={2}
                    autoFocus
                    className="flex-1 px-3 py-2 text-sm bg-dark-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 resize-none transition-all"
                  />
                  <button
                    onClick={submitReply}
                    disabled={!replyText.trim()}
                    className="p-2.5 rounded-lg bg-primary-500 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary-400 transition-colors self-end"
                    aria-label="发送回复"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showReplies && review.replies.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-3 space-y-3 pl-3 border-l-2 border-gray-800">
                  {review.replies.map((reply) => (
                    <div key={reply.id} className="flex items-start gap-2.5">
                      <CornerDownRight className="w-3.5 h-3.5 text-gray-600 mt-1 flex-shrink-0" />
                      <img
                        src={reply.userAvatar}
                        alt={reply.userName}
                        className="w-7 h-7 rounded-full object-cover border border-gray-700 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-medium text-gray-300">{reply.userName}</span>
                          <span className="text-[11px] text-gray-600">
                            {formatRelativeTime(reply.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mt-0.5 break-words">{reply.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
