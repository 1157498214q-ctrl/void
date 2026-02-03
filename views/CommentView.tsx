
import React, { useState, useRef } from 'react';
import { ArchiveLog, UserProfile, Comment } from '../types';

interface Props {
  log: ArchiveLog;
  userProfile: UserProfile;
  onBack: () => void;
  onAddComment: (comment: Comment) => void;
  onDeleteComment?: (commentId: string) => void;
}

const CommentView: React.FC<Props> = ({ log, userProfile, onBack, onAddComment, onDeleteComment }) => {
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment: Comment = {
      id: `comm_${Date.now()}`,
      userName: userProfile.name,
      userAvatar: userProfile.avatarUrl,
      timestamp: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: commentText.trim(),
      parentId: replyingTo?.id,
      replyToName: replyingTo?.userName
    };

    onAddComment(newComment);
    setCommentText('');
    setReplyingTo(null);
  };

  const handleReplyClick = (comment: Comment) => {
    setReplyingTo(comment);
    inputRef.current?.focus();
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  const handleDeleteClick = (commentId: string) => {
    if (window.confirm("确定删除此评论吗？")) {
      onDeleteComment?.(commentId);
    }
  };

  return (
    <div className="min-h-screen bg-archive-black flex flex-col">
      <header className="sticky top-0 z-50 bg-archive-black/95 backdrop-blur-md border-b border-archive-grey pt-10 pb-4 px-6">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-archive-accent">
            <span className="material-symbols-outlined text-xl">arrow_back</span>
          </button>
          <div className="flex-1">
            <h1 className="text-[9px] font-bold tracking-[0.3em] uppercase opacity-50">Transmission_Feedback // 评论</h1>
            <p className="text-xs font-bold tracking-widest text-archive-accent uppercase truncate max-w-[200px]">{log.title}</p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8 pb-40">
        {(log.comments && log.comments.length > 0) ? (
          log.comments.map((comment) => (
            <div key={comment.id} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="flex items-start gap-4">
                <div className="size-10 thin-border overflow-hidden grayscale brightness-75 bg-archive-deep">
                  <img src={comment.userAvatar} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-end mb-1">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-archive-accent uppercase tracking-widest">{comment.userName}</span>
                      {comment.replyToName && (
                        <div className="flex items-center gap-1 text-[8px] text-archive-muted uppercase tracking-widest italic font-bold">
                          <span className="material-symbols-outlined !text-[10px]">reply</span>
                          Replying to @{comment.replyToName}
                        </div>
                      )}
                    </div>
                    <span className="text-[8px] text-archive-dim font-mono">{comment.timestamp}</span>
                  </div>
                  <div className="group relative p-3 thin-border border-archive-grey/40 bg-archive-deep/20 hover:border-archive-accent/30 transition-colors">
                    <p className="text-sm text-archive-text/80 leading-relaxed italic font-mono whitespace-pre-wrap">
                      {comment.content}
                    </p>
                    
                    {/* Action Bar */}
                    <div className="mt-3 flex gap-4 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleReplyClick(comment)}
                        className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-archive-dim hover:text-archive-accent"
                      >
                        <span className="material-symbols-outlined !text-sm">chat_bubble_outline</span>
                        Reply
                      </button>
                      {comment.userName === userProfile.name && (
                        <button 
                          onClick={() => handleDeleteClick(comment.id)}
                          className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-archive-dim hover:text-red-500"
                        >
                          <span className="material-symbols-outlined !text-sm">delete</span>
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-40 flex flex-col items-center justify-center text-center opacity-30 space-y-4">
            <span className="material-symbols-outlined text-4xl">chat_bubble_outline</span>
            <p className="text-[10px] uppercase tracking-[0.4em] font-mono">No synchronization nodes detected in this sector</p>
          </div>
        )}
      </main>

      {/* Input Area */}
      <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md p-6 bg-archive-black/90 backdrop-blur-xl border-t border-archive-grey z-50">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Reply Preview */}
          {replyingTo && (
            <div className="flex items-center justify-between px-3 py-2 bg-archive-accent/10 thin-border border-archive-accent/30 animate-in slide-in-from-bottom-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined !text-sm text-archive-accent">reply</span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-archive-accent">
                  Replying_To: @{replyingTo.userName}
                </span>
              </div>
              <button onClick={handleCancelReply} className="text-archive-accent/60 hover:text-archive-accent">
                <span className="material-symbols-outlined !text-sm">close</span>
              </button>
            </div>
          )}
          
          <div className="relative thin-border border-archive-accent/30 bg-archive-accent/5 focus-within:border-archive-accent transition-all p-3">
            <textarea 
              ref={inputRef}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={replyingTo ? "Compose reply..." : "Input response stream... (在此输入评论)"}
              className="w-full bg-transparent border-none focus:ring-0 text-sm text-archive-text placeholder:text-archive-dim/50 resize-none h-20 font-mono italic"
            />
            <div className="absolute top-1 right-2 text-[7px] text-archive-accent font-bold uppercase tracking-widest opacity-40">Direct_Link</div>
          </div>
          <button 
            type="submit"
            disabled={!commentText.trim()}
            className={`w-full h-12 flex items-center justify-center gap-3 font-bold uppercase tracking-[0.4em] text-[11px] transition-all ${commentText.trim() ? 'bg-archive-accent text-black shadow-[0_0_15px_rgba(0,163,255,0.2)]' : 'bg-archive-dim text-archive-black opacity-40 cursor-not-allowed'}`}
          >
            <span className="material-symbols-outlined text-lg">terminal</span>
            {replyingTo ? 'Push_Reply' : 'Send_Response'}
          </button>
        </form>
      </footer>
    </div>
  );
};

export default CommentView;
