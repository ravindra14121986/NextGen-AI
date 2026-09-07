import React, { useState } from 'react';
import {
  Search,
  Filter,
  PlusCircle,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
  Download,
  Database,
} from 'lucide-react';
import { ApiUsageLog } from '../types';

interface UsageLogsTabProps {
  logs: ApiUsageLog[];
  totalLogs: number;
  limit: number;
  offset: number;
  onPageChange: (newOffset: number) => void;
  tierFilter: string;
  onTierFilterChange: (tier: string) => void;
  modelFilter: string;
  onModelFilterChange: (model: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenNewModal: () => void;
  availableTiers: string[];
  availableModels: string[];
  isLoading: boolean;
}

export const UsageLogsTab: React.FC<UsageLogsTabProps> = ({
  logs,
  totalLogs,
  limit,
  offset,
  onPageChange,
  tierFilter,
  onTierFilterChange,
  modelFilter,
  onModelFilterChange,
  searchQuery,
  onSearchChange,
  onOpenNewModal,
  availableTiers,
  availableModels,
  isLoading,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedLog, setSelectedLog] = useState<ApiUsageLog | null>(null);

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleExportCsv = () => {
    if (!logs.length) return;
    const headers = [
      'usage_id',
      'created_at',
      'model_or_endpoint',
      'request_type',
      'tier_applied',
      'user_id',
      'username',
      'standard_cost',
      'actual_cost',
      'savings_amount',
      'session_id',
    ];
    const rows = logs.map((l) => [
      l.usage_id,
      l.created_at,
      l.model_or_endpoint,
      l.request_type || '',
      l.tier_applied,
      l.user_id,
      l.username || '',
      l.standard_cost,
      l.actual_cost,
      l.savings_amount,
      l.session_id || '',
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.map((val) => `"${val}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `api_usage_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(totalLogs / limit) || 1;

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toISOString().replace('T', ' ').slice(0, 19);
    } catch {
      return isoString;
    }
  };

  const getTierBadge = (tier: string) => {
    const t = tier.toLowerCase();
    if (t.includes('enterprise') || t.includes('tier1')) {
      return (
        <span className="inline-block px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase tracking-wider">
          {tier}
        </span>
      );
    }
    if (t.includes('pro') || t.includes('tier2')) {
      return (
        <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
          {tier}
        </span>
      );
    }
    return (
      <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider">
        {tier}
      </span>
    );
  };

  return (
    <div className="space-y-5">
      {/* Top Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search model, request type, user, or UUID..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9.5 pr-3.5 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
          />
        </div>

        {/* Filters and New Button */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Tier filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={tierFilter}
              onChange={(e) => onTierFilterChange(e.target.value)}
              className="text-xs rounded-lg border border-slate-200 px-3 py-2 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
            >
              <option value="all">All Tiers</option>
              {availableTiers.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Model filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <select
              value={modelFilter}
              onChange={(e) => onModelFilterChange(e.target.value)}
              className="text-xs rounded-lg border border-slate-200 px-3 py-2 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
            >
              <option value="all">All Models / Endpoints</option>
              {availableModels.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={onOpenNewModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-2xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Record Usage</span>
          </button>
        </div>
      </div>

      {/* Main Table Card (Sleek Interface Structure) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
        {/* Table Header Bar */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-slate-700">Live Usage Logs</h2>
            <span className="text-xs font-mono text-slate-400">
              ({totalLogs.toLocaleString()} total)
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExportCsv}
              className="px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1 text-slate-700 shadow-2xs"
            >
              <Download className="w-3 h-3 text-slate-500" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={onOpenNewModal}
              className="px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-2xs"
            >
              + Add Entry
            </button>
          </div>
        </div>

        {/* Scrollable Table Area */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
              <tr>
                <th className="px-6 py-3.5 w-1/4">Usage ID / Timestamp</th>
                <th className="px-6 py-3.5">Model & Tier</th>
                <th className="px-6 py-3.5">User</th>
                <th className="px-6 py-3.5 text-right">Std Cost</th>
                <th className="px-6 py-3.5 text-right">Act Cost</th>
                <th className="px-6 py-3.5 text-right">Savings</th>
                <th className="px-6 py-3.5 text-center">Session</th>
                <th className="px-6 py-3.5 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-14 text-center text-slate-500">
                    <div className="w-6 h-6 border-2 border-slate-300 border-t-indigo-600 rounded-full animate-spin mx-auto mb-2" />
                    <span className="text-xs font-medium">Fetching records from Neon PostgreSQL...</span>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-14 text-center text-slate-500 text-xs">
                    No API usage logs found matching your filters.
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  const std = parseFloat(String(log.standard_cost) || '0');
                  const act = parseFloat(String(log.actual_cost) || '0');
                  const sav = parseFloat(String(log.savings_amount) || '0');

                  return (
                    <tr
                      key={log.usage_id}
                      className="hover:bg-slate-50 transition-colors cursor-pointer"
                      onClick={() => setSelectedLog(log)}
                    >
                      {/* Usage ID & Timestamp */}
                      <td className="px-6 py-4">
                        <div
                          className="font-mono text-xs text-indigo-600 mb-0.5 flex items-center gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span>{log.usage_id.slice(0, 8)}...</span>
                          <button
                            onClick={() => handleCopy(log.usage_id)}
                            className="text-slate-400 hover:text-indigo-600 p-0.5"
                            title="Copy UUID"
                          >
                            {copiedId === log.usage_id ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                        <div className="text-slate-400 text-[11px]">
                          {formatDate(log.created_at)}
                        </div>
                      </td>

                      {/* Model & Tier */}
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-800 text-xs font-mono mb-1">
                          {log.model_or_endpoint}
                        </div>
                        {getTierBadge(log.tier_applied)}
                      </td>

                      {/* User */}
                      <td className="px-6 py-4">
                        <div className="leading-tight">
                          <span className="font-medium text-slate-800 block text-xs">
                            {log.username || log.user_id.slice(0, 8)}
                          </span>
                          {log.user_subscription && (
                            <span className="text-[10px] text-slate-400">
                              {log.user_subscription}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Standard Cost */}
                      <td className="px-6 py-4 text-right font-mono text-slate-500 text-xs">
                        ${std.toFixed(4)}
                      </td>

                      {/* Actual Cost */}
                      <td className="px-6 py-4 text-right font-mono text-slate-900 font-medium text-xs">
                        ${act.toFixed(4)}
                      </td>

                      {/* Savings Amount (Generated) */}
                      <td className="px-6 py-4 text-right">
                        <span className="text-emerald-600 font-semibold font-mono text-xs">
                          ${sav.toFixed(4)}
                        </span>
                      </td>

                      {/* Session */}
                      <td className="px-6 py-4 text-center">
                        {log.session_id ? (
                          <span
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-50 text-purple-700 border border-purple-200"
                            title={log.session_title || log.session_id}
                          >
                            Active
                          </span>
                        ) : (
                          <span className="text-slate-300 text-xs">—</span>
                        )}
                      </td>

                      {/* Inspect */}
                      <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="text-slate-400 hover:text-indigo-600 p-1 rounded-lg transition"
                          title="Inspect record details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing <span className="font-semibold text-slate-700">{logs.length}</span> of{' '}
            <span className="font-semibold text-slate-700">{totalLogs}</span> entries
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(Math.max(0, offset - limit))}
              disabled={offset === 0}
              className="inline-flex items-center px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-3.5 h-3.5 mr-0.5" />
              Prev
            </button>
            <span className="text-slate-600 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => onPageChange(offset + limit)}
              disabled={offset + limit >= totalLogs}
              className="inline-flex items-center px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Partition info & Legend (Matching Sleek Interface Design HTML) */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3 pt-1">
        <p>
          Displaying latest {logs.length} logs of {totalLogs.toLocaleString()} available in current partition.
        </p>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-indigo-500 rounded-full" />
            Enterprise Applied
          </span>
          <span className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-slate-400 rounded-full" />
            Pro Rate
          </span>
          <span className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-amber-500 rounded-full" />
            No Discount
          </span>
        </div>
      </div>

      {/* Record Inspector Drawer / Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-xl w-full overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
              <div className="flex items-center space-x-2">
                <Database className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-semibold text-slate-900">
                  api_usage_logs Inspection
                </h3>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] text-slate-400 block font-mono">usage_id (UUID PK)</label>
                  <p className="font-mono text-indigo-600 break-all">{selectedLog.usage_id}</p>
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block font-mono">created_at (TIMESTAMPTZ)</label>
                  <p className="text-slate-800">{formatDate(selectedLog.created_at)}</p>
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block font-mono">user_id (FK: users.user_id)</label>
                  <p className="font-mono text-slate-800 break-all">{selectedLog.user_id}</p>
                  {selectedLog.username && (
                    <span className="text-[11px] text-indigo-700 font-semibold">
                      Username: {selectedLog.username}
                    </span>
                  )}
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block font-mono">session_id (FK: chat_sessions)</label>
                  <p className="font-mono text-slate-800 break-all">
                    {selectedLog.session_id || 'null'}
                  </p>
                  {selectedLog.session_title && (
                    <span className="text-[11px] text-purple-700">
                      Title: {selectedLog.session_title}
                    </span>
                  )}
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block font-mono">model_or_endpoint</label>
                  <p className="font-medium text-slate-900">{selectedLog.model_or_endpoint}</p>
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block font-mono">tier_applied</label>
                  <div className="mt-0.5">{getTierBadge(selectedLog.tier_applied)}</div>
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block font-mono">request_type</label>
                  <p className="text-slate-800">{selectedLog.request_type || '—'}</p>
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block font-mono">standard_cost</label>
                  <p className="font-mono text-slate-800">
                    ${parseFloat(String(selectedLog.standard_cost)).toFixed(6)}
                  </p>
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block font-mono">actual_cost</label>
                  <p className="font-mono font-semibold text-slate-900">
                    ${parseFloat(String(selectedLog.actual_cost)).toFixed(6)}
                  </p>
                </div>
                <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                  <label className="text-[11px] text-emerald-700 block font-medium">
                    savings_amount (GENERATED ALWAYS STORED)
                  </label>
                  <p className="font-mono font-bold text-emerald-800 text-sm">
                    ${parseFloat(String(selectedLog.savings_amount)).toFixed(6)}
                  </p>
                </div>
              </div>

              {/* Raw JSON View */}
              <div className="pt-2">
                <label className="text-[11px] text-slate-400 block font-mono mb-1">
                  Raw Record JSON
                </label>
                <pre className="bg-slate-900 text-emerald-400 p-3.5 rounded-xl text-[11px] font-mono overflow-x-auto max-h-40 border border-slate-800">
                  {JSON.stringify(selectedLog, null, 2)}
                </pre>
              </div>
            </div>

            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 transition shadow-2xs"
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
