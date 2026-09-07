import React from 'react';
import { RefreshCw, Activity, Menu, Flame, Play, Pause, Radio } from 'lucide-react';
import { DbHealth, TableCounts } from '../types';
import { ActiveSection } from './Sidebar';
import { playClickSound } from '../utils/audio';

interface HeaderProps {
  health: DbHealth | null;
  counts: TableCounts | null;
  activeSection: ActiveSection;
  onSectionChange: (section: ActiveSection) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  countdown?: number;
  autoRefreshEnabled?: boolean;
  onToggleAutoRefresh?: () => void;
  onToggleMobileNav?: () => void;
  onOpenNewModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  health,
  counts,
  activeSection,
  onRefresh,
  isRefreshing,
  countdown = 30,
  autoRefreshEnabled = true,
  onToggleAutoRefresh,
  onToggleMobileNav,
  onOpenNewModal,
}) => {
  const getSubBreadcrumb = () => {
    switch (activeSection) {
      case 'home':
        return 'Executive Overview · Metrics At A Glance';
      case 'trending_requests':
        return 'Top 10 Trending User Requests · Live Telemetry';
      case 'users_licenses':
        return 'User & License Intelligence · Distribution';
      case 'cost_savings':
        return 'Cost Savings & Tier Economics (Tier 1 & 2 Free · Tier 3 Paid)';
      case 'api_requests':
        return 'API Call Request Count & Throughput';
      case 'llm_comparison':
        return 'Multi-LLM Cost Comparison (GPT-4o · Claude · Gemini)';
      case 'usage_logs':
        return 'Live PostgreSQL Usage Logs';
      case 'sql_console':
        return 'SQL & Database DDL Inspector';
      default:
        return 'Executive Overview';
    }
  };

  const hostDisplay = health?.host
    ? health.host.replace('.eastus2.azure.neon.tech', '...neon.tech')
    : 'ep-polished-surf...neon.tech';

  const handleManualSync = () => {
    playClickSound();
    onRefresh();
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0 z-30 sticky top-0">
      {/* Mobile Toggle & Brand Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        {onToggleMobileNav && (
          <button
            onClick={onToggleMobileNav}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition shrink-0"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="flex items-baseline gap-2 truncate">
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-baseline tracking-tight">
              <span className="font-extrabold text-slate-950 text-sm sm:text-base">
                NextGen
              </span>
              <span className="ml-0.5 font-black text-sm sm:text-base text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600">
                AI
              </span>
            </div>
            <span className="text-slate-300 font-light hidden sm:inline">|</span>
            <span className="font-semibold tracking-tight text-slate-700 text-xs sm:text-sm bg-slate-100/90 px-2 py-0.5 rounded-md border border-slate-200">
              Omni View
            </span>
          </div>
          <span className="hidden md:inline text-slate-400 font-normal text-xs font-mono truncate">
            / {getSubBreadcrumb()}
          </span>
        </div>
      </div>

      {/* Live 30s Polling indicator, connection status and actions */}
      <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm shrink-0">
        {/* 30-Second Live Polling Indicator */}
        <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 bg-indigo-50/80 text-indigo-900 border border-indigo-200/80 rounded-full font-mono text-xs shadow-2xs">
          <span className="relative flex h-2 w-2">
            {autoRefreshEnabled && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-75" />
            )}
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                autoRefreshEnabled ? 'bg-indigo-600' : 'bg-slate-400'
              }`}
            />
          </span>

          <span className="font-semibold text-[11px] hidden md:inline">LIVE 30s</span>
          <span className="text-[11px] text-indigo-700 font-mono">
            {autoRefreshEnabled ? `${countdown}s` : 'PAUSED'}
          </span>

          {onToggleAutoRefresh && (
            <button
              onClick={() => {
                playClickSound();
                onToggleAutoRefresh();
              }}
              className="ml-1 text-slate-500 hover:text-indigo-700 p-0.5 rounded transition"
              title={autoRefreshEnabled ? 'Pause 30s auto-refresh' : 'Resume 30s auto-refresh'}
            >
              {autoRefreshEnabled ? (
                <Pause className="w-3 h-3 text-indigo-700" />
              ) : (
                <Play className="w-3 h-3 text-slate-600" />
              )}
            </button>
          )}
        </div>

        {/* Neon Host Status Pill */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200/80 rounded-full font-mono text-xs shadow-2xs">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="font-medium">{hostDisplay}</span>
          {health?.latencyMs !== undefined && (
            <span className="text-[11px] text-emerald-600 flex items-center gap-0.5 border-l border-emerald-200 pl-1.5 font-bold">
              <Activity className="w-3 h-3" />
              {health.latencyMs}ms
            </span>
          )}
        </div>

        {/* Sync DB Button */}
        <button
          id="refresh-db-btn"
          onClick={handleManualSync}
          disabled={isRefreshing}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs disabled:opacity-50"
          title="Force immediate metrics refresh"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 text-slate-500 ${isRefreshing ? 'animate-spin text-indigo-600' : ''}`}
          />
          <span className="hidden sm:inline">{isRefreshing ? 'Syncing...' : 'Sync DB'}</span>
        </button>

        {onOpenNewModal && (
          <button
            onClick={() => {
              playClickSound();
              onOpenNewModal();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition"
          >
            <span>+ New Call</span>
          </button>
        )}
      </div>
    </header>
  );
};


