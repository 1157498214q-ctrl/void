import { supabase } from './supabaseClient';
import { Comment } from '../types';

// 数据库行类型
interface CommentRow {
    id: string;
    log_id: string;
    user_id: string;
    user_name: string;
    user_avatar: string | null;
    timestamp: string | null;
    content: string;
    parent_id: string | null;
    reply_to_name: string | null;
    created_at: string;
}

// 将数据库行转换为前端类型
const rowToComment = (row: CommentRow): Comment => ({
    id: row.id,
    userName: row.user_name,
    userAvatar: row.user_avatar || '',
    timestamp: row.timestamp || '',
    content: row.content,
    parentId: row.parent_id || undefined,
    replyToName: row.reply_to_name || undefined
});

// 获取日志的所有评论
export const getCommentsByLogId = async (logId: string): Promise<Comment[]> => {
    const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('log_id', logId)
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching comments:', error);
        return [];
    }

    return (data || []).map(rowToComment);
};

// 创建评论
export const createComment = async (logId: string, comment: Omit<Comment, 'id'>): Promise<Comment | null> => {
    // 获取当前用户
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        console.error('Error creating comment: No authenticated user');
        return null;
    }

    const { data, error } = await supabase
        .from('comments')
        .insert({
            log_id: logId,
            user_id: user.id,
            user_name: comment.userName,
            user_avatar: comment.userAvatar || null,
            timestamp: comment.timestamp || null,
            content: comment.content,
            parent_id: comment.parentId || null,
            reply_to_name: comment.replyToName || null
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating comment:', error);
        return null;
    }

    return data ? rowToComment(data) : null;
};

// 删除评论
export const deleteComment = async (id: string): Promise<boolean> => {
    const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting comment:', error);
        return false;
    }

    return true;
};
