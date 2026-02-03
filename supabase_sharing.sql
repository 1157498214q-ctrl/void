-- 虚空档案系统 - 共享策略更新
-- 请在 Supabase SQL Editor 中执行此脚本
-- 此脚本将更新 RLS 策略，允许所有用户查看所有数据

-- =====================
-- 删除旧的 RLS 策略
-- =====================

-- 角色表
DROP POLICY IF EXISTS "users_own_characters" ON characters;

-- 日志表
DROP POLICY IF EXISTS "users_own_logs" ON archive_logs;

-- 评论表
DROP POLICY IF EXISTS "users_own_comments" ON comments;

-- =====================
-- 创建新的共享 RLS 策略
-- =====================

-- 角色表：所有认证用户可读取所有角色，但只能修改自己的
CREATE POLICY "characters_select_all"
ON characters FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "characters_insert_own"
ON characters FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "characters_update_own"
ON characters FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "characters_delete_own"
ON characters FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- 日志表：所有认证用户可读取所有日志，但只能修改自己的
CREATE POLICY "logs_select_all"
ON archive_logs FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "logs_insert_own"
ON archive_logs FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "logs_update_own"
ON archive_logs FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "logs_delete_own"
ON archive_logs FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- 评论表：所有认证用户可读取所有评论，但只能修改自己的
CREATE POLICY "comments_select_all"
ON comments FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "comments_insert_own"
ON comments FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "comments_delete_own"
ON comments FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- 用户配置表保持私有（只能看到自己的）
-- 不需要修改 user_profiles 的策略
