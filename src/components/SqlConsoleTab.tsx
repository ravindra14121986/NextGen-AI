import React, { useState, useEffect } from 'react';
import {
  Play,
  Database,
  Clock,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Sparkles,
} from 'lucide-react';
import { TableSchemaDetail } from '../types';

interface SqlConsoleTabProps {
  initialTable?: string;
}

const PREBUILT_QUERIES = [
  {
    name: 'Top 10 Usage Logs with Savings',
    sql: `SELECT 
  u.usage_id,
  usr.username,
  u.model_or_endpoint,
  u.tier_applied,
  u.standard_cost,
  u.actual_cost,
  u.savings_amount,
  u.created_at
FROM api_usage_logs u
JOIN users usr ON u.user_id = usr.user_id
ORDER BY u.created_at DESC
LIMIT 10;`,
  },
  {
    name: 'Total Savings by Tier',
    sql: `SELECT 
  tier_applied,
  COUNT(*) as log_count,
  SUM(standard_cost)::numeric(12,2) as total_standard,
  SUM(actual_cost)::numeric(12,2) as total_actual,
  SUM(savings_amount)::numeric(12,2) as total_savings
FROM api_usage_logs
GROUP BY tier_applied
ORDER BY total_savings DESC;`,
  },
  {
    name: 'User Breakdown (Usage & Subscription)',
    sql: `SELECT 
  u.username,
  u.subscription,
  u.license_key,
  COUNT(l.usage_id) as total_requests,
  COALESCE(SUM(l.savings_amount), 0)::numeric(12,4) as user_savings
FROM users u
LEFT JOIN api_usage_logs l ON u.user_id = l.user_id
GROUP BY u.user_id, u.username, u.subscription, u.license_key
ORDER BY total_requests DESC;`,
  },
  {
    name: 'AI Interaction Latency & Feedback',
    sql: `SELECT 
  m.role,
  m.prompt_tokens,
  m.completion_tokens,
  ai.latency_ms,
  ai.user_feedback,
  ai.error_code,
  cs.title as session_title
FROM ai_interaction_logs ai
JOIN messages m ON ai.message_id = m.message_id
JOIN chat_sessions cs ON m.session_id = cs.session_id
ORDER BY ai.latency_ms DESC
LIMIT 15;`,
  },
  {
    name: 'Recent Authentication Logs',
    sql: `SELECT 
  a.timestamp,
  u.username,
  a.status,
  a.ip_address
FROM auth_logs a
JOIN users u ON a.user_id = u.user_id
ORDER BY a.timestamp DESC
LIMIT 20;`,
  },
];

export const SqlConsoleTab: React.FC<SqlConsoleTabProps> = () => {
  const [activeSubTab, setActiveSubTab] = useState<'console' | 'ddl'>('console');
  const [sql, setSql] = useState<string>(PREBUILT_QUERIES[0].sql);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<{
    fields: string[];
    rows: any[];
    rowCount: number;
    executionTimeMs: number;
  } | null>(null);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [schemaData, setSchemaData] = useState<Record<string, TableSchemaDetail> | null>(null);
  const [selectedTable, setSelectedTable] = useState<string>('api_usage_logs');
  const [copiedDdl, setCopiedDdl] = useState(false);

  useEffect(() => {
    fetch('/api/schema')
      .then((res) => res.json())
      .then((data) => {
        if (data.schema) setSchemaData(data.schema);
      })
      .catch((err) => console.error('Error fetching schema:', err));
  }, []);

  const handleRunQuery = async () => {
    if (!sql.trim()) return;
    setIsRunning(true);
    setQueryError(null);

    try {
      const res = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to execute query');
      }

      setResults(data);
    } catch (err: any) {
      setQueryError(err.message);
      setResults(null);
    } finally {
      setIsRunning(false);
    }
  };

  const ddlStatements = `
-- Table: api_usage_logs (with GENERATED ALWAYS STORED column)
CREATE TABLE "api_usage_logs" (
  "usage_id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "session_id" uuid,
  "tier_applied" varchar(20) NOT NULL,
  "model_or_endpoint" varchar(50) NOT NULL,
  "request_type" varchar(50),
  "standard_cost" numeric(12, 6) DEFAULT '0.000000',
  "actual_cost" numeric(12, 6) DEFAULT '0.000000',
  "savings_amount" numeric(12, 6) GENERATED ALWAYS AS ((standard_cost - actual_cost)) STORED,
  "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX "api_usage_logs_pkey" ON "api_usage_logs" ("usage_id");
CREATE INDEX "idx_api_usage_user_time" ON "api_usage_logs" ("user_id","created_at");
ALTER TABLE "api_usage_logs" ADD CONSTRAINT "api_usage_logs_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "chat_sessions"("session_id") ON DELETE SET NULL;
ALTER TABLE "api_usage_logs" ADD CONSTRAINT "api_usage_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE;

-- Table: users
CREATE TABLE "users" (
  "user_id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "username" varchar(50) NOT NULL,
  "email" varchar(255),
  "password" varchar(100) NOT NULL,
  "status" varchar(10),
  "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp with time zone,
  "Comments" text,
  "subscription" varchar(10) NOT NULL,
  "license_key" varchar(16)
);
CREATE UNIQUE INDEX "users_pkey" ON "users" ("user_id");

-- Table: snowusers
CREATE TABLE "snowusers" (
  "user_id" uuid PRIMARY KEY,
  "snow_username" varchar(100) NOT NULL,
  "snow_instance" varchar(100),
  "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE "snowusers" ADD CONSTRAINT "snowusers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE;

-- Table: chat_sessions
CREATE TABLE "chat_sessions" (
  "session_id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "title" varchar(255) DEFAULT 'New Chat',
  "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp with time zone,
  "is_active" boolean DEFAULT true,
  "model_used" varchar(50) DEFAULT 'default'
);
ALTER TABLE "chat_sessions" ADD CONSTRAINT "chat_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE;

-- Table: messages
CREATE TABLE "messages" (
  "message_id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "session_id" uuid NOT NULL,
  "role" varchar(20) NOT NULL,
  "content" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  "token_count" integer,
  "prompt_tokens" integer,
  "completion_tokens" integer
);
ALTER TABLE "messages" ADD CONSTRAINT "messages_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "chat_sessions"("session_id") ON DELETE CASCADE;

-- Table: ai_interaction_logs
CREATE TABLE "ai_interaction_logs" (
  "interaction_id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "message_id" uuid,
  "latency_ms" integer,
  "error_code" varchar(50),
  "user_feedback" varchar(20),
  "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE "ai_interaction_logs" ADD CONSTRAINT "ai_interaction_logs_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "messages"("message_id") ON DELETE CASCADE;

-- Table: auth_logs
CREATE TABLE "auth_logs" (
  "log_id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid,
  "timestamp" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  "status" varchar(20) NOT NULL,
  "ip_address" varchar(45)
);
ALTER TABLE "auth_logs" ADD CONSTRAINT "auth_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE SET NULL;
`;

  return (
    <div className="space-y-6">
      {/* Top Switcher */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveSubTab('console')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition ${
              activeSubTab === 'console'
                ? 'bg-white text-slate-800 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Interactive SQL Query Console
          </button>
          <button
            onClick={() => setActiveSubTab('ddl')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition ${
              activeSubTab === 'ddl'
                ? 'bg-white text-slate-800 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            DDL Schema & Constraints Inspector
          </button>
        </div>

        <div className="text-xs text-slate-500 flex items-center gap-2 px-2">
          <Database className="w-4 h-4 text-indigo-600" />
          <span>Neon PostgreSQL 17 (etl_db)</span>
        </div>
      </div>

      {activeSubTab === 'console' ? (
        <div className="space-y-5">
          {/* Query Templates */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-500 mr-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Pre-built Queries:
            </span>
            {PREBUILT_QUERIES.map((q) => (
              <button
                key={q.name}
                onClick={() => setSql(q.sql)}
                className="px-3 py-1.5 text-xs rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition"
              >
                {q.name}
              </button>
            ))}
          </div>

          {/* SQL Editor */}
          <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-slate-400">PostgreSQL SELECT Console</span>
              <button
                id="run-sql-btn"
                onClick={handleRunQuery}
                disabled={isRunning}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition disabled:opacity-50 shadow-2xs"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isRunning ? 'Executing...' : 'Run Query'}</span>
              </button>
            </div>
            <textarea
              value={sql}
              onChange={(e) => setSql(e.target.value)}
              rows={6}
              className="w-full bg-slate-950 text-emerald-400 font-mono text-xs p-4 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 transition leading-relaxed"
              placeholder="SELECT * FROM api_usage_logs LIMIT 10;"
            />
          </div>

          {/* Error Message */}
          {queryError && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div className="font-mono">{queryError}</div>
            </div>
          )}

          {/* Query Results */}
          {results && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-medium">
                    Returned {results.rows.length} row{results.rows.length === 1 ? '' : 's'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{results.executionTimeMs} ms</span>
                </div>
              </div>

              <div className="overflow-x-auto max-h-96">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <tr>
                      {results.fields.map((f) => (
                        <th key={f} className="py-3 px-4 whitespace-nowrap font-mono">
                          {f}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                    {results.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50 transition-colors">
                        {results.fields.map((f) => {
                          const val = row[f];
                          return (
                            <td key={f} className="py-2.5 px-4 text-slate-800 whitespace-nowrap max-w-xs truncate">
                              {val === null || val === undefined ? (
                                <span className="text-slate-400 italic">null</span>
                              ) : typeof val === 'object' ? (
                                JSON.stringify(val)
                              ) : (
                                String(val)
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* DDL Schema Viewer */
        <div className="space-y-6">
          {/* Table Selector */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Database Table Introspection (Neon PostgreSQL)
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                'api_usage_logs',
                'users',
                'chat_sessions',
                'messages',
                'snowusers',
                'auth_logs',
                'ai_interaction_logs',
              ].map((tbl) => (
                <button
                  key={tbl}
                  onClick={() => setSelectedTable(tbl)}
                  className={`px-3.5 py-2 text-xs font-mono rounded-lg border transition ${
                    selectedTable === tbl
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200 font-semibold'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {tbl}
                </button>
              ))}
            </div>

            {/* Table Details */}
            {schemaData && schemaData[selectedTable] && (
              <div className="mt-5 pt-5 border-t border-slate-100 space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-slate-800 mb-2.5">Columns</h4>
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200">
                        <tr>
                          <th className="py-2.5 px-4">Column</th>
                          <th className="py-2.5 px-4">Type</th>
                          <th className="py-2.5 px-4">Nullable</th>
                          <th className="py-2.5 px-4">Default / Generated</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                        {schemaData[selectedTable].columns.map((col) => (
                          <tr key={col.column_name} className="hover:bg-slate-50">
                            <td className="py-2.5 px-4 font-semibold text-slate-900">
                              {col.column_name}
                            </td>
                            <td className="py-2.5 px-4 text-slate-600">{col.data_type}</td>
                            <td className="py-2.5 px-4 text-slate-500">{col.is_nullable}</td>
                            <td className="py-2.5 px-4 text-emerald-700">
                              {col.generation_expression
                                ? `GENERATED ALWAYS AS (${col.generation_expression}) STORED`
                                : col.column_default || '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Constraints & Foreign Keys */}
                {schemaData[selectedTable].constraints.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-slate-800 mb-2.5">
                      Constraints & Foreign Keys
                    </h4>
                    <div className="space-y-1.5 text-xs font-mono">
                      {schemaData[selectedTable].constraints.map((c, i) => (
                        <div key={i} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-700">
                          <span className="font-semibold text-slate-900">{c.constraint_name}</span>{' '}
                          <span className="text-slate-500">({c.constraint_type})</span> on{' '}
                          <span className="text-indigo-600">{c.column_name}</span>
                          {c.foreign_table_name && (
                            <span>
                              {' '}
                              → REFERENCES <span className="text-purple-700 font-bold">{c.foreign_table_name}</span>({c.foreign_column_name})
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Full DDL Script */}
          <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
                Complete PostgreSQL DDL Statements
              </h3>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(ddlStatements.trim());
                  setCopiedDdl(true);
                  setTimeout(() => setCopiedDdl(false), 2000);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
              >
                {copiedDdl ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy DDL</span>
                  </>
                )}
              </button>
            </div>
            <pre className="text-emerald-400 font-mono text-xs overflow-x-auto max-h-96 p-3 bg-slate-950 rounded-xl leading-relaxed border border-slate-800">
              {ddlStatements.trim()}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
