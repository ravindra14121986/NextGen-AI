import React from 'react';
import {
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  Database,
  Users,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  ChevronRight,
  Coins,
  Flame,
} from 'lucide-react';
import { CircularMetricBox } from './CircularMetricBox';
import { ChasingLightCard } from './ChasingLightCard';
import {
  McKinseyAnalyticsData,
  UsageSummaryData,
} from '../types';
import { ActiveSection } from './Sidebar';

interface MckinseyHomeViewProps {
  analytics: McKinseyAnalyticsData | null;
  summary: UsageSummaryData | null;
  onNavigateSection: (section: ActiveSection) => void;
  onOpenNewModal: () => void;
  isLoading: boolean;
}

export const MckinseyHomeView: React.FC<MckinseyHomeViewProps> = ({
  analytics,
  summary,
  onNavigateSection,
  onOpenNewModal,
  isLoading,
}) => {
  const usersSummary = analytics?.usersSummary;
  const tierEconomics = analytics?.tierEconomics;
  const llmComparison = analytics?.llmComparison || [];

  const totalCalls = tierEconomics?.overall.totalCalls || summary?.metrics.total_calls || 0;
  const totalSaved = tierEconomics?.overall.totalRealSavings || parseFloat(summary?.metrics.total_savings || '0') || 0;
  const totalUsers = usersSummary?.totalUsers || 0;
  const loggedInUsers = usersSummary?.loggedInUsers || 0;
  const activeUsers = usersSummary?.activeUsers || 0;
  const freeCallsCount = tierEconomics?.overall.freeCallsCount || 0;
  const freeCallsPercent = tierEconomics?.overall.freeCallsPercent || 0;
  const chargeableCallsCount = tierEconomics?.overall.chargeableCallsCount || 0;
  const totalCustomerCharged = tierEconomics?.overall.totalChargedToCustomers || 0;

  // Max cost for LLM comparison bar scale
  const maxLlmCost = Math.max(...llmComparison.map((c) => c.totalCost), 1);

  return (
    <div className="space-y-8">
      {/* Top McKinsey Strategic Advisory Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 border border-slate-800 shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2.5 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>Omni View Executive Briefing</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Enterprise LLM Cost &amp; Tier Optimization
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Our hybrid routing infrastructure eliminates commercial API overhead: <strong className="text-emerald-400">Tier 1 &amp; Tier 2 are 100% FREE cost savers</strong>, absorbing {freeCallsPercent.toFixed(1)}% of total call volume with zero customer charges. Only <strong className="text-amber-300">Tier 3 is chargeable</strong>, discounted by over 68% against standard OpenAI GPT-4o benchmarks.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
            <button
              onClick={() => onNavigateSection('cost_savings')}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-lg shadow-indigo-600/30 flex items-center gap-1.5"
            >
              <span>Explore Tier ROI</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenNewModal}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-xs transition backdrop-blur-xs flex items-center gap-1.5"
            >
              <span>+ Record Usage</span>
            </button>
          </div>
        </div>

        {/* Quick Highlights Strip */}
        <div className="relative z-10 mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Free API Throughput</span>
            <span className="font-mono font-bold text-emerald-400 text-sm">
              {freeCallsPercent.toFixed(1)}% of all calls
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Tier 1 &amp; 2 Customer Cost</span>
            <span className="font-mono font-bold text-emerald-300 text-sm">
              $0.00 (100% Free)
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Tier 3 Rate / Call</span>
            <span className="font-mono font-bold text-amber-300 text-sm">
              ${tierEconomics?.tier3.ratePerCall?.toFixed(4) || '0.0095'} (vs $0.0300 GPT)
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Logged-in User Ratio</span>
            <span className="font-mono font-bold text-indigo-300 text-sm">
              {totalUsers > 0 ? Math.round((loggedInUsers / totalUsers) * 100) : 0}% Active Now
            </span>
          </div>
        </div>
      </div>

      {/* CIRCULAR BOXES WITH SOFT EDGE & GRADIENT COLOR */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Core Executive Metrics</span>
              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                Circular Gradient Gauges
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Live intelligence aggregated from Neon PostgreSQL <code className="font-mono text-slate-700">api_usage_logs</code> and <code className="font-mono text-slate-700">users</code>
            </p>
          </div>
          <button
            onClick={() => onNavigateSection('llm_comparison')}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
          >
            <span>View LLM Benchmarks</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 5 Circular Boxes with Soft Edges & Gradient Colors */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 justify-items-center bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
          {/* Circle 1: Total Real Cost Saved */}
          <CircularMetricBox
            title="Total Cost Saved"
            value={`$${Math.round(totalSaved).toLocaleString()}`}
            subtitle="Calculated vs GPT Rates"
            badgeText="ROI Leader"
            trend="+100% Efficiency"
            variant="emerald"
            icon={<Coins className="w-4 h-4" />}
            footnote="Tier 1 & 2 Free + Tier 3 Discounts"
          />

          {/* Circle 2: Total API Requests Count */}
          <CircularMetricBox
            title="Total API Calls"
            value={totalCalls.toLocaleString()}
            subtitle="Processed Queries"
            badgeText="Throughput"
            trend="Active"
            variant="indigo"
            icon={<Zap className="w-4 h-4" />}
            footnote="All models & endpoints"
          />

          {/* Circle 3: Total & Logged In Users */}
          <CircularMetricBox
            title="Active / Total Users"
            value={`${activeUsers}/${totalUsers}`}
            subtitle={`${loggedInUsers} Logged In`}
            badgeText="Accounts"
            trend={`${Math.round((loggedInUsers / Math.max(1, totalUsers)) * 100)}% Online`}
            variant="blue"
            icon={<Users className="w-4 h-4" />}
            footnote="Verified User Directory"
          />

          {/* Circle 4: Tier 1 & Tier 2 Free Volume (The Real Cost Saver) */}
          <CircularMetricBox
            title="Tier 1 & 2 Free Calls"
            value={freeCallsCount.toLocaleString()}
            subtitle="$0.00 Billed to Users"
            badgeText="Real Cost Saver"
            trend="100% Free Tier"
            variant="purple"
            icon={<ShieldCheck className="w-4 h-4" />}
            footnote="Enterprise & Pro Subsidized"
          />

          {/* Circle 5: Tier 3 Chargeable Calls */}
          <CircularMetricBox
            title="Tier 3 Chargeable"
            value={chargeableCallsCount.toLocaleString()}
            subtitle={`$${totalCustomerCharged.toFixed(2)} Total Billed`}
            badgeText="Chargeable"
            trend="$0.0095/call"
            variant="amber"
            icon={<Coins className="w-4 h-4" />}
            footnote="vs $0.0300 GPT Benchmark"
          />
        </div>
      </div>

      {/* TOP 10 TRENDING USER REQUESTS SPOTLIGHT BANNER */}
      <ChasingLightCard
        variant="purple"
        rounded="rounded-3xl"
        onClick={() => onNavigateSection('trending_requests')}
      >
        <div className="p-5 sm:p-6 bg-gradient-to-r from-rose-950/90 via-purple-950/80 to-slate-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-400/30 flex items-center justify-center shrink-0">
              <Flame className="w-6 h-6 text-rose-400 animate-pulse" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded-full border border-rose-400/30">
                  New Live Tab
                </span>
                <span className="text-xs text-rose-200/80 font-mono">
                  30s Auto-Syncing Active
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Top 10 Trending User Requests &amp; Invocations
              </h3>
              <p className="text-xs text-rose-100/70 max-w-2xl">
                Explore real-time query counts, ServiceNow incident FAQ lookups, priority and assignment status queries directly from etl_db with 100% real database records.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
            <span className="text-xs font-semibold text-rose-200 hidden sm:inline">
              Click to Open Live Dashboard
            </span>
            <div className="p-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white transition flex items-center gap-1.5 shadow-md shadow-rose-900/40 font-semibold text-xs">
              <span>View Top 10</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </ChasingLightCard>

      {/* TABLE FOR TOTAL USERS, LOGGED IN USERS, LICENCE WISE DISTRIBUTION */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-800">
                License-Wise Distribution &amp; User Engagement Table
              </h2>
              <span className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded-full border border-indigo-200">
                {usersSummary?.licenseDistribution.length || 0} License Tiers
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Breakdown of total users, actively logged-in accounts, API consumption, and cost savings per license tier
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateSection('users_licenses')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 px-3 py-1.5 rounded-lg border border-indigo-100 hover:bg-indigo-50 transition"
            >
              Open Full User Directory →
            </button>
          </div>
        </div>

        {/* High Level Metrics Banner for the Table */}
        <div className="bg-slate-50/70 border-b border-slate-100 px-6 py-3.5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 uppercase text-[10px] font-bold">Total Registered Users</span>
            <div className="text-base font-bold text-slate-800 font-mono">{totalUsers} Users</div>
          </div>
          <div>
            <span className="text-slate-400 uppercase text-[10px] font-bold">Currently Logged In</span>
            <div className="text-base font-bold text-indigo-600 font-mono flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {loggedInUsers} Accounts
            </div>
          </div>
          <div>
            <span className="text-slate-400 uppercase text-[10px] font-bold">Active Account Status</span>
            <div className="text-base font-bold text-emerald-600 font-mono">{activeUsers} Active</div>
          </div>
          <div>
            <span className="text-slate-400 uppercase text-[10px] font-bold">Billing Policy</span>
            <div className="text-xs font-bold text-slate-700 mt-0.5">
              Tier 1 &amp; 2 <span className="text-emerald-600">Free</span> · Tier 3 <span className="text-amber-600">Paid</span>
            </div>
          </div>
        </div>

        {/* The License Distribution Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
              <tr>
                <th className="py-3.5 px-6">License / Subscription</th>
                <th className="py-3.5 px-6">App Tier Mapping</th>
                <th className="py-3.5 px-6 text-center">Total Users</th>
                <th className="py-3.5 px-6 text-center">Logged-In Users</th>
                <th className="py-3.5 px-6 text-center">Active Status</th>
                <th className="py-3.5 px-6 text-right">API Calls Consumed</th>
                <th className="py-3.5 px-6 text-right">Total Cost Saved</th>
                <th className="py-3.5 px-6 text-center">Chargeable Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {usersSummary?.licenseDistribution.map((item) => (
                <tr key={item.license} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-bold text-slate-800 text-xs">
                      {item.license}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {item.assignedKeys} key{item.assignedKeys === 1 ? '' : 's'} assigned
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-slate-100 text-slate-700 border border-slate-200">
                      {item.tierMapping}
                    </span>
                  </td>

                  <td className="py-4 px-6 text-center font-mono font-bold text-slate-800">
                    {item.userCount}
                  </td>

                  <td className="py-4 px-6 text-center">
                    <span className="inline-flex items-center gap-1 font-mono font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {item.loggedInCount}
                    </span>
                  </td>

                  <td className="py-4 px-6 text-center font-mono text-emerald-700">
                    {item.activeCount}
                  </td>

                  <td className="py-4 px-6 text-right font-mono text-slate-800 font-semibold">
                    {item.totalApiCalls.toLocaleString()}
                  </td>

                  <td className="py-4 px-6 text-right font-mono font-bold text-emerald-600">
                    ${item.totalSaved.toFixed(2)}
                  </td>

                  <td className="py-4 px-6 text-center">
                    {item.isChargeable ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800 border border-amber-300">
                        Chargeable (Tier 3)
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                        100% Free (Cost Saver)
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MULTI-LLM COST COMPARISON MATRIX SECTION */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-800">
                Multi-LLM Commercial Cost Comparison
              </h2>
              <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                Current API Call Volume: {totalCalls.toLocaleString()} Calls
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Benchmarking total expenditure if current call volume were executed on standard commercial LLM pricing (GPT-4o, Claude 3.5 Sonnet, Gemini 1.5 Pro)
            </p>
          </div>

          <button
            onClick={() => onNavigateSection('llm_comparison')}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
          >
            <span>Detailed Cost Breakdown</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Visual Benchmark Bars */}
        <div className="space-y-4">
          {llmComparison.map((comp) => {
            const isOurApp = comp.isOurApp;
            const barWidthPercent = Math.max(6, (comp.totalCost / maxLlmCost) * 100);

            return (
              <div
                key={comp.provider + comp.model}
                className={`p-4 rounded-2xl border transition-all ${
                  isOurApp
                    ? 'bg-gradient-to-r from-indigo-50/70 to-purple-50/70 border-indigo-200 ring-2 ring-indigo-500/20'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">
                      {comp.provider}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono bg-white px-2 py-0.5 rounded border border-slate-200">
                      {comp.model}
                    </span>
                    {isOurApp && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-600 text-white px-2 py-0.5 rounded-full">
                        Our Hybrid Architecture
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-slate-400 font-mono">
                      ${comp.ratePerCall.toFixed(4)} / call
                    </span>
                    <span className={`font-mono font-bold text-sm ${isOurApp ? 'text-indigo-700' : 'text-slate-900'}`}>
                      ${comp.totalCost.toFixed(2)} Total
                    </span>
                    {!isOurApp && comp.savingsVsProvider > 0 && (
                      <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                        Saved ${comp.savingsVsProvider.toFixed(2)} ({comp.savingsPercent.toFixed(0)}%)
                      </span>
                    )}
                  </div>
                </div>

                {/* Relative Cost Bar */}
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isOurApp
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 shadow-sm'
                        : comp.provider.includes('OpenAI')
                        ? 'bg-emerald-500'
                        : comp.provider.includes('Anthropic')
                        ? 'bg-amber-500'
                        : 'bg-blue-500'
                    }`}
                    style={{ width: `${barWidthPercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Strategic Takeaway Box */}
        <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-start gap-3 text-xs text-indigo-950">
          <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block">Omni View Economic Summary</span>
            <p className="text-indigo-900/80 leading-relaxed">
              By reserving charges strictly to <strong>Tier 3 at $0.0095 per API call</strong> and keeping <strong>Tier 1 &amp; Tier 2 100% free</strong>, your organization achieves an average <strong>{tierEconomics?.overall.netSavingsRate ? tierEconomics.overall.netSavingsRate.toFixed(1) : '78.5'}% reduction</strong> compared to direct commercial OpenAI GPT-4o subscriptions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
