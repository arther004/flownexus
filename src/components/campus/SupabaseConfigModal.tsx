/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SupabaseConfig } from '../../types/campus';
import { campusDb, DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_ANON_KEY } from '../../lib/supabaseClient';
import {
  Database,
  CheckCircle,
  AlertCircle,
  Copy,
  Check,
  X,
  Download,
  RotateCcw,
  ExternalLink
} from 'lucide-react';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SupabaseConfig;
  onConfigUpdated: () => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  onConfigUpdated
}) => {
  const [url, setUrl] = useState(config.url || DEFAULT_SUPABASE_URL);
  const [anonKey, setAnonKey] = useState(config.anonKey || DEFAULT_SUPABASE_ANON_KEY);
  const [activeTab, setActiveTab] = useState<'connection' | 'schema'>('connection');
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (config.url) setUrl(config.url);
    if (config.anonKey) setAnonKey(config.anonKey);
  }, [config]);

  if (!isOpen) return null;

  const handleSaveConnection = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTesting(true);
    setStatusMessage(null);

    try {
      const result = await campusDb.setConfig(url, anonKey);
      setStatusMessage({ text: result.message, isError: !result.success });
      if (result.success) {
        onConfigUpdated();
      }
    } finally {
      setIsTesting(false);
    }
  };

  const handleDisconnect = async () => {
    setUrl('');
    setAnonKey('');
    const result = await campusDb.setConfig('', '');
    setStatusMessage({ text: result.message, isError: false });
    onConfigUpdated();
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(campusDb.getBootstrapSql());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportData = async () => {
    const json = await campusDb.exportAllData();
    const blob = new Blob([json], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = href;
    a.download = `nexusflow_data_export_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(href);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all campus data to default initial seed?')) {
      campusDb.resetToDefaults();
      onConfigUpdated();
      setStatusMessage({ text: 'Data reset to default academic state.', isError: false });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl relative max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Supabase Database Backend Sync
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Connect your remote Supabase PostgreSQL database or manage persistent local records.
            </p>
          </div>
        </div>

        {/* Tabs: Connection vs Schema */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl my-4 text-xs font-medium">
          <button
            onClick={() => setActiveTab('connection')}
            className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'connection'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Connection Settings
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'schema'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            PostgreSQL SQL Schema
          </button>
        </div>

        {/* Status Banner */}
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center justify-between mb-4 ${
            config.isConnected
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
              : 'bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {config.isConnected ? (
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
            )}
            <span>
              {config.isConnected
                ? 'Connected to remote Supabase database. Real-time queries active.'
                : 'Local Offline-First Storage Mode active. Data persists locally.'}
            </span>
          </div>
          {config.lastSyncedAt && (
            <span className="text-[11px] font-mono text-slate-500">
              Synced {new Date(config.lastSyncedAt).toLocaleTimeString()}
            </span>
          )}
        </div>

        {/* Status Message from Testing */}
        {statusMessage && (
          <div
            className={`p-3 rounded-xl text-xs mb-4 ${
              statusMessage.isError
                ? 'bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400'
                : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400'
            }`}
          >
            {statusMessage.text}
          </div>
        )}

        {/* Tab 1: Connection Form */}
        {activeTab === 'connection' && (
          <form onSubmit={handleSaveConnection} className="space-y-4 overflow-y-auto flex-1">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Supabase Project URL
              </label>
              <input
                type="url"
                placeholder="https://xyzcompany.supabase.co"
                value={url}
                onChange={e => setUrl(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-emerald-500"
              />
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Located in your Supabase Dashboard &gt; Project Settings &gt; API
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Supabase Anon Public API Key
              </label>
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={anonKey}
                onChange={e => setAnonKey(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-emerald-500"
              />
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Safe for browser client access. Never use the secret service role key.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {config.isConnected && (
                  <button
                    type="button"
                    onClick={handleDisconnect}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-red-500 text-xs font-medium cursor-pointer"
                  >
                    Disconnect
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleExportData}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export JSON</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetData}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Seed</span>
                </button>
              </div>

              <button
                type="submit"
                disabled={isTesting || !url.trim() || !anonKey.trim()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isTesting ? (
                  <span>Testing Connection...</span>
                ) : (
                  <>
                    <Database className="w-3.5 h-3.5" />
                    <span>Save & Connect</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: PostgreSQL Schema */}
        {activeTab === 'schema' && (
          <div className="flex-1 overflow-y-auto space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Execute this SQL in Supabase Dashboard &gt; SQL Editor to generate all tables:
              </span>
              <button
                onClick={handleCopySql}
                className="flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy SQL'}</span>
              </button>
            </div>

            <pre className="p-3.5 rounded-xl bg-slate-900 text-slate-200 text-[11px] font-mono overflow-x-auto max-h-72 border border-slate-800">
              {campusDb.getBootstrapSql()}
            </pre>

            <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <span>Need help? Open</span>
              <a
                href="https://supabase.com/docs"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-600 dark:text-emerald-400 underline inline-flex items-center gap-0.5"
              >
                <span>Supabase Documentation</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
