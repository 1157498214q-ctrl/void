import { supabase } from './supabaseClient';
import { Character } from '../types';

// 数据库行类型
interface CharacterRow {
    id: string;
    user_id: string;
    name: string;
    title: string | null;
    tags: string[];
    attributes: Record<string, string>;
    ability: string | null;
    stats: string | null;
    trivia: string[];
    introduction: string | null;
    quote: string | null;
    image_url: string | null;
    is_draft: boolean;
    created_at: string;
    updated_at: string;
}

// 将数据库行转换为前端类型
const rowToCharacter = (row: CharacterRow): Character => ({
    id: row.id,
    name: row.name,
    title: row.title || '',
    tags: row.tags || [],
    attributes: {
        height: row.attributes?.height || '',
        age: row.attributes?.age || '',
        alignment: row.attributes?.alignment || '无',
        gender: row.attributes?.gender || ''
    },
    ability: row.ability || undefined,
    stats: row.stats || undefined,
    trivia: row.trivia || [],
    introduction: row.introduction || '',
    quote: row.quote || undefined,
    imageUrl: row.image_url || '',
    isDraft: row.is_draft
});

// 将前端类型转换为数据库插入格式
const characterToRow = (char: Omit<Character, 'id'> & { id?: string }) => ({
    name: char.name,
    title: char.title || null,
    tags: char.tags || [],
    attributes: char.attributes || {},
    ability: char.ability || null,
    stats: char.stats || null,
    trivia: char.trivia || [],
    introduction: char.introduction || null,
    quote: char.quote || null,
    image_url: char.imageUrl || null,
    is_draft: char.isDraft || false
});

// 获取所有角色（所有用户的）
export const getCharacters = async (): Promise<Character[]> => {
    const { data, error } = await supabase
        .from('characters')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching characters:', error);
        return [];
    }

    return (data || []).map(rowToCharacter);
};

// 获取我的角色（仅当前用户创建的）
export const getMyCharacters = async (): Promise<Character[]> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return [];
    }

    const { data, error } = await supabase
        .from('characters')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching my characters:', error);
        return [];
    }

    return (data || []).map(rowToCharacter);
};

// 获取单个角色
export const getCharacterById = async (id: string): Promise<Character | null> => {
    const { data, error } = await supabase
        .from('characters')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching character:', error);
        return null;
    }

    return data ? rowToCharacter(data) : null;
};

// 创建角色
export const createCharacter = async (char: Omit<Character, 'id'>): Promise<Character | null> => {
    // 获取当前用户
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        console.error('Error creating character: No authenticated user');
        return null;
    }

    const insertData = {
        ...characterToRow(char),
        user_id: user.id
    };

    const { data, error } = await supabase
        .from('characters')
        .insert(insertData)
        .select()
        .single();

    if (error) {
        console.error('Error creating character:', error);
        return null;
    }

    return data ? rowToCharacter(data) : null;
};

// 更新角色
export const updateCharacter = async (id: string, char: Partial<Character>): Promise<Character | null> => {
    const updateData: Record<string, unknown> = {};

    if (char.name !== undefined) updateData.name = char.name;
    if (char.title !== undefined) updateData.title = char.title;
    if (char.tags !== undefined) updateData.tags = char.tags;
    if (char.attributes !== undefined) updateData.attributes = char.attributes;
    if (char.ability !== undefined) updateData.ability = char.ability;
    if (char.stats !== undefined) updateData.stats = char.stats;
    if (char.trivia !== undefined) updateData.trivia = char.trivia;
    if (char.introduction !== undefined) updateData.introduction = char.introduction;
    if (char.quote !== undefined) updateData.quote = char.quote;
    if (char.imageUrl !== undefined) updateData.image_url = char.imageUrl;
    if (char.isDraft !== undefined) updateData.is_draft = char.isDraft;

    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
        .from('characters')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating character:', error);
        return null;
    }

    return data ? rowToCharacter(data) : null;
};

// 删除角色
export const deleteCharacter = async (id: string): Promise<boolean> => {
    const { error } = await supabase
        .from('characters')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting character:', error);
        return false;
    }

    return true;
};
