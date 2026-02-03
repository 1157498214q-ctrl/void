
import React, { useState } from 'react';
import { signIn, signUp } from '../services/authService';

interface Props {
  onAccess: () => void;
}

const WelcomeView: React.FC<Props> = ({ onAccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (isLogin) {
        const { user, error } = await signIn(email, password);
        if (error) {
          setError(error);
        } else if (user) {
          onAccess();
        }
      } else {
        const { user, error } = await signUp(email, password, name || email.split('@')[0]);
        if (error) {
          setError(error);
        } else if (user) {
          setSuccessMessage('注册成功！请检查邮箱确认后登录。');
          setIsLogin(true);
        }
      }
    } catch (err) {
      setError('操作失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-between px-8 pt-24 pb-12 min-h-screen">
      <div className="flex flex-col items-center text-center">
        <div className="mb-8 opacity-60">
          <span className="material-symbols-outlined text-archive-accent text-4xl">
            auto_stories
          </span>
        </div>
        <h1 className="font-header text-archive-text text-4xl font-light uppercase tracking-[0.3em] leading-tight">
          Hello,<br />void
        </h1>
      </div>

      <div className="flex flex-col items-center text-center max-w-xs space-y-4">
        <p className="text-archive-accent text-sm leading-relaxed tracking-wider">
          {isLogin ? '[ ACCESSING ARCHIVE... ]' : '[ NEW USER REGISTRATION ]'}
        </p>
        <p className="text-archive-dim text-xs uppercase tracking-[0.15em] leading-loose">
          Where every character finds a voice, and every story finds a home.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-[280px] space-y-4">
        {!isLogin && (
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="昵称（可选）"
              className="w-full bg-transparent thin-border border-archive-grey h-12 px-4 text-archive-text text-sm tracking-wider focus:border-archive-accent focus:outline-none transition-colors placeholder:text-archive-dim"
            />
          </div>
        )}

        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="邮箱"
            required
            className="w-full bg-transparent thin-border border-archive-grey h-12 px-4 text-archive-text text-sm tracking-wider focus:border-archive-accent focus:outline-none transition-colors placeholder:text-archive-dim"
          />
        </div>

        <div className="relative">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="密码"
            required
            minLength={6}
            className="w-full bg-transparent thin-border border-archive-grey h-12 px-4 text-archive-text text-sm tracking-wider focus:border-archive-accent focus:outline-none transition-colors placeholder:text-archive-dim"
          />
        </div>

        {error && (
          <p className="text-red-400 text-xs text-center tracking-wider">
            {error}
          </p>
        )}

        {successMessage && (
          <p className="text-green-400 text-xs text-center tracking-wider">
            {successMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="group relative flex w-full cursor-pointer items-center justify-center bg-transparent thin-border border-archive-grey h-14 transition-all duration-300 hover:border-archive-accent disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="text-archive-accent text-sm font-light tracking-[0.5em] uppercase pl-2">
            {loading ? '处理中...' : (isLogin ? '接入终端' : '创建账户')}
          </span>
        </button>

        <div className="flex flex-col items-center pt-4">
          <div className="w-1 h-1 bg-archive-accent shadow-[0_0_8px_#00A3FF]"></div>
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
              setSuccessMessage(null);
            }}
            className="text-archive-dim hover:text-archive-text transition-colors text-[10px] tracking-[0.2em] uppercase underline-offset-8"
          >
            {isLogin ? '初来乍到？点我注册！' : '已有账户？返回登录'}
          </button>
        </div>
      </form>

      <div className="absolute top-6 left-6 w-4 h-4 border-l border-t border-archive-grey opacity-30"></div>
      <div className="absolute bottom-6 right-6 w-4 h-4 border-r border-b border-archive-grey opacity-30"></div>
    </div>
  );
};

export default WelcomeView;