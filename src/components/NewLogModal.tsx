import React, { useState } from 'react';
import { X, PlusCircle, CheckCircle2, AlertCircle, Calculator } from 'lucide-react';
import { UserItem, ChatSessionItem } from '../types';

interface NewLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogCreated: () => void;
  users: UserItem[];
  sessions: ChatSessionItem[];
}

export const NewLogModal: React.FC<NewLogModalProps> = ({
  isOpen,
  onClose,
  onLogCreated,
  users,
  sessions,
}) => {
  const [userId, setUserId] = useState<string>(users[0]?.user_id || '');
  const [sessionId, setSessionId] = useState<string>('');
  const [tierApplied, setTierApplied] = useState<string>('Tier1');
  const [modelOrEndpoint, setModelOrEndpoint] = useState<string>('servicenow_incident_faq');
  const [requestType, setRequestType] = useState<string>('chat_request');
  const [standardCost, setStandardCost] = useState<string>('0.035000');
  const [actualCost, setActualCost] = useState<string>('0.009500');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const std = parseFloat(standardCost) || 0;
  const act = parseFloat(actualCost) || 0;
  const estimatedSavings = std - act;

  // Filter sessions owned by chosen user if any
  const userSessions = sessions.filter((s) => s.user_id === userId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      setError('Please select a valid user.');
      return;
    }
    if (!tierApplied) {
      setError('Tier applied is required.');
      return;
    }
    if (!modelOrEndpoint) {
      setError('Model or endpoint name is required.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('/api/usage/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          session_id: sessionId || null,
          tier_applied: tierApplied,
          model_or_endpoint: modelOrEndpoint,
          request_type: requestType,
          standard_cost: std,
          actual_cost: act,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to record usage log');
      }

      setSuccess(`Log recorded successfully! Postgres generated savings_amount: $${parseFloat(data.log.savings_amount).toFixed(6)}`);
      setTimeout(() => {
        onLogCreated();
        onClose();
      }, 1200);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center space-x-2.5">
            <PlusCircle className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-semibold text-slate-800">Record API Usage Entry</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {/* User selector */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              User (Foreign Key: <code className="text-indigo-600 font-mono">user_id</code>) *
            </label>
            <select
              value={userId}
              onChange={(e) => {
                setUserId(e.target.value);
                setSessionId('');
              }}
              className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
              required
            >
              {users.map((u) => (
                <option key={u.user_id} value={u.user_id}>
                  {u.username} ({u.email || 'No email'}) - {u.subscription}
                </option>
              ))}
            </select>
          </div>

          {/* Optional Chat Session */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Chat Session (Foreign Key: <code className="text-indigo-600 font-mono">session_id</code>, Optional)
            </label>
            <select
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
            >
              <option value="">-- No linked chat session --</option>
              {userSessions.map((s) => (
                <option key={s.session_id} value={s.session_id}>
                  {s.title} ({s.model_used || 'General'})
                </option>
              ))}
              {userSessions.length === 0 &&
                sessions.slice(0, 10).map((s) => (
                  <option key={s.session_id} value={s.session_id}>
                    {s.title} (by other user)
                  </option>
                ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Tier Applied */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Tier Applied *
              </label>
              <select
                value={tierApplied}
                onChange={(e) => setTierApplied(e.target.value)}
                className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
                required
              >
                <option value="Tier1">Tier1 (Enterprise Volume)</option>
                <option value="Tier2">Tier2 (Pro Agreement)</option>
                <option value="Enterprise">Enterprise Dedicated</option>
                <option value="Standard">Standard (No Discount)</option>
                <option value="Free">Free / Developer Tier</option>
              </select>
            </div>

            {/* Request Type */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Request Type
              </label>
              <input
                type="text"
                value={requestType}
                onChange={(e) => setRequestType(e.target.value)}
                placeholder="e.g. chat_request, embeddings"
                className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
              />
            </div>
          </div>

          {/* Model or Endpoint */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Model or Endpoint Name *
            </label>
            <input
              type="text"
              value={modelOrEndpoint}
              onChange={(e) => setModelOrEndpoint(e.target.value)}
              placeholder="e.g. gpt-4o-latest, servicenow_incident_faq"
              className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
              required
            />
          </div>

          {/* Cost Inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Standard Cost ($ USD)
              </label>
              <input
                type="number"
                step="0.000001"
                min="0"
                value={standardCost}
                onChange={(e) => setStandardCost(e.target.value)}
                className="w-full text-xs font-mono rounded-lg border border-slate-200 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Actual Cost ($ USD)
              </label>
              <input
                type="number"
                step="0.000001"
                min="0"
                value={actualCost}
                onChange={(e) => setActualCost(e.target.value)}
                className="w-full text-xs font-mono rounded-lg border border-slate-200 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
              />
            </div>
          </div>

          {/* Stored Generated Column Preview */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-indigo-600" />
              <div>
                <span className="font-medium text-slate-800">Postgres Generated Column: </span>
                <code className="text-indigo-600 text-[11px] font-mono">(standard_cost - actual_cost)</code>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block">Stored Savings:</span>
              <span className="font-mono font-bold text-emerald-600 text-sm">
                ${estimatedSavings.toFixed(6)}
              </span>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs transition disabled:opacity-50"
            >
              {isSubmitting ? 'Committing...' : 'Commit to Database'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
