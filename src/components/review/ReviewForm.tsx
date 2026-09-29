import { useRef, useState } from 'react';
import { ImagePlus, X, Loader2, Send } from 'lucide-react';
import { useStore } from '@/store/useStore';
import StarRating from './StarRating';
import { cn } from '@/lib/utils';

const MAX_IMAGES = 4;
const MAX_SIZE_MB = 5;

interface ReviewFormProps {
  toolId: string;
  onSubmitted?: () => void;
}

export default function ReviewForm({ toolId, onSubmitted }: ReviewFormProps) {
  const { user, addReview } = useStore();
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setRating(0);
    setContent('');
    setImages([]);
    setError('');
  };

  const handleImages = (files: FileList | null) => {
    if (!files) return;
    setError('');

    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) {
      setError(`最多只能上传 ${MAX_IMAGES} 张图片`);
      return;
    }

    const picked = Array.from(files).slice(0, remaining);
    const oversized = picked.find((file) => file.size > MAX_SIZE_MB * 1024 * 1024);
    if (oversized) {
      setError(`图片「${oversized.name}」超过 ${MAX_SIZE_MB}MB，无法上传`);
      return;
    }
    const invalid = picked.find((file) => !file.type.startsWith('image/'));
    if (invalid) {
      setError('仅支持上传图片文件');
      return;
    }

    picked.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        if (typeof result === 'string') {
          setImages((prev) => (prev.length >= MAX_IMAGES ? prev : [...prev, result]));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    // 防止重复提交
    if (isSubmitting) return;

    const trimmed = content.trim();
    if (rating < 1) {
      setError('请先选择星级评分（1-5 星）');
      return;
    }
    if (!trimmed) {
      setError('评论内容不能为空');
      return;
    }
    if (!user) return;

    setIsSubmitting(true);
    setError('');
    // 模拟网络请求
    await new Promise((resolve) => setTimeout(resolve, 600));

    addReview(toolId, rating, trimmed, images);
    setIsSubmitting(false);
    resetForm();
    onSubmitted?.();
  };

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-white mb-4">发表评价</h3>

      <div className="flex items-center gap-3 mb-4">
        <img
          src={user?.avatar}
          alt={user?.name}
          className="w-10 h-10 rounded-full object-cover border border-gray-700"
        />
        <div>
          <p className="text-white font-medium text-sm">{user?.name}</p>
          <p className="text-gray-500 text-xs">有效订阅用户</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <StarRating value={rating} size="lg" interactive onChange={setRating} />
          {rating > 0 && (
            <span className="text-gold-400 font-semibold text-sm w-8">{rating} 星</span>
          )}
        </div>
      </div>

      <textarea
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          if (error) setError('');
        }}
        placeholder="分享您的使用体验，帮助其他用户做出选择…"
        rows={4}
        maxLength={500}
        className="input resize-none mb-2"
      />
      <div className="flex justify-end mb-3">
        <span className="text-xs text-gray-500">{content.length}/500</span>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mb-3">
          {images.map((src, index) => (
            <div key={index} className="relative group aspect-square">
              <img
                src={src}
                alt={`评价图片 ${index + 1}`}
                className="w-full h-full object-cover rounded-lg border border-gray-700"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-dark-900 border border-gray-600 flex items-center justify-center text-gray-300 hover:text-red-400 hover:border-red-400 transition-colors"
                aria-label="删除图片"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              handleImages(e.target.files);
              e.target.value = '';
            }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={images.length >= MAX_IMAGES}
            className={cn(
              'inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all',
              images.length >= MAX_IMAGES
                ? 'border-gray-700 text-gray-600 cursor-not-allowed'
                : 'border-gray-600 text-gray-300 hover:border-primary-500 hover:text-primary-400 hover:bg-primary-500/10',
            )}
          >
            <ImagePlus className="w-4 h-4" />
            添加图片
            <span className="text-xs text-gray-500">
              ({images.length}/{MAX_IMAGES})
            </span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="btn-primary px-6 py-2.5 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              提交中…
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              发布评价
            </>
          )}
        </button>
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
    </div>
  );
}
