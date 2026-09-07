import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  PiggyBank,
  Activity,
  Scale,
  FileSpreadsheet,
  Database,
  Sparkles,
  Server,
  ChevronRight,
  ShieldCheck,
  Flame,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { DbHealth } from '../types';
import { playClickSound, isSoundMuted, toggleSound } from '../utils/audio';

export type ActiveSection =
  | 'home'
  | 'trending_requests'
  | 'users_licenses'
  | 'cost_savings'
  | 'api_requests'
  | 'llm_comparison'
  | 'usage_logs'
  | 'sql_console';

interface SidebarProps {
  activeSection: ActiveSection;
  onSectionChange: (section: ActiveSection) => void;
  health: DbHealth | null;
  totalUsers: number;
  totalCalls: number;
  totalSavings: number;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSectionChange,
  health,
  totalUsers,
  totalCalls,
  totalSavings,
  isOpenMobile,
  onCloseMobile,
}) => {
  const [muted, setMuted] = useState(isSoundMuted());

  const handleToggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newMuted = toggleSound();
    setMuted(newMuted);
    if (!newMuted) {
      playClickSound();
    }
  };

  const navItems = [
    {
      id: 'home' as ActiveSection,
      label: 'Executive Overview',
      sublabel: 'Metrics At A Glance',
      icon: LayoutDashboard,
      badge: 'Omni View',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    },
    {
      id: 'trending_requests' as ActiveSection,
      label: 'Top 10 Trending Requests',
      sublabel: 'Live Frequency & Costs',
      icon: Flame,
      badge: 'Top 10 · Live',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    },
    {
      id: 'users_licenses' as ActiveSection,
      label: 'Users & Licenses',
      sublabel: 'Distribution & Logged In',
      icon: Users,
      badge: `${totalUsers} Users`,
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    },
    {
      id: 'cost_savings' as ActiveSection,
      label: 'Cost Savings & Tiers',
      sublabel: 'Tier 1 & 2 Free · Tier 3 Paid',
      icon: PiggyBank,
      badge: `$${Math.round(totalSavings).toLocaleString()}`,
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    },
    {
      id: 'api_requests' as ActiveSection,
      label: 'API Request Count',
      sublabel: 'Throughput & Models',
      icon: Activity,
      badge: `${totalCalls.toLocaleString()} Calls`,
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    },
    {
      id: 'llm_comparison' as ActiveSection,
      label: 'Multi-LLM Cost Matrix',
      sublabel: 'vs GPT-4o, Claude, Gemini',
      icon: Scale,
      badge: '68% Lower',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
    {
      id: 'usage_logs' as ActiveSection,
      label: 'Live Usage Logs',
      sublabel: 'Full Records & CSV Export',
      icon: FileSpreadsheet,
      badge: 'Postgres',
      badgeColor: 'bg-slate-700 text-slate-300 border-slate-600',
    },
    {
      id: 'sql_console' as ActiveSection,
      label: 'SQL & Schema Workbench',
      sublabel: 'DDL & Introspection',
      icon: Database,
      badge: 'Console',
      badgeColor: 'bg-slate-700 text-slate-300 border-slate-600',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-xs"
        />
      )}

      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-72 bg-slate-950 text-slate-100 flex flex-col border-r border-slate-800 shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header with NextGen AI Lighting Effect */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-900/60 relative">
          {/* Ambient Lighting Aura Glow */}
          <div className="absolute inset-x-4 top-3 h-16 bg-gradient-to-r from-cyan-500/20 via-indigo-500/25 to-fuchsia-500/20 rounded-2xl blur-xl animate-neon-aura pointer-events-none" />

          {/* Eye-Catcher Card Container with Shimmer Light Sweep */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-950 to-indigo-950/60 p-3.5 border border-indigo-500/40 shadow-[0_0_20px_-3px_rgba(99,102,241,0.35)] transition-all duration-300 hover:border-cyan-400/50 hover:shadow-[0_0_30px_-4px_rgba(56,189,248,0.45)]">
            {/* Dynamic Light Sweep Beam */}
            <div className="absolute inset-0 w-2/3 h-full bg-gradient-to-r from-transparent via-cyan-300/10 to-transparent pointer-events-none animate-light-sweep" />

            <div className="relative z-10 flex items-center space-x-3">
              {/* Luminous Glowing Icon */}
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 via-indigo-500 to-fuchsia-500 flex items-center justify-center shadow-[0_0_15px_rgba(56,189,248,0.5)] ring-1 ring-white/30 transition-transform duration-300 hover:scale-105">
                  <Sparkles className="w-5 h-5 text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]" />
                </div>
                {/* Micro Light Beacon Ring */}
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-80" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-gradient-to-r from-cyan-400 to-indigo-500 border border-slate-950" />
                </span>
              </div>

              {/* NextGen AI Typography with Lighting Effect */}
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <div className="flex items-baseline tracking-tight">
                    <span className="font-extrabold text-white text-lg tracking-tight drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]">
                      NextGen
                    </span>
                    <span className="ml-1 font-black text-lg bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-300 text-transparent bg-clip-text drop-shadow-[0_0_12px_rgba(56,189,248,0.85)] animate-text-flow">
                      AI
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[8.5px] font-black uppercase tracking-wider bg-gradient-to-r from-indigo-500/25 to-purple-500/25 text-cyan-200 px-1.5 py-0.5 rounded-full border border-cyan-400/40 shadow-[0_0_8px_rgba(56,189,248,0.3)]">
                    <span className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse" />
                    OMNI VIEW
                  </span>
                </div>
                <p className="text-[10.5px] text-slate-400 font-medium leading-tight mt-0.5 truncate">
                  Enterprise Cost &amp; Tier Strategy
                </p>
              </div>
            </div>
          </div>

          {/* Database Live Ping */}
          <div className="mt-3.5 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-slate-300">Neon Postgres 17</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold">
              {health?.latencyMs ? `${health.latencyMs}ms` : 'Connected'}
            </span>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-1 text-[10px] uppercase font-bold tracking-wider text-slate-400">
            Advisory Dashboard Sections
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  playClickSound();
                  onSectionChange(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full text-left px-3.5 py-3 rounded-xl transition-all flex items-center justify-between group ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/30 ring-1 ring-white/10'
                    : 'text-slate-300 hover:bg-slate-900/80 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400 group-hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 pr-1">
                    <div className="text-xs font-semibold truncate leading-tight">
                      {item.label}
                    </div>
                    <div
                      className={`text-[10px] truncate ${
                        isActive ? 'text-indigo-100' : 'text-slate-500'
                      }`}
                    >
                      {item.sublabel}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 shrink-0">
                  {item.badge && (
                    <span
                      className={`text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full border ${
                        isActive ? 'bg-white/20 text-white border-white/30' : item.badgeColor
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight
                    className={`w-3.5 h-3.5 transition-transform ${
                      isActive ? 'text-white translate-x-0.5' : 'text-slate-600 group-hover:text-slate-400'
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Audio FX Status & Bottom Strategic Card */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/30 space-y-3">
          {/* Sound Toggle Button */}
          <button
            onClick={handleToggleAudio}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-xs transition"
            title="Toggle mechanical tactile clicking sound"
          >
            <div className="flex items-center gap-2">
              {muted ? (
                <VolumeX className="w-3.5 h-3.5 text-slate-500" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              )}
              <span className="text-slate-300 text-[11px] font-medium">
                Click Sound FX
              </span>
            </div>
            <span
              className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                muted
                  ? 'bg-slate-800 text-slate-400 border-slate-700'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              }`}
            >
              {muted ? 'MUTED' : 'ACTIVE'}
            </span>
          </button>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
              <ShieldCheck className="w-4 h-4" />
              <span>Tier Policy Active</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Tier 1 &amp; Tier 2 are <strong className="text-emerald-300">100% Free</strong> cost savers. Only Tier 3 is chargeable based on GPT benchmark rates.
            </p>
          </div>
        </div>
      </aside>

    </>
  );
};
