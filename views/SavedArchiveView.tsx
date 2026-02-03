
import React from 'react';
import { ArchiveLog } from '../types';

interface Props {
  logs: ArchiveLog[];
  onSelectLog: (log: ArchiveLog) => void;
  onBack: () => void;
}

const SavedArchiveView: React.FC<Props> = ({ logs, onSelectLog, onBack }) => {
  return (
    <div className="min-h-screen bg-archive-black text-archive-text font-mono flex flex-col">
      <header className="sticky top-0 z-50 bg-archive-black/95 backdrop-blur-md border-b border-archive-grey px-6 py-5 flex items-center gap-4">
        <button onClick={onBack} className="text-archive-accent flex items-center justify-center">
          <span className="material-symbols-outlined text-xl">arrow_back</span>
        </button>
        <div className="flex-1">
          <h1 className="text-xs font-bold tracking-[0.3em] uppercase opacity-70">Archive_Deep_Storage</h1>
          <p className="text-sm font-bold tracking-widest text-archive-accent uppercase">已存档案 / SAVED_RECORDS</p>
        </div>
        <div className="text-[10px] text-archive-dim">TOTAL: {logs.length}</div>
      </header>

      <main className="flex-1 p-6 space-y-6">
        {logs.length > 0 ? (
          logs.map(log => (
            <div 
              key={log.id}
              onClick={() => onSelectLog(log)}
              className="group relative flex gap-4 thin-border p-4 bg-archive-deep cursor-pointer hover:border-archive-accent transition-all"
            >
              <div 
                className="w-16 h-24 flex-shrink-0 bg-center bg-cover border border-archive-grey/50" 
                style={{ backgroundImage: `url(${log.imageUrl})` }}
              ></div>
              <div className="flex flex-col justify-between flex-1">
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[8px] text-archive-accent uppercase tracking-widest px-1 border border-archive-accent/30">Stored</span>
                    <span className="text-[8px] text-archive-dim uppercase">{log.timestamp}</span>
                  </div>
                  <h3 className="text-sm font-bold tracking-widest text-archive-text group-hover:text-archive-accent transition-colors truncate">
                    {log.title}
                  </h3>
                  <p className="text-[10px] text-archive-dim line-clamp-2 mt-1 italic">
                    {log.summary}
                  </p>
                </div>
                <div className="flex items-center justify-end text-[10px] text-archive-accent font-bold uppercase gap-1">
                  Read_Entry <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-40 flex flex-col items-center justify-center text-center opacity-20">
            <span className="material-symbols-outlined text-5xl mb-4 font-light">star</span>
            <p className="text-[10px] uppercase tracking-[0.4em]">No starred records in sector_04</p>
          </div>
        )}
      </main>

      <footer className="p-8 text-center opacity-10">
        <div className="text-[9px] tracking-[0.8em] uppercase">VOID_STASIS_PROTOCOL</div>
      </footer>
    </div>
  );
};

export default SavedArchiveView;
