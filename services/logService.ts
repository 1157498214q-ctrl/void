import { supabase } from './supabaseClient';
import { ArchiveLog, LogEntry } from '../types';

// 数据库行类型
interface LogRow {
    id: string;
    user_id: string;
    title: string;
    status: string;
    timestamp: string | null;
    word_count: string;
    summary: string | null;
    image_url: string | null;
    participants: string[];
    entries: LogEntry[];
    is_favorite: boolean;
    created_at: string;
    updated_at: string;
}

// 将数据库行转换为前端类型
const rowToLog = (row: LogRow): ArchiveLog => ({
    id: row.id,
    title: row.title,
    status: row.status as 'Ongoing' | 'Finished' | 'Standby',
    timestamp: row.timestamp || '',
    wordCount: row.word_count || '0',
    summary: row.summary || '',
    imageUrl: row.image_url || '',
    participants: row.participants || [],
    entries: row.entries || [],
    isFavorite: row.is_favorite
});

// 将前端类型转换为数据库插入格式
const logToRow = (log: Omit<ArchiveLog, 'id'> & { id?: string }) => ({
    title: log.title,
    status: log.status,
    timestamp: log.timestamp || null,
    word_count: log.wordCount || '0',
    summary: log.summary || null,
    image_url: log.imageUrl || null,
    participants: log.participants || [],
    entries: log.entries || [],
    is_favorite: log.isFavorite || false
});

// 获取所有日志
export const getLogs = async (): Promise<ArchiveLog[]> => {
    const { data, error } = await supabase
        .from('archive_logs')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching logs:', error);
        return [];
    }

    return (data || []).map(rowToLog);
};

// 获取单个日志
export const getLogById = async (id: string): Promise<ArchiveLog | null> => {
    const { data, error } = await supabase
        .from('archive_logs')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching log:', error);
        return null;
    }

    return data ? rowToLog(data) : null;
};

// 创建日志
export const createLog = async (log: Omit<ArchiveLog, 'id'>): Promise<ArchiveLog | null> => {
    // 获取当前用户
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        console.error('Error creating log: No authenticated user');
        return null;
    }

    const insertData = {
        ...logToRow(log),
        user_id: user.id
    };

    console.log('Creating log with data:', insertData);

    const { data, error } = await supabase
        .from('archive_logs')
        .insert(insertData)
        .select()
        .single();

    if (error) {
        console.error('Error creating log:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        return null;
    }

    console.log('Log created successfully:', data);
    return data ? rowToLog(data) : null;
};

// 更新日志
export const updateLog = async (id: string, log: Partial<ArchiveLog>): Promise<ArchiveLog | null> => {
    const updateData: Record<string, unknown> = {};

    if (log.title !== undefined) updateData.title = log.title;
    if (log.status !== undefined) updateData.status = log.status;
    if (log.timestamp !== undefined) updateData.timestamp = log.timestamp;
    if (log.wordCount !== undefined) updateData.word_count = log.wordCount;
    if (log.summary !== undefined) updateData.summary = log.summary;
    if (log.imageUrl !== undefined) updateData.image_url = log.imageUrl;
    if (log.participants !== undefined) updateData.participants = log.participants;
    if (log.entries !== undefined) updateData.entries = log.entries;
    if (log.isFavorite !== undefined) updateData.is_favorite = log.isFavorite;

    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
        .from('archive_logs')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating log:', error);
        return null;
    }

    return data ? rowToLog(data) : null;
};

// 删除日志
export const deleteLog = async (id: string): Promise<boolean> => {
    const { error } = await supabase
        .from('archive_logs')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting log:', error);
        return false;
    }

    return true;
};

// 切换收藏状态
export const toggleFavorite = async (id: string, currentStatus: boolean): Promise<boolean> => {
    const { error } = await supabase
        .from('archive_logs')
        .update({ is_favorite: !currentStatus, updated_at: new Date().toISOString() })
        .eq('id', id);

    if (error) {
        console.error('Error toggling favorite:', error);
        return false;
    }

    return true;
};
