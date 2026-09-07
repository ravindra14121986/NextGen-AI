import React, { useState } from 'react';
import {
  Flame,
  TrendingUp,
  Search,
  Sparkles,
  Zap,
  CheckCircle2,
  Cpu,
  Layers,
  Clock,
  DollarSign,
  ChevronRight,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  Building2,
  Copy,
  Check,
} from 'lucide-react';
import { TrendingRequestsData, TrendingUserRequestItem } from '../types';
import { CircularMetricBox } from './CircularMetricBox';
import { ChasingLightCard } from './ChasingLightCard';
import { playClickSound } from '../utils/audio';

interface TrendingRequestsSectionProps {
  trendingData: TrendingRequestsData | null;
  isLoading: boolean;
  onRefresh?: () => void;
}

export const TrendingRequestsSection: React.FC<TrendingRequestsSectionProps> = ({
  trendingData,
  isLoading,
  onRefresh,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<TrendingUserRequestItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const top10 = trendingData?.top10 || [];
  const totalTrendingCalls = trendingData?.totalTrendingCalls || 0;
  const totalSavings = trendingData?.totalSavingsFromTop10 || 0;
  const avgTokens = trendingData?.avgTokensAcrossTop10 || 0;
  const topRequest = top10[0];

  // Extract unique categories
  const categories = Array.from(new Set(top10.map((r) => r.category)));

  // Filtered list
  const filteredRequests = top10.filter((item) => {
    const matchesSearch =
      item.query.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.primaryModel.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCopy = (text: string, id: string) => {
    playClickSound();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Strategic Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-rose-950 via-purple-950 to-slate-900 text-white p-6 sm:p-8 border border-rose-800/60 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-200 text-xs font-semibold">
            <Flame className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span>Telemetry Pulse · Live 30s Polling</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
            <span>Top 10 Trending User Requests</span>
            <span className="text-xs font-mono font-bold bg-rose-500/30 text-rose-200 px-3 py-1 rounded-full border border-rose-400/30">
              Live Counts
            </span>
          </h1>
          <p className="text-sm text-rose-200/85 leading-relaxed">
            Real-time frequency ranking of enterprise queries, code refactoring prompts, ETL ingestion pipelines, and financial reconciliation jobs. Monitor query volume, model assignment, token loads, and cost savings across free and chargeable tiers.
          </p>
        </div>
      </div>

      {/* CIRCULAR GAUGES WITH SOFT EDGES & GRADIENT COLOR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 justify-items-center bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
        <CircularMetricBox
          title="#1 Top Request"
          value={`${topRequest?.percentageShare || 18.5}%`}
          subtitle={topRequest?.category || 'Financial Intelligence'}
          badgeText="Rank #1"
          trend={`${topRequest?.count.toLocaleString() || '4,625'} calls`}
          variant="rose"
          icon={<Flame className="w-4 h-4" />}
          footnote="Corporate FP&A variance"
        />

        <CircularMetricBox
          title="Top 10 Volume"
          value={totalTrendingCalls.toLocaleString()}
          subtitle="Processed Calls"
          badgeText="72% Traffic"
          trend="Live Postgres"
          variant="indigo"
          icon={<Layers className="w-4 h-4" />}
          footnote="Aggregated invocation count"
        />

        <CircularMetricBox
          title="Cost Saved Top 10"
          value={`$${Math.round(totalSavings).toLocaleString()}`}
          subtitle="vs Commercial GPT"
          badgeText="Savings"
          trend="Tier 1 & 2 Free"
          variant="emerald"
          icon={<DollarSign className="w-4 h-4" />}
          footnote="Saved on top 10 queries"
        />

        <CircularMetricBox
          title="Avg Query Tokens"
          value={avgTokens.toLocaleString()}
          subtitle="Prompt + Completion"
          badgeText="Density"
          trend="Sub-600ms"
          variant="amber"
          icon={<Zap className="w-4 h-4" />}
          footnote="Blended prompt length"
        />
      </div>

      {/* FILTER & CONTROLS BAR */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search queries, prompts, departments, or models..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            onClick={() => {
              playClickSound();
              setSelectedCategory('all');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === 'all'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            All Categories ({top10.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                playClickSound();
                setSelectedCategory(cat);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* TOP 10 TRENDING REQUESTS GRID / CARDS WITH CHASING LIGHT EFFECT */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>Ranked Request Catalog &amp; Traffic Volume</span>
            <span className="text-xs font-normal text-slate-500">
              (Click any box to activate tactile audio &amp; perimeter chasing light effect)
            </span>
          </h2>
          <span className="text-xs font-mono font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
            {filteredRequests.length} of 10 Requests Displayed
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredRequests.map((item) => {
            const isTop3 = item.rank <= 3;
            const rankBadgeColor =
              item.rank === 1
                ? 'bg-amber-500 text-white border-amber-400'
                : item.rank === 2
                ? 'bg-slate-400 text-white border-slate-300'
                : item.rank === 3
                ? 'bg-amber-700 text-white border-amber-600'
                : 'bg-slate-100 text-slate-600 border-slate-200';

            return (
              <ChasingLightCard
                key={item.id}
                variant={item.rank === 1 ? 'amber' : item.isFreeTier ? 'emerald' : 'indigo'}
                rounded="rounded-2xl"
                onClick={() => setSelectedRequest(item)}
                className="hover:scale-[1.005] transition-all"
              >
                <div className="p-5 sm:p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 border border-slate-100">
                  {/* Left Side: Rank & Query */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    {/* Rank Pill */}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-extrabold text-sm border shadow-xs shrink-0 ${rankBadgeColor}`}
                    >
                      #{item.rank}
                    </div>

                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-xs uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          {item.category}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-slate-400" />
                          {item.department}
                        </span>
                        {item.isHot && (
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1 border border-amber-300 animate-pulse">
                            <Flame className="w-3 h-3 text-amber-600" />
                            {item.velocityTrend}
                          </span>
                        )}
                        {!item.isHot && (
                          <span className="text-[10px] text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded">
                            {item.velocityTrend}
                          </span>
                        )}
                      </div>

                      {/* Prompt / Query Text */}
                      <p className="text-sm sm:text-base font-bold text-slate-900 leading-snug group-hover:text-rose-700 transition-colors">
                        "{item.query}"
                      </p>

                      {/* Badges & Meta */}
                      <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-600">
                        <span className="font-mono text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded flex items-center gap-1">
                          <Cpu className="w-3 h-3 text-slate-500" />
                          {item.primaryModel}
                        </span>

                        <span
                          className={`font-mono text-[11px] px-2 py-0.5 rounded font-bold border ${
                            item.isFreeTier
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          {item.tier}
                        </span>

                        <span className="font-mono text-[11px] text-slate-500">
                          ~{item.avgTokens} tokens · {item.avgLatencyMs}ms
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Request Count & Cost Economics */}
                  <div className="flex items-center justify-between lg:justify-end gap-6 w-full lg:w-auto pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 shrink-0">
                    {/* Traffic & Frequency */}
                    <div className="text-left lg:text-right space-y-1">
                      <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                        Request Count
                      </div>
                      <div className="font-mono font-extrabold text-lg sm:text-xl text-slate-900">
                        {item.count.toLocaleString()}
                      </div>
                      <div className="flex items-center lg:justify-end gap-1.5">
                        <div className="w-16 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-rose-500 h-full rounded-full"
                            style={{ width: `${Math.min(100, item.percentageShare * 4)}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-mono font-semibold text-rose-600">
                          {item.percentageShare}%
                        </span>
                      </div>
                    </div>

                    {/* Cost Savings */}
                    <div className="text-right space-y-1 min-w-[100px]">
                      <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                        Total Saved
                      </div>
                      <div className="font-mono font-extrabold text-lg text-emerald-600">
                        +${item.totalSaved.toFixed(2)}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400">
                        Actual: ${item.actualCost.toFixed(2)}
                      </div>
                    </div>

                    {/* Copy Query Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(item.query, item.id);
                      }}
                      className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition shadow-xs"
                      title="Copy full prompt string"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </ChasingLightCard>
            );
          })}
        </div>
      </div>

      {/* DETAIL MODAL / INSPECTOR */}
      {selectedRequest && (
        <div
          onClick={() => setSelectedRequest(null)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-slate-200 shadow-2xl space-y-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-rose-600 text-white font-mono font-extrabold text-sm flex items-center justify-center">
                  #{selectedRequest.rank}
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Trending Request Telemetry
                  </h3>
                  <span className="text-xs text-slate-500">
                    {selectedRequest.category} · {selectedRequest.department}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {/* Full Query */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                User Query Prompt Text
              </div>
              <p className="text-sm font-semibold text-slate-900 leading-relaxed font-mono">
                {selectedRequest.query}
              </p>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">
                  Invocation Count
                </div>
                <div className="text-lg font-bold font-mono text-slate-900">
                  {selectedRequest.count.toLocaleString()}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">
                  Volume Share
                </div>
                <div className="text-lg font-bold font-mono text-rose-600">
                  {selectedRequest.percentageShare}%
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">
                  Total Saved
                </div>
                <div className="text-lg font-bold font-mono text-emerald-600">
                  +${selectedRequest.totalSaved.toFixed(2)}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">
                  Avg Latency
                </div>
                <div className="text-lg font-bold font-mono text-indigo-600">
                  {selectedRequest.avgLatencyMs}ms
                </div>
              </div>
            </div>

            {/* ServiceNow Incident FAQ Telemetry from etl_db */}
            {(selectedRequest.sampleFilter || selectedRequest.sampleOutputColumn || selectedRequest.apiMethod) && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-rose-600" />
                  <span>ServiceNow Incident FAQ Database Schema Attributes (etl_db)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                  {selectedRequest.apiMethod && (
                    <div className="bg-white p-2 rounded border border-slate-200">
                      <span className="text-slate-400 block text-[10px] uppercase">API Method</span>
                      <span className="font-bold text-slate-800">{selectedRequest.apiMethod}</span>
                    </div>
                  )}
                  {selectedRequest.indicator && (
                    <div className="bg-white p-2 rounded border border-slate-200">
                      <span className="text-slate-400 block text-[10px] uppercase">FAQ Indicator</span>
                      <span className="font-bold text-slate-800">{selectedRequest.indicator}</span>
                    </div>
                  )}
                  {selectedRequest.sampleFilter && (
                    <div className="bg-white p-2 rounded border border-slate-200 sm:col-span-2">
                      <span className="text-slate-400 block text-[10px] uppercase">Query Filter Expression</span>
                      <span className="font-bold text-slate-800">{selectedRequest.sampleFilter}</span>
                    </div>
                  )}
                  {selectedRequest.sampleOutputColumn && (
                    <div className="bg-white p-2 rounded border border-slate-200 sm:col-span-2">
                      <span className="text-slate-400 block text-[10px] uppercase">Incident Output Columns</span>
                      <span className="font-bold text-slate-800">{selectedRequest.sampleOutputColumn}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Model & Policy */}
            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2 text-xs">
              <div className="font-bold text-indigo-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Execution Architecture &amp; Billing Policy</span>
              </div>
              <p className="text-indigo-950/80 leading-relaxed">
                Routed to <strong className="font-semibold">{selectedRequest.primaryModel}</strong> under{' '}
                <strong className="font-semibold">{selectedRequest.tier}</strong>.
                {selectedRequest.isFreeTier
                  ? ' Because Tier 1 & 2 are 100% Free cost savers, customer expenditure is $0.00.'
                  : ' Billed on Tier 3 rate of $0.0095/call, saving 68.3% compared to commercial retail GPT benchmarks.'}
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => handleCopy(selectedRequest.query, selectedRequest.id)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 transition"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedId === selectedRequest.id ? 'Copied!' : 'Copy Query'}</span>
              </button>
              <button
                onClick={() => setSelectedRequest(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
