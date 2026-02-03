
import React, { useState, useEffect } from 'react';
import { ArchiveLog } from '../types';

interface Props {
  log: ArchiveLog;
  onBack: () => void;
  onToggleFavorite?: () => void;
  onOpenComments?: () => void;
}

const LogDetailView: React.FC<Props> = ({ log, onBack, onToggleFavorite, onOpenComments }) => {
  const [showTOC, setShowTOC] = useState(false);
  const [isUIHidden, setIsUIHidden] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = window.pageYOffset || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? Math.min(100, Math.max(0, Math.round((winScroll / height) * 100))) : 100;
      setScrollProgress(scrolled);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const chapters = log.entries?.filter(e => e.role === 'CHAPTER') || [];

  const scrollToChapter = (idx: number) => {
    setShowTOC(false);
    const elements = document.querySelectorAll(`[data-chapter-idx="${idx}"]`);
    if (elements.length > 0) {
      elements[0].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const toggleUI = () => {
    if (showMoreMenu) {
      setShowMoreMenu(false);
      return;
    }
    setIsUIHidden(!isUIHidden);
  };

  return (
    <div
      className="min-h-screen pb-40 bg-archive-black relative overflow-x-hidden"
      onClick={toggleUI}
    >
      {/* TOC Panel */}
      {showTOC && (
        <div
          className="fixed inset-0 z-[100] animate-in fade-in duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setShowTOC(false)}></div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-archive-deep thin-border border-x-0 p-8 space-y-8 animate-in slide-in-from-bottom duration-300 rounded-t-3xl border-t border-archive-accent/20">
            <div className="flex items-center justify-between">
              <h2 className="text-[10px] font-bold text-archive-accent tracking-[0.5em] uppercase">Archive_Index // 目录</h2>
              <button onClick={() => setShowTOC(false)} className="text-archive-muted hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto space-y-6 no-scrollbar pr-2 pb-10">
              {chapters.length > 0 ? chapters.map((chap, idx) => (
                <div
                  key={idx}
                  onClick={() => scrollToChapter(idx)}
                  className="group flex items-start gap-6 cursor-pointer hover:bg-archive-accent/5 p-3 -mx-3 transition-colors"
                >
                  <div className="text-[10px] font-mono text-archive-dim group-hover:text-archive-accent transition-colors">0{idx + 1}</div>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-archive-text uppercase tracking-widest group-hover:text-archive-accent transition-colors leading-relaxed">{chap.content}</div>
                    <div className="mt-1 h-[1px] w-0 group-hover:w-full bg-archive-accent transition-all duration-500 opacity-30"></div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-10 opacity-30 text-[10px] uppercase tracking-widest">No structural nodes detected</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header
        className={`fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 px-6 pt-10 pb-6 bg-archive-black/80 backdrop-blur-xl border-b border-archive-grey/10 transition-transform duration-500 ease-in-out ${isUIHidden ? '-translate-y-full' : 'translate-y-0'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between relative">
          <button
            onClick={onBack}
            className="flex items-center justify-center size-10 -ml-2 text-archive-accent hover:brightness-125 transition-all active:scale-90"
          >
            <span className="material-symbols-outlined !text-xl">arrow_back_ios_new</span>
          </button>

          <div className="text-center flex-1 mx-2">
            <h1 className="text-[8px] uppercase text-archive-dim mb-0.5 tracking-[0.4em] font-bold">Data_Stream_Link</h1>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase truncate max-w-[180px] text-archive-accent">{log.title}</p>
          </div>

          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className={`flex items-center justify-center size-10 -mr-2 transition-colors ${showMoreMenu ? 'text-archive-accent' : 'text-archive-dim hover:text-archive-text'}`}
          >
            <span className="material-symbols-outlined !text-xl">more_vert</span>
          </button>

          {/* More Actions Menu */}
          {showMoreMenu && (
            <div className="absolute top-12 right-0 w-48 bg-archive-deep thin-border border-archive-accent/20 shadow-2xl animate-in zoom-in-95 duration-200 z-[60]">
              <button
                onClick={(e) => { e.stopPropagation(); onToggleFavorite?.(); setShowMoreMenu(false); }}
                className="w-full flex items-center gap-3 px-4 py-4 text-xs font-bold uppercase tracking-widest text-archive-text hover:bg-archive-accent/10 transition-colors"
              >
                <span className={`material-symbols-outlined !text-[18px] ${log.isFavorite ? 'text-archive-accent fill-1' : 'text-archive-dim'}`}>
                  {log.isFavorite ? 'star' : 'star_outline'}
                </span>
                {log.isFavorite ? 'Unfavorite' : 'Favorite'}
              </button>
              <div className="h-[1px] w-full bg-archive-grey/50"></div>
              <button
                onClick={(e) => { e.stopPropagation(); onOpenComments?.(); setShowMoreMenu(false); }}
                className="w-full flex items-center gap-3 px-4 py-4 text-xs font-bold uppercase tracking-widest text-archive-text hover:bg-archive-accent/10 transition-colors"
              >
                <span className="material-symbols-outlined !text-[18px] text-archive-dim">forum</span>
                Comments
              </button>
            </div>
          )}
        </div>
        <div className="absolute bottom-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-archive-accent/30 to-transparent opacity-50"></div>
      </header>

      <main className="px-6 pt-36 space-y-16">
        <section className="text-center mb-12">
          <div className="inline-block mb-6">
            <div className="thin-border px-4 py-1 text-[10px] uppercase tracking-widest text-archive-accent/80 bg-archive-accent/5">
              {log.status === 'Finished' ? 'Completed Record' : 'Serial Record'}
            </div>
          </div>
          <h2 className="text-3xl font-light tracking-widest mb-8 uppercase text-archive-text leading-tight px-4">{log.title}</h2>
          <div className="flex items-center justify-center gap-6 text-[10px] text-archive-dim uppercase tracking-widest font-mono">
            <span className="flex items-center gap-1.5"><span className="w-1 h-1 bg-archive-accent rounded-full"></span> {log.wordCount} 字</span>
            <span className="flex items-center gap-1.5"><span className="w-1 h-1 bg-archive-accent rounded-full"></span> {log.timestamp}</span>
          </div>
        </section>

        <article className="max-w-2xl mx-auto space-y-10">
          <div className="bg-archive-deep/40 p-6 thin-border border-dashed border-archive-grey mb-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-archive-accent opacity-20"></div>
            <div className="text-[9px] text-archive-accent uppercase font-bold tracking-[0.3em] mb-3">System Narration // 简介</div>
            <p className="text-[14px] leading-relaxed text-archive-text/70 italic font-mono whitespace-pre-wrap">
              {log.summary}
            </p>
          </div>

          <div className="space-y-12">
            {log.entries && log.entries.length > 0 ? (
              (() => {
                let chapterIdx = 0;
                return log.entries.map((entry, idx) => {
                  if (entry.role === 'CHAPTER') {
                    const currentIdx = chapterIdx++;
                    return (
                      <div key={idx} data-chapter-idx={currentIdx} className="flex flex-col items-center py-16 scroll-mt-32">
                        <div className="w-16 h-px bg-archive-accent/40 mb-6"></div>
                        <h3 className="text-lg font-bold tracking-[0.4em] uppercase text-archive-accent text-center px-4 leading-relaxed whitespace-pre-wrap">
                          {entry.content}
                        </h3>
                        <div className="mt-4 flex gap-2">
                          <div className="w-1 h-1 bg-archive-dim rounded-full"></div>
                          <div className="w-1 h-1 bg-archive-accent rounded-full animate-pulse"></div>
                          <div className="w-1 h-1 bg-archive-dim rounded-full"></div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={idx} className="animate-in fade-in duration-1000">
                      {entry.role === 'NAR' ? (
                        <div className="bg-archive-accent/5 thin-border border-archive-accent/20 p-5 relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-2 text-[8px] font-bold text-archive-accent/40 font-mono">TYPE: NAR</div>
                          <p className="text-archive-accent text-sm leading-[1.8] tracking-wide font-medium whitespace-pre-wrap">
                            {entry.content}
                          </p>
                        </div>
                      ) : (
                        <div className="pl-4 border-l-2 border-archive-grey/50">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="size-7 thin-border p-0.5 overflow-hidden bg-archive-black">
                              <img
                                src={entry.avatarUrl || 'https://picsum.photos/100/100?grayscale'}
                                alt=""
                                className="w-full h-full object-cover grayscale opacity-60"
                              />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[11px] font-bold text-archive-text uppercase tracking-widest">{entry.role}</span>
                              <span className="text-[8px] text-archive-dim font-bold font-mono">{entry.timestamp}</span>
                            </div>
                          </div>
                          <p className="text-[14px] leading-loose text-archive-text/90 pl-1 font-mono whitespace-pre-wrap">
                            {entry.content}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                });
              })()
            ) : (
              <div className="py-20 text-center space-y-4 opacity-40">
                <span className="material-symbols-outlined text-4xl">folder_zip</span>
                <p className="text-[10px] uppercase tracking-[0.4em] font-mono">No detailed interaction logs recovered</p>
              </div>
            )}
          </div>

          <footer className="text-center pb-20 pt-10">
            <div className="w-1.5 h-1.5 bg-archive-accent/40 mx-auto mb-10 rounded-full animate-pulse"></div>
            <p className="text-[10px] text-white/20 tracking-[0.3em] uppercase font-mono">End of available transmission data</p>
          </footer>
        </article>
      </main>

      {/* Bottom Nav */}
      <nav
        className={`fixed bottom-10 left-1/2 -translate-x-1/2 w-[92%] max-sm:w-[92%] max-w-sm z-50 transition-transform duration-500 ease-in-out ${isUIHidden ? 'translate-y-[200%]' : 'translate-y-0'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-archive-deep/80 backdrop-blur-md thin-border rounded-none py-4 px-6 flex items-center justify-between shadow-2xl">
          <button
            onClick={() => setShowTOC(true)}
            className={`flex flex-col items-center gap-1 transition-colors ${showTOC ? 'text-archive-accent' : 'text-white/40 hover:text-archive-accent'}`}
          >
            <span className="material-symbols-outlined !text-xl">list_alt</span>
            <span className="text-[9px] uppercase font-bold">目录</span>
          </button>
          <div className="flex-1 px-8">
            <div className="flex justify-between items-end mb-2 text-[9px] text-white/30 uppercase tracking-widest font-mono">
              <span>Read_Progress</span>
              <span className="text-archive-accent">{scrollProgress}%</span>
            </div>
            <div className="w-full bg-archive-grey h-[1px]">
              <div
                className="bg-archive-accent h-[1px] shadow-[0_0_8px_#00A3FF] transition-all duration-300 ease-out"
                style={{ width: `${scrollProgress}%` }}
              ></div>
            </div>
          </div>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex flex-col items-center gap-1 text-white/40 hover:text-archive-accent transition-colors"
          >
            <span className="material-symbols-outlined !text-xl">vertical_align_top</span>
            <span className="text-[9px] uppercase font-bold">回顶</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default LogDetailView;
