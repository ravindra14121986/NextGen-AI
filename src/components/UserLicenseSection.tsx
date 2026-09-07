import React, { useState } from 'react';
import {
  Users,
  Search,
  Key,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Sparkles,
  ExternalLink,
  Filter,
  BarChart2,
  Calendar,
  Layers,
} from 'lucide-react';
import {
  UsersSummaryData,
  UserItem,
} from '../types';
import { CircularMetricBox } from './CircularMetricBox';

interface UserLicenseSectionProps {
  usersSummary: UsersSummaryData | null;
  usersList: UserItem[];
  isLoading: boolean;
}

export const UserLicenseSection: React.FC<UserLicenseSectionProps> = ({
  usersSummary,
  usersList,
  isLoading,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLicense, setSelectedLicense] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const totalUsers = usersSummary?.totalUsers || usersList.length;
  const loggedInUsers = usersSummary?.loggedInUsers || 0;
  const activeUsers = usersSummary?.activeUsers || 0;
  const inactiveUsers = usersSummary?.inactiveUsers || 0;

  // Filter users list
  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      searchTerm === '' ||
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.subscription && u.subscription.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesLicense =
      selectedLicense === 'all' ||
      u.subscription.toLowerCase() === selectedLicense.toLowerCase();

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && (u.status === 'active' || !u.status)) ||
      (statusFilter === 'inactive' && u.status === 'inactive');

    return matchesSearch && matchesLicense && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 border border-blue-800/60 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold">
            <Users className="w-3.5 h-3.5" />
            <span>Identity &amp; License Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            User Directory &amp; License Distribution
          </h1>
          <p className="text-sm text-blue-200/80 leading-relaxed">
            Manage enterprise user accounts, track real-time logged-in sessions via <code className="text-white font-mono">auth_logs</code>, inspect license key allocations, and monitor individual consumption quotas.
          </p>
        </div>
      </div>

      {/* Circular Metric Gauges for Users */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 justify-items-center bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
        <CircularMetricBox
          title="Total Users"
          value={totalUsers}
          subtitle="Directory Accounts"
          badgeText="Registered"
          trend="Neon DB"
          variant="blue"
          icon={<Users className="w-4 h-4" />}
          footnote="Users table verified"
        />

        <CircularMetricBox
          title="Logged-In Users"
          value={loggedInUsers}
          subtitle="Auth Logs Online"
          badgeText="Live Sessions"
          trend={`${totalUsers > 0 ? Math.round((loggedInUsers / totalUsers) * 100) : 0}% Active`}
          variant="indigo"
          icon={<CheckCircle className="w-4 h-4" />}
          footnote="Authenticated via auth_logs"
        />

        <CircularMetricBox
          title="Active Status"
          value={activeUsers}
          subtitle="Healthy Accounts"
          badgeText="Status Check"
          trend="100% Operational"
          variant="emerald"
          icon={<ShieldCheck className="w-4 h-4" />}
          footnote="Enabled user permissions"
        />

        <CircularMetricBox
          title="License Pool Keys"
          value={usersSummary?.totalLicensePoolKeys || 100}
          subtitle={`${usersSummary?.assignedLicensePoolKeys || 1} Assigned / ${usersSummary?.availableLicensePoolKeys || 99} Free`}
          badgeText="License Pool"
          trend="100 Total Keys"
          variant="purple"
          icon={<Key className="w-4 h-4" />}
          footnote="license_details table in etl_db"
        />
      </div>

      {/* PRIMARY TABLE: TOTAL USERS, LOGGED IN USER, LICENCE WISE DISTRIBUTION */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>License-Wise Distribution &amp; Allocation Matrix</span>
              <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded-full">
                Core Advisory Table
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Aggregated from Neon PostgreSQL users, auth_logs, and api_usage_logs
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
              <tr>
                <th className="py-3.5 px-6">License Tier</th>
                <th className="py-3.5 px-6">System Tier Mapping</th>
                <th className="py-3.5 px-6 text-center">Total Users</th>
                <th className="py-3.5 px-6 text-center">Logged-In Users</th>
                <th className="py-3.5 px-6 text-center">Active Users</th>
                <th className="py-3.5 px-6 text-center">License Keys</th>
                <th className="py-3.5 px-6 text-right">API Calls</th>
                <th className="py-3.5 px-6 text-right">Total Saved</th>
                <th className="py-3.5 px-6 text-center">Chargeable Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {usersSummary?.licenseDistribution.map((item) => (
                <tr key={item.license} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-bold text-slate-900 text-sm">
                      {item.license}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      {item.tierMapping}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center font-mono font-bold text-slate-900 text-sm">
                    {item.userCount}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="inline-flex items-center gap-1 font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      {item.loggedInCount}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center font-mono text-emerald-700 font-bold">
                    {item.activeCount}
                  </td>
                  <td className="py-4 px-6 text-center font-mono text-slate-600">
                    {item.assignedKeys} assigned
                  </td>
                  <td className="py-4 px-6 text-right font-mono font-bold text-slate-800">
                    {item.totalApiCalls.toLocaleString()}
                  </td>
                  <td className="py-4 px-6 text-right font-mono font-bold text-emerald-600">
                    ${item.totalSaved.toFixed(2)}
                  </td>
                  <td className="py-4 px-6 text-center">
                    {item.isChargeable ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-900 border border-amber-300">
                        Chargeable (Tier 3)
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-900 border border-emerald-300">
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

      {/* DETAILED USER ACCOUNTS DIRECTORY */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Individual User Accounts Directory
            </h2>
            <p className="text-xs text-slate-500">
              Showing {filteredUsers.length} of {usersList.length} registered user profiles
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search user, email, license..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
              />
            </div>

            <select
              value={selectedLicense}
              onChange={(e) => setSelectedLicense(e.target.value)}
              className="text-xs border border-slate-200 rounded-xl px-3 py-1.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
            >
              <option value="all">All Licenses</option>
              {usersSummary?.licenseDistribution.map((l) => (
                <option key={l.license} value={l.license}>
                  {l.license} ({l.userCount})
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs border border-slate-200 rounded-xl px-3 py-1.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Users Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user) => (
            <div
              key={user.user_id}
              className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:shadow-md transition-all space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    {user.username}
                    <span
                      className={`w-2 h-2 rounded-full ${
                        user.status === 'active' || !user.status
                          ? 'bg-emerald-500'
                          : 'bg-rose-500'
                      }`}
                    />
                  </div>
                  <div className="text-xs text-slate-500 truncate max-w-[200px]">
                    {user.email || 'No email provided'}
                  </div>
                </div>

                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {user.subscription}
                </span>
              </div>

              {/* Metrics Pills */}
              <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-200/60 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Calls</span>
                  <span className="font-mono font-bold text-slate-800 text-xs">
                    {user.total_api_calls}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Sessions</span>
                  <span className="font-mono font-bold text-slate-800 text-xs">
                    {user.total_sessions}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Saved</span>
                  <span className="font-mono font-bold text-emerald-600 text-xs">
                    ${parseFloat(user.total_saved || '0').toFixed(2)}
                  </span>
                </div>
              </div>

              {/* License Key & ServiceNow Info */}
              <div className="text-[11px] text-slate-500 space-y-1">
                {user.license_key && (
                  <div className="flex items-center gap-1.5 font-mono text-[10px]">
                    <Key className="w-3 h-3 text-slate-400" />
                    <span>Key: {user.license_key}</span>
                  </div>
                )}
                {user.snow_username && (
                  <div className="text-[10px] text-slate-600">
                    ServiceNow: <strong className="font-semibold">{user.snow_username}</strong> ({user.snow_instance})
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
