
import React, { useState, useEffect } from 'react';
import { Character } from '../types';
import ImageUploader from '../components/ImageUploader';

interface Props {
  character: Character | null;
  onSave: (char: Character) => void;
  onSaveDraft: (char: Character) => void;
  onCancel: () => void;
}

const CharacterEditorView: React.FC<Props> = ({ character, onSave, onSaveDraft, onCancel }) => {
  const [formData, setFormData] = useState<Character>(character || {
    id: `char_temp_${Date.now()}`,
    name: '',
    title: '',
    tags: [],
    attributes: { height: '', age: '', alignment: '无', gender: '' },
    ability: '',
    stats: '力量：C\n速度：C\n耐久：C\n射程：C\n精密度：C\n成长性：C',
    trivia: [],
    introduction: '',
    imageUrl: 'https://picsum.photos/800/400?grayscale',
    isDraft: true
  });

  const [triviaInput, setTriviaInput] = useState(character?.trivia?.join('\n') || '');

  useEffect(() => {
    if (character) {
      setFormData(character);
      setTriviaInput(character.trivia?.join('\n') || '');
    }
  }, [character]);

  const handleTriviaChange = (val: string) => {
    setTriviaInput(val);
    const triviaArray = val.split('\n').filter(line => line.trim() !== '');
    setFormData({ ...formData, trivia: triviaArray });
  };

  const isFormValid = formData.name.trim().length > 0;

  const alignmentOptions = ["ASF", "黎明会", "结社", "RW", "CRUIS", "血色圣杯", "无"];

  return (
    <div className="min-h-screen pb-48 bg-archive-black">
      <nav className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-md z-[60] flex items-center justify-between px-6 h-14 bg-archive-black/90 backdrop-blur-md border-b border-archive-grey">
        <button onClick={onCancel} className="material-symbols-outlined text-archive-text text-xl leading-none">close</button>
        <div className="font-sans font-bold text-[10px] tracking-[0.4em] uppercase text-archive-text">
          {formData.name ? `Editing: ${formData.name}` : '档案录入 / NEW_ENTITY'}
        </div>
        <div className="w-5"></div>
      </nav>

      <header className="relative w-full aspect-video h-[20vh] mt-14 overflow-hidden border-b border-archive-grey group">
        <div
          className="absolute inset-0 bg-center bg-cover grayscale brightness-50 contrast-125 transition-all duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url(${formData.imageUrl})` }}
        ></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/40">
          <div className="text-[8px] text-archive-dim uppercase tracking-[0.5em] font-bold">封面图像 / COVER_IMAGE</div>
        </div>
      </header>

      {/* 图片上传区域 */}
      <div className="px-6 py-4 border-b border-archive-grey">
        <ImageUploader
          currentImageUrl={formData.imageUrl}
          onImageChange={(url) => setFormData({ ...formData, imageUrl: url })}
          folder="characters"
        />
      </div>

      <main className="px-6 py-10 space-y-12">
        <section className="space-y-8">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-bold text-archive-accent uppercase tracking-[0.25em]">01 / 角色姓名 (Required)</label>
            </div>
            <input
              className="w-full bg-transparent border-none border-b border-archive-grey focus:ring-0 focus:border-archive-accent text-archive-text text-2xl font-light tracking-tight transition-all placeholder:text-archive-dim/30"
              placeholder="请输入角色名..."
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="space-y-3">
            <label className="text-[11px] font-bold text-archive-text uppercase tracking-[0.25em]">02 / 称号/身份</label>
            <input
              className="w-full bg-transparent border-none border-b border-archive-grey focus:ring-0 focus:border-archive-accent text-archive-text text-sm transition-all placeholder:text-archive-dim/30"
              placeholder="例如：朴载弦的狂热男粉丝"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-[11px] font-bold text-archive-text uppercase tracking-[0.25em]">03 / 核心参数 // CORE_DATA</h3>
          <div className="grid grid-cols-2 gap-x-10 gap-y-8">
            <div className="space-y-2">
              <p className="text-[9px] text-archive-muted uppercase tracking-widest">身高 / Height</p>
              <input
                placeholder="180cm"
                className="w-full bg-transparent border-none border-b border-archive-grey focus:ring-0 focus:border-archive-accent text-archive-text text-sm transition-all placeholder:text-archive-dim/20"
                value={formData.attributes?.height}
                onChange={e => setFormData({ ...formData, attributes: { ...formData.attributes!, height: e.target.value } })}
              />
            </div>
            <div className="space-y-2">
              <p className="text-[9px] text-archive-muted uppercase tracking-widest">年龄 / Age</p>
              <input
                placeholder="24"
                className="w-full bg-transparent border-none border-b border-archive-grey focus:ring-0 focus:border-archive-accent text-archive-text text-sm transition-all placeholder:text-archive-dim/20"
                value={formData.attributes?.age}
                onChange={e => setFormData({ ...formData, attributes: { ...formData.attributes!, age: e.target.value } })}
              />
            </div>
            <div className="space-y-2">
              <p className="text-[9px] text-archive-muted uppercase tracking-widest">阵营 / Alignment</p>
              <select
                className="w-full bg-transparent border-none border-b border-archive-grey focus:ring-0 focus:border-archive-accent text-archive-text text-sm transition-all cursor-pointer appearance-none"
                value={formData.attributes?.alignment}
                onChange={e => setFormData({ ...formData, attributes: { ...formData.attributes!, alignment: e.target.value } })}
              >
                {alignmentOptions.map(opt => (
                  <option key={opt} value={opt} className="bg-archive-black text-archive-text">{opt}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <p className="text-[9px] text-archive-muted uppercase tracking-widest">性别 / Gender</p>
              <input
                placeholder="Male / Female"
                className="w-full bg-transparent border-none border-b border-archive-grey focus:ring-0 focus:border-archive-accent text-archive-text text-sm transition-all placeholder:text-archive-dim/20"
                value={formData.attributes?.gender}
                onChange={e => setFormData({ ...formData, attributes: { ...formData.attributes!, gender: e.target.value } })}
              />
            </div>
          </div>
        </section>

        {/* 04 - Bio Section moved up */}
        <section className="space-y-5">
          <h3 className="text-[11px] font-bold text-archive-text uppercase tracking-[0.25em]">04 / 档案简介 // BIO</h3>
          <textarea
            className="w-full min-h-[160px] bg-archive-deep/50 border border-archive-grey p-5 text-[13px] leading-relaxed focus:ring-0 focus:border-archive-accent text-archive-text resize-none font-mono placeholder:text-archive-dim/20"
            placeholder="请输入角色的背景故事、性格特征等详细信息..."
            value={formData.introduction}
            onChange={e => setFormData({ ...formData, introduction: e.target.value })}
          />
        </section>

        {/* 05 - Ability Section changed to textarea and moved below BIO */}
        <section className="space-y-5">
          <h3 className="text-[11px] font-bold text-archive-text uppercase tracking-[0.25em]">05 / 异能力 // SPECIAL_ABILITY</h3>
          <textarea
            className="w-full min-h-[120px] bg-archive-deep/50 border border-archive-grey p-5 text-[13px] leading-relaxed focus:ring-0 focus:border-archive-accent text-archive-accent resize-none font-mono placeholder:text-archive-accent/20 whitespace-pre-wrap"
            placeholder="输入该实体的核心能力或魔法体系..."
            value={formData.ability}
            onChange={e => setFormData({ ...formData, ability: e.target.value })}
          />
        </section>

        {/* 06 - Power Panel */}
        <section className="space-y-6">
          <h3 className="text-[11px] font-bold text-archive-text uppercase tracking-[0.25em]">06 / 面板参数 // POWER_PANEL</h3>
          <textarea
            className="w-full min-h-[120px] bg-archive-deep/50 border border-archive-grey p-5 text-[13px] leading-relaxed focus:ring-0 focus:border-archive-accent text-archive-accent resize-none font-mono placeholder:text-archive-accent/20"
            placeholder="输入面板数值，例如：&#10;力量：A&#10;速度：C"
            value={formData.stats}
            onChange={e => setFormData({ ...formData, stats: e.target.value })}
          />
        </section>

        <section className="space-y-5">
          <h3 className="text-[11px] font-bold text-archive-text uppercase tracking-[0.25em]">07 / 角色冷知识 // TRIVIA_LOG</h3>
          <textarea
            className="w-full min-h-[120px] bg-archive-deep/50 border border-archive-grey p-5 text-[12px] leading-relaxed focus:ring-0 focus:border-archive-accent text-archive-dim resize-none font-mono italic placeholder:text-archive-dim/20"
            placeholder="每行输入一条冷知识或趣味细节..."
            value={triviaInput}
            onChange={e => handleTriviaChange(e.target.value)}
          />
          <p className="text-[8px] text-archive-dim/60 uppercase tracking-widest italic">Tip: Use line breaks for multiple nodes</p>
        </section>
      </main>

      <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md p-6 bg-archive-black/95 backdrop-blur-2xl border-t border-archive-grey flex flex-col gap-4 z-[70]">
        <div className="flex gap-4">
          <button
            onClick={() => onSaveDraft(formData)}
            className="flex-1 py-4 border border-archive-grey text-archive-dim font-sans text-[10px] tracking-[0.4em] uppercase hover:bg-archive-grey/10 transition-colors"
          >
            保存草稿
          </button>
          <button
            onClick={() => onSave(formData)}
            disabled={!isFormValid}
            className={`flex-[2] py-4 font-sans font-bold text-[10px] tracking-[0.4em] uppercase transition-all shadow-[0_0_20px_rgba(0,163,255,0.1)] ${isFormValid ? 'bg-archive-accent text-black hover:brightness-110 active:scale-95' : 'bg-archive-dim text-archive-black cursor-not-allowed opacity-40'}`}
          >
            提交并公开发布
          </button>
        </div>
        {!isFormValid && (
          <p className="text-center text-[8px] text-red-900 font-bold uppercase tracking-widest animate-pulse">
            ERROR: REQUIRED_DATA_MISSING (CHARACTER_NAME)
          </p>
        )}
      </footer>
    </div>
  );
};

export default CharacterEditorView;
