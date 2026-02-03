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
            data: { name }
        }
    });

    if (error) {
        return { user: null, error: error.message };
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
