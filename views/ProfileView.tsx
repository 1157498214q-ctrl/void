
import React, { useState } from 'react';
import { UserProfile } from '../types';

interface Props {
  userProfile: UserProfile;
  logsCount: number;
  wordCount: string;
  charactersCount: number;
  onBack: () => void;
  onLogout: () => void;
  onNavigateToCharacters: () => void;
  onNavigateToDrafts: () => void;
  onNavigateToSavedArchive: () => void;
  onNavigateToMyCharacters: () => void;
  onNavigateToSettings: () => void;
}

const ProfileView: React.FC<Props> = ({ 
  userProfile,
  logsCount,
  wordCount,
  charactersCount,
  onBack, 
  onLogout, 
  onNavigateToCharacters, 
  onNavigateToDrafts, 
  onNavigateToSavedArchive,
  onNavigateToMyCharacters,
  onNavigateToSettings
}) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  return (
    <div className="min-h-screen relative flex flex-col pb-20">
      <header className="flex items-center justify-between p-6 pb-4">
        {/* Removed Scanner Button */}
        <div className="w-10"></div> 
        <h1 className="font-header font-bold text-[11px] uppercase tracking-[0.4em] text-archive-text">个人中心</h1>
        <button onClick={onNavigateToSettings} className="text-archive-muted hover:text-archive-accent transition-colors w-10 flex justify-end">
          <span className="material-symbols-outlined text-[24px]">settings</span>
        </button>
      </header>

      <div className="flex flex-col items-center px-6 py-6">
        <div className="relative mb-8">
          <div className="absolute -inset-2 border border-archive-grey rounded-full opacity-50"></div>
          <div className="relative h-28 w-28 rounded-full overflow-hidden thin-border grayscale brightness-90">
            <img alt="Avatar" className="w-full h-full object-cover" src={userProfile.avatarUrl} />
          </div>
          <div className="absolute bottom-1 right-1 w-3 h-3 bg-archive-accent rounded-full ring-4 ring-archive-black shadow-[0_0_8px_#00A3FF]"></div>
        </div>
        <h2 className="font-header text-2xl font-bold tracking-[0.1em] text-archive-text mb-1 uppercase">{userProfile.name}</h2>
        <div className="mb-4">
          <span className="text-[10px] text-archive-muted tracking-[0.2em] font-header font-semibold uppercase">档案实体 // Archive_Entity</span>
        </div>
        <p className="text-archive-muted text-[12px] leading-relaxed text-center max-w-[280px] font-mono italic">
          "{userProfile.signature}"
        </p>
      </div>

      <div className="grid grid-cols-3 gap-0 px-6 mt-4">
        <div className="flex flex-col items-center justify-center py-4 thin-border border-r-0">
          <span className="text-archive-accent text-lg font-mono font-medium">{logsCount}</span>
          <span className="text-archive-muted text-[9px] uppercase font-header tracking-widest mt-1">档案 / Files</span>
        </div>
        <div className="flex flex-col items-center justify-center py-4 thin-border border-r-0">
          <span className="text-archive-accent text-lg font-mono font-medium">{wordCount}</span>
          <span className="text-archive-muted text-[9px] uppercase font-header tracking-widest mt-1">字数 / Chars</span>
        </div>
        <div 
          onClick={onNavigateToMyCharacters}
          className="flex flex-col items-center justify-center py-4 thin-border cursor-pointer hover:bg-archive-grey/20 transition-all active:bg-archive-grey/40"
        >
          <span className="text-archive-accent text-lg font-mono font-medium">{charactersCount}</span>
          <span className="text-archive-muted text-[9px] uppercase font-header tracking-widest mt-1">角色 / Roles</span>
        </div>
      </div>

      <div className="px-6 mt-10 space-y-3">
        <div 
          onClick={onNavigateToSavedArchive}
          className="group flex items-center justify-between px-5 py-5 thin-border bg-archive-black hover:bg-archive-grey/20 transition-all cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-archive-accent text-[20px]">folder_special</span>
            <span className="text-archive-text text-sm font-header tracking-[0.15em] uppercase">已存档案 / Saved Archive</span>
          </div>
          <span className="material-symbols-outlined text-archive-muted text-[18px]">chevron_right</span>
        </div>
        <div 
          onClick={onNavigateToDrafts}
          className="group flex items-center justify-between px-5 py-5 thin-border bg-archive-black hover:bg-archive-grey/20 transition-all cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-archive-accent text-[20px]">edit_note</span>
            <span className="text-archive-text text-sm font-header tracking-[0.15em] uppercase">草稿箱 / Drafts</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-archive-accent text-[10px] font-mono">[ ACTIVE ]</span>
            <span className="material-symbols-outlined text-archive-muted text-[18px]">chevron_right</span>
          </div>
        </div>
      </div>

      <div className="mt-auto px-6 pt-12 pb-12 flex flex-col items-center gap-8">
        <button 
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full h-14 thin-border bg-transparent text-archive-muted font-header text-xs uppercase tracking-[0.3em] hover:text-archive-text transition-all flex items-center justify-center gap-3"
        >
          <span className="material-symbols-outlined text-[20px]">power_settings_new</span>
          断开连接 / Disconnect Terminal
        </button>
        <div className="text-center opacity-60">
          <p className="text-[9px] text-archive-muted tracking-[0.4em] font-mono">VERSION 2.4.0_REV.82</p>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowLogoutConfirm(false)}></div>
          <div className="relative w-full max-w-[320px] bg-archive-deep thin-border border-archive-accent/30 p-8 animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="size-12 rounded-full border border-archive-accent/20 flex items-center justify-center text-archive-accent">
                <span className="material-symbols-outlined text-2xl animate-pulse">sensors_off</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-archive-text text-sm font-bold tracking-[0.2em] uppercase">确定断开连接？</h3>
                <p className="text-[10px] text-archive-dim tracking-[0.1em] leading-relaxed uppercase">
                  Terminal_Connection_Termination // Protocol_00
                </p>
              </div>
              <div className="w-full h-px bg-archive-grey"></div>
              <div className="grid grid-cols-2 gap-4 w-full">
                <button 
                  onClick={() => setShowLogoutConfirm(false)}
                  className="py-3 thin-border border-archive-grey text-archive-muted text-[10px] font-bold uppercase tracking-[0.2em] hover:text-archive-text transition-colors"
                >
                  取消 / CANCEL
                </button>
                <button 
                  onClick={onLogout}
                  className="py-3 bg-archive-accent text-black text-[10px] font-bold uppercase tracking-[0.2em] shadow-[0_0_15_rgba(0,163,255,0.2)]"
                >
                  确定 / CONFIRM
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto h-20 bg-archive-black border-t border-archive-grey flex items-center justify-around px-8 z-50">
        <button onClick={onBack} className="flex flex-col items-center gap-1.5 text-archive-muted hover:text-archive-text transition-colors">
          <span className="material-symbols-outlined text-[24px]">folder</span>
          <span className="text-[8px] font-header font-bold uppercase">归档</span>
        </button>
        <button onClick={onNavigateToCharacters} className="flex flex-col items-center gap-1.5 text-archive-muted hover:text-archive-text transition-colors">
          <span className="material-symbols-outlined text-[24px]">badge</span>
          <span className="text-[8px] font-header font-bold uppercase">角色库</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 text-archive-accent relative">
          <span className="material-symbols-outlined text-[24px]">contact_page</span>
          <span className="text-[8px] font-header font-bold uppercase">我的</span>
          <div className="absolute -top-1.5 w-1 h-1 bg-archive-accent rounded-full shadow-[0_0_8px_#00A3FF]"></div>
        </button>
      </nav>
    </div>
  );
};

export default ProfileView;
