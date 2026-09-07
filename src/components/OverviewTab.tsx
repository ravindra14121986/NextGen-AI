import React from 'react';
import {
  TrendingUp,
  DollarSign,
  Layers,
  ArrowUpRight,
  BarChart3,
  PieChart as PieIcon,
  PlusCircle,
  Zap,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { UsageSummaryData } from '../types';

interface OverviewTabProps {
  summary: UsageSummaryData | null;
  onOpenNewModal: () => void;
  onViewLogs: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  summary,
  onOpenNewModal,
  onViewLogs,
}) => {
  if (!summary) {
    return (
      <div className="py-24 text-center text-slate-500 flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-2 border-slate-300 border-t-indigo-600 rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium">Querying Neon PostgreSQL live metrics...</p>
      </div>
    );
  }

  const { metrics, byTier, byModel, byType, timeline } = summary;

  const totalStandard = parseFloat(metrics?.total_standard_cost || '0');
  const totalActual = parseFloat(metrics?.total_actual_cost || '0');
  const totalSavings = parseFloat(metrics?.total_savings || '0');
  const totalCalls = metrics?.total_calls || 0;

  const savingsPercent =
    totalStandard > 0 ? ((totalSavings / totalStandard) * 100).toFixed(1) : '0.0';

  // Format timeline data for area chart
  const timelineData =
    timeline.length > 0
      ? timeline.map((item) => ({
          date: item.date,
          calls: item.count,
          savings: parseFloat(item.savings),
          actualCost: parseFloat(item.actual_cost),
          standardCost: parseFloat(item.standard_cost),
        }))
      : [
          { date: 'Today', calls: totalCalls, savings: totalSavings, actualCost: totalActual, standardCost: totalStandard },
        ];

  // Palette matching Sleek Interface theme (Indigo, Emerald, Violet, Cyan, Amber)
  const sleekColors = ['#4f46e5', '#10b981', '#06b6d4', '#f59e0b', '#8b5cf6', '#64748b'];

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-200 gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-800">
            API Cost & Savings Performance
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time telemetry aggregated from PostgreSQL table{' '}
            <code className="text-slate-800 font-mono bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
              api_usage_logs
            </code>
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            id="explore-logs-btn"
            onClick={onViewLogs}
            className="px-3.5 py-2 text-xs font-medium border border-slate-200 rounded-lg hover:bg-white text-slate-700 transition-colors shadow-2xs flex items-center gap-1.5"
          >
            <span>View All Logs</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
          <button
            id="open-log-modal-btn"
            onClick={onOpenNewModal}
            className="px-3.5 py-2 text-xs font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-2xs flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Record Usage</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Grid (Matches Sleek Interface Design HTML) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Requests */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500 mb-1 font-medium">Total Requests</p>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
            {totalCalls.toLocaleString()}
          </h3>
          <div className="text-xs text-emerald-600 mt-2 font-medium flex items-center gap-1">
            <span>↑</span> Across {byModel.length} distinct models
          </div>
        </div>

        {/* Cumulative Savings */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500 mb-1 font-medium">Cumulative Savings</p>
          <h3 className="text-2xl font-bold text-indigo-600 font-mono tracking-tight">
            ${totalSavings.toFixed(4)}
          </h3>
          <p className="text-xs text-slate-400 mt-2 font-medium">
            Generated stored column ({savingsPercent}% saved)
          </p>
        </div>

        {/* Standard Cost */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500 mb-1 font-medium">Standard Cost</p>
          <h3 className="text-2xl font-bold text-slate-900 font-mono tracking-tight">
            ${totalStandard.toFixed(4)}
          </h3>
          <p className="text-xs text-slate-400 mt-2 font-medium">
            Avg: ${(totalCalls > 0 ? totalStandard / totalCalls : 0).toFixed(4)}/req
          </p>
        </div>

        {/* Actual Cost */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500 mb-1 font-medium">Actual Cost</p>
          <h3 className="text-2xl font-bold text-emerald-600 font-mono tracking-tight">
            ${totalActual.toFixed(4)}
          </h3>
          <p className="text-xs text-slate-400 mt-2 font-medium">
            Tier-applied pricing
          </p>
        </div>
      </div>

      {/* Visual Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">API Volume & Activity Timeline</h3>
              <p className="text-xs text-slate-400">Daily invocations logged to Neon PostgreSQL</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block"></span>
                Invocations
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="callsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                  itemStyle={{ color: '#818cf8' }}
                />
                <Area
                  type="monotone"
                  dataKey="calls"
                  name="API Invocations"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#callsGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tier Applied Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-slate-800">Tier Distribution</h3>
              <span className="text-[11px] text-indigo-600 font-mono bg-indigo-50 px-2 py-0.5 rounded-md font-medium">
                tier_applied
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-5">
              Breakdown of rate tiers and discount agreements
            </p>

            <div className="space-y-3.5">
              {byTier.map((t, idx) => {
                const pct = totalCalls > 0 ? Math.round((t.count / totalCalls) * 100) : 0;
                const badgeColor =
                  t.tier_applied === 'Enterprise' || t.tier_applied === 'Tier1'
                    ? '#4f46e5'
                    : t.tier_applied === 'Pro' || t.tier_applied === 'Tier2'
                    ? '#06b6d4'
                    : '#f59e0b';

                return (
                  <div key={t.tier_applied} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-700 flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: badgeColor }}
                        />
                        {t.tier_applied}
                      </span>
                      <span className="text-slate-500 font-mono">
                        {t.count} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: badgeColor,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-3.5 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Database Constraint:</span>
            <span className="font-mono text-slate-600 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
              tier_applied varchar(20) NOT NULL
            </span>
          </div>
        </div>
      </div>

      {/* Model & Request Type Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Model or Endpoint Analysis */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">Invocations by Model / Endpoint</h3>
              <p className="text-xs text-slate-400">Relative volume per registered endpoint</p>
            </div>
            <BarChart3 className="w-4 h-4 text-slate-400" />
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byModel} layout="vertical" margin={{ top: 5, right: 20, left: 35, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis
                  type="category"
                  dataKey="model_or_endpoint"
                  tick={{ fontSize: 11, fill: '#334155' }}
                  axisLine={false}
                  tickLine={false}
                  width={120}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Bar dataKey="count" name="Calls" radius={[0, 4, 4, 0]}>
                  {byModel.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={sleekColors[index % sleekColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Request Types & Operations */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">Operation / Request Type</h3>
              <p className="text-xs text-slate-400">Distribution across workflow intents</p>
            </div>
            <PieIcon className="w-4 h-4 text-slate-400" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
                  <th className="pb-2.5">Request Type</th>
                  <th className="pb-2.5 text-right">Invocations</th>
                  <th className="pb-2.5 text-right">Actual Cost</th>
                  <th className="pb-2.5 text-right">Savings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {byType.map((t) => (
                  <tr key={t.request_type} className="hover:bg-slate-50/75 transition-colors">
                    <td className="py-2.5 font-medium text-slate-800">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono bg-slate-100 text-slate-700">
                        {t.request_type}
                      </span>
                    </td>
                    <td className="py-2.5 text-right font-mono text-slate-600">{t.count}</td>
                    <td className="py-2.5 text-right font-mono text-slate-900 font-medium">
                      ${parseFloat(t.total_actual).toFixed(4)}
                    </td>
                    <td className="py-2.5 text-right font-mono text-emerald-600 font-semibold">
                      ${parseFloat(t.total_savings).toFixed(4)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
