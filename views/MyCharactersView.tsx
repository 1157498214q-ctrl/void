
import React from 'react';
import { Character } from '../types';

interface Props {
  characters: Character[];
  onSelectCharacter: (char: Character) => void;
  onAddCharacter: () => void;
  onBack: () => void;
}

const MyCharactersView: React.FC<Props> = ({ characters, onSelectCharacter, onAddCharacter, onBack }) => {
  return (
    <div className="min-h-screen bg-archive-black text-archive-text font-mono flex flex-col">
      <header className="sticky top-0 z-50 bg-archive-black/95 backdrop-blur-md border-b border-archive-grey px-6 py-5 flex items-center gap-4">
        <button onClick={onBack} className="text-archive-accent flex items-center justify-center">
          <span className="material-symbols-outlined text-xl">arrow_back</span>
        </button>
        <div className="flex-1">
          <h1 className="text-xs font-bold tracking-[0.3em] uppercase opacity-70">Identity_Repository</h1>
          <p className="text-sm font-bold tracking-widest text-archive-accent uppercase">我的角色 / CREATED_ENTITIES</p>
        </div>
        <div className="text-[10px] text-archive-dim">ENTITIES: {characters.length}</div>
      </header>

      <main className="flex-1 p-6">
        <div className="grid grid-cols-2 gap-4">
          {characters.map((char) => (
            <div 
              key={char.id}
              onClick={() => onSelectCharacter(char)}
              className="group relative flex flex-col thin-border bg-archive-deep overflow-hidden cursor-pointer hover:border-archive-accent transition-all duration-500"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <div 
                  className="absolute inset-0 bg-center bg-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
                  style={{ backgroundImage: `url(${char.imageUrl})` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-archive-black via-transparent to-transparent opacity-60"></div>
                
                <div className="absolute top-2 left-2 text-[7px] font-bold text-white/50 bg-black/40 px-1 py-0.5 tracking-widest uppercase">
                  ID: {char.id.slice(-4)}
                </div>
              </div>

              <div className="p-3 space-y-2 bg-archive-black/80">
                <h3 className="text-xs font-bold tracking-widest text-archive-accent truncate uppercase">
                  {char.name}
                </h3>
                <div className="flex flex-wrap gap-1">
                  {char.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="text-[7px] px-1 border border-archive-dim text-archive-muted uppercase truncate">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="pt-2 flex items-center justify-between text-[8px] font-bold text-archive-dim uppercase tracking-tighter">
                  <span>Data_Stored</span>
                  <span className="material-symbols-outlined text-[12px] text-archive-accent">verified</span>
                </div>
              </div>

              <div className="absolute inset-0 border border-archive-accent opacity-0 group-hover:opacity-20 transition-opacity"></div>
            </div>
          ))}

          {/* New Character Placeholder Button */}
          <div 
            onClick={onAddCharacter}
            className="aspect-[3/4] thin-border border-dashed border-archive-dim flex flex-col items-center justify-center gap-3 opacity-40 hover:opacity-100 hover:border-archive-accent hover:text-archive-accent transition-all cursor-pointer bg-archive-deep/20"
          >
            <span className="material-symbols-outlined text-3xl">add</span>
            <span className="text-[9px] uppercase tracking-widest font-bold">New_Entity</span>
          </div>
        </div>
      </main>

      <footer className="p-10 text-center">
        <div className="w-1 h-1 bg-archive-accent mx-auto mb-4 animate-pulse shadow-[0_0_8px_#00A3FF]"></div>
        <div className="text-[8px] tracking-[0.6em] text-archive-dim uppercase">End_Of_Repository_Access</div>
      </footer>
    </div>
  );
};

export default MyCharactersView;
