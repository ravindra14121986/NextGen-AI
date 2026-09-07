import React, { useState } from 'react';
import {
  PiggyBank,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Zap,
  TrendingDown,
  Info,
  Sliders,
  DollarSign,
  ArrowRight,
  BarChart3,
  Coins,
} from 'lucide-react';
import { TierEconomicsData } from '../types';
import { CircularMetricBox } from './CircularMetricBox';

interface CostSavingsSectionProps {
  tierEconomics: TierEconomicsData | null;
  isLoading: boolean;
}

export const CostSavingsSection: React.FC<CostSavingsSectionProps> = ({
  tierEconomics,
  isLoading,
}) => {
  const [simulatedCalls, setSimulatedCalls] = useState<number>(50000);
  const [tier1Ratio, setTier1Ratio] = useState<number>(55);
  const [tier2Ratio, setTier2Ratio] = useState<number>(30);

  // Derived Tier 3 ratio: remaining percentage
  const tier3Ratio = Math.max(0, 100 - tier1Ratio - tier2Ratio);

  const t1 = tierEconomics?.tier1;
  const t2 = tierEconomics?.tier2;
  const t3 = tierEconomics?.tier3;
  const overall = tierEconomics?.overall;

  const totalSaved = overall?.totalRealSavings || 0;
  const totalCalls = overall?.totalCalls || 0;
  const freeCallsCount = overall?.freeCallsCount || 0;
  const chargeableCallsCount = overall?.chargeableCallsCount || 0;
  const totalCharged = overall?.totalChargedToCustomers || 0;

  // Simulator Calculations
  const simT1Calls = Math.round(simulatedCalls * (tier1Ratio / 100));
  const simT2Calls = Math.round(simulatedCalls * (tier2Ratio / 100));
  const simT3Calls = simulatedCalls - simT1Calls - simT2Calls;

  const gptRate = 0.0300; // standard GPT-4o cost per API call
  const tier3Rate = 0.0095; // our tier 3 charge per call

  const simCommercialGptCost = simulatedCalls * gptRate;
  // In our app, Tier 1 & 2 are $0 (Free)
  const simOurAppCost = simT3Calls * tier3Rate;
  const simSavings = simCommercialGptCost - simOurAppCost;
  const simSavingsPercent = (simSavings / simCommercialGptCost) * 100;

  return (
    <div className="space-y-8">
      {/* Strategic Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white p-6 sm:p-8 border border-emerald-800/60 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
            <PiggyBank className="w-3.5 h-3.5" />
            <span>Enterprise Cost Governance &amp; Tier Policy</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Cost Savings &amp; Tier Pricing Architecture
          </h1>
          <p className="text-sm text-emerald-200/85 leading-relaxed">
            Strict policy enforcement: <strong className="text-white underline decoration-emerald-400 font-bold">Tier 1 &amp; Tier 2 are 100% FREE</strong> for users (the real cost savers), absorbing subsidized volume with zero charges. <strong className="text-amber-300 font-bold">Only Tier 3 is chargeable</strong>, billed per API call benchmarked against commercial GPT model rates.
          </p>
        </div>
      </div>

      {/* CIRCULAR GAUGES WITH SOFT EDGES & GRADIENT COLOR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
        <CircularMetricBox
          title="Total Real Saved"
          value={`$${Math.round(totalSaved).toLocaleString()}`}
          subtitle="Enterprise Savings"
          badgeText="Cumulative"
          trend="Saved"
          variant="emerald"
          icon={<DollarSign className="w-4 h-4" />}
          footnote="Free T1 & T2 + T3 Discounts"
        />

        <CircularMetricBox
          title="Tier 1 (Free) Saved"
          value={`$${Math.round(t1?.totalSaved || 0).toLocaleString()}`}
          subtitle="Subsidized Enterprise"
          badgeText="100% Free"
          trend="$0.00 Billed"
          variant="purple"
          icon={<ShieldCheck className="w-4 h-4" />}
          footnote="Zero charge to customer"
        />

        <CircularMetricBox
          title="Tier 2 (Free) Saved"
          value={`$${Math.round(t2?.totalSaved || 0).toLocaleString()}`}
          subtitle="Pro Dev Agreement"
          badgeText="100% Free"
          trend="$0.00 Billed"
          variant="indigo"
          icon={<Zap className="w-4 h-4" />}
          footnote="Zero charge to customer"
        />

        <CircularMetricBox
          title="Tier 3 (Chargeable)"
          value={`$${totalCharged.toFixed(2)}`}
          subtitle="Only Chargeable Tier"
          badgeText="Chargeable"
          trend="$0.0095/call"
          variant="amber"
          icon={<Coins className="w-4 h-4" />}
          footnote="Benchmarked vs GPT-4o"
        />
      </div>

      {/* TIER-BY-TIER DEEP DIVE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tier 1 Card: 100% Free Cost Saver */}
        <div className="rounded-3xl border-2 border-emerald-500/30 bg-gradient-to-b from-emerald-50/50 to-white p-6 space-y-4 relative shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full border border-emerald-300">
              The Real Cost Saver
            </span>
            <span className="font-mono font-extrabold text-emerald-600 text-lg">
              $0.00 / call
            </span>
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900">
              Tier 1: Enterprise Dedicated
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              100% subsidized enterprise partner tier. All calls in this tier carry zero customer charges and deliver maximum cost avoidance.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-emerald-100 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Processed Calls:</span>
              <span className="font-mono font-bold text-slate-800">{t1?.calls.toLocaleString() || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Cost to Customer:</span>
              <span className="font-mono font-bold text-emerald-600">$0.00 (FREE)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Commercial Benchmark:</span>
              <span className="font-mono text-slate-600">${t1?.standardCost?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex justify-between border-t border-slate-100 pt-2 font-semibold">
              <span className="text-emerald-800">Net Dollar Savings:</span>
              <span className="font-mono font-bold text-emerald-600">${t1?.totalSaved.toFixed(2) || '0.00'}</span>
            </div>
          </div>
        </div>

        {/* Tier 2 Card: 100% Free Cost Saver */}
        <div className="rounded-3xl border-2 border-indigo-500/30 bg-gradient-to-b from-indigo-50/50 to-white p-6 space-y-4 relative shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full border border-indigo-300">
              The Real Cost Saver
            </span>
            <span className="font-mono font-extrabold text-indigo-600 text-lg">
              $0.00 / call
            </span>
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900">
              Tier 2: Pro Volume Agreement
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Pre-allocated high-volume professional pool. High concurrency with $0.00 billed to the client organization.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-indigo-100 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Processed Calls:</span>
              <span className="font-mono font-bold text-slate-800">{t2?.calls.toLocaleString() || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Cost to Customer:</span>
              <span className="font-mono font-bold text-indigo-600">$0.00 (FREE)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Commercial Benchmark:</span>
              <span className="font-mono text-slate-600">${t2?.standardCost?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex justify-between border-t border-slate-100 pt-2 font-semibold">
              <span className="text-indigo-800">Net Dollar Savings:</span>
              <span className="font-mono font-bold text-indigo-600">${t2?.totalSaved.toFixed(2) || '0.00'}</span>
            </div>
          </div>
        </div>

        {/* Tier 3 Card: Only Chargeable Tier */}
        <div className="rounded-3xl border-2 border-amber-500/40 bg-gradient-to-b from-amber-50/50 to-white p-6 space-y-4 relative shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-300">
              Only Chargeable Tier
            </span>
            <span className="font-mono font-extrabold text-amber-700 text-lg">
              ${t3?.ratePerCall?.toFixed(4) || '0.0095'} / call
            </span>
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900">
              Tier 3: On-Demand &amp; Standard
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              The ONLY chargeable tier in our application. Billed transparently per call, benchmarked against commercial GPT charges ($0.0300).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-amber-100 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Processed Calls:</span>
              <span className="font-mono font-bold text-slate-800">{t3?.calls.toLocaleString() || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Rate per Call:</span>
              <span className="font-mono font-bold text-amber-700">${t3?.ratePerCall?.toFixed(4) || '0.0095'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Total Billed to Customer:</span>
              <span className="font-mono font-bold text-slate-900">${t3?.costToCustomer.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex justify-between border-t border-slate-100 pt-2 font-semibold">
              <span className="text-amber-900">Savings vs Commercial GPT:</span>
              <span className="font-mono font-bold text-emerald-600">${t3?.totalSaved.toFixed(2) || '0.00'} (68%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* INTERACTIVE ROI & SIMULATOR CALCULATOR */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">
                Interactive Tier Routing &amp; Savings Simulator
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulate enterprise API call volume to project savings between Free Tiers (1 &amp; 2) and Chargeable Tier 3
            </p>
          </div>
          <span className="text-xs font-mono bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-200 font-semibold">
            {simulatedCalls.toLocaleString()} Calls Simulated
          </span>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-2xl bg-slate-50 border border-slate-200">
          <div>
            <label className="text-xs font-bold text-slate-700 flex justify-between mb-1.5">
              <span>Total API Calls</span>
              <span className="font-mono text-indigo-600">{simulatedCalls.toLocaleString()}</span>
            </label>
            <input
              type="range"
              min="1000"
              max="200000"
              step="1000"
              value={simulatedCalls}
              onChange={(e) => setSimulatedCalls(parseInt(e.target.value, 10))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>1k</span>
              <span>100k</span>
              <span>200k</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-emerald-800 flex justify-between mb-1.5">
              <span>Tier 1 Allocation (100% Free)</span>
              <span className="font-mono">{tier1Ratio}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={tier1Ratio}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setTier1Ratio(val);
                if (val + tier2Ratio > 100) {
                  setTier2Ratio(100 - val);
                }
              }}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="text-[10px] text-emerald-600 mt-1 font-mono">
              {simT1Calls.toLocaleString()} Free Calls ($0 Billed)
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-indigo-800 flex justify-between mb-1.5">
              <span>Tier 2 Allocation (100% Free)</span>
              <span className="font-mono">{tier2Ratio}%</span>
            </label>
            <input
              type="range"
              min="0"
              max={100 - tier1Ratio}
              value={tier2Ratio}
              onChange={(e) => setTier2Ratio(parseInt(e.target.value, 10))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="text-[10px] text-indigo-600 mt-1 font-mono">
              {simT2Calls.toLocaleString()} Free Calls ($0 Billed)
            </div>
          </div>
        </div>

        {/* Simulator Results Comparison Card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-5 rounded-2xl bg-rose-50/70 border border-rose-200">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800 block">
              Standard OpenAI GPT-4o Cost
            </span>
            <div className="text-2xl font-extrabold font-mono text-rose-700 mt-1">
              ${simCommercialGptCost.toFixed(2)}
            </div>
            <span className="text-[10px] text-rose-600 block mt-1">
              At retail $0.0300 / API call
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-800 block">
              Our App Cost (Tier 3 Only Billed)
            </span>
            <div className="text-2xl font-extrabold font-mono text-indigo-700 mt-1">
              ${simOurAppCost.toFixed(2)}
            </div>
            <span className="text-[10px] text-indigo-600 block mt-1">
              Tier 1 &amp; 2: $0.00 | Tier 3: {simT3Calls.toLocaleString()} calls @ $0.0095
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
              Simulated Enterprise Savings
            </span>
            <div className="text-2xl font-extrabold font-mono text-emerald-600 mt-1">
              ${simSavings.toFixed(2)}
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold block mt-1">
              {simSavingsPercent.toFixed(1)}% Cost Reduction
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
