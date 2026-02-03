-- 虚空档案系统 - Storage 配置
-- 请在 Supabase SQL Editor 中执行此脚本

-- 创建 images bucket（用于存储用户上传的图片）
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- 允许所有认证用户上传图片
CREATE POLICY "允许认证用户上传图片"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'images');

-- 允许所有人查看图片（公开访问）
CREATE POLICY "允许公开访问图片"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'images');

-- 允许用户删除自己上传的图片
CREATE POLICY "允许用户删除自己的图片"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'images' AND auth.uid()::text = (storage.foldername(name))[1]);
