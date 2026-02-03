import React, { useRef, useState } from 'react';
import { uploadImage } from '../services/imageService';

interface Props {
    currentImageUrl: string;
    onImageChange: (url: string) => void;
    folder?: string;
}

const ImageUploader: React.FC<Props> = ({ currentImageUrl, onImageChange, folder = 'general' }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // 验证文件类型
        if (!file.type.startsWith('image/')) {
            setError('请选择图片文件');
            return;
        }

        // 验证文件大小（最大 5MB）
        if (file.size > 5 * 1024 * 1024) {
            setError('图片大小不能超过 5MB');
            return;
        }

        setUploading(true);
        setError(null);

        const { url, error: uploadError } = await uploadImage(file, folder);

        setUploading(false);

        if (uploadError) {
            setError(uploadError);
        } else if (url) {
            onImageChange(url);
        }
    };

    return (
        <div className="space-y-3">
            {/* 当前图片预览 */}
            {currentImageUrl && (
                <div className="relative">
                    <img
                        src={currentImageUrl}
                        alt="预览"
                        className="w-full h-40 object-cover rounded border border-archive-grey"
                    />
                </div>
            )}

            {/* 上传按钮和 URL 输入 */}
            <div className="flex gap-2">
                <input
                    type="text"
                    value={currentImageUrl}
                    onChange={(e) => onImageChange(e.target.value)}
                    placeholder="输入图片 URL 或点击上传"
                    className="flex-1 bg-transparent thin-border border-archive-grey h-10 px-3 text-archive-text text-sm focus:border-archive-accent focus:outline-none transition-colors placeholder:text-archive-dim"
                />
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="px-4 h-10 thin-border border-archive-grey text-archive-accent text-sm hover:border-archive-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {uploading ? (
                        <>
                            <span className="animate-spin">⟳</span>
                            上传中
                        </>
                    ) : (
                        <>
                            <span className="material-symbols-outlined text-base">upload</span>
                            上传
                        </>
                    )}
                </button>
            </div>

            {/* 隐藏的文件输入 */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
            />

            {/* 错误提示 */}
            {error && (
                <p className="text-red-400 text-xs">{error}</p>
            )}
        </div>
    );
};

export default ImageUploader;
