import { useRef, useState } from 'react';
import { ImagePlus, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReviewImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  max?: number;
  onError?: (message: string) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPT_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

/**
 * 评价图片上传：读取本地图片为 DataURL 预览（模拟上传），
 * 支持数量/格式/大小校验、删除与上传中状态。
 */
export default function ReviewImageUploader({
  images,
  onChange,
  max = 6,
  onError,
}: ReviewImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const readFile = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('read failed'));
      reader.readAsDataURL(file);
    });

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    const files = Array.from(fileList);
    const available = max - images.length;

    if (available <= 0) {
      onError?.(`最多只能上传 ${max} 张图片`);
      return;
    }
    if (files.length > available) {
      onError?.(`最多还能上传 ${available} 张图片`);
    }

    const picked = files.slice(0, available);
    const invalid = picked.find((file) => !ACCEPT_TYPES.includes(file.type));
    if (invalid) {
      onError?.('仅支持 JPG、PNG、WEBP、GIF 格式的图片');
      return;
    }
    const oversized = picked.find((file) => file.size > MAX_FILE_SIZE);
    if (oversized) {
      onError?.('单张图片大小不能超过 5MB');
      return;
    }

    setUploading(true);
    try {
      // 模拟网络上传耗时，实际项目中替换为上传接口
      const dataUrls = await Promise.all(picked.map(readFile));
      await new Promise((resolve) => setTimeout(resolve, 500));
      onChange([...images, ...dataUrls]);
    } catch {
      onError?.('图片读取失败，请重试');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="flex-1 min-w-0">
      <div className="flex flex-wrap gap-3">
        {images.map((src, index) => (
          <div
            key={index}
            className="relative group w-20 h-20 rounded-lg overflow-hidden border border-gray-700 bg-dark-900"
          >
            <img src={src} alt={`评价图片 ${index + 1}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(index)}
              aria-label="删除图片"
              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {images.length < max && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className={cn(
              'w-20 h-20 rounded-lg border-2 border-dashed border-gray-700 flex flex-col items-center justify-center gap-1 text-gray-500 transition-all',
              'hover:border-primary-500 hover:text-primary-400 hover:bg-primary-500/5',
              uploading && 'opacity-60 cursor-wait'
            )}
          >
            {uploading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <ImagePlus className="w-5 h-5" />
                <span className="text-[10px]">上传图片</span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_TYPES.join(',')}
        multiple
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />

      <p className="mt-2 text-xs text-gray-500">
        最多 {max} 张，支持 JPG / PNG / WEBP，单张不超过 5MB
      </p>
    </div>
  );
}
