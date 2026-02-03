
import React, { useState, useMemo } from 'react';
import { ArchiveLog, Character } from '../types';

interface Props {
  logs: ArchiveLog[];
  characters: Character[];
  onSelectLog: (log: ArchiveLog) => void;
  onContinueLog: (log: ArchiveLog) => void;
  onAddLog: () => void;
  onToggleFavorite?: (logId: string) => void;
  onNavigateToCharacters: () => void;
  onNavigateToProfile: () => void;
  onViewAllLogs?: () => void;
}

const DashboardView: React.FC<Props> = ({ logs, characters, onSelectLog, onContinueLog, onAddLog, onToggleFavorite, onNavigateToCharacters, onNavigateToProfile, onViewAllLogs }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [showHackerModal, setShowHackerModal] = useState(false);
  const [showMariaModal, setShowMariaModal] = useState(false);

  const filteredLogs = useMemo(() => {
    let result = logs;
    if (activeSearch.trim()) {
      const q = activeSearch.toLowerCase();
      result = result.filter(log =>
        log.title.toLowerCase().includes(q) ||
        log.summary.toLowerCase().includes(q) ||
        log.participants.some(p => p.toLowerCase().includes(q))
      );
    }
    return result;
  }, [logs, activeSearch]);

  const handleLogClick = (log: ArchiveLog) => {
    onSelectLog(log);
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    setActiveSearch(searchQuery);
  };

  const getParticipantData = (idOrName: string) => {
    return characters.find(c => c.id === idOrName || c.name === idOrName);
  };

  return (
    <div className="min-h-screen pb-40">
      {/* Hacker X Modal Overlay */}
      {showHackerModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowHackerModal(false)}></div>
          <div className="relative w-full max-w-[300px] bg-archive-deep thin-border border-archive-accent/40 p-8 text-center space-y-6 animate-in zoom-in-95 duration-200">
            <div className="size-16 mx-auto rounded-full border border-archive-accent/20 flex items-center justify-center text-archive-accent">
              <span className="material-symbols-outlined text-3xl animate-pulse">security</span>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-archive-accent">Connection_Interrupted</h3>
              <p className="text-base font-bold text-archive-text uppercase tracking-widest">嘿！我是黑客X!</p>
            </div>
            <button
              onClick={() => setShowHackerModal(false)}
              className="w-full py-3 thin-border border-archive-accent text-archive-accent text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-archive-accent/10 transition-colors"
            >
              Close_Terminal
            </button>
          </div>
        </div>
      )}

      {/* Maria Modal Overlay (Pink) */}
      {showMariaModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-pink-950/40 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowMariaModal(false)}></div>
          <div className="relative w-full max-w-[300px] bg-archive-deep thin-border border-pink-500/40 p-8 text-center space-y-6 animate-in zoom-in-95 duration-200 shadow-[0_0_30px_rgba(236,72,153,0.2)]">
            <div className="size-16 mx-auto rounded-full border border-pink-500/20 flex items-center justify-center text-pink-500">
              <span className="material-symbols-outlined text-3xl animate-pulse font-variation-fill">favorite</span>
            </div>
            <div className="space-y-2">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-pink-500/60">HEART_LINK_ESTABLISHED</h3>
              <p className="text-lg font-bold text-pink-500 uppercase tracking-widest">玛莉娅大人天下第一！</p>
            </div>
            <button
              onClick={() => setShowMariaModal(false)}
              className="w-full py-3 thin-border border-pink-500 text-pink-500 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-pink-500/10 transition-colors"
            >
              TERMINATE_LINK
            </button>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-50 bg-archive-black/90 backdrop-blur-md">
        <div className="flex items-center justify-between px-6 pt-10 pb-4">
          <h1 className="font-header text-xl font-bold text-archive-text tracking-widest uppercase">欢迎来到虚空！</h1>
          <div className="flex gap-4">
            <span
              onClick={() => setShowHackerModal(true)}
              className="material-symbols-outlined text-archive-grey cursor-pointer hover:text-archive-accent transition-colors"
            >
              lock
            </span>
            <span
              onClick={() => setShowMariaModal(true)}
              className="material-symbols-outlined text-pink-500 cursor-pointer hover:text-pink-400 transition-colors"
            >
              favorite
            </span>
          </div>
        </div>

        <div className="px-6 py-2 border-b border-archive-grey/10">
          <form onSubmit={handleSearchSubmit} className="flex items-center thin-border bg-archive-black h-11 px-4 focus-within:border-archive-accent transition-colors">
            <span className="material-symbols-outlined text-archive-grey text-lg">search</span>
            <input
              className="bg-transparent border-none focus:ring-0 text-archive-text placeholder:text-archive-grey w-full text-sm px-3 uppercase tracking-widest"
              placeholder="SEARCH BY TITLE, SUMMARY OR CHARACTER..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setActiveSearch(''); }}
                className="text-archive-muted hover:text-archive-text mr-2"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            )}
            <button
              type="submit"
              className="text-archive-accent hover:text-archive-text transition-colors font-bold text-[10px] uppercase tracking-widest pl-2 border-l border-archive-grey"
            >
              搜索
            </button>
          </form>
        </div>
      </header>

      {/* 查看全部戒录入口 */}
      <div className="px-6 py-3 border-b border-archive-grey/10">
        <button
          onClick={onViewAllLogs}
          className="w-full flex items-center justify-between p-3 thin-border border-archive-grey/30 hover:border-archive-accent/50 bg-archive-deep/30 hover:bg-archive-accent/5 transition-all group"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-archive-accent">list_alt</span>
            <span className="text-[11px] font-bold uppercase tracking-widest text-archive-text group-hover:text-archive-accent transition-colors">查看全部戏录</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-archive-dim">{logs.length} 条</span>
            <span className="material-symbols-outlined text-archive-dim group-hover:text-archive-accent transition-colors">chevron_right</span>
          </div>
        </button>
      </div>

      <main className="px-6 py-6 flex flex-col gap-8">
        {filteredLogs.length > 0 ? (
          filteredLogs.map(log => (
            <div
              key={log.id}
              className="group relative flex flex-col thin-border p-4 bg-archive-black cursor-pointer hover:bg-archive-deep transition-all"
              onClick={() => handleLogClick(log)}
            >
              {/* Main Content Area */}
              <div className="flex gap-4 mb-4">
                {/* Image Column */}
                <div
                  className="w-20 h-28 flex-shrink-0 bg-center bg-cover grayscale group-hover:grayscale-0 transition-all border border-archive-grey shadow-sm"
                  style={{ backgroundImage: `url(${log.imageUrl})` }}
                ></div>

                {/* Text Content Column */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col">
                        <span className="text-archive-dim text-[10px] uppercase font-mono tracking-tighter">TIMESTAMP // 存档时间</span>
                        <span className="text-archive-text text-[10px] uppercase font-mono font-bold">{log.timestamp}</span>
                      </div>
                    </div>
                    <h3 className="font-header text-lg font-bold text-archive-text mt-2 group-hover:text-archive-accent transition-colors truncate tracking-wider uppercase">{log.title}</h3>
                    <p className="text-archive-muted text-[11px] leading-relaxed line-clamp-3 mt-1 font-mono italic opacity-70">
                      {log.summary}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action/Icon Row - Strictly Aligned Under the Image Column */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Favorite Button: Aligned at the start of the image column */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite?.(log.id);
                    }}
                    className={`flex items-center justify-center transition-all ${log.isFavorite ? 'text-archive-accent scale-110' : 'text-archive-dim hover:text-archive-muted'}`}
                  >
                    <span className={`material-symbols-outlined !text-[22px] ${log.isFavorite ? 'fill-1' : ''}`}>
                      {log.isFavorite ? 'star' : 'star_outline'}
                    </span>
                  </button>

                  {/* Avatars: Displayed next to the favorite button */}
                  <div className="flex -space-x-2">
                    {log.participants.map((p, idx) => {
                      const char = getParticipantData(p);
                      return (
                        <div key={idx} className="size-6 border border-archive-black bg-archive-grey rounded-full flex items-center justify-center text-[8px] font-bold text-black uppercase overflow-hidden shadow-lg ring-1 ring-white/5">
                          {char?.imageUrl ? (
                            <img src={char.imageUrl} alt={char.name} className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 transition-all" />
                          ) : (
                            <span>{(char?.name || p).charAt(0)}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Details Link: Aligned right */}
                <div className="flex items-center gap-1.5 text-archive-accent text-[11px] font-bold uppercase tracking-[0.2em] group-hover:translate-x-1 transition-transform">
                  查看详情 <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-center opacity-40">
            <span className="material-symbols-outlined text-4xl mb-4 text-archive-accent/50">folder_open</span>
            <p className="text-[10px] uppercase tracking-[0.4em] font-mono">No matching records found in node_04</p>
            {activeSearch && (
              <button
                onClick={() => { setSearchQuery(''); setActiveSearch(''); }}
                className="mt-6 text-[9px] text-archive-accent uppercase tracking-widest border-b border-archive-accent/20 pb-1"
              >
                Clear Search / 清除搜索
              </button>
            )}
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-24 left-0 right-0 max-w-md mx-auto pointer-events-none z-40 px-6">
        <div className="flex justify-end">
          <button
            onClick={onAddLog}
            className="group pointer-events-auto flex size-14 items-center justify-center bg-archive-black border border-archive-accent text-archive-accent transition-all active:scale-95 shadow-[0_0_20px_rgba(0,163,255,0.2)] hover:shadow-[0_0_30px_rgba(0,163,255,0.4)]"
          >
            <span className="material-symbols-outlined text-3xl group-hover:rotate-90 transition-transform duration-300">add</span>
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto h-20 bg-archive-black/95 backdrop-blur-xl border-t border-archive-grey flex items-center justify-around px-8 z-50">
        <button className="flex flex-col items-center gap-1.5 text-archive-accent relative">
          <span className="material-symbols-outlined text-[26px]">folder</span>
          <span className="text-[9px] font-header font-bold uppercase tracking-widest">归档</span>
          <div className="absolute -top-1.5 w-1.5 h-1.5 bg-archive-accent rounded-full shadow-[0_0_10px_#00A3FF]"></div>
        </button>
        <button onClick={onNavigateToCharacters} className="flex flex-col items-center gap-1.5 text-archive-muted hover:text-archive-text transition-all">
          <span className="material-symbols-outlined text-[26px]">badge</span>
          <span className="text-[9px] font-header font-bold uppercase tracking-widest">角色库</span>
        </button>
        <button onClick={onNavigateToProfile} className="flex flex-col items-center gap-1.5 text-archive-muted hover:text-archive-text transition-all">
          <span className="material-symbols-outlined text-[26px]">contact_page</span>
          <span className="text-[9px] font-header font-bold uppercase tracking-widest">我的</span>
        </button>
      </nav>
    </div>
  );
};

export default DashboardView;
