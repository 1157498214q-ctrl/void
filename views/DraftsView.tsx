
import React, { useState } from 'react';
import { ArchiveLog, Character } from '../types';

interface Props {
  logs: ArchiveLog[];
  characters: Character[];
  onSelectDraft: (log: ArchiveLog) => void;
  onSelectCharacterDraft: (char: Character) => void;
  onDeleteDraft: (logId: string) => void;
  onDeleteCharacterDraft: (charId: string) => void;
  onAddLog: () => void;
  onAddCharacter: () => void;
  onBack: () => void;
}

const DraftsView: React.FC<Props> = ({ 
  logs, 
  characters, 
  onSelectDraft, 
  onSelectCharacterDraft,
  onDeleteDraft, 
  onDeleteCharacterDraft,
  onAddLog,
  onAddCharacter,
  onBack 
}) => {
  const [activeTab, setActiveTab] = useState<'LOGS' | 'ENTITIES'>('LOGS');
  const [itemToDelete, setItemToDelete] = useState<{ id: string, type: 'LOG' | 'CHAR' } | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);

  const confirmDeletion = () => {
    if (itemToDelete) {
      if (itemToDelete.type === 'LOG') {
        onDeleteDraft(itemToDelete.id);
      } else {
        onDeleteCharacterDraft(itemToDelete.id);
      }
      setItemToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-archive-black text-archive-text font-mono flex flex-col relative" onClick={() => setShowAddMenu(false)}>
      {/* Custom Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6" onClick={(e) => e.stopPropagation()}>
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300" 
            onClick={() => setItemToDelete(null)}
          ></div>
          <div className="relative w-full max-w-[320px] bg-archive-deep thin-border border-red-900/30 p-8 animate-in zoom-in-95 fade-in duration-200 shadow-[0_0_40px_rgba(220,38,38,0.1)]">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="size-14 rounded-full border border-red-500/20 flex items-center justify-center text-red-500">
                <span className="material-symbols-outlined text-3xl animate-pulse">warning</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-archive-text text-sm font-bold tracking-[0.2em] uppercase">
                  确定删除这个{itemToDelete.type === 'LOG' ? '戏录' : '角色'}记录？
                </h3>
                <p className="text-[9px] text-red-500/60 tracking-[0.1em] leading-relaxed uppercase font-bold">
                  Warning: Action_Irreversible // Data_Purge
                </p>
              </div>
              <div className="w-full h-px bg-archive-grey"></div>
              <div className="grid grid-cols-2 gap-4 w-full">
                <button 
                  onClick={() => setItemToDelete(null)}
                  className="py-3 thin-border border-archive-grey text-archive-muted text-[10px] font-bold uppercase tracking-[0.2em] hover:text-archive-text transition-colors"
                >
                  取消 / CANCEL
                </button>
                <button 
                  onClick={confirmDeletion}
                  className="py-3 bg-red-600 text-white text-[10px] font-bold uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(220,38,38,0.2)] hover:bg-red-500 transition-colors"
                >
                  确定 / DELETE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-50 bg-archive-black/95 backdrop-blur-md border-b border-archive-grey pt-10 flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 flex items-center gap-4 mb-5 relative">
          <button onClick={onBack} className="text-archive-accent flex items-center justify-center size-10 -ml-2 hover:bg-archive-accent/5 transition-colors">
            <span className="material-symbols-outlined text-xl">arrow_back</span>
          </button>
          <div className="flex-1">
            <h1 className="text-[9px] font-bold tracking-[0.3em] uppercase opacity-40 leading-none mb-1">ARCHIVE_STATION_V.04</h1>
            <p className="text-[11px] font-bold tracking-widest text-archive-accent uppercase flex items-center gap-2">
              <span className="material-symbols-outlined !text-xs">folder_open</span>
              档案管理 / ARCHIVE_STORAGE
            </p>
          </div>
          
          {/* New Draft Button */}
          <div className="relative">
            <button 
              onClick={(e) => { e.stopPropagation(); setShowAddMenu(!showAddMenu); }}
              className={`flex items-center gap-2 px-3 py-1.5 thin-border transition-all duration-300 ${showAddMenu ? 'bg-archive-accent text-black border-archive-accent' : 'border-archive-accent/30 text-archive-accent hover:border-archive-accent hover:bg-archive-accent/5'}`}
            >
              <span className="material-symbols-outlined !text-[18px]">add_box</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">新建草稿</span>
            </button>

            {/* Dropdown Menu */}
            {showAddMenu && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-archive-deep thin-border border-archive-accent/20 shadow-2xl animate-in zoom-in-95 duration-200 z-[60]">
                <div className="p-2 border-b border-archive-grey/50">
                  <p className="text-[8px] text-archive-dim uppercase tracking-[0.2em] px-2">Select_Mode:</p>
                </div>
                <button 
                  onClick={() => { setShowAddMenu(false); onAddCharacter(); }}
                  className="w-full flex items-center gap-3 px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-archive-text hover:bg-archive-accent/10 transition-colors text-left"
                >
                  <span className="material-symbols-outlined !text-[18px] text-archive-accent">badge</span>
                  新建角色草稿
                </button>
                <div className="h-[1px] w-full bg-archive-grey/30"></div>
                <button 
                  onClick={() => { setShowAddMenu(false); onAddLog(); }}
                  className="w-full flex items-center gap-3 px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-archive-text hover:bg-archive-accent/10 transition-colors text-left"
                >
                  <span className="material-symbols-outlined !text-[18px] text-archive-accent">edit_note</span>
                  新建戏录草稿
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Tab Switcher */}
        <div className="flex px-6 border-t border-archive-grey/30">
          <button 
            onClick={() => setActiveTab('LOGS')}
            className={`flex-1 py-4 text-[10px] font-bold tracking-[0.4em] uppercase transition-all relative ${activeTab === 'LOGS' ? 'text-archive-accent' : 'text-archive-dim'}`}
          >
            LOG_DRAFTS ({logs.length})
            {activeTab === 'LOGS' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-archive-accent shadow-[0_0_12px_#00A3FF]"></div>}
          </button>
          <button 
            onClick={() => setActiveTab('ENTITIES')}
            className={`flex-1 py-4 text-[10px] font-bold tracking-[0.4em] uppercase transition-all relative ${activeTab === 'ENTITIES' ? 'text-archive-accent' : 'text-archive-dim'}`}
          >
            ENTITY_RECORDS ({characters.length})
            {activeTab === 'ENTITIES' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-archive-accent shadow-[0_0_12px_#00A3FF]"></div>}
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 space-y-6 overflow-y-auto no-scrollbar pb-32">
        {activeTab === 'LOGS' ? (
          logs.length > 0 ? (
            logs.map(log => (
              <div 
                key={log.id}
                onClick={() => onSelectDraft(log)}
                className="group relative bg-archive-deep thin-border p-5 cursor-pointer hover:border-archive-accent transition-all duration-300"
              >
                <div className="absolute top-0 right-0 p-3 flex items-center gap-3">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setItemToDelete({ id: log.id, type: 'LOG' });
                    }}
                    className="size-10 flex items-center justify-center text-red-900/40 hover:text-red-500 hover:bg-red-500/10 transition-all rounded-full z-10"
                  >
                    <span className="material-symbols-outlined text-[20px]">delete_forever</span>
                  </button>
                </div>
                <div className="flex flex-col mb-4">
                  <div className="text-[10px] text-archive-dim font-bold uppercase tracking-widest italic">{log.timestamp}</div>
                </div>
                <h3 className="text-base font-bold tracking-widest text-archive-text mb-2 group-hover:text-archive-accent transition-colors uppercase pr-12 leading-relaxed">
                  {log.title}
                </h3>
                <p className="text-[11px] text-archive-muted line-clamp-2 leading-relaxed italic opacity-70">
                  {log.summary || '无简介数据...'}
                </p>
                <div className="mt-4 flex justify-end">
                   <span className="text-[8px] text-archive-dim uppercase tracking-widest font-bold">Modified: {log.timestamp}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-40 flex flex-col items-center justify-center text-center opacity-30">
              <span className="material-symbols-outlined text-5xl mb-4 font-light text-archive-accent">edit_note</span>
              <p className="text-[10px] uppercase tracking-[0.4em]">No active log segments recovered</p>
              <button onClick={onAddLog} className="mt-6 text-[9px] text-archive-accent uppercase tracking-widest border border-archive-accent/30 px-4 py-2 hover:bg-archive-accent/5 transition-colors">Start_New_Transmission</button>
            </div>
          )
        ) : (
          characters.length > 0 ? (
            characters.map(char => (
              <div 
                key={char.id}
                onClick={() => onSelectCharacterDraft(char)}
                className="group relative bg-archive-deep thin-border p-5 cursor-pointer hover:border-archive-accent transition-all duration-300 flex gap-5"
              >
                <div className="w-16 h-16 thin-border flex-shrink-0 bg-center bg-cover grayscale opacity-50 transition-all group-hover:grayscale-0 group-hover:opacity-100" style={{ backgroundImage: `url(${char.imageUrl})` }}></div>
                <div className="flex-1 min-w-0">
                  <div className="absolute top-0 right-0 p-3">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setItemToDelete({ id: char.id, type: 'CHAR' });
                      }}
                      className="size-10 flex items-center justify-center text-red-900/40 hover:text-red-500 hover:bg-red-500/10 transition-all rounded-full z-10"
                    >
                      <span className="material-symbols-outlined text-[20px]">delete_forever</span>
                    </button>
                  </div>
                  <div className="flex gap-4 mb-2">
                    <div className={`text-[8px] font-bold px-1.5 border uppercase tracking-tighter ${char.isDraft ? 'text-archive-dim border-archive-dim bg-archive-dim/5' : 'text-archive-accent border-archive-accent bg-archive-accent/5'}`}>
                      {char.isDraft ? 'IN_DRAFT' : 'PUBLISHED'}
                    </div>
                    <div className="text-[8px] text-archive-muted font-bold tracking-widest uppercase truncate max-w-[80px]">ID: 0x{char.id.slice(-4)}</div>
                  </div>
                  <h3 className="text-base font-bold tracking-widest text-archive-text group-hover:text-archive-accent transition-colors uppercase truncate pr-10">
                    {char.name || '[ UNNAMED_ENTITY ]'}
                  </h3>
                  <p className="text-[9px] text-archive-dim mt-1 uppercase tracking-[0.2em] font-bold truncate">
                    {char.title || 'No_Role_Assigned'}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="py-40 flex flex-col items-center justify-center text-center opacity-30">
              <span className="material-symbols-outlined text-5xl mb-4 font-light text-archive-accent">badge</span>
              <p className="text-[10px] uppercase tracking-[0.4em]">Identity_Repository is currently empty</p>
              <button onClick={onAddCharacter} className="mt-6 text-[9px] text-archive-accent uppercase tracking-widest border border-archive-accent/30 px-4 py-2 hover:bg-archive-accent/5 transition-colors">Create_New_Identity</button>
            </div>
          )
        )}
      </main>

      <footer className="p-8 text-center opacity-20 bg-gradient-to-t from-archive-black to-transparent">
        <div className="text-[9px] tracking-[0.5em] uppercase">VOID_BUFFER_END // Protocol_Complete</div>
      </footer>
    </div>
  );
};

export default DraftsView;
