
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ArchiveLog, Character, LogEntry } from '../types';
import ImageUploader from '../components/ImageUploader';

interface Props {
  log: ArchiveLog | null;
  availableCharacters: Character[];
  onBack: () => void;
  onSave?: (log: ArchiveLog) => void;
  onDeleteLog?: (logId: string) => void;
}

const LogEditorView: React.FC<Props> = ({ log, availableCharacters, onBack, onSave, onDeleteLog }) => {
  const [entries, setEntries] = useState<LogEntry[]>(log?.entries || [
    { role: 'CHAPTER', timestamp: '22:40:00', content: '第一章：开始' },
    { role: 'NAR', timestamp: '22:41:04', content: '在这里输入你的叙事文本...' }
  ]);
  const [title, setTitle] = useState(log?.title || '未命名戏录');
  const [summary, setSummary] = useState(log?.summary || '开始一段新的记录...');
  const [currentText, setCurrentText] = useState('');
  const [activeSpeaker, setActiveSpeaker] = useState<'NAR' | 'CHAPTER' | string>('NAR');
  const [isSyncing, setIsSyncing] = useState(false);
  const [showTOC, setShowTOC] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');
  const [editingRole, setEditingRole] = useState<string>('NAR');
  const [showDestroyConfirm, setShowDestroyConfirm] = useState(false);
  const [showCharPanel, setShowCharPanel] = useState(false);
  const [charSearch, setCharSearch] = useState('');
  const [imageUrl, setImageUrl] = useState(log?.imageUrl || 'https://picsum.photos/800/400?grayscale');

  const scrollRef = useRef<HTMLDivElement>(null);

  // Combine characters
  const allPossibleParticipants = useMemo(() => {
    const available = [...availableCharacters];
    log?.participants?.forEach(name => {
      if (!available.find(c => c.name === name)) {
        available.push({
          id: `ext_${name}`,
          name: name,
          title: 'Existing Identity',
          tags: [],
          attributes: { height: '-', age: '-', alignment: '-', gender: '-' },
          introduction: '',
          imageUrl: 'https://picsum.photos/100/100?grayscale'
        });
      }
    });
    return available;
  }, [availableCharacters, log]);

  const sortedParticipants = useMemo(() => {
    const freq: Record<string, number> = {};
    entries.forEach(e => {
      if (e.role !== 'NAR' && e.role !== 'CHAPTER') {
        freq[e.role] = (freq[e.role] || 0) + 1;
      }
    });
    return [...allPossibleParticipants].sort((a, b) => (freq[b.name] || 0) - (freq[a.name] || 0));
  }, [entries, allPossibleParticipants]);

  const filteredChars = useMemo(() => {
    if (!charSearch.trim()) return allPossibleParticipants;
    return allPossibleParticipants.filter(c =>
      c.name.toLowerCase().includes(charSearch.toLowerCase()) ||
      c.title.toLowerCase().includes(charSearch.toLowerCase())
    );
  }, [allPossibleParticipants, charSearch]);

  useEffect(() => {
    if (scrollRef.current && editingIndex === null) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries, editingIndex]);

  const handleSpeakerClick = (role: string) => {
    if (editingIndex !== null) {
      setEditingRole(role);
    } else {
      setActiveSpeaker(role);
    }
  };

  const commitBlock = () => {
    if (!currentText.trim()) return;
    const newEntry: LogEntry = {
      role: activeSpeaker,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
      content: currentText,
      avatarUrl: (activeSpeaker === 'NAR' || activeSpeaker === 'CHAPTER') ? undefined : sortedParticipants.find(p => p.name === activeSpeaker)?.imageUrl
    };
    setEntries([...entries, newEntry]);
    setCurrentText('');
  };

  // 在指定位置插入新条目
  const insertEntryAt = (index: number) => {
    const newEntry: LogEntry = {
      role: activeSpeaker,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
      content: '',
      avatarUrl: (activeSpeaker === 'NAR' || activeSpeaker === 'CHAPTER') ? undefined : sortedParticipants.find(p => p.name === activeSpeaker)?.imageUrl
    };
    const newEntries = [...entries];
    newEntries.splice(index, 0, newEntry);
    setEntries(newEntries);
    // 自动进入编辑模式
    setEditingIndex(index);
    setEditingText('');
    setEditingRole(activeSpeaker);
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditingText(entries[index].content);
    setEditingRole(entries[index].role);
  };

  const saveEdit = () => {
    if (editingIndex === null) return;
    const updatedEntries = [...entries];
    updatedEntries[editingIndex] = {
      ...updatedEntries[editingIndex],
      content: editingText,
      role: editingRole,
      avatarUrl: (editingRole === 'NAR' || editingRole === 'CHAPTER') ? undefined : sortedParticipants.find(p => p.name === editingRole)?.imageUrl
    };
    setEntries(updatedEntries);
    setEditingIndex(null);
  };

  const deleteEntry = (index: number) => {
    if (!window.confirm("确定删除该条戏文吗？")) return;
    const newEntries = entries.filter((_, i) => i !== index);
    setEntries(newEntries);
    if (editingIndex === index) setEditingIndex(null);
  };

  const handlePushToArchive = async () => {
    setIsSyncing(true);
    try {
      let finalEntries = entries;
      if (editingIndex !== null) {
        finalEntries = [...entries];
        finalEntries[editingIndex] = {
          ...finalEntries[editingIndex],
          content: editingText,
          role: editingRole,
          avatarUrl: (editingRole === 'NAR' || editingRole === 'CHAPTER') ? undefined : sortedParticipants.find(p => p.name === editingRole)?.imageUrl
        };
        setEntries(finalEntries);
        setEditingIndex(null);
      }

      if (onSave && log) {
        await onSave({
          ...log,
          title,
          summary,
          imageUrl,
          status: 'Ongoing',
          entries: finalEntries,
          participants: Array.from(new Set(finalEntries.filter(e => e.role !== 'NAR' && e.role !== 'CHAPTER').map(e => e.role)))
        });
      }
    } catch (error) {
      console.error('保存失败:', error);
      alert('保存失败，请检查网络连接后重试');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDestroyLog = () => {
    if (onDeleteLog && log && log.id !== 'new') {
      onDeleteLog(log.id);
    }
    onBack();
  };

  return (
    <div className="flex flex-col h-screen bg-archive-black text-archive-text font-mono overflow-hidden relative">
      {/* TOC Overlay */}
      {showTOC && (
        <div className="absolute inset-0 z-[100] flex animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowTOC(false)}></div>
          <div className="relative w-72 bg-archive-deep border-r border-archive-grey p-8 animate-in slide-in-from-left duration-300">
            <h2 className="text-xs font-bold text-archive-accent tracking-[0.4em] uppercase mb-6">Log_Structure</h2>
            <div className="space-y-4">
              {entries.filter(e => e.role === 'CHAPTER').map((chap, idx) => (
                <div key={idx} className="text-[10px] text-archive-text font-bold uppercase tracking-widest">{chap.content}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Character Selector Panel - Pops out to the right */}
      {showCharPanel && (
        <div className="absolute inset-0 z-[100] flex animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowCharPanel(false)}></div>
          <div className="relative w-72 bg-archive-deep border-r border-archive-grey flex flex-col animate-in slide-in-from-left duration-300">
            <div className="p-6 border-b border-archive-grey">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[10px] font-bold text-archive-accent tracking-[0.4em] uppercase">Select_Identity</h2>
                <button onClick={() => setShowCharPanel(false)} className="text-archive-dim hover:text-archive-text transition-colors">
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  autoFocus
                  value={charSearch}
                  onChange={(e) => setCharSearch(e.target.value)}
                  placeholder="SEARCH ENTITY..."
                  className="w-full bg-archive-black border border-archive-grey p-2 text-[10px] uppercase tracking-widest text-archive-text focus:border-archive-accent outline-none"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
              {filteredChars.map(c => (
                <div
                  key={c.id}
                  onClick={() => { handleSpeakerClick(c.name); setShowCharPanel(false); }}
                  className="group flex gap-3 p-3 thin-border border-archive-grey/50 hover:border-archive-accent transition-all cursor-pointer bg-archive-black/20"
                >
                  <img src={c.imageUrl} className="size-10 thin-border grayscale group-hover:grayscale-0 transition-all object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold uppercase truncate tracking-widest">{c.name}</p>
                    <p className="text-[8px] text-archive-dim truncate uppercase mt-0.5">{c.title}</p>
                  </div>
                </div>
              ))}
              {filteredChars.length === 0 && (
                <div className="text-center py-10 opacity-30 text-[9px] uppercase tracking-widest">No matching nodes</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Destroy Confirmation */}
      {showDestroyConfirm && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setShowDestroyConfirm(false)}></div>
          <div className="relative w-full max-w-[300px] bg-archive-deep thin-border border-red-500/30 p-8 text-center space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest">确认彻底删除此戏录？</h3>
            <div className="flex gap-4">
              <button onClick={() => setShowDestroyConfirm(false)} className="flex-1 py-3 thin-border border-archive-grey text-[10px] uppercase">取消</button>
              <button onClick={handleDestroyLog} className="flex-1 py-3 bg-red-600 text-white text-[10px] uppercase shadow-[0_0_15px_rgba(220,38,38,0.3)]">销毁</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-archive-grey shrink-0 bg-archive-black/90 backdrop-blur-md z-40">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-archive-muted hover:text-archive-text"><span className="material-symbols-outlined">arrow_back</span></button>
          <h1 className="text-xs font-bold uppercase tracking-widest">Editor.Protocol</h1>
        </div>
        <div className="flex items-center gap-4">
          {log?.id !== 'new' && (
            <button onClick={() => setShowDestroyConfirm(true)} className="text-red-900/40 hover:text-red-500 transition-colors">
              <span className="material-symbols-outlined text-[20px]">delete</span>
            </button>
          )}
          <button onClick={() => setShowTOC(true)} className="flex items-center gap-2 px-2 py-1 thin-border border-archive-grey text-[10px] font-bold uppercase">目录</button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar" ref={scrollRef}>
        <section className="px-6 py-8 border-b border-archive-grey bg-archive-black space-y-8">
          <div>
            <label className="text-[9px] text-archive-dim uppercase tracking-[0.3em] block mb-2 font-bold">Archive_Label // 标题</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-transparent border-none focus:ring-0 text-archive-text text-xl font-bold tracking-widest uppercase p-0"
              placeholder="戏录标题"
            />
          </div>

          <div>
            <label className="text-[9px] text-archive-dim uppercase tracking-[0.3em] block mb-2 font-bold">Summary_Index // 简介</label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full bg-archive-deep/30 border border-archive-grey/50 focus:border-archive-accent/50 focus:ring-0 p-3 text-[12px] leading-relaxed text-archive-dim italic font-mono resize-none transition-colors"
              placeholder="开始一段新的记录简介..."
              rows={3}
            />
          </div>

          {/* 封面图上传 */}
          <div>
            <label className="text-[9px] text-archive-dim uppercase tracking-[0.3em] block mb-2 font-bold">Cover_Image // 封面图</label>
            <ImageUploader
              currentImageUrl={imageUrl}
              onImageChange={setImageUrl}
              folder="logs"
            />
          </div>
        </section>

        <section className="flex min-h-[calc(100vh-200px)]">
          {/* Sidebar - Identity Selector */}
          <aside className="w-20 border-r border-archive-grey flex flex-col items-center py-6 gap-6 sticky top-0 h-screen bg-archive-black/30 overflow-y-auto no-scrollbar">
            <button
              onClick={() => handleSpeakerClick('CHAPTER')}
              className={`size-12 shrink-0 thin-border flex flex-col items-center justify-center transition-all ${(editingIndex !== null ? editingRole === 'CHAPTER' : activeSpeaker === 'CHAPTER') ? 'bg-white text-black border-white' : 'text-archive-dim border-archive-grey'}`}
            >
              <span className="material-symbols-outlined">bookmark</span>
              <span className="text-[7px] font-bold mt-0.5">CHAP</span>
            </button>
            <button
              onClick={() => handleSpeakerClick('NAR')}
              className={`size-12 shrink-0 thin-border flex flex-col items-center justify-center transition-all ${(editingIndex !== null ? editingRole === 'NAR' : activeSpeaker === 'NAR') ? 'bg-archive-accent/20 border-archive-accent text-archive-accent' : 'text-archive-dim border-archive-grey'}`}
            >
              <span className="material-symbols-outlined">book_5</span>
              <span className="text-[7px] font-bold mt-0.5">NAR</span>
            </button>
            <div className="w-8 h-[1px] bg-archive-grey/50"></div>
            {sortedParticipants.slice(0, 4).map((p) => (
              <button
                key={p.id}
                onClick={() => handleSpeakerClick(p.name)}
                className={`flex flex-col items-center shrink-0 transition-all ${(editingIndex !== null ? editingRole === p.name : activeSpeaker === p.name) ? 'opacity-100 scale-110' : 'opacity-40 grayscale'}`}
              >
                <div className={`size-12 thin-border p-0.5 ${(editingIndex !== null ? editingRole === p.name : activeSpeaker === p.name) ? 'border-archive-accent' : 'border-archive-grey'}`}>
                  <img src={p.imageUrl} className="w-full h-full object-cover" />
                </div>
                <span className={`text-[7px] font-bold truncate w-16 text-center mt-1 uppercase ${(editingIndex !== null ? editingRole === p.name : activeSpeaker === p.name) ? 'text-archive-accent' : 'text-archive-dim'}`}>
                  {p.name}
                </span>
              </button>
            ))}
            {/* Added: Distinct button to expand character panel */}
            <button
              onClick={() => setShowCharPanel(true)}
              className="size-12 shrink-0 thin-border flex flex-col items-center justify-center text-archive-accent border-archive-accent/30 hover:bg-archive-accent/10 transition-all shadow-[0_0_10px_rgba(0,163,255,0.1)]"
            >
              <span className="material-symbols-outlined">group_add</span>
              <span className="text-[7px] font-bold mt-0.5">SEARCH</span>
            </button>
          </aside>

          {/* Chat Feed */}
          <div className="flex-1 p-6 space-y-10 pb-60">
            {entries.map((entry, idx) => (
              <div key={idx}>
                <div className="relative group animate-in fade-in duration-500">
                  {editingIndex === idx ? (
                    <div className="space-y-4 p-5 thin-border border-archive-accent bg-archive-accent/5">
                      <div className="flex items-center justify-between text-[8px] font-bold text-archive-accent uppercase tracking-widest">
                        <span>Editing_Block_Identity: {editingRole}</span>
                        <button onClick={() => deleteEntry(idx)} className="text-red-500 hover:scale-110 transition-transform"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                      </div>
                      <textarea
                        autoFocus
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); saveEdit(); } }}
                        className="w-full bg-archive-black/50 border border-archive-grey/30 p-3 text-[14px] leading-relaxed resize-none h-32 text-archive-text focus:ring-1 focus:ring-archive-accent"
                      />
                      <div className="flex justify-end gap-4">
                        <button onClick={() => setEditingIndex(null)} className="text-[9px] uppercase font-bold text-archive-dim">取消</button>
                        <button onClick={saveEdit} className="px-6 py-2 bg-archive-accent text-black text-[9px] font-bold uppercase tracking-widest">保存</button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => startEditing(idx)}
                      className="cursor-pointer group relative"
                    >
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteEntry(idx); }}
                        className="absolute -right-2 -top-2 size-6 flex items-center justify-center bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      >
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>

                      {entry.role === 'CHAPTER' ? (
                        <div className="flex flex-col items-center py-4">
                          <div className="bg-archive-black px-6 py-2 thin-border border-archive-accent text-[11px] font-bold tracking-[0.3em] uppercase text-archive-accent">{entry.content}</div>
                        </div>
                      ) : entry.role === 'NAR' ? (
                        <div className="bg-archive-accent/5 thin-border border-archive-accent/20 p-4 relative group-hover:border-archive-accent transition-colors">
                          <span className="absolute top-1 right-2 text-[7px] text-archive-accent/30 font-bold">NAR</span>
                          <p className="text-archive-accent text-sm leading-relaxed italic whitespace-pre-wrap">{entry.content}</p>
                        </div>
                      ) : (
                        <div className="pl-3 border-l-2 border-archive-grey group-hover:border-archive-accent transition-colors">
                          <div className="flex items-center gap-3 mb-2">
                            <img src={entry.avatarUrl} className="size-5 thin-border grayscale object-cover" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">{entry.role}</span>
                            <span className="text-[8px] text-archive-dim">{entry.timestamp}</span>
                          </div>
                          <p className="text-[13px] leading-loose text-archive-text/90 italic font-mono whitespace-pre-wrap">{entry.content}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 插入按钮 - 在条目之间显示 */}
                {editingIndex === null && (
                  <div className="flex justify-center py-2 opacity-0 hover:opacity-100 transition-opacity group/insert">
                    <button
                      onClick={() => insertEntryAt(idx + 1)}
                      className="flex items-center gap-1 px-3 py-1 text-[8px] text-archive-dim hover:text-archive-accent thin-border border-archive-grey/30 hover:border-archive-accent/50 transition-all uppercase tracking-widest"
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                      插入条目
                    </button>
                  </div>
                )}
              </div>
            ))}

            {/* Bottom Input Area */}
            {editingIndex === null && (
              <div className="pt-10 animate-in slide-in-from-bottom-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`text-[10px] font-bold px-2 py-1 thin-border uppercase tracking-widest ${activeSpeaker === 'CHAPTER' ? 'bg-white text-black border-white' : activeSpeaker === 'NAR' ? 'bg-archive-accent text-black border-archive-accent' : 'text-archive-accent border-archive-accent'}`}>
                    {activeSpeaker}
                  </div>
                  <div className="text-[9px] text-archive-dim animate-pulse uppercase tracking-[0.4em]">Ready_For_Transmission</div>
                </div>
                <div className="thin-border p-5 bg-archive-accent/5 border-archive-accent/50 focus-within:border-archive-accent transition-all">
                  <textarea
                    value={currentText}
                    onChange={(e) => setCurrentText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); commitBlock(); } }}
                    placeholder="在此输入戏文... (Cmd+Enter 发送)"
                    className="w-full bg-transparent border-none focus:ring-0 p-0 text-[14px] leading-relaxed resize-none h-24 text-archive-text placeholder:text-archive-dim/30"
                  />
                </div>
                <div className="flex justify-end mt-4">
                  <button onClick={commitBlock} className="text-archive-accent text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 hover:translate-x-1 transition-transform">
                    COMMIT_ENTRY <span className="material-symbols-outlined text-sm">send</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Persistence Footer - Modified to remove Save Cache and expand Push button */}
      <footer className="shrink-0 p-4 bg-archive-black border-t border-archive-grey z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <div className="max-w-md mx-auto flex">
          <button
            onClick={handlePushToArchive}
            disabled={isSyncing}
            className={`w-full h-14 bg-archive-accent text-black flex flex-col items-center justify-center transition-all shadow-[0_0_20px_rgba(0,163,255,0.2)] hover:shadow-[0_0_30px_rgba(0,163,255,0.4)] active:scale-[0.98] ${isSyncing ? 'opacity-50' : ''}`}
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">{isSyncing ? 'sync' : 'publish'}</span>
              <span className="text-[11px] font-bold tracking-[0.3em] uppercase">{isSyncing ? 'SYNCHRONIZING...' : 'PUSH_TO_ARCHIVE'}</span>
            </div>
            <span className="text-[7px] font-bold opacity-50 uppercase tracking-widest mt-0.5">PUBLIC_LOG // 发布到档案首页</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default LogEditorView;
