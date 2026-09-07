import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar, ActiveSection } from './components/Sidebar';
import { Header } from './components/Header';
import { MckinseyHomeView } from './components/MckinseyHomeView';
import { TrendingRequestsSection } from './components/TrendingRequestsSection';
import { UserLicenseSection } from './components/UserLicenseSection';
import { CostSavingsSection } from './components/CostSavingsSection';
import { ApiRequestsSection } from './components/ApiRequestsSection';
import { LlmComparisonSection } from './components/LlmComparisonSection';
import { UsageLogsTab } from './components/UsageLogsTab';
import { SqlConsoleTab } from './components/SqlConsoleTab';
import { NewLogModal } from './components/NewLogModal';
import {
  DbHealth,
  TableCounts,
  UsageSummaryData,
  ApiUsageLog,
  UserItem,
  ChatSessionItem,
  McKinseyAnalyticsData,
  TrendingRequestsData,
} from './types';

export default function App() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('home');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Backend state
  const [health, setHealth] = useState<DbHealth | null>(null);
  const [counts, setCounts] = useState<TableCounts | null>(null);
  const [summary, setSummary] = useState<UsageSummaryData | null>(null);
  const [mckinseyAnalytics, setMckinseyAnalytics] = useState<McKinseyAnalyticsData | null>(null);
  const [trendingData, setTrendingData] = useState<TrendingRequestsData | null>(null);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [sessions, setSessions] = useState<ChatSessionItem[]>([]);

  // Logs state
  const [logs, setLogs] = useState<ApiUsageLog[]>([]);
  const [totalLogs, setTotalLogs] = useState(0);
  const [limit] = useState(25);
  const [offset, setOffset] = useState(0);
  const [tierFilter, setTierFilter] = useState('all');
  const [modelFilter, setModelFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLogsLoading, setIsLogsLoading] = useState(false);

  // 30-Second Live Refresh State
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const [countdown, setCountdown] = useState(30);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // Fetch DB Health & counts
  const fetchHealthAndCounts = useCallback(async () => {
    try {
      const [hRes, cRes] = await Promise.all([
        fetch('/api/health'),
        fetch('/api/db/overview'),
      ]);
      const hData = await hRes.json();
      const cData = await cRes.json();
      setHealth(hData);
      if (cData.counts) setCounts(cData.counts);
    } catch (err) {
      console.error('Error fetching health or counts:', err);
      setHealth({ status: 'error', message: 'Failed to connect to backend server' });
    }
  }, []);

  // Fetch Usage Summary
  const fetchSummary = useCallback(async () => {
    try {
      const res = await fetch('/api/usage/summary');
      const data = await res.json();
      setSummary(data);
    } catch (err) {
      console.error('Error fetching summary:', err);
    }
  }, []);

  // Fetch McKinsey Analytics (Users, Tier Economics, LLM Competitors)
  const fetchMckinseyAnalytics = useCallback(async () => {
    try {
      const res = await fetch('/api/analytics/mckinsey');
      const data = await res.json();
      setMckinseyAnalytics(data);
    } catch (err) {
      console.error('Error fetching McKinsey analytics:', err);
    }
  }, []);

  // Fetch Trending User Requests
  const fetchTrending = useCallback(async () => {
    try {
      const res = await fetch('/api/analytics/trending-requests');
      const data = await res.json();
      setTrendingData(data);
    } catch (err) {
      console.error('Error fetching trending requests:', err);
    }
  }, []);

  // Fetch Users
  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (data.users) setUsers(data.users);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  }, []);

  // Fetch Sessions
  const fetchSessions = useCallback(async () => {
    try {
      const res = await fetch('/api/sessions');
      const data = await res.json();
      if (data.sessions) setSessions(data.sessions);
    } catch (err) {
      console.error('Error fetching sessions:', err);
    }
  }, []);

  // Fetch Logs with filters
  const fetchLogs = useCallback(async () => {
    setIsLogsLoading(true);
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
        tier: tierFilter,
        model: modelFilter,
        search: searchQuery,
      });
      const res = await fetch(`/api/usage/logs?${params.toString()}`);
      const data = await res.json();
      if (data.logs) {
        setLogs(data.logs);
        setTotalLogs(data.total || 0);
      }
    } catch (err) {
      console.error('Error fetching logs:', err);
    } finally {
      setIsLogsLoading(false);
    }
  }, [limit, offset, tierFilter, modelFilter, searchQuery]);

  // Overall refresh
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await Promise.all([
      fetchHealthAndCounts(),
      fetchSummary(),
      fetchMckinseyAnalytics(),
      fetchTrending(),
      fetchUsers(),
      fetchSessions(),
      fetchLogs(),
    ]);
    setIsRefreshing(false);
  }, [
    fetchHealthAndCounts,
    fetchSummary,
    fetchMckinseyAnalytics,
    fetchTrending,
    fetchUsers,
    fetchSessions,
    fetchLogs,
  ]);

  // Initial load
  useEffect(() => {
    handleRefresh();
  }, [handleRefresh]);

  // 30-Second Live Polling Loop
  useEffect(() => {
    if (!autoRefreshEnabled) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          handleRefresh();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [autoRefreshEnabled, handleRefresh]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);


  // Extract unique tiers and models for dropdown filters
  const availableTiers = summary?.byTier.map((t) => t.tier_applied) || ['Tier1', 'Tier2'];
  const availableModels = summary?.byModel.map((m) => m.model_or_endpoint) || [];

  const totalCalls = mckinseyAnalytics?.tierEconomics.overall.totalCalls || summary?.metrics.total_calls || 0;
  const totalSavings = mckinseyAnalytics?.tierEconomics.overall.totalRealSavings || parseFloat(summary?.metrics.total_savings || '0') || 0;
  const totalUsersCount = mckinseyAnalytics?.usersSummary.totalUsers || users.length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Left Sidebar Panel - McKinsey Advisory Navigation */}
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        health={health}
        totalUsers={totalUsersCount}
        totalCalls={totalCalls}
        totalSavings={totalSavings}
        isOpenMobile={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
      />

      {/* Main App Canvas */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Top Header */}
        <Header
          health={health}
          counts={counts}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          countdown={countdown}
          autoRefreshEnabled={autoRefreshEnabled}
          onToggleAutoRefresh={() => setAutoRefreshEnabled((prev) => !prev)}
          onToggleMobileNav={() => setIsMobileNavOpen((prev) => !prev)}
          onOpenNewModal={() => setIsNewModalOpen(true)}
        />

        {/* Dynamic Section Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 1. Home: Executive Overview with Circular Gradient Gauges */}
          {activeSection === 'home' && (
            <MckinseyHomeView
              analytics={mckinseyAnalytics}
              summary={summary}
              onNavigateSection={setActiveSection}
              onOpenNewModal={() => setIsNewModalOpen(true)}
              isLoading={isRefreshing && !mckinseyAnalytics}
            />
          )}

          {/* 2. Top 10 Trending User Requests along with Count */}
          {activeSection === 'trending_requests' && (
            <TrendingRequestsSection
              trendingData={trendingData}
              isLoading={isRefreshing && !trendingData}
              onRefresh={handleRefresh}
            />
          )}

          {/* 3. User & License Section */}
          {activeSection === 'users_licenses' && (
            <UserLicenseSection
              usersSummary={mckinseyAnalytics?.usersSummary || null}
              usersList={users}
              isLoading={isRefreshing && users.length === 0}
            />
          )}

          {/* 3. Cost Savings & Tier ROI (Tier 1 & 2 Free, Tier 3 Paid based on GPT) */}
          {activeSection === 'cost_savings' && (
            <CostSavingsSection
              tierEconomics={mckinseyAnalytics?.tierEconomics || null}
              isLoading={isRefreshing && !mckinseyAnalytics}
            />
          )}

          {/* 4. API Request Count & Throughput */}
          {activeSection === 'api_requests' && (
            <ApiRequestsSection
              summary={summary}
              isLoading={isRefreshing && !summary}
            />
          )}

          {/* 5. Multi-LLM Cost Comparison Matrix */}
          {activeSection === 'llm_comparison' && (
            <LlmComparisonSection
              competitors={mckinseyAnalytics?.llmComparison || []}
              tierEconomics={mckinseyAnalytics?.tierEconomics || null}
              totalCalls={totalCalls}
              isLoading={isRefreshing && !mckinseyAnalytics}
            />
          )}

          {/* 6. Live Usage Logs & Raw Records */}
          {activeSection === 'usage_logs' && (
            <UsageLogsTab
              logs={logs}
              totalLogs={totalLogs}
              limit={limit}
              offset={offset}
              onPageChange={setOffset}
              tierFilter={tierFilter}
              onTierFilterChange={(t) => {
                setTierFilter(t);
                setOffset(0);
              }}
              modelFilter={modelFilter}
              onModelFilterChange={(m) => {
                setModelFilter(m);
                setOffset(0);
              }}
              searchQuery={searchQuery}
              onSearchChange={(q) => {
                setSearchQuery(q);
                setOffset(0);
              }}
              onOpenNewModal={() => setIsNewModalOpen(true)}
              availableTiers={availableTiers}
              availableModels={availableModels}
              isLoading={isLogsLoading}
            />
          )}

          {/* 7. SQL & Schema Workbench */}
          {activeSection === 'sql_console' && <SqlConsoleTab />}
        </main>

        {/* Modal for recording a new API Usage entry */}
        <NewLogModal
          isOpen={isNewModalOpen}
          onClose={() => setIsNewModalOpen(false)}
          onLogCreated={() => {
            handleRefresh();
          }}
          users={users}
          sessions={sessions}
        />

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500 mt-auto">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>
              Omni View Telemetry Hub · Neon PostgreSQL <code className="font-mono text-slate-700">etl_db</code>
            </p>
            <p className="text-[11px] text-slate-400">
              Billing Model: <strong className="text-emerald-600">Tier 1 &amp; Tier 2 (100% Free Cost Savers)</strong> · <strong className="text-amber-600">Tier 3 (Chargeable vs GPT Benchmark)</strong>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
