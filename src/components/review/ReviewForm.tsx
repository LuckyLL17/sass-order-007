import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Crown, Lock, Send, Loader2 } from 'lucide-react';
import { useStore } from '@/store/useStore';
import StarRating from './StarRating';
import ReviewImageUploader from './ReviewImageUploader';

interface ReviewFormProps {
  toolId: string;
  onError: (message: string) => void;
  onSuccess: () => void;
}

const MAX_CONTENT = 500;

export default function ReviewForm({ toolId, onError, onSuccess }: ReviewFormProps) {
  const { user, isAuthenticated, hasActiveSubscription, addReview } = useStore();
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const subscribed = hasActiveSubscription(toolId);

  const resetForm = () => {
    setRating(0);
    setContent('');
    setImages([]);
  };

  const handleSubmit = async () => {
    // 空评论拦截：必须打星，且文字/图片至少有一项
    if (rating === 0) {
      onError('请先为这款工具选择星级评分');
      return;
    }
    if (content.trim().length === 0 && images.length === 0) {
      onError('评论内容不能为空，写点使用感受或上传图片吧');
      return;
    }
    if (submitting) return; // 防止重复提交

    setSubmitting(true);
    try {
      // 模拟提交请求
      await new Promise((resolve) => setTimeout(resolve, 600));
      addReview({ toolId, rating, content, images });
      resetForm();
      onSuccess();
    } finally {
      setSubmitting(false);
    }
  };

  // 访客：未登录
  if (!isAuthenticated || !user) {
    return (
      <div className="rounded-xl border border-gray-800 bg-dark-900/50 p-6 text-center">
        <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gray-700/30 flex items-center justify-center">
          <Lock className="w-6 h-6 text-gray-400" />
        </div>
        <h3 className="font-semibold text-white mb-1.5">登录后即可评价</h3>
        <p className="text-sm text-gray-400 mb-4">
          分享你的真实使用体验，还可以上传截图、为其他评价点赞和回复
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link to="/login" state={{ from: `/tool/${toolId}` }} className="btn-primary text-sm">
            立即登录
          </Link>
          <Link to="/register" className="btn-outline text-sm">
            注册账号
          </Link>
        </div>
      </div>
    );
  }

  // 已登录但没有有效订阅
  if (!subscribed) {
    return (
      <div className="rounded-xl border border-gold-500/20 bg-gradient-to-br from-gold-500/10 to-amber-500/5 p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-gold-500/15 flex items-center justify-center">
            <Crown className="w-6 h-6 text-gold-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white mb-1.5">订阅用户专属</h3>
            <p className="text-sm text-gray-400">
              仅当前持有该工具<strong className="text-gold-400 font-medium">有效订阅</strong>
              的用户可以发表评价。订阅后即可分享星级、评论和使用截图。
            </p>
            <a
              href="#subscribe"
              className="inline-flex items-center gap-1.5 mt-3 text-sm font-medium text-gold-400 hover:text-gold-300 transition-colors"
            >
              <Crown className="w-4 h-4" />
              前往订阅方案
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-gray-800 bg-dark-900/50 p-5"
    >
      <div className="flex items-center gap-3 mb-4">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-10 h-10 rounded-full object-cover border border-gray-700"
        />
        <div>
          <p className="font-medium text-white text-sm">{user.name}</p>
          <p className="text-xs text-gray-500">发表你的真实使用体验</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-300">整体评分</span>
          {rating > 0 && <span className="text-xs text-gray-500">已选择 {rating} 星</span>}
        </div>
        <StarRating value={rating} size={28} interactive onChange={setRating} />
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value.slice(0, MAX_CONTENT))}
        placeholder="说说这款工具的优点、不足或使用建议…"
        rows={4}
        className="input resize-none mb-3"
      />

      <div className="flex items-start justify-between gap-4 mb-4">
        <ReviewImageUploader images={images} onChange={setImages} onError={onError} />
        <span className="text-xs text-gray-500 flex-shrink-0 pt-1">
          {content.length}/{MAX_CONTENT}
        </span>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="btn-primary text-sm disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              发布中…
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              发布评价
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
