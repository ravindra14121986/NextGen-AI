import React, { useState } from 'react';
import {
  Shield,
  Key,
  Search,
} from 'lucide-react';
import { UserItem } from '../types';

interface UsersTabProps {
  users: UserItem[];
  isLoading: boolean;
}

export const UsersTab: React.FC<UsersTabProps> = ({ users, isLoading }) => {
  const [search, setSearch] = useState('');

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      (u.email && u.email.toLowerCase().includes(search.toLowerCase())) ||
      (u.subscription && u.subscription.toLowerCase().includes(search.toLowerCase())) ||
      (u.license_key && u.license_key.toLowerCase().includes(search.toLowerCase())) ||
      (u.snow_username && u.snow_username.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header and Search */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-800">
            Registered Users & Accounts
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Relational entities from <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">users</code> and linked <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">snowusers</code>
          </p>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by username, email, license..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9.5 pr-3.5 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
          />
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {isLoading ? (
          <div className="col-span-full py-20 text-center text-slate-500">
            <div className="w-6 h-6 border-2 border-slate-300 border-t-indigo-600 rounded-full animate-spin mx-auto mb-2" />
            <span className="text-xs font-medium">Loading user accounts from Neon PostgreSQL...</span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-500 text-xs">
            No users found matching your search.
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user.user_id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-indigo-700 text-sm shadow-2xs">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-800 leading-tight">
                        {user.username}
                      </h3>
                      <span className="text-[11px] text-slate-400 block truncate max-w-[160px] font-mono">
                        {user.email || 'No email registered'}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      user.status === 'active' || !user.status
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {user.status || 'active'}
                  </span>
                </div>

                {/* Subscriptions and Credentials */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-slate-400" />
                      Subscription:
                    </span>
                    <span className="font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md text-[11px]">
                      {user.subscription}
                    </span>
                  </div>

                  {user.license_key && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Key className="w-3.5 h-3.5 text-amber-500" />
                        License:
                      </span>
                      <span className="font-mono text-[11px] text-slate-600">
                        {user.license_key}
                      </span>
                    </div>
                  )}

                  {/* ServiceNow Linked Account */}
                  {user.snow_username && (
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] space-y-0.5 mt-2">
                      <div className="flex items-center justify-between text-slate-800 font-medium">
                        <span>ServiceNow Account</span>
                        <span className="font-mono text-[10px] text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded">snowusers</span>
                      </div>
                      <p className="text-slate-600 font-mono text-[10px]">
                        {user.snow_username} @ {user.snow_instance || 'dev-instance'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Usage & Cost Summary */}
              <div className="mt-5 pt-3 border-t border-slate-100 bg-slate-50/70 -mx-5 -mb-5 p-4 rounded-b-2xl grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-medium block">Sessions</span>
                  <span className="font-mono font-semibold text-slate-800">
                    {user.total_sessions}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-medium block">API Calls</span>
                  <span className="font-mono font-semibold text-indigo-600">
                    {user.total_api_calls}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-medium block">Saved</span>
                  <span className="font-mono font-semibold text-emerald-600">
                    ${parseFloat(user.total_saved).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
