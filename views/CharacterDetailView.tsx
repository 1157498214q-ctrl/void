
import React from 'react';
import { Character } from '../types';

interface Props {
  character: Character;
  onBack: () => void;
  onEdit: () => void;
  onStartLog: () => void;
}

const CharacterDetailView: React.FC<Props> = ({ character, onBack, onEdit, onStartLog }) => {
  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-md z-[60] flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
        <button onClick={onBack} className="flex items-center justify-center size-10 thin-border bg-black/40 text-archive-text">
          <span className="material-symbols-outlined text-[20px]">arrow_back_ios_new</span>
        </button>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="flex items-center gap-2 px-4 py-2 thin-border bg-black/40 text-archive-text"
          >
            <span className="material-symbols-outlined text-sm">edit</span>
            <span className="text-[11px] font-sans font-bold uppercase tracking-wider">Edit</span>
          </button>
        </div>
      </nav>

      <header className="w-full h-[240px] relative overflow-hidden thin-border border-x-0 border-t-0">
        <div
          className="absolute inset-0 bg-center bg-cover grayscale hover:grayscale-0 transition-all duration-700"
          style={{ backgroundImage: `url(${character.imageUrl})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-archive-black via-archive-black/20 to-transparent"></div>
        <div className="absolute bottom-4 left-4 flex items-center gap-2">
          <div className="size-2 bg-archive-accent animate-pulse"></div>
          <span className="text-[10px] font-sans font-bold text-archive-accent tracking-[0.2em] uppercase">System Live</span>
        </div>
      </header>

      <section className="p-6 bg-archive-black thin-border border-x-0 border-t-0">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-sans font-bold tracking-tight text-archive-text uppercase">{character.name}</h1>
            <div className="h-[1px] flex-grow bg-archive-grey"></div>
          </div>
          <p className="text-archive-accent text-xs font-medium uppercase tracking-wider">{character.title}</p>
        </div>
        <div className="flex gap-2 mt-4 flex-wrap">
          {character.tags.map(tag => (
            <span key={tag} className="px-2 py-1 thin-border text-[9px] text-archive-dim uppercase tracking-widest font-bold">{tag}</span>
          ))}
        </div>
      </section>

      <main className="p-6 space-y-12 pb-48">
        <section>
          <h3 className="text-[10px] font-sans font-bold text-archive-dim uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
            <span className="w-1 h-3 bg-archive-accent"></span> Core Attributes
          </h3>
          <div className="grid grid-cols-2 gap-[1px] bg-archive-grey thin-border">
            <div className="p-4 bg-archive-black flex flex-col gap-1">
              <p className="text-[9px] text-archive-dim uppercase tracking-wider">Height</p>
              <p className="text-archive-text text-base font-medium">{character.attributes.height || '---'}</p>
            </div>
            <div className="p-4 bg-archive-black flex flex-col gap-1">
              <p className="text-[9px] text-archive-dim uppercase tracking-wider">Age</p>
              <p className="text-archive-text text-base font-medium">{character.attributes.age || '--'}<span className="text-[10px] ml-1 text-archive-accent">YR</span></p>
            </div>
            <div className="p-4 bg-archive-black flex flex-col gap-1">
              <p className="text-[9px] text-archive-dim uppercase tracking-wider">Alignment</p>
              <p className="text-archive-text text-base font-medium">{character.attributes.alignment || '无'}</p>
            </div>
            <div className="p-4 bg-archive-black flex flex-col gap-1">
              <p className="text-[9px] text-archive-dim uppercase tracking-wider">Gender</p>
              <p className="text-archive-text text-base font-medium">{character.attributes.gender || 'Unknown'}</p>
            </div>
          </div>
        </section>

        {/* Introduction Section (Bio) */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[10px] font-sans font-bold text-archive-dim uppercase tracking-[0.3em] flex items-center gap-2">
              <span className="w-1 h-3 bg-archive-accent"></span> Introduction
            </h3>
          </div>
          <div className="space-y-4 text-[13px] leading-relaxed text-archive-text/80 font-mono">
            <p className="whitespace-pre-wrap">{character.introduction}</p>
            {character.quote && (
              <p className="border-l border-archive-accent/30 pl-4 italic text-archive-dim whitespace-pre-wrap">
                "{character.quote}"
              </p>
            )}
          </div>
        </section>

        {/* Ability Section */}
        {character.ability && character.ability.trim() !== '' && (
          <section>
            <h3 className="text-[10px] font-sans font-bold text-archive-dim uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
              <span className="w-1 h-3 bg-archive-accent"></span> Special Ability
            </h3>
            <div className="p-4 thin-border border-archive-accent/20 bg-archive-accent/5">
              <p className="text-archive-accent text-sm font-bold tracking-widest uppercase italic whitespace-pre-wrap leading-relaxed">{character.ability}</p>
            </div>
          </section>
        )}

        {/* Stats Panel Section */}
        {character.stats && character.stats.trim() !== '' && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[10px] font-sans font-bold text-archive-dim uppercase tracking-[0.3em] flex items-center gap-2">
                <span className="w-1 h-3 bg-archive-accent"></span> Power Panel
              </h3>
              <div className="h-[1px] flex-grow ml-4 bg-archive-grey"></div>
            </div>
            <div className="p-5 thin-border border-archive-grey bg-archive-deep/40 relative">
              <div className="absolute top-0 right-0 p-2 text-[8px] font-bold text-archive-dim opacity-40 font-mono">NODE_07 / STASIS</div>
              <pre className="text-archive-accent text-xs font-mono whitespace-pre-wrap leading-[2.2] uppercase tracking-widest">{character.stats}</pre>
            </div>
          </section>
        )}

        {/* Trivia Log Section */}
        {character.trivia && character.trivia.length > 0 && (
          <section>
            <h3 className="text-[10px] font-sans font-bold text-archive-dim uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
              <span className="w-1 h-3 bg-archive-accent"></span> Trivia Nodes
            </h3>
            <div className="space-y-4">
              {character.trivia.map((item, i) => (
                <div key={i} className="flex gap-4 items-start group">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-mono text-archive-accent mt-1 tracking-tighter">[{String(i + 1).padStart(2, '0')}]</span>
                    <div className="w-[1px] flex-grow bg-archive-grey mt-2"></div>
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="text-[12px] text-archive-dim italic leading-relaxed font-mono whitespace-pre-wrap group-hover:text-archive-text transition-colors">{item}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-[70] bg-archive-black/90 backdrop-blur-xl border-t border-archive-grey p-4 px-6 pb-8">
        <button
          onClick={onStartLog}
          className="w-full bg-archive-accent text-archive-black font-sans font-bold py-4 text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(0,163,255,0.2)]"
        >
          <span className="material-symbols-outlined text-[18px]">add_box</span>
          <span>Initialize New Log</span>
        </button>
      </div>
    </div>
  );
};

export default CharacterDetailView;
