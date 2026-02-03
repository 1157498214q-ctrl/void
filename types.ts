
export enum AppView {
  WELCOME = 'welcome',
  DASHBOARD = 'dashboard',
  CHARACTER_LIST = 'character_list',
  CHARACTER_DETAIL = 'character_detail',
  CHARACTER_EDITOR = 'character_editor',
  LOG_DETAIL = 'log_detail',
  LOG_EDITOR = 'log_editor',
  PROFILE = 'profile',
  DRAFTS = 'drafts',
  SAVED_ARCHIVE = 'saved_archive',
  MY_CHARACTERS = 'my_characters',
  SETTINGS = 'settings',
  COMMENTS = 'comments',
  ALL_LOGS = 'all_logs'
}

export interface UserProfile {
  name: string;
  signature: string;
  avatarUrl: string;
  theme?: 'light' | 'dark';
}

export interface Character {
  id: string;
  name: string;
  title: string;
  tags: string[];
  attributes: {
    height: string;
    age: string;
    alignment: string;
    gender: string;
  };
  ability?: string;
  stats?: string; // Changed from object to string for flexible "text box" editing
  trivia?: string[];
  introduction: string;
  quote?: string;
  imageUrl: string;
  isDraft?: boolean;
}

export interface Comment {
  id: string;
  userName: string;
  userAvatar: string;
  timestamp: string;
  content: string;
  parentId?: string;
  replyToName?: string;
}

export interface ArchiveLog {
  id: string;
  title: string;
  status: 'Ongoing' | 'Finished' | 'Standby';
  timestamp: string;
  wordCount: string;
  summary: string;
  imageUrl: string;
  participants: string[];
  entries?: LogEntry[];
  isFavorite?: boolean;
  comments?: Comment[];
}

export interface LogEntry {
  role: 'NAR' | 'CHAPTER' | string;
  timestamp: string;
  content: string;
  avatarUrl?: string;
}
