-- 虚空档案系统数据库初始化脚本
-- 请在 Supabase SQL Editor 中执行此脚本

-- 用户配置表（与 auth.users 关联）
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  signature TEXT,
  avatar_url TEXT,
  theme TEXT DEFAULT 'dark',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 角色表（用户隔离）
CREATE TABLE IF NOT EXISTS characters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  title TEXT,
  tags TEXT[] DEFAULT '{}',
  attributes JSONB DEFAULT '{}',
  ability TEXT,
  stats TEXT,
  trivia TEXT[] DEFAULT '{}',
  introduction TEXT,
  quote TEXT,
  image_url TEXT,
  is_draft BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 日志表（用户隔离）
CREATE TABLE IF NOT EXISTS archive_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  status TEXT DEFAULT 'Ongoing',
  timestamp TEXT,
  word_count TEXT DEFAULT '0',
  summary TEXT,
  image_url TEXT,
  participants TEXT[] DEFAULT '{}',
  entries JSONB DEFAULT '[]',
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 评论表
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  log_id UUID REFERENCES archive_logs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_name TEXT NOT NULL,
  user_avatar TEXT,
  timestamp TEXT,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  reply_to_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 启用 RLS（行级安全策略）
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE archive_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- RLS 策略：用户只能访问自己的数据
CREATE POLICY "users_own_profile" ON user_profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "users_own_characters" ON characters FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "users_own_logs" ON archive_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "users_own_comments" ON comments FOR ALL USING (auth.uid() = user_id);

-- 自动创建用户配置（注册时触发）
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, name, signature, avatar_url)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)), 
    '欢迎来到虚空档案...', 
    'https://picsum.photos/300/300'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 删除旧触发器（如果存在）
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 创建触发器
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
