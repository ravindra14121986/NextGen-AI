import React from 'react';
import {
  Activity,
  Zap,
  Cpu,
  Layers,
  Clock,
  CheckCircle,
  TrendingUp,
  Server,
  ArrowUpRight,
} from 'lucide-react';
import { UsageSummaryData } from '../types';
import { CircularMetricBox } from './CircularMetricBox';

interface ApiRequestsSectionProps {
  summary: UsageSummaryData | null;
  isLoading: boolean;
}

export const ApiRequestsSection: React.FC<ApiRequestsSectionProps> = ({
  summary,
  isLoading,
}) => {
  const metrics = summary?.metrics;
  const byModel = summary?.byModel || [];
  const byType = summary?.byType || [];
  const timeline = summary?.timeline || [];

  const totalCalls = metrics?.total_calls || 0;
  const avgCost = parseFloat(metrics?.avg_actual_cost || '0');
  const avgSavings = parseFloat(metrics?.avg_savings || '0');
  const totalModels = byModel.length;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-950 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 border border-purple-800/60 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-200 text-xs font-semibold">
            <Activity className="w-3.5 h-3.5" />
            <span>Throughput &amp; Query Volume Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            API Call Request Count &amp; Traffic Volume
          </h1>
          <p className="text-sm text-purple-200/85 leading-relaxed">
            Monitor granular API invocation metrics, model endpoint distribution, request types (chat completions, embeddings, ETL queries), and throughput velocity.
          </p>
        </div>
      </div>

      {/* CIRCULAR GAUGES WITH SOFT EDGES & GRADIENT COLOR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 justify-items-center bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
        <CircularMetricBox
          title="Total API Calls"
          value={totalCalls.toLocaleString()}
          subtitle="Processed Requests"
          badgeText="Throughput"
          trend="Neon DB"
          variant="purple"
          icon={<Zap className="w-4 h-4" />}
          footnote="Live from api_usage_logs"
        />

        <CircularMetricBox
          title="Active Models"
          value={totalModels}
          subtitle="Endpoints Mapped"
          badgeText="Models"
          trend="Multi-LLM"
          variant="indigo"
          icon={<Cpu className="w-4 h-4" />}
          footnote="GPT, Claude, Gemini"
        />

        <CircularMetricBox
          title="Avg Cost / Call"
          value={`$${avgCost.toFixed(5)}`}
          subtitle="Blended Actual"
          badgeText="Efficiency"
          trend="Discounted"
          variant="emerald"
          icon={<TrendingUp className="w-4 h-4" />}
          footnote="Includes $0 free tiers"
        />

        <CircularMetricBox
          title="Avg Saved / Call"
          value={`$${avgSavings.toFixed(5)}`}
          subtitle="vs Commercial GPT"
          badgeText="Savings"
          trend="+100% Value"
          variant="blue"
          icon={<Activity className="w-4 h-4" />}
          footnote="Saved per request"
        />
      </div>

      {/* MODEL & ENDPOINT BREAKDOWN TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              API Requests Volume by Model &amp; Endpoint
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Breakdown of total invocations, total spend, and realized savings by individual LLM model
            </p>
          </div>
          <span className="text-xs font-mono bg-purple-50 text-purple-700 px-3 py-1 rounded-full border border-purple-200 font-semibold">
            {byModel.length} Configured Models
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
              <tr>
                <th className="py-3.5 px-6">Model / Endpoint</th>
                <th className="py-3.5 px-6 text-center">Request Count</th>
                <th className="py-3.5 px-6 text-center">Volume Share</th>
                <th className="py-3.5 px-6 text-right">Actual Spent</th>
                <th className="py-3.5 px-6 text-right">Total Saved</th>
                <th className="py-3.5 px-6 text-right">Avg Cost/Call</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {byModel.map((m) => {
                const sharePercent = totalCalls > 0 ? (m.count / totalCalls) * 100 : 0;
                return (
                  <tr key={m.model_or_endpoint} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900 text-xs font-mono">
                        {m.model_or_endpoint}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center font-mono font-bold text-slate-800">
                      {m.count.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="inline-flex items-center gap-2">
                        <div className="w-16 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-indigo-600 h-full rounded-full"
                            style={{ width: `${Math.min(100, Math.max(5, sharePercent))}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px] text-slate-600">
                          {sharePercent.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right font-mono font-semibold text-slate-800">
                      ${parseFloat(m.total_actual).toFixed(2)}
                    </td>
                    <td className="py-4 px-6 text-right font-mono font-bold text-emerald-600">
                      ${parseFloat(m.total_savings).toFixed(2)}
                    </td>
                    <td className="py-4 px-6 text-right font-mono text-slate-600">
                      ${parseFloat(m.avg_cost).toFixed(5)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* REQUEST TYPE DISTRIBUTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>Request Type Classification</span>
          </h3>
          <p className="text-xs text-slate-500">
            Categorization of queries into conversation, completions, and background syncs
          </p>

          <div className="space-y-3 pt-2">
            {byType.map((t) => (
              <div
                key={t.request_type}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-xs text-slate-800 uppercase tracking-wide">
                    {t.request_type}
                  </span>
                  <div className="text-[11px] text-slate-500 font-mono">
                    {t.count.toLocaleString()} requests
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-emerald-600 text-xs">
                    +${parseFloat(t.total_savings).toFixed(2)} saved
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    ${parseFloat(t.total_actual).toFixed(2)} billed
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Request Timeline */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-600" />
            <span>Daily Call Velocity Timeline</span>
          </h3>
          <p className="text-xs text-slate-500">
            Recent request counts recorded in PostgreSQL chronologically
          </p>

          <div className="space-y-2 pt-2 max-h-72 overflow-y-auto pr-1">
            {timeline.slice(-7).reverse().map((day) => (
              <div
                key={day.date}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span className="font-mono font-semibold text-slate-800">{day.date}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-slate-700 font-bold">
                    {day.count.toLocaleString()} calls
                  </span>
                  <span className="font-mono text-emerald-600 font-bold">
                    +${parseFloat(day.savings).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
