-- 虚空档案系统 - 管理员权限配置
-- 请在 Supabase SQL Editor 中执行此脚本

-- 创建管理员表
CREATE TABLE IF NOT EXISTS admins (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 为管理员表启用 RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- 只有管理员能看到管理员列表
CREATE POLICY "admins_select" ON admins FOR SELECT TO authenticated USING (true);

-- =====================
-- 删除旧的 UPDATE/DELETE 策略（如果存在）
-- =====================

DROP POLICY IF EXISTS "characters_update_own" ON characters;
DROP POLICY IF EXISTS "characters_delete_own" ON characters;
DROP POLICY IF EXISTS "logs_update_own" ON archive_logs;
DROP POLICY IF EXISTS "logs_delete_own" ON archive_logs;

-- =====================
-- 创建新策略：允许管理员编辑/删除所有内容
-- =====================

-- 辅助函数：检查是否是管理员
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 角色表：允许创建者或管理员更新
CREATE POLICY "characters_update_own_or_admin"
ON characters FOR UPDATE
TO authenticated
USING (auth.uid() = user_id OR is_admin());

-- 角色表：允许创建者或管理员删除
CREATE POLICY "characters_delete_own_or_admin"
ON characters FOR DELETE
TO authenticated
USING (auth.uid() = user_id OR is_admin());

-- 日志表：允许创建者或管理员更新
CREATE POLICY "logs_update_own_or_admin"
ON archive_logs FOR UPDATE
TO authenticated
USING (auth.uid() = user_id OR is_admin());

-- 日志表：允许创建者或管理员删除
CREATE POLICY "logs_delete_own_or_admin"
ON archive_logs FOR DELETE
TO authenticated
USING (auth.uid() = user_id OR is_admin());

-- =====================
-- 添加管理员用户
-- =====================
-- 注意：请将下面的 email 替换为管理员用户的实际邮箱
-- 执行此脚本后，需要单独执行下面的 INSERT 语句来添加管理员

-- 查找用户并添加为管理员的方法：
-- 1. 在 Supabase 控制台 -> Authentication -> Users 中找到"葵殊世"用户
-- 2. 复制他的 User UID
-- 3. 执行以下语句（替换 YOUR_USER_ID 为实际的 UUID）:
-- INSERT INTO admins (user_id) VALUES ('YOUR_USER_ID');
