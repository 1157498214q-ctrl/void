import { supabase } from './supabaseClient';

const BUCKET_NAME = 'images';

// 上传图片
export const uploadImage = async (file: File, folder: string = 'general'): Promise<{ url: string | null; error: string | null }> => {
    try {
        // 生成唯一文件名
        const fileExt = file.name.split('.').pop();
        const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

        // 上传到 Supabase Storage
        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            console.error('Upload error:', error);
            return { url: null, error: error.message };
        }

        // 获取公开 URL
        const { data: urlData } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(data.path);

        return { url: urlData.publicUrl, error: null };
    } catch (err) {
        console.error('Upload exception:', err);
        return { url: null, error: '上传失败，请重试' };
    }
};

// 删除图片
export const deleteImage = async (imageUrl: string): Promise<boolean> => {
    try {
        // 从 URL 中提取文件路径
        const urlParts = imageUrl.split(`${BUCKET_NAME}/`);
        if (urlParts.length < 2) return false;

        const filePath = urlParts[1];

        const { error } = await supabase.storage
            .from(BUCKET_NAME)
            .remove([filePath]);

        if (error) {
            console.error('Delete error:', error);
            return false;
        }

        return true;
    } catch (err) {
        console.error('Delete exception:', err);
        return false;
    }
};
