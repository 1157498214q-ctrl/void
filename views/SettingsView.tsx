
import React, { useState } from 'react';
import { UserProfile } from '../types';
import ImageUploader from '../components/ImageUploader';

interface Props {
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
  onBack: () => void;
}

const SettingsView: React.FC<Props> = ({ profile, onSave, onBack }) => {
  const [formData, setFormData] = useState<UserProfile>({ ...profile });

  return (
    <div className="min-h-screen bg-archive-black text-archive-text font-mono flex flex-col">
      <header className="sticky top-0 z-50 bg-archive-black/95 backdrop-blur-md border-b border-archive-grey px-6 py-5 flex items-center gap-4">
        <button onClick={onBack} className="text-archive-accent flex items-center justify-center">
          <span className="material-symbols-outlined text-xl">arrow_back</span>
        </button>
        <div className="flex-1">
          <h1 className="text-xs font-bold tracking-[0.3em] uppercase opacity-70">Terminal_Config</h1>
          <p className="text-sm font-bold tracking-widest text-archive-accent uppercase">设置 / SETTINGS</p>
        </div>
      </header>

      <main className="flex-1 p-6 space-y-10">
        {/* 头像上传区域 */}
        <div className="space-y-4">
          <label className="text-[9px] text-archive-dim uppercase tracking-[0.3em] block font-bold">Avatar_Image / 头像</label>
          <div className="flex items-start gap-4">
            <div className="size-20 rounded-full overflow-hidden thin-border border-archive-accent/50 grayscale brightness-90 shrink-0">
              <img
                src={formData.avatarUrl}
                alt="Avatar Preview"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <ImageUploader
                currentImageUrl={formData.avatarUrl}
                onImageChange={(url) => setFormData({ ...formData, avatarUrl: url })}
                folder="avatars"
              />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Theme Switch Section */}
          <div className="space-y-4">
            <label className="text-[9px] text-archive-dim uppercase tracking-[0.3em] block mb-2 font-bold">Display_Mode / 界面模式</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setFormData({ ...formData, theme: 'light' })}
                className={`group flex flex-col items-center gap-3 py-6 thin-border transition-all duration-300 ${formData.theme === 'light' ? 'bg-archive-text text-archive-black border-archive-text' : 'bg-archive-deep text-archive-dim hover:border-archive-muted'}`}
              >
                <span className="material-symbols-outlined text-2xl">light_mode</span>
                <div className="text-center">
                  <p className="text-[10px] font-bold uppercase tracking-widest">白天模式</p>
                  <p className="text-[8px] opacity-40 mt-1 uppercase">High_Contrast</p>
                </div>
              </button>
              <button
                onClick={() => setFormData({ ...formData, theme: 'dark' })}
                className={`group flex flex-col items-center gap-3 py-6 thin-border transition-all duration-300 ${formData.theme === 'dark' ? 'border-archive-accent bg-archive-accent/10 text-archive-accent' : 'bg-archive-deep text-archive-dim hover:border-archive-muted'}`}
              >
                <span className="material-symbols-outlined text-2xl">dark_mode</span>
                <div className="text-center">
                  <p className="text-[10px] font-bold uppercase tracking-widest">黑夜模式</p>
                  <p className="text-[8px] opacity-40 mt-1 uppercase">Atmospheric</p>
                </div>
              </button>
            </div>
          </div>

          <div>
            <label className="text-[9px] text-archive-dim uppercase tracking-[0.3em] block mb-2 font-bold">Identity_Label / 昵称</label>
            <input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-archive-deep thin-border border-archive-grey p-4 text-sm focus:ring-1 focus:ring-archive-accent transition-all uppercase tracking-widest font-bold"
            />
          </div>

          <div>
            <label className="text-[9px] text-archive-dim uppercase tracking-[0.3em] block mb-2 font-bold">Personal_Directive / 签名</label>
            <textarea
              value={formData.signature}
              onChange={(e) => setFormData({ ...formData, signature: e.target.value })}
              className="w-full h-24 bg-archive-deep thin-border border-archive-grey p-4 text-sm focus:ring-1 focus:ring-archive-accent transition-all italic leading-relaxed resize-none"
              placeholder="Enter your personal directive..."
            />
          </div>
        </div>

        <div className="pt-10 space-y-4">
          <div className="flex items-center gap-4 text-[9px] text-archive-dim uppercase tracking-widest border-t border-archive-grey/30 pt-4">
            <span className="material-symbols-outlined text-sm">security</span>
            Secure Data Channel: Active
          </div>
          <div className="flex items-center gap-4 text-[9px] text-archive-dim uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm">storage</span>
            Cache Integrity: Valid
          </div>
        </div>
      </main>

      <footer className="sticky bottom-0 bg-archive-black/90 backdrop-blur-md p-6 border-t border-archive-grey">
        <button
          onClick={() => onSave(formData)}
          className="w-full h-14 bg-archive-accent text-black font-bold text-xs uppercase tracking-[0.4em] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-[0_0_15px_rgba(0,163,255,0.2)]"
        >
          <span className="material-symbols-outlined text-xl">done_all</span>
          应用更改 / APPLY_CHANGES
        </button>
      </footer>
    </div>
  );
};

export default SettingsView;
