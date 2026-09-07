import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Bot,
  User,
  Clock,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  ChevronRight,
  Search,
} from 'lucide-react';
import { ChatSessionItem, SessionMessage, InteractionStats } from '../types';

interface SessionsTelemetryTabProps {
  sessions: ChatSessionItem[];
  isLoading: boolean;
}

export const SessionsTelemetryTab: React.FC<SessionsTelemetryTabProps> = ({
  sessions,
  isLoading,
}) => {
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    sessions[0]?.session_id || null
  );
  const [messages, setMessages] = useState<SessionMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [stats, setStats] = useState<InteractionStats | null>(null);
  const [search, setSearch] = useState('');

  // Fetch AI Interaction telemetry stats
  useEffect(() => {
    fetch('/api/interactions')
      .then((res) => res.json())
      .then((data) => {
        if (data.stats) setStats(data.stats);
      })
      .catch((err) => console.error('Error fetching interactions:', err));
  }, []);

  // Fetch messages when a session is selected
  useEffect(() => {
    if (!selectedSessionId && sessions.length > 0) {
      setSelectedSessionId(sessions[0].session_id);
    }
  }, [sessions, selectedSessionId]);

  useEffect(() => {
    if (!selectedSessionId) return;
    setIsLoadingMessages(true);
    fetch(`/api/sessions/${selectedSessionId}/messages`)
      .then((res) => res.json())
      .then((data) => {
        setMessages(data.messages || []);
      })
      .catch((err) => console.error('Error fetching session messages:', err))
      .finally(() => setIsLoadingMessages(false));
  }, [selectedSessionId]);

  const filteredSessions = sessions.filter(
    (s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      (s.model_used && s.model_used.toLowerCase().includes(search.toLowerCase())) ||
      (s.username && s.username.toLowerCase().includes(search.toLowerCase()))
  );

  const activeSession = sessions.find((s) => s.session_id === selectedSessionId);

  return (
    <div className="space-y-6">
      {/* Telemetry Summary Cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
              AI Latency Average
            </span>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-mono text-slate-900">
                {stats.avg_latency_ms}
              </span>
              <span className="text-xs text-slate-400">ms</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Min {stats.min_latency_ms}ms · Max {stats.max_latency_ms}ms
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
              Interactions
            </span>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-mono text-indigo-600">
                {stats.total_interactions}
              </span>
              <span className="text-xs text-slate-400">events</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              From <code className="text-slate-600 font-mono">ai_interaction_logs</code>
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
              User Satisfaction
            </span>
            <div className="mt-2 flex items-center gap-3">
              <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold font-mono text-sm bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <ThumbsUp className="w-3.5 h-3.5" />
                {stats.thumbs_up}
              </span>
              <span className="inline-flex items-center gap-1 text-rose-700 font-semibold font-mono text-sm bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                <ThumbsDown className="w-3.5 h-3.5" />
                {stats.thumbs_down}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Feedback signals</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
              Recorded Errors
            </span>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-mono text-slate-900">
                {stats.errors_count}
              </span>
              <span className="text-xs text-slate-400">exceptions</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Error code tracking</p>
          </div>
        </div>
      )}

      {/* Main Split View: Sessions on Left, Messages and Telemetry on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sessions List */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-3.5 border-b border-slate-100 bg-slate-50/70">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search sessions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8.5 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center text-xs text-slate-500">
                Loading chat sessions...
              </div>
            ) : filteredSessions.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No sessions found.
              </div>
            ) : (
              filteredSessions.map((sess) => {
                const isSelected = sess.session_id === selectedSessionId;
                return (
                  <button
                    key={sess.session_id}
                    onClick={() => setSelectedSessionId(sess.session_id)}
                    className={`w-full text-left p-4 transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-50/70 border-l-4 border-indigo-600'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="space-y-1 min-w-0 pr-2">
                      <div className="flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <h4 className="text-xs font-semibold text-slate-900 truncate">
                          {sess.title}
                        </h4>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <span>{sess.username || 'User'}</span>
                        <span>•</span>
                        <span className="font-mono text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded">
                          {sess.model_used || 'chat'}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-2 pt-0.5">
                        <span>{sess.message_count} msgs</span>
                        <span>•</span>
                        <span>{sess.total_prompt_tokens + sess.total_completion_tokens} tokens</span>
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 shrink-0 ${
                        isSelected ? 'text-indigo-600' : 'text-slate-300'
                      }`}
                    />
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Selected Session Message Feed & Telemetry */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          {activeSession ? (
            <>
              {/* Session Meta Header */}
              <div className="p-5 border-b border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-slate-900">
                      {activeSession.title}
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {activeSession.model_used || 'default'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Owner: <span className="font-medium text-slate-700">{activeSession.username}</span> ({activeSession.email || 'no email'})
                    · ID: <span className="font-mono text-[10px] text-slate-500">{activeSession.session_id.slice(0, 8)}...</span>
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="bg-slate-100 px-2.5 py-1 rounded-lg text-slate-700 border border-slate-200">
                    Prompt: {activeSession.total_prompt_tokens}
                  </span>
                  <span className="bg-slate-100 px-2.5 py-1 rounded-lg text-slate-700 border border-slate-200">
                    Comp: {activeSession.total_completion_tokens}
                  </span>
                </div>
              </div>

              {/* Message Feed */}
              <div className="p-5 space-y-3.5 max-h-[550px] overflow-y-auto">
                {isLoadingMessages ? (
                  <div className="py-14 text-center text-xs text-slate-500">
                    Loading messages and interaction telemetry...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="py-14 text-center text-xs text-slate-500">
                    No messages recorded for this session yet.
                  </div>
                ) : (
                  messages.map((m) => {
                    const isAssistant = m.role === 'assistant';
                    return (
                      <div
                        key={m.message_id}
                        className={`p-4 rounded-xl border text-xs space-y-2 ${
                          isAssistant
                            ? 'bg-slate-50 border-slate-200'
                            : 'bg-indigo-50/30 border-indigo-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {isAssistant ? (
                              <Bot className="w-4 h-4 text-indigo-600" />
                            ) : (
                              <User className="w-4 h-4 text-slate-600" />
                            )}
                            <span className="font-semibold text-slate-800 capitalize">
                              {m.role}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {m.prompt_tokens ? `${m.prompt_tokens} in` : ''}
                              {m.completion_tokens ? ` · ${m.completion_tokens} out` : ''}
                            </span>
                          </div>

                          {/* Telemetry pill */}
                          {m.latency_ms !== null && m.latency_ms !== undefined && (
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center gap-1 font-mono text-[10px] text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                                <Clock className="w-3 h-3 text-slate-400" />
                                {m.latency_ms}ms
                              </span>
                              {m.user_feedback === 'thumbs_up' && (
                                <span className="text-emerald-600 p-0.5" title="User Thumbs Up">
                                  <ThumbsUp className="w-3 h-3" />
                                </span>
                              )}
                              {m.user_feedback === 'thumbs_down' && (
                                <span className="text-rose-600 p-0.5" title="User Thumbs Down">
                                  <ThumbsDown className="w-3 h-3" />
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Content text */}
                        <div className="text-slate-800 whitespace-pre-wrap leading-relaxed text-xs">
                          {m.content}
                        </div>

                        {m.error_code && (
                          <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 font-mono text-[11px] flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                            <span>Error Code: {m.error_code}</span>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </>
          ) : (
            <div className="p-16 text-center text-xs text-slate-500">
              Select a session from the list to view message history and AI telemetry.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
