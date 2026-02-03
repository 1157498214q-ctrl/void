import { supabase } from './supabaseClient';
import { UserProfile } from '../types';

// 数据库行类型
interface ProfileRow {
    id: string;
    name: string;
    signature: string | null;
    avatar_url: string | null;
    theme: string;
    created_at: string;
    updated_at: string;
}

// 将数据库行转换为前端类型
const rowToProfile = (row: ProfileRow): UserProfile => ({
    name: row.name,
    signature: row.signature || '',
    avatarUrl: row.avatar_url || '',
    theme: (row.theme as 'light' | 'dark') || 'dark'
});

// 获取用户配置
export const getProfile = async (): Promise<UserProfile | null> => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return null;
    }

    const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (error) {
        console.error('Error fetching profile:', error);
        // 如果没有配置，返回默认值
        return {
            name: user.email?.split('@')[0] || 'User',
            signature: '欢迎来到虚空档案...',
            avatarUrl: 'https://picsum.photos/300/300',
            theme: 'dark'
        };
    }

    return data ? rowToProfile(data) : null;
};

// 更新用户配置
export const updateProfile = async (profile: Partial<UserProfile>): Promise<UserProfile | null> => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return null;
    }

    const updateData: Record<string, unknown> = {};

    if (profile.name !== undefined) updateData.name = profile.name;
    if (profile.signature !== undefined) updateData.signature = profile.signature;
    if (profile.avatarUrl !== undefined) updateData.avatar_url = profile.avatarUrl;
    if (profile.theme !== undefined) updateData.theme = profile.theme;

    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('id', user.id)
        .select()
        .single();

    if (error) {
        console.error('Error updating profile:', error);
        return null;
    }

    return data ? rowToProfile(data) : null;
};

// 创建用户配置（供注册时使用，或手动创建）
export const createProfile = async (profile: UserProfile): Promise<UserProfile | null> => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return null;
    }

    const { data, error } = await supabase
        .from('user_profiles')
        .insert({
            id: user.id,
            name: profile.name,
            signature: profile.signature || null,
            avatar_url: profile.avatarUrl || null,
            theme: profile.theme || 'dark'
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating profile:', error);
        return null;
    }

    return data ? rowToProfile(data) : null;
};
