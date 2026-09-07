import React, { useState, useEffect, useSyncExternalStore } from 'react';
import { 
  Database, 
  Globe, 
  Radio, 
  Palette, 
  Activity, 
  Trash2, 
  X, 
  Minimize2, 
  Maximize2, 
  Copy, 
  Check, 
  ChevronRight, 
  ChevronDown,
  Terminal
} from 'lucide-react';
import { debugStore, DebugTabType, ApiLogEntry, QueryLogEntry, SocketLogEntry } from './debugStore';
import { useWeddingConfig } from '../../context/WeddingContext';
import { useThemeTokens } from '../frontend/themes';
import { useGuestName } from '../../hooks/useGuestName';

export const DeveloperDebugBar: React.FC = () => {
  // Only render in Vite development mode
  if (!import.meta.env.DEV) {
    return null;
  }

  // Subscribe to debugStore updates
  useSyncExternalStore(
    (callback) => debugStore.subscribe(callback),
    () => debugStore.getApiLogs().length + debugStore.getSocketLogs().length
  );

  const { weddingConfig } = useWeddingConfig();
  const { themeId, tokens, isDark } = useThemeTokens();
  const guestName = useGuestName();

  const isOpen = debugStore.getIsOpen();
  const activeTab = debugStore.getActiveTab();
  const apiLogs = debugStore.getApiLogs();
  const allQueries = debugStore.getAllQueries();
  const socketLogs = debugStore.getSocketLogs();
  const socketStatus = debugStore.getSocketStatus();
  const totalQueryDuration = debugStore.getTotalQueryDuration();

  const [isMaximized, setIsMaximized] = useState(false);
  const [copiedQueryIndex, setCopiedQueryIndex] = useState<number | null>(null);
  const [selectedApiId, setSelectedApiId] = useState<string | null>(null);
  const [queryFilter, setQueryFilter] = useState('');

  // Keyboard shortcut listener: Ctrl + Shift + D (or Cmd + Shift + D)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'D' || e.key === 'd')) {
        e.preventDefault();
        debugStore.toggleOpen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCopySql = (sql: string, index: number) => {
    navigator.clipboard.writeText(sql).catch(() => {});
    setCopiedQueryIndex(index);
    setTimeout(() => setCopiedQueryIndex(null), 1800);
  };

  const filteredQueries = allQueries.filter((q) => 
    q.sql.toLowerCase().includes(queryFilter.toLowerCase()) || 
    (q.apiEndpoint && q.apiEndpoint.toLowerCase().includes(queryFilter.toLowerCase()))
  );

  const lastApiDuration = apiLogs.length > 0 ? apiLogs[0].durationMs : 0;

  // Render Collapsed Floating Pill
  if (!isOpen) {
    return (
      <div className="fixed bottom-3 left-3 z-[9999] pointer-events-auto">
        <button
          type="button"
          onClick={() => debugStore.toggleOpen()}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-900/90 hover:bg-stone-800 text-stone-200 border border-stone-700 shadow-xl backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer text-xs font-mono select-none"
          title="Buka MP DebugBar (Ctrl + Shift + D)"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold text-amber-400 flex items-center gap-1">
            <Terminal size={12} />
            DebugBar
          </span>
          <span className="text-stone-500">|</span>
          <span className="text-sky-300">{lastApiDuration}ms</span>
          <span className="text-stone-500">|</span>
          <span className="text-emerald-300">{allQueries.length} Q</span>
          <span className="text-stone-500">|</span>
          <span className={socketStatus.status === 'connected' ? 'text-emerald-400' : 'text-amber-400'}>
            {socketStatus.status === 'connected' ? '🔌 On' : '🔌 Off'}
          </span>
        </button>
      </div>
    );
  }

  // Render Full Expanded DebugBar Drawer
  return (
    <aside 
      aria-label="Developer DebugBar"
      className={`fixed left-0 right-0 bottom-0 z-[9999] bg-stone-900/98 text-stone-200 border-t border-stone-700 shadow-2xl backdrop-blur-lg flex flex-col font-mono text-xs select-none transition-all duration-200 ${
        isMaximized ? 'h-[85vh]' : 'h-[380px]'
      }`}
    >
      {/* Top Main Bar & Controls */}
      <header className="flex items-center justify-between px-3 py-2 bg-stone-950 border-b border-stone-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-amber-400">
            <Terminal size={14} />
            <span>MARI PARTNER DEBUGBAR</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] text-stone-400">
            <span className="px-2 py-0.5 rounded bg-stone-800 text-sky-300 border border-stone-700">
              ⚡ API: {lastApiDuration}ms
            </span>
            <span className="px-2 py-0.5 rounded bg-stone-800 text-emerald-300 border border-stone-700">
              🗄️ DB: {totalQueryDuration}ms ({allQueries.length} Q)
            </span>
            <span className={`px-2 py-0.5 rounded border ${
              socketStatus.status === 'connected' 
                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800' 
                : 'bg-amber-950/60 text-amber-300 border-amber-800'
            }`}>
              🔌 Socket: {socketStatus.status}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <kbd className="hidden md:inline-block px-1.5 py-0.5 rounded bg-stone-800 text-[10px] text-stone-400 border border-stone-700">
            Ctrl+Shift+D
          </kbd>

          <button
            type="button"
            onClick={() => debugStore.clearAll()}
            className="p-1.5 rounded hover:bg-stone-800 text-stone-400 hover:text-stone-200 transition-colors cursor-pointer"
            title="Bersihkan Log"
          >
            <Trash2 size={13} />
          </button>

          <button
            type="button"
            onClick={() => setIsMaximized(!isMaximized)}
            className="p-1.5 rounded hover:bg-stone-800 text-stone-400 hover:text-stone-200 transition-colors cursor-pointer"
            title={isMaximized ? "Restore Ukuran" : "Maksimalkan"}
          >
            {isMaximized ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </button>

          <button
            type="button"
            onClick={() => debugStore.setOpen(false)}
            className="p-1.5 rounded hover:bg-red-950 hover:text-red-300 text-stone-400 transition-colors cursor-pointer"
            title="Tutup DebugBar"
          >
            <X size={14} />
          </button>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav aria-label="DebugBar Tabs" className="flex items-center gap-1 px-3 py-1 bg-stone-900 border-b border-stone-800 shrink-0 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => debugStore.setActiveTab('queries')}
          className={`px-3 py-1.5 rounded-t-md flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'queries' 
              ? 'bg-stone-800 text-emerald-300 border-b-2 border-emerald-400 font-semibold' 
              : 'text-stone-400 hover:bg-stone-800/50 hover:text-stone-200'
          }`}
        >
          <Database size={13} />
          <span>Queries ({allQueries.length})</span>
        </button>

        <button
          type="button"
          onClick={() => debugStore.setActiveTab('api')}
          className={`px-3 py-1.5 rounded-t-md flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'api' 
              ? 'bg-stone-800 text-sky-300 border-b-2 border-sky-400 font-semibold' 
              : 'text-stone-400 hover:bg-stone-800/50 hover:text-stone-200'
          }`}
        >
          <Globe size={13} />
          <span>REST API ({apiLogs.length})</span>
        </button>

        <button
          type="button"
          onClick={() => debugStore.setActiveTab('socket')}
          className={`px-3 py-1.5 rounded-t-md flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'socket' 
              ? 'bg-stone-800 text-purple-300 border-b-2 border-purple-400 font-semibold' 
              : 'text-stone-400 hover:bg-stone-800/50 hover:text-stone-200'
          }`}
        >
          <Radio size={13} />
          <span>Realtime ({socketLogs.length})</span>
        </button>

        <button
          type="button"
          onClick={() => debugStore.setActiveTab('state')}
          className={`px-3 py-1.5 rounded-t-md flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'state' 
              ? 'bg-stone-800 text-amber-300 border-b-2 border-amber-400 font-semibold' 
              : 'text-stone-400 hover:bg-stone-800/50 hover:text-stone-200'
          }`}
        >
          <Palette size={13} />
          <span>State & Tema</span>
        </button>

        <button
          type="button"
          onClick={() => debugStore.setActiveTab('perf')}
          className={`px-3 py-1.5 rounded-t-md flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'perf' 
              ? 'bg-stone-800 text-pink-300 border-b-2 border-pink-400 font-semibold' 
              : 'text-stone-400 hover:bg-stone-800/50 hover:text-stone-200'
          }`}
        >
          <Activity size={13} />
          <span>Performance</span>
        </button>
      </nav>

      {/* Tab Contents */}
      <div className="flex-1 overflow-y-auto p-3 text-stone-300">
        
        {/* TAB 1: QUERIES */}
        {activeTab === 'queries' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3 mb-2">
              <input
                type="text"
                placeholder="Cari statement SQL atau endpoint..."
                value={queryFilter}
                onChange={(e) => setQueryFilter(e.target.value)}
                className="w-full max-w-sm px-2.5 py-1 bg-stone-950 border border-stone-800 rounded text-stone-200 placeholder-stone-600 focus:outline-hidden focus:border-stone-600"
              />
              <span className="text-[11px] text-stone-400 shrink-0">
                Total Waktu Kueri: <strong className="text-emerald-400">{totalQueryDuration} ms</strong>
              </span>
            </div>

            {filteredQueries.length === 0 ? (
              <div className="py-12 text-center text-stone-500">
                {allQueries.length === 0 
                  ? 'Belum ada kueri SQL yang terekam. Lakukan interaksi atau refresh data.' 
                  : 'Tidak ada kueri yang cocok dengan filter pencarian.'}
              </div>
            ) : (
              filteredQueries.map((query, index) => {
                const isFast = query.durationMs < 10;
                const isMedium = query.durationMs >= 10 && query.durationMs < 50;

                return (
                  <div 
                    key={index}
                    className="p-2.5 rounded-lg bg-stone-950/80 border border-stone-800 hover:border-stone-700 transition-colors flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          isFast 
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                            : isMedium 
                            ? 'bg-amber-950 text-amber-400 border border-amber-800' 
                            : 'bg-red-950 text-red-400 border border-red-800'
                        }`}>
                          {query.durationMs} ms
                        </span>
                        {query.apiEndpoint && (
                          <span className="px-1.5 py-0.5 rounded bg-stone-800 text-stone-400 text-[10px]">
                            {query.apiEndpoint}
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCopySql(query.sql, index)}
                        className="px-2 py-0.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center gap-1 text-[10px] cursor-pointer"
                        title="Salin SQL"
                      >
                        {copiedQueryIndex === index ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                        <span>{copiedQueryIndex === index ? 'Disalin' : 'Copy SQL'}</span>
                      </button>
                    </div>

                    <pre className="font-mono text-[11px] text-emerald-200 overflow-x-auto whitespace-pre-wrap select-text leading-relaxed">
                      {query.sql}
                    </pre>

                    {query.params && query.params.length > 0 && (
                      <div className="text-[10px] text-stone-400 mt-0.5 bg-stone-900/50 p-1 rounded border border-stone-800/80">
                        <span className="text-stone-500 mr-1">Bindings:</span>
                        <code>{JSON.stringify(query.params)}</code>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 2: REST API REQUESTS */}
        {activeTab === 'api' && (
          <div className="space-y-2">
            {apiLogs.length === 0 ? (
              <div className="py-12 text-center text-stone-500">
                Belum ada request API yang terekam.
              </div>
            ) : (
              apiLogs.map((log) => {
                const isSelected = selectedApiId === log.id;
                const isSuccess = log.status >= 200 && log.status < 300;

                return (
                  <div 
                    key={log.id} 
                    className="rounded-lg bg-stone-950/80 border border-stone-800 overflow-hidden"
                  >
                    <div 
                      onClick={() => setSelectedApiId(isSelected ? null : log.id)}
                      className="p-2.5 flex items-center justify-between gap-2 hover:bg-stone-900 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {isSelected ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                          log.method === 'GET' ? 'bg-sky-950 text-sky-400 border border-sky-800' :
                          log.method === 'POST' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                          log.method === 'PUT' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                          'bg-red-950 text-red-400 border border-red-800'
                        }`}>
                          {log.method}
                        </span>

                        <span className="font-semibold text-stone-200 truncate">
                          {log.url}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          isSuccess ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'
                        }`}>
                          {log.status === 0 ? 'ERR' : log.status}
                        </span>

                        <span className="text-sky-300 text-[11px]">
                          {log.durationMs} ms
                        </span>

                        {log.queries.length > 0 && (
                          <span className="px-1.5 py-0.5 rounded bg-stone-800 text-emerald-300 text-[10px]">
                            {log.queries.length} Q
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Detailed Accordion Payload & Query Breakdown */}
                    {isSelected && (
                      <div className="p-3 bg-stone-900/90 border-t border-stone-800 space-y-2 text-[11px]">
                        {log.requestPayload && (
                          <div>
                            <span className="text-stone-400 font-bold block mb-1">Request Payload:</span>
                            <pre className="p-2 rounded bg-stone-950 text-stone-300 overflow-x-auto max-h-40">
                              {JSON.stringify(log.requestPayload, null, 2)}
                            </pre>
                          </div>
                        )}

                        {log.responsePreview && (
                          <div>
                            <span className="text-stone-400 font-bold block mb-1">Response Data:</span>
                            <pre className="p-2 rounded bg-stone-950 text-stone-300 overflow-x-auto max-h-40">
                              {JSON.stringify(log.responsePreview, null, 2)}
                            </pre>
                          </div>
                        )}

                        {log.queries.length > 0 && (
                          <div>
                            <span className="text-emerald-400 font-bold block mb-1">Database Queries:</span>
                            <div className="space-y-1.5">
                              {log.queries.map((q, qIdx) => (
                                <div key={qIdx} className="p-1.5 rounded bg-stone-950 text-emerald-300 text-[10px]">
                                  <span className="text-amber-400 mr-2">[{q.durationMs}ms]</span>
                                  <code>{q.sql}</code>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 3: REALTIME SOCKET.IO */}
        {activeTab === 'socket' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 rounded bg-stone-950 border border-stone-800 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-stone-400">Status Gateway:</span>
                <span className={`font-bold ${
                  socketStatus.status === 'connected' ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {socketStatus.status.toUpperCase()}
                </span>
                <span className="text-stone-500">|</span>
                <span className="text-stone-400">Socket ID:</span>
                <code className="text-stone-300">{socketStatus.socketId}</code>
              </div>
            </div>

            {socketLogs.length === 0 ? (
              <div className="py-12 text-center text-stone-500">
                Belum ada event WebSocket yang masuk.
              </div>
            ) : (
              socketLogs.map((log) => (
                <div 
                  key={log.id}
                  className="p-2 rounded bg-stone-950/80 border border-stone-800 flex items-center justify-between gap-2 text-[11px]"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`px-1 py-0.5 rounded text-[9px] font-bold uppercase ${
                      log.direction === 'in' ? 'bg-emerald-950 text-emerald-400' : 
                      log.direction === 'out' ? 'bg-sky-950 text-sky-400' : 
                      'bg-stone-800 text-stone-400'
                    }`}>
                      {log.direction}
                    </span>
                    <span className="font-semibold text-purple-300">{log.event}</span>
                  </div>

                  {log.payload && (
                    <pre className="text-stone-400 text-[10px] truncate max-w-xs">
                      {JSON.stringify(log.payload)}
                    </pre>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 4: STATE & THEME */}
        {activeTab === 'state' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-stone-950 border border-stone-800 space-y-2">
              <h4 className="font-bold text-amber-400 flex items-center gap-1.5">
                <Palette size={13} />
                Tema Aktif
              </h4>
              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-stone-500">Theme ID:</span>
                  <span className="font-semibold text-stone-200">{themeId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Mode Tampilan:</span>
                  <span className="text-stone-200">{isDark ? 'Dark Mode' : 'Light Mode'}</span>
                </div>
                <div className="pt-2 border-t border-stone-800 flex items-center gap-2">
                  <span className="text-stone-500">Warna:</span>
                  <div className="flex gap-1.5 items-center">
                    <div className="w-4 h-4 rounded border border-white/20" style={{ backgroundColor: tokens.primary }} title="Primary" />
                    <div className="w-4 h-4 rounded border border-white/20" style={{ backgroundColor: tokens.accent }} title="Accent" />
                    <div className="w-4 h-4 rounded border border-white/20" style={{ backgroundColor: tokens.bg }} title="Background" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-stone-950 border border-stone-800 space-y-2">
              <h4 className="font-bold text-amber-400">Context Mempelai & Tamu</h4>
              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-stone-500">Mempelai Pria:</span>
                  <span className="text-stone-200">{weddingConfig.groom?.nickname}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Mempelai Wanita:</span>
                  <span className="text-stone-200">{weddingConfig.bride?.nickname}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Nama Tamu (?to=):</span>
                  <span className="font-semibold text-emerald-400">{guestName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Tanggal Acara:</span>
                  <span className="text-stone-200">{weddingConfig.dateStr}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: PERFORMANCE */}
        {activeTab === 'perf' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-stone-950 border border-stone-800 space-y-2">
              <h4 className="font-bold text-pink-400 flex items-center gap-1.5">
                <Activity size={13} />
                Viewport & Layar
              </h4>
              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-stone-500">Window Inner:</span>
                  <span className="text-stone-200">{typeof window !== 'undefined' ? `${window.innerWidth} × ${window.innerHeight} px` : '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Target Container:</span>
                  <span className="text-emerald-400">Max 430px (Mobile SPA Frame)</span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-stone-950 border border-stone-800 space-y-2">
              <h4 className="font-bold text-pink-400">Sistem Lingkungan</h4>
              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-stone-500">Environment:</span>
                  <span className="text-emerald-400 font-bold">development (Vite)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">React Runtime:</span>
                  <span className="text-stone-200">React 19 (Strict Mode)</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </aside>
  );
};
