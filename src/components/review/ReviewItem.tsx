import { useState } from 'react';
import { ThumbsUp, MessageSquareReply, Send, CornerDownRight } from 'lucide-react';
import type { Review } from '@/types';
import { useStore } from '@/store/useStore';
import { cn, formatRelativeTime } from '@/lib/utils';
import StarRating from './StarRating';

interface ReviewItemProps {
  review: Review;
  onRequireAuth: (action: string) => void;
  onOpenImage: (src: string) => void;
}

export default function ReviewItem({ review, onRequireAuth, onOpenImage }: ReviewItemProps) {
  const { user, isAuthenticated, toggleReviewLike, addReviewReply } = useStore();
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [replyError, setReplyError] = useState('');

  const liked = !!user && review.likedBy.includes(user.id);

  const handleLike = () => {
    if (!isAuthenticated) {
      onRequireAuth('点赞');
      return;
    }
    toggleReviewLike(review.id);
  };

  const handleReplyClick = () => {
    if (!isAuthenticated) {
      onRequireAuth('回复');
      return;
    }
    setShowReplyBox((prev) => !prev);
    setReplyError('');
  };

  const handleSubmitReply = () => {
    const trimmed = replyContent.trim();
    if (!trimmed) {
      setReplyError('回复内容不能为空');
      return;
    }
    addReviewReply(review.id, trimmed);
    setReplyContent('');
    setReplyError('');
    setShowReplyBox(false);
  };

  return (
    <div className="p-5 rounded-xl bg-dark-900/50 border border-gray-800/80">
      <div className="flex items-start gap-4">
        <img
          src={review.userAvatar}
          alt={review.userName}
          className="w-11 h-11 rounded-full object-cover border border-gray-700 flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1">
            <span className="text-white font-medium">{review.userName}</span>
            <StarRating value={review.rating} size="sm" />
            <span className="text-gray-500 text-xs ml-auto sm:ml-0">
              {formatRelativeTime(review.createdAt)}
            </span>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap break-words">
            {review.content}
          </p>

          {review.images.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {review.images.map((src, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => onOpenImage(src)}
                  className="w-24 h-24 rounded-lg overflow-hidden border border-gray-700 hover:border-primary-500 transition-colors group"
                >
                  <img
                    src={src}
                    alt={`评价图片 ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 mt-3">
            <button
              type="button"
              onClick={handleLike}
              className={cn(
                'inline-flex items-center gap-1.5 text-xs font-medium transition-colors',
                liked
                  ? 'text-primary-400'
                  : 'text-gray-400 hover:text-primary-400',
              )}
            >
              <ThumbsUp className={cn('w-4 h-4', liked && 'fill-primary-400')} />
              {liked ? '已点赞' : '点赞'}
              {review.likedBy.length > 0 && (
                <span className="px-1.5 py-0.5 rounded bg-dark-800 text-gray-400">
                  {review.likedBy.length}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={handleReplyClick}
              className={cn(
                'inline-flex items-center gap-1.5 text-xs font-medium transition-colors',
                showReplyBox ? 'text-primary-400' : 'text-gray-400 hover:text-primary-400',
              )}
            >
              <MessageSquareReply className="w-4 h-4" />
              回复
              {review.replies.length > 0 && (
                <span className="px-1.5 py-0.5 rounded bg-dark-800 text-gray-400">
                  {review.replies.length}
                </span>
              )}
            </button>
          </div>

          {showReplyBox && (
            <div className="mt-3 flex gap-2">
              <input
                value={replyContent}
                onChange={(e) => {
                  setReplyContent(e.target.value);
                  if (replyError) setReplyError('');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSubmitReply();
                }}
                placeholder="写下您的回复…"
                maxLength={200}
                className="flex-1 px-3 py-2 bg-dark-800 border border-gray-700 rounded-lg text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                autoFocus
              />
              <button
                type="button"
                onClick={handleSubmitReply}
                className="px-3 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-400 transition-colors flex-shrink-0"
                aria-label="发送回复"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          )}
          {replyError && <p className="mt-2 text-xs text-red-400">{replyError}</p>}

          {review.replies.length > 0 && (
            <div className="mt-4 space-y-3 border-l-2 border-gray-800 pl-4">
              {review.replies.map((reply) => (
                <div key={reply.id} className="flex items-start gap-3">
                  <CornerDownRight className="w-4 h-4 text-gray-600 mt-1 flex-shrink-0" />
                  <img
                    src={reply.userAvatar}
                    alt={reply.userName}
                    className="w-7 h-7 rounded-full object-cover border border-gray-700 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm text-white font-medium">{reply.userName}</span>
                      <span className="text-xs text-gray-500">
                        {formatRelativeTime(reply.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 break-words">{reply.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
