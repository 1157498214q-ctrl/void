import { supabase } from './supabaseClient';
import type { User, Session } from '@supabase/supabase-js';

export interface AuthUser {
    id: string;
    email: string;
}

// 注册
export const signUp = async (email: string, password: string, name: string): Promise<{ user: AuthUser | null; error: string | null }> => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { name },
            emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : undefined
        }
    });

    if (error) {
        return { user: null, error: error.message };
    }

    // 如果用户已创建但会话未建立（邮箱确认开启的情况），尝试直接登录
    if (data.user && !data.session) {
        // 尝试用刚注册的凭证登录
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (loginData?.user) {
            return {
                user: { id: loginData.user.id, email: loginData.user.email! },
                error: null
            };
        }

        // 如果登录也失败，说明确实需要邮箱确认
        if (loginError?.message?.includes('not confirmed')) {
            return {
                user: { id: data.user.id, email: data.user.email! },
                error: '注册成功！请检查邮箱确认后登录，或联系管理员手动确认。'
            };
        }
    }

    return {
        user: data.user ? { id: data.user.id, email: data.user.email! } : null,
        error: null
    };
};

// 登录
export const signIn = async (email: string, password: string): Promise<{ user: AuthUser | null; error: string | null }> => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        return { user: null, error: error.message };
    }

    return {
        user: data.user ? { id: data.user.id, email: data.user.email! } : null,
        error: null
    };
};

// 登出
export const signOut = async (): Promise<{ error: string | null }> => {
    const { error } = await supabase.auth.signOut();
    return { error: error?.message || null };
};

// 获取当前用户
export const getCurrentUser = async (): Promise<User | null> => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
};

// 获取当前会话
export const getSession = async (): Promise<Session | null> => {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
};

// 监听认证状态变化
export const onAuthStateChange = (callback: (user: User | null) => void) => {
    return supabase.auth.onAuthStateChange((event, session) => {
        callback(session?.user || null);
    });
};
