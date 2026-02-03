
import React, { useState, useEffect, useMemo } from 'react';
import { AppView, Character, ArchiveLog, UserProfile, Comment } from './types';

// Services
import { onAuthStateChange, signOut, getCurrentUser } from './services/authService';
import * as characterService from './services/characterService';
import * as logService from './services/logService';
import * as profileService from './services/profileService';
import * as commentService from './services/commentService';

// Views
import WelcomeView from './views/WelcomeView';
import DashboardView from './views/DashboardView';
import CharacterListView from './views/CharacterListView';
import CharacterDetailView from './views/CharacterDetailView';
import ProfileView from './views/ProfileView';
import CharacterEditorView from './views/CharacterEditorView';
import LogEditorView from './views/LogEditorView';
import LogDetailView from './views/LogDetailView';
import DraftsView from './views/DraftsView';
import SavedArchiveView from './views/SavedArchiveView';
import MyCharactersView from './views/MyCharactersView';
import SettingsView from './views/SettingsView';
import CommentView from './views/CommentView';
import AllLogsView from './views/AllLogsView';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.WELCOME);
  const [navigationSource, setNavigationSource] = useState<AppView | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [selectedLog, setSelectedLog] = useState<ArchiveLog | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [myCharacters, setMyCharacters] = useState<Character[]>([]);
  const [logs, setLogs] = useState<ArchiveLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Loading...',
    signature: '',
    avatarUrl: 'https://picsum.photos/300/300',
    theme: 'dark'
  });

  // 标记是否是首次加载
  const isInitialLoadRef = React.useRef(true);

  // 监听认证状态变化
  useEffect(() => {
    const { data: { subscription } } = onAuthStateChange(async (user) => {
      if (user) {
        setIsAuthenticated(true);
        await loadInitialData();
        // 只在首次加载且当前在欢迎页时跳转到仪表板
        if (isInitialLoadRef.current && currentView === AppView.WELCOME) {
          setCurrentView(AppView.DASHBOARD);
        }
      } else {
        setIsAuthenticated(false);
        setCharacters([]);
        setMyCharacters([]);
        setLogs([]);
        setCurrentView(AppView.WELCOME);
      }
      setIsLoading(false);
      isInitialLoadRef.current = false;
    });

    // 检查初始认证状态
    checkInitialAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkInitialAuth = async () => {
    const user = await getCurrentUser();
    if (user) {
      setIsAuthenticated(true);
      await loadInitialData();
      // 只在欢迎页时跳转
      if (currentView === AppView.WELCOME) {
        setCurrentView(AppView.DASHBOARD);
      }
    }
    setIsLoading(false);
    isInitialLoadRef.current = false;
  };

  const loadInitialData = async () => {
    try {
      const [chars, myChars, logsData, profile] = await Promise.all([
        characterService.getCharacters(),
        characterService.getMyCharacters(),
        logService.getLogs(),
        profileService.getProfile()
      ]);

      setCharacters(chars);
      setMyCharacters(myChars);

      // 为每个日志加载评论
      const logsWithComments = await Promise.all(
        logsData.map(async (log) => {
          const comments = await commentService.getCommentsByLogId(log.id);
          return { ...log, comments };
        })
      );

      setLogs(logsWithComments);

      if (profile) {
        setUserProfile(profile);
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  // Calculate stats for Profile
  const stats = useMemo(() => {
    const publishedLogs = logs.filter(l => l.status !== 'Standby');
    const totalWords = publishedLogs.reduce((acc, log) => {
      const count = parseInt(log.wordCount.replace(/,/g, '')) || 0;
      return acc + count;
    }, 0);

    return {
      logsCount: publishedLogs.length,
      wordCount: totalWords >= 1000 ? (totalWords / 1000).toFixed(1) + 'k' : totalWords.toString(),
      charactersCount: characters.filter(c => !c.isDraft).length
    };
  }, [logs, characters]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', userProfile.theme || 'dark');
  }, [userProfile.theme]);

  const navigateTo = (view: AppView, payload?: any) => {
    if (payload?.hasOwnProperty('character')) setSelectedCharacter(payload.character);
    if (payload?.hasOwnProperty('log')) {
      setSelectedLog(payload.log);
    }

    if (payload?.hasOwnProperty('from')) {
      setNavigationSource(payload.from);
    } else {
      if (view !== AppView.LOG_EDITOR && view !== AppView.CHARACTER_EDITOR) {
        setNavigationSource(null);
      }
    }

    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  const handleCreateNewCharacter = (fromView?: AppView) => {
    navigateTo(AppView.CHARACTER_EDITOR, {
      character: {
        id: `char_temp_${Date.now()}`,
        name: '',
        title: '',
        tags: [],
        attributes: { height: '', age: '', alignment: '无', gender: '' },
        ability: '',
        stats: '力量：C\n速度：C\n耐久：C\n射程：C\n精密度：C\n成长性：C',
        trivia: [],
        introduction: '',
        imageUrl: 'https://picsum.photos/800/400?grayscale',
        isDraft: true
      },
      from: fromView
    });
  };

  const handleSaveCharacter = async (char: Character, asDraft: boolean = false) => {
    const updatedChar = { ...char, isDraft: asDraft };
    const isNew = char.id.startsWith('char_temp_');

    try {
      let savedChar: Character | null;
      if (isNew) {
        const { id, ...charWithoutId } = updatedChar;
        savedChar = await characterService.createCharacter(charWithoutId);
      } else {
        savedChar = await characterService.updateCharacter(char.id, updatedChar);
      }

      if (savedChar) {
        // 更新所有角色列表
        setCharacters(prev => {
          if (isNew) {
            return [savedChar!, ...prev];
          } else {
            return prev.map(c => c.id === savedChar!.id ? savedChar! : c);
          }
        });
        // 同时更新我的角色列表
        setMyCharacters(prev => {
          if (isNew) {
            return [savedChar!, ...prev];
          } else {
            return prev.map(c => c.id === savedChar!.id ? savedChar! : c);
          }
        });
      }
    } catch (error) {
      console.error('Error saving character:', error);
    }

    if (navigationSource === AppView.DRAFTS) {
      navigateTo(AppView.DRAFTS);
    } else if (asDraft) {
      navigateTo(AppView.DRAFTS);
    } else {
      navigateTo(AppView.CHARACTER_LIST);
    }
  };

  const handleDeleteCharacter = async (id: string) => {
    const success = await characterService.deleteCharacter(id);
    if (success) {
      setCharacters(prev => prev.filter(c => c.id !== id));
      setMyCharacters(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleCreateNewLog = (fromView?: AppView) => {
    navigateTo(AppView.LOG_EDITOR, {
      log: {
        id: 'new',
        title: '未命名戏录',
        status: 'Ongoing',
        timestamp: new Date().toLocaleDateString(),
        wordCount: '0',
        summary: '开始一段新的记录...',
        imageUrl: 'https://picsum.photos/800/400?grayscale',
        participants: [],
        entries: []
      },
      from: fromView
    });
  };

  const handleSaveLog = async (updatedLog: ArchiveLog) => {
    const isNew = updatedLog.id === 'new';
    const finalEntries = updatedLog.entries || [];
    const logData = {
      ...updatedLog,
      wordCount: finalEntries.reduce((acc, e) => acc + e.content.length, 0).toLocaleString()
    };

    try {
      let savedLog: ArchiveLog | null;
      if (isNew) {
        const { id, ...logWithoutId } = logData;
        savedLog = await logService.createLog(logWithoutId);
      } else {
        savedLog = await logService.updateLog(updatedLog.id, logData);
      }

      if (savedLog) {
        setLogs(prev => {
          if (isNew) {
            return [savedLog!, ...prev];
          } else {
            return prev.map(l => l.id === savedLog!.id ? savedLog! : l);
          }
        });
        setSelectedLog(savedLog);
      }
    } catch (error) {
      console.error('Error saving log:', error);
    }

    if (navigationSource === AppView.DRAFTS) {
      navigateTo(AppView.DRAFTS);
    } else {
      navigateTo(AppView.DASHBOARD);
    }
  };

  const handleDeleteLog = async (logId: string) => {
    const success = await logService.deleteLog(logId);
    if (success) {
      setLogs(prev => prev.filter(l => l.id !== logId));
    }
  };

  const handleToggleFavorite = async (logId: string) => {
    const log = logs.find(l => l.id === logId);
    if (!log) return;

    const success = await logService.toggleFavorite(logId, log.isFavorite || false);
    if (success) {
      setLogs(prev => prev.map(l => {
        if (l.id === logId) {
          const updated = { ...l, isFavorite: !l.isFavorite };
          if (selectedLog?.id === logId) {
            setSelectedLog(updated);
          }
          return updated;
        }
        return l;
      }));
    }
  };

  const handleAddComment = async (logId: string, comment: Comment) => {
    const savedComment = await commentService.createComment(logId, comment);
    if (savedComment) {
      setLogs(prev => prev.map(l => {
        if (l.id === logId) {
          const updated = { ...l, comments: [...(l.comments || []), savedComment] };
          if (selectedLog?.id === logId) {
            setSelectedLog(updated);
          }
          return updated;
        }
        return l;
      }));
    }
  };

  const handleDeleteComment = async (logId: string, commentId: string) => {
    const success = await commentService.deleteComment(commentId);
    if (success) {
      setLogs(prev => prev.map(l => {
        if (l.id === logId) {
          const updated = { ...l, comments: (l.comments || []).filter(c => c.id !== commentId) };
          if (selectedLog?.id === logId) {
            setSelectedLog(updated);
          }
          return updated;
        }
        return l;
      }));
    }
  };

  const handleLogout = async () => {
    await signOut();
    setIsAuthenticated(false);
    navigateTo(AppView.WELCOME);
  };

  const handleUpdateProfile = async (newProfile: UserProfile) => {
    const updated = await profileService.updateProfile(newProfile);
    if (updated) {
      setUserProfile(updated);
    } else {
      setUserProfile(newProfile);
    }
    navigateTo(AppView.PROFILE);
  };

  // 加载中显示
  if (isLoading) {
    return (
      <div className="relative min-h-screen max-w-md mx-auto bg-archive-black overflow-hidden shadow-2xl flex items-center justify-center">
        <div className="text-archive-accent text-sm tracking-widest animate-pulse">
          [ INITIALIZING... ]
        </div>
      </div>
    );
  }

  const renderView = () => {
    // 未登录时只显示登录页
    if (!isAuthenticated && currentView !== AppView.WELCOME) {
      return <WelcomeView onAccess={() => { }} />;
    }

    switch (currentView) {
      case AppView.WELCOME:
        return <WelcomeView onAccess={() => navigateTo(AppView.DASHBOARD)} />;
      case AppView.DASHBOARD:
        return <DashboardView
          logs={logs.filter(l => l.status !== 'Standby')}
          characters={characters}
          onSelectLog={(log) => navigateTo(AppView.LOG_DETAIL, { log })}
          onContinueLog={(log) => navigateTo(AppView.LOG_EDITOR, { log })}
          onAddLog={() => handleCreateNewLog()}
          onToggleFavorite={handleToggleFavorite}
          onNavigateToCharacters={() => navigateTo(AppView.CHARACTER_LIST)}
          onNavigateToProfile={() => navigateTo(AppView.PROFILE)}
          onViewAllLogs={() => navigateTo(AppView.ALL_LOGS)}
        />;
      case AppView.CHARACTER_LIST:
        return <CharacterListView
          characters={characters.filter(c => !c.isDraft)}
          onSelectCharacter={(char) => navigateTo(AppView.CHARACTER_DETAIL, { character: char })}
          onAddCharacter={() => handleCreateNewCharacter()}
          onBack={() => navigateTo(AppView.DASHBOARD)}
          onNavigateToProfile={() => navigateTo(AppView.PROFILE)}
        />;
      case AppView.CHARACTER_DETAIL:
        return <CharacterDetailView
          character={selectedCharacter!}
          onBack={() => navigateTo(AppView.CHARACTER_LIST)}
          onEdit={() => navigateTo(AppView.CHARACTER_EDITOR, { character: selectedCharacter })}
          onStartLog={() => navigateTo(AppView.LOG_EDITOR, {
            log: {
              id: 'new',
              title: `${selectedCharacter?.name} 的新篇章`,
              status: 'Ongoing',
              timestamp: new Date().toLocaleDateString(),
              wordCount: '0',
              summary: `关于 ${selectedCharacter?.name} 的新故事。`,
              imageUrl: selectedCharacter?.imageUrl || '',
              participants: [selectedCharacter?.name || ''],
              entries: []
            }
          })}
        />;
      case AppView.CHARACTER_EDITOR:
        return <CharacterEditorView
          character={selectedCharacter}
          onSave={(char) => handleSaveCharacter(char, false)}
          onSaveDraft={(char) => handleSaveCharacter(char, true)}
          onCancel={() => {
            if (navigationSource === AppView.DRAFTS) {
              navigateTo(AppView.DRAFTS);
            } else {
              navigateTo(AppView.CHARACTER_LIST);
            }
          }}
        />;
      case AppView.LOG_DETAIL:
        return <LogDetailView
          log={selectedLog!}
          onBack={() => navigateTo(AppView.DASHBOARD)}
          onToggleFavorite={() => handleToggleFavorite(selectedLog!.id)}
          onOpenComments={() => navigateTo(AppView.COMMENTS, { log: selectedLog })}
        />;
      case AppView.COMMENTS:
        return <CommentView
          log={selectedLog!}
          userProfile={userProfile}
          onBack={() => navigateTo(AppView.LOG_DETAIL, { log: selectedLog })}
          onAddComment={(comment) => handleAddComment(selectedLog!.id, comment)}
          onDeleteComment={(commentId) => handleDeleteComment(selectedLog!.id, commentId)}
        />;
      case AppView.LOG_EDITOR:
        return <LogEditorView
          log={selectedLog}
          availableCharacters={characters.filter(c => !c.isDraft)}
          onBack={() => {
            if (navigationSource === AppView.DRAFTS) {
              navigateTo(AppView.DRAFTS);
            } else {
              navigateTo(AppView.DASHBOARD);
            }
          }}
          onSave={handleSaveLog}
          onDeleteLog={handleDeleteLog}
        />;
      case AppView.PROFILE:
        return <ProfileView
          userProfile={userProfile}
          logsCount={stats.logsCount}
          wordCount={stats.wordCount}
          charactersCount={stats.charactersCount}
          onBack={() => navigateTo(AppView.DASHBOARD)}
          onLogout={handleLogout}
          onNavigateToCharacters={() => navigateTo(AppView.CHARACTER_LIST)}
          onNavigateToDrafts={() => navigateTo(AppView.DRAFTS)}
          onNavigateToSavedArchive={() => navigateTo(AppView.SAVED_ARCHIVE)}
          onNavigateToMyCharacters={() => navigateTo(AppView.MY_CHARACTERS)}
          onNavigateToSettings={() => navigateTo(AppView.SETTINGS)}
        />;
      case AppView.DRAFTS:
        return <DraftsView
          logs={logs.filter(l => l.status === 'Ongoing')}
          characters={characters}
          onSelectDraft={(log) => navigateTo(AppView.LOG_EDITOR, { log, from: AppView.DRAFTS })}
          onSelectCharacterDraft={(char) => navigateTo(AppView.CHARACTER_EDITOR, { character: char, from: AppView.DRAFTS })}
          onDeleteDraft={handleDeleteLog}
          onDeleteCharacterDraft={handleDeleteCharacter}
          onAddLog={() => handleCreateNewLog(AppView.DRAFTS)}
          onAddCharacter={() => handleCreateNewCharacter(AppView.DRAFTS)}
          onBack={() => navigateTo(AppView.PROFILE)}
        />;
      case AppView.SAVED_ARCHIVE:
        return <SavedArchiveView
          logs={logs.filter(l => l.isFavorite)}
          onSelectLog={(log) => navigateTo(AppView.LOG_DETAIL, { log })}
          onBack={() => navigateTo(AppView.PROFILE)}
        />;
      case AppView.MY_CHARACTERS:
        return <MyCharactersView
          characters={myCharacters.filter(c => !c.isDraft)}
          onSelectCharacter={(char) => navigateTo(AppView.CHARACTER_DETAIL, { character: char })}
          onAddCharacter={() => handleCreateNewCharacter()}
          onBack={() => navigateTo(AppView.PROFILE)}
        />;
      case AppView.SETTINGS:
        return <SettingsView
          profile={userProfile}
          onSave={handleUpdateProfile}
          onBack={() => navigateTo(AppView.PROFILE)}
        />;
      case AppView.ALL_LOGS:
        return <AllLogsView
          logs={logs}
          onSelectLog={(log) => navigateTo(AppView.LOG_DETAIL, { log })}
          onBack={() => navigateTo(AppView.DASHBOARD)}
        />;
      default:
        return <WelcomeView onAccess={() => navigateTo(AppView.DASHBOARD)} />;
    }
  };

  return (
    <div className="relative min-h-screen max-w-md mx-auto bg-archive-black overflow-hidden shadow-2xl">
      <div className="fixed inset-0 noise-bg z-[100] pointer-events-none"></div>
      {renderView()}
    </div>
  );
};

export default App;
