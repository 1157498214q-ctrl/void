
import React, { useState, useMemo } from 'react';
import { Character } from '../types';

interface Props {
  characters: Character[];
  onSelectCharacter: (char: Character) => void;
  onAddCharacter: () => void;
  onBack: () => void;
  onNavigateToProfile: () => void;
}

const CharacterListView: React.FC<Props> = ({ characters, onSelectCharacter, onAddCharacter, onBack, onNavigateToProfile }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCharacters = useMemo(() => {
    if (!searchQuery.trim()) return characters;
    const q = searchQuery.toLowerCase();
    return characters.filter(char => 
      char.name.toLowerCase().includes(q) || 
      char.title.toLowerCase().includes(q) ||
      char.tags.some(tag => tag.toLowerCase().includes(q))
    );
  }, [characters, searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Real-time filtering is handled by useMemo, preventing refresh here.
  };

  return (
    <div className="min-h-screen pb-40">
      <header className="sticky top-0 z-50 bg-archive-black/90 backdrop-blur-md border-b border-archive-grey">
        <div className="flex items-center px-6 py-5 justify-between">
          <button onClick={onBack} className="text-archive-accent">
            <span className="material-symbols-outlined text-lg">arrow_back_ios</span>
          </button>
          <h1 className="text-archive-text text-xs font-bold tracking-[0.2em] uppercase font-header flex-1 text-center">CHARACTER_ARCHIVE_LOG</h1>
          <div className="text-[10px] text-archive-accent opacity-70">NODE_04</div>
        </div>
      </header>

      <main className="p-6 space-y-6">
        {/* Updated Search Bar to match DashboardView style */}
        <div className="mb-8">
          <form onSubmit={handleSearchSubmit} className="flex items-center thin-border bg-archive-black h-11 px-4 focus-within:border-archive-accent transition-colors">
            <span className="material-symbols-outlined text-archive-grey text-lg">search</span>
            <input 
              className="bg-transparent border-none focus:ring-0 text-archive-text placeholder:text-archive-grey w-full text-sm px-3 uppercase tracking-widest" 
              placeholder="QUERY_ID / NAME / TAGS..." 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                type="button"
                onClick={() => setSearchQuery('')}
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

        <div className="space-y-4">
          {filteredCharacters.length > 0 ? (
            filteredCharacters.map(char => (
              <div 
                key={char.id}
                onClick={() => onSelectCharacter(char)}
                className="thin-border relative bg-archive-black group p-4 cursor-pointer hover:bg-archive-deep transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-[10px] text-archive-dim mb-1">ARCHIVE_ID: 0x{char.id.slice(-4).toUpperCase()}</div>
                    <h3 className="text-archive-accent text-lg font-bold tracking-widest uppercase">{char.name}</h3>
                  </div>
                  <div className="text-[9px] px-1.5 py-0.5 border border-archive-accent/40 text-archive-accent bg-archive-accent/5 uppercase font-mono">DATA_ACTIVE</div>
                </div>
                <div className="flex items-center gap-4">
                  <div 
                    className="w-16 h-16 thin-border grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700 bg-center bg-cover"
                    style={{ backgroundImage: `url(${char.imageUrl})` }}
                  ></div>
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {char.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[9px] px-2 py-0.5 border border-archive-grey text-archive-muted uppercase font-mono">{tag}</span>
                      ))}
                    </div>
                    <p className="text-archive-muted text-[10px] leading-tight font-mono opacity-60">LOG_TYPE: ORIGINAL_CONTENT<br/>SYNC_RATE: 98.2%</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-center opacity-40">
              <span className="material-symbols-outlined text-4xl mb-4 text-archive-accent/50">warning</span>
              <p className="text-[10px] uppercase tracking-[0.4em] font-mono">No entities matched the current query</p>
              <button 
                onClick={() => setSearchQuery('')}
                className="mt-6 text-[9px] text-archive-accent uppercase tracking-widest border-b border-archive-accent/30 pb-1"
              >
                Reset Search / 重置搜索
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-24 left-0 right-0 max-w-md mx-auto pointer-events-none z-40 px-6">
        <div className="flex justify-end">
          <button 
            onClick={onAddCharacter}
            className="group pointer-events-auto flex size-14 items-center justify-center bg-archive-black border border-archive-accent text-archive-accent transition-all active:scale-95 shadow-[0_0_15px_rgba(0,163,255,0.15)] hover:shadow-[0_0_20px_rgba(0,163,255,0.25)]"
          >
            <span className="material-symbols-outlined text-3xl group-hover:rotate-90 transition-transform duration-300">add</span>
          </button>
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto h-20 bg-archive-black border-t border-archive-grey flex items-center justify-around px-8 z-50">
        <button onClick={onBack} className="flex flex-col items-center gap-1.5 text-archive-muted hover:text-archive-text transition-colors">
          <span className="material-symbols-outlined text-[24px]">folder</span>
          <span className="text-[8px] font-header font-bold uppercase">归档</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 text-archive-accent relative">
          <span className="material-symbols-outlined text-[24px]">badge</span>
          <span className="text-[8px] font-header font-bold uppercase">角色库</span>
          <div className="absolute -top-1.5 w-1 h-1 bg-archive-accent rounded-full shadow-[0_0_8px_#00A3FF]"></div>
        </button>
        <button onClick={onNavigateToProfile} className="flex flex-col items-center gap-1.5 text-archive-muted hover:text-archive-text transition-colors">
          <span className="material-symbols-outlined text-[24px]">contact_page</span>
          <span className="text-[8px] font-header font-bold uppercase">我的</span>
        </button>
      </nav>
    </div>
  );
};

export default CharacterListView;
