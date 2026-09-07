import React, { useState } from 'react';
import {
  Scale,
  Sparkles,
  CheckCircle2,
  TrendingDown,
  ExternalLink,
  ShieldCheck,
  Zap,
  DollarSign,
  ChevronRight,
  Info,
} from 'lucide-react';
import { LlmCompetitorItem, TierEconomicsData } from '../types';
import { CircularMetricBox } from './CircularMetricBox';

interface LlmComparisonSectionProps {
  competitors: LlmCompetitorItem[];
  tierEconomics: TierEconomicsData | null;
  totalCalls: number;
  isLoading: boolean;
}

export const LlmComparisonSection: React.FC<LlmComparisonSectionProps> = ({
  competitors,
  tierEconomics,
  totalCalls,
  isLoading,
}) => {
  const [calculatorVolume, setCalculatorVolume] = useState<number>(totalCalls > 0 ? totalCalls : 1500);

  // Find benchmarks
  const gpt4o = competitors.find((c) => c.model.includes('GPT-4o (Standard)'));
  const claude35 = competitors.find((c) => c.model.includes('Claude 3.5 Sonnet'));
  const geminiPro = competitors.find((c) => c.model.includes('Gemini 1.5 Pro'));

  const maxTotalCost = Math.max(...competitors.map((c) => c.totalCost), 1);

  // Free calls ratio in our app (Tier 1 & 2)
  const freeCallsPercent = tierEconomics?.overall.freeCallsPercent || 85;
  const tier3Rate = tierEconomics?.tier3.ratePerCall || 0.0095;

  return (
    <div className="space-y-8">
      {/* Strategic Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 border border-amber-800/60 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold">
            <Scale className="w-3.5 h-3.5" />
            <span>Commercial Market Pricing Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Multi-LLM Cost Comparison Matrix
          </h1>
          <p className="text-sm text-amber-200/85 leading-relaxed">
            Direct benchmark of current query volume against retail commercial APIs (OpenAI GPT-4o, Anthropic Claude, Google Gemini). Because <strong className="text-emerald-300 font-bold">Tier 1 &amp; Tier 2 are 100% FREE cost savers</strong> and <strong className="text-amber-300 font-bold">only Tier 3 is chargeable</strong>, our blended rate is fundamentally lower than any standalone LLM provider.
          </p>
        </div>
      </div>

      {/* CIRCULAR GAUGES WITH SOFT EDGES & GRADIENT COLOR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 justify-items-center bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
        <CircularMetricBox
          title="Saved vs GPT-4o"
          value={`$${Math.round(gpt4o?.savingsVsProvider || 0).toLocaleString()}`}
          subtitle="OpenAI Benchmark"
          badgeText="vs GPT"
          trend={`${Math.round(gpt4o?.savingsPercent || 0)}% Lower`}
          variant="emerald"
          icon={<DollarSign className="w-4 h-4" />}
          footnote="Saved against $0.0300 rate"
        />

        <CircularMetricBox
          title="Saved vs Claude 3.5"
          value={`$${Math.round(claude35?.savingsVsProvider || 0).toLocaleString()}`}
          subtitle="Anthropic Sonnet"
          badgeText="vs Claude"
          trend={`${Math.round(claude35?.savingsPercent || 0)}% Lower`}
          variant="amber"
          icon={<TrendingDown className="w-4 h-4" />}
          footnote="Saved against $0.0240 rate"
        />

        <CircularMetricBox
          title="Saved vs Gemini Pro"
          value={`$${Math.round(geminiPro?.savingsVsProvider || 0).toLocaleString()}`}
          subtitle="Google Gemini 1.5"
          badgeText="vs Gemini"
          trend={`${Math.round(geminiPro?.savingsPercent || 0)}% Lower`}
          variant="blue"
          icon={<Zap className="w-4 h-4" />}
          footnote="Saved against $0.0180 rate"
        />

        <CircularMetricBox
          title="Free Tier Volume"
          value={`${freeCallsPercent.toFixed(0)}%`}
          subtitle="Zero Customer Cost"
          badgeText="Real Saver"
          trend="Tier 1 & 2 Free"
          variant="purple"
          icon={<ShieldCheck className="w-4 h-4" />}
          footnote="Zero API charges applied"
        />
      </div>

      {/* FULL COMPARISON MATRIX TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Commercial LLM Unit Economics &amp; Expenditure Matrix
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Based on current call volume of {totalCalls.toLocaleString()} requests recorded in PostgreSQL
            </p>
          </div>
          <span className="text-xs font-mono bg-indigo-50 text-indigo-700 font-semibold px-3 py-1 rounded-full border border-indigo-200">
            {competitors.length} Providers Benchmarked
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
              <tr>
                <th className="py-3.5 px-6">Provider &amp; Architecture</th>
                <th className="py-3.5 px-6">Model Configuration</th>
                <th className="py-3.5 px-6 text-right">Unit Rate / Call</th>
                <th className="py-3.5 px-6 text-right">Total Expenditure</th>
                <th className="py-3.5 px-6 text-right">Savings Delivered</th>
                <th className="py-3.5 px-6 text-center">Cost Advantage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {competitors.map((item) => {
                const isOurApp = item.isOurApp;
                return (
                  <tr
                    key={item.provider + item.model}
                    className={`transition-colors ${
                      isOurApp
                        ? 'bg-indigo-50/60 font-bold hover:bg-indigo-50'
                        : 'hover:bg-slate-50/80'
                    }`}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {isOurApp && (
                          <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                        )}
                        <span className={`text-xs ${isOurApp ? 'text-indigo-900 font-extrabold' : 'text-slate-900'}`}>
                          {item.provider}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span className={`font-mono text-xs px-2 py-0.5 rounded ${
                        isOurApp ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {item.model}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right font-mono font-semibold text-slate-700">
                      ${item.ratePerCall.toFixed(4)}
                    </td>

                    <td className="py-4 px-6 text-right font-mono font-bold text-sm">
                      <span className={isOurApp ? 'text-indigo-700' : 'text-slate-900'}>
                        ${item.totalCost.toFixed(2)}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right font-mono font-bold">
                      {isOurApp ? (
                        <span className="text-indigo-600 text-[11px] uppercase tracking-wider">
                          Baseline Host
                        </span>
                      ) : (
                        <span className="text-emerald-600 font-mono">
                          +${item.savingsVsProvider.toFixed(2)}
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-center">
                      {isOurApp ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-600 text-white shadow-xs">
                          Lowest Cost Host
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                          {item.savingsPercent.toFixed(0)}% Saved
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* DYNAMIC MULTI-LLM VOLUME CALCULATOR */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Interactive Multi-LLM Call Volume Simulator</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select or type a projected query volume to compare budget impact across all 4 major platforms
            </p>
          </div>

          {/* Quick preset buttons */}
          <div className="flex items-center gap-2">
            {[10000, 50000, 100000, 500000].map((preset) => (
              <button
                key={preset}
                onClick={() => setCalculatorVolume(preset)}
                className={`px-3 py-1 text-xs font-mono rounded-lg transition font-semibold ${
                  calculatorVolume === preset
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {(preset / 1000)}k
              </button>
            ))}
          </div>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Our App Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-indigo-50 to-purple-50 border-2 border-indigo-400 shadow-sm space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200">
              Our App (T1&amp;T2 Free + T3)
            </span>
            <div className="text-2xl font-extrabold font-mono text-indigo-700">
              ${(calculatorVolume * (1 - (freeCallsPercent / 100)) * tier3Rate).toFixed(2)}
            </div>
            <p className="text-[11px] text-slate-600">
              {(calculatorVolume * (freeCallsPercent / 100)).toFixed(0)} calls free + remaining @ $0.0095
            </p>
          </div>

          {/* OpenAI GPT-4o */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
              OpenAI GPT-4o
            </span>
            <div className="text-2xl font-extrabold font-mono text-slate-900">
              ${(calculatorVolume * 0.0300).toFixed(2)}
            </div>
            <p className="text-[11px] text-emerald-600 font-semibold">
              Our App saves ${((calculatorVolume * 0.0300) - (calculatorVolume * (1 - (freeCallsPercent / 100)) * tier3Rate)).toFixed(2)}
            </p>
          </div>

          {/* Anthropic Claude 3.5 */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
              Claude 3.5 Sonnet
            </span>
            <div className="text-2xl font-extrabold font-mono text-slate-900">
              ${(calculatorVolume * 0.0240).toFixed(2)}
            </div>
            <p className="text-[11px] text-emerald-600 font-semibold">
              Our App saves ${((calculatorVolume * 0.0240) - (calculatorVolume * (1 - (freeCallsPercent / 100)) * tier3Rate)).toFixed(2)}
            </p>
          </div>

          {/* Google Gemini 1.5 Pro */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
              Google Gemini 1.5 Pro
            </span>
            <div className="text-2xl font-extrabold font-mono text-slate-900">
              ${(calculatorVolume * 0.0180).toFixed(2)}
            </div>
            <p className="text-[11px] text-emerald-600 font-semibold">
              Our App saves ${((calculatorVolume * 0.0180) - (calculatorVolume * (1 - (freeCallsPercent / 100)) * tier3Rate)).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
