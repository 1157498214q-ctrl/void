
import React, { useState, useMemo } from 'react';
import { ArchiveLog } from '../types';

interface Props {
    logs: ArchiveLog[];
    onSelectLog: (log: ArchiveLog) => void;
    onBack: () => void;
}

const AllLogsView: React.FC<Props> = ({ logs, onSelectLog, onBack }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'date' | 'title' | 'words'>('date');

    // 过滤和排序日志
    const filteredLogs = useMemo(() => {
        let result = logs.filter(log => log.status !== 'Standby');

        // 搜索过滤
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(log =>
                log.title.toLowerCase().includes(query) ||
                log.summary.toLowerCase().includes(query) ||
                log.participants.some(p => p.toLowerCase().includes(query))
            );
        }

        // 排序
        result.sort((a, b) => {
            switch (sortBy) {
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'words':
                    const wordsA = parseInt(a.wordCount.replace(/,/g, '')) || 0;
                    const wordsB = parseInt(b.wordCount.replace(/,/g, '')) || 0;
                    return wordsB - wordsA;
                case 'date':
                default:
                    return b.timestamp.localeCompare(a.timestamp);
            }
        });

        return result;
    }, [logs, searchQuery, sortBy]);

    // 按状态分组
    const ongoingLogs = filteredLogs.filter(l => l.status === 'Ongoing');
    const finishedLogs = filteredLogs.filter(l => l.status === 'Finished');

    return (
        <div className="min-h-screen bg-archive-black text-archive-text font-mono">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-archive-black/95 backdrop-blur-md border-b border-archive-grey px-6 py-5">
                <div className="flex items-center gap-4 mb-4">
                    <button onClick={onBack} className="text-archive-accent flex items-center justify-center">
                        <span className="material-symbols-outlined text-xl">arrow_back</span>
                    </button>
                    <div className="flex-1">
                        <h1 className="text-xs font-bold tracking-[0.3em] uppercase opacity-70">Archive_Index</h1>
                        <p className="text-sm font-bold tracking-widest text-archive-accent uppercase">全部戏录 / ALL LOGS</p>
                    </div>
                    <div className="text-[10px] text-archive-dim uppercase tracking-widest">
                        共 {filteredLogs.length} 条
                    </div>
                </div>

                {/* 搜索和排序 */}
                <div className="flex gap-3">
                    <div className="flex-1 relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-archive-dim text-lg">search</span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="搜索标题、简介或参与者..."
                            className="w-full bg-archive-deep thin-border border-archive-grey pl-10 pr-4 py-3 text-xs focus:border-archive-accent/50 focus:ring-0 transition-colors"
                        />
                    </div>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as 'date' | 'title' | 'words')}
                        className="bg-archive-deep thin-border border-archive-grey px-4 py-2 text-xs uppercase tracking-widest focus:border-archive-accent/50 focus:ring-0"
                    >
                        <option value="date">按时间</option>
                        <option value="title">按标题</option>
                        <option value="words">按字数</option>
                    </select>
                </div>
            </header>

            {/* 内容区域 */}
            <main className="p-6 space-y-8 pb-20">
                {/* 连载中 */}
                {ongoingLogs.length > 0 && (
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-2 h-2 bg-archive-accent rounded-full animate-pulse"></div>
                            <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-archive-accent">
                                连载中 / ONGOING ({ongoingLogs.length})
                            </h2>
                            <div className="flex-1 h-px bg-archive-grey/30"></div>
                        </div>
                        <div className="space-y-2">
                            {ongoingLogs.map(log => (
                                <LogItem key={log.id} log={log} onClick={() => onSelectLog(log)} />
                            ))}
                        </div>
                    </section>
                )}

                {/* 已完结 */}
                {finishedLogs.length > 0 && (
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-2 h-2 bg-archive-dim rounded-full"></div>
                            <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-archive-dim">
                                已完结 / FINISHED ({finishedLogs.length})
                            </h2>
                            <div className="flex-1 h-px bg-archive-grey/30"></div>
                        </div>
                        <div className="space-y-2">
                            {finishedLogs.map(log => (
                                <LogItem key={log.id} log={log} onClick={() => onSelectLog(log)} />
                            ))}
                        </div>
                    </section>
                )}

                {/* 空状态 */}
                {filteredLogs.length === 0 && (
                    <div className="py-20 text-center space-y-4">
                        <span className="material-symbols-outlined text-4xl text-archive-dim">folder_off</span>
                        <p className="text-[10px] uppercase tracking-[0.4em] text-archive-dim">
                            {searchQuery ? '没有找到匹配的戏录' : '暂无戏录'}
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
};

// 日志列表项组件
const LogItem: React.FC<{ log: ArchiveLog; onClick: () => void }> = ({ log, onClick }) => (
    <div
        onClick={onClick}
        className="group flex items-center gap-4 p-4 thin-border border-archive-grey/30 hover:border-archive-accent/50 bg-archive-deep/30 hover:bg-archive-accent/5 cursor-pointer transition-all"
    >
        {/* 状态指示 */}
        <div className={`w-1 h-12 ${log.status === 'Ongoing' ? 'bg-archive-accent' : 'bg-archive-dim/50'}`}></div>

        {/* 主要信息 */}
        <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-bold uppercase tracking-widest truncate group-hover:text-archive-accent transition-colors">
                    {log.title}
                </h3>
                {log.isFavorite && (
                    <span className="material-symbols-outlined text-archive-accent text-sm fill-1">star</span>
                )}
            </div>
            <p className="text-[10px] text-archive-dim truncate">{log.summary}</p>
            <div className="flex items-center gap-4 mt-2 text-[9px] text-archive-dim uppercase tracking-widest">
                <span>{log.wordCount} 字</span>
                <span>{log.timestamp}</span>
                {log.participants.length > 0 && (
                    <span className="truncate max-w-[120px]">
                        {log.participants.slice(0, 3).join(', ')}
                        {log.participants.length > 3 && '...'}
                    </span>
                )}
            </div>
        </div>

        {/* 箭头 */}
        <span className="material-symbols-outlined text-archive-dim group-hover:text-archive-accent transition-colors">
            chevron_right
        </span>
    </div>
);

export default AllLogsView;
