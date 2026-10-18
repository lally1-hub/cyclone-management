import React, { useState } from 'react';
import { SystemHealth, SystemSettings, AuditLog } from '../types';
import { Key, Database, Activity, Save, Check, RefreshCw } from 'lucide-react';
import { updateSettings } from '../services/api';

interface ApiKeysVaultProps {
  health: SystemHealth | null;
  settings: SystemSettings | null;
  auditLogs: AuditLog[];
  onRefreshSettings: () => void;
}

export const ApiKeysVault: React.FC<ApiKeysVaultProps> = ({
  health,
  settings,
  auditLogs,
  onRefreshSettings
}) => {
  const [apiKeyInput, setApiKeyInput] = useState(settings?.geminiApiKey || '');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveKeys = async () => {
    setIsSaving(true);
    await updateSettings({ geminiApiKey: apiKeyInput });
    setIsSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
    onRefreshSettings();
  };

  return (
    <div className="space-y-6 text-slate-800 font-sans">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-sky-600" />
            <h2 className="text-lg font-bold text-slate-900">
              API Keys, System Connectors & Audit Vault
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage Gemini API credentials, ISRO MOSDAC satellite feeds, IMD API status, and view database logs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: API Form */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Key className="w-4 h-4 text-sky-600" />
              API CREDENTIALS
            </h3>

            {savedSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                API Key saved & activated!
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs text-slate-700 block font-medium">
                Google Gemini API Key
              </label>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-mono text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
              <p className="text-[11px] text-slate-500">
                Key is used for generating IMD technical advisories and multilingual warnings. If left blank, internal fallback engine is used automatically.
              </p>
            </div>

            <button
              onClick={handleSaveKeys}
              disabled={isSaving}
              className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-2 shadow-md shadow-sky-600/20 transition-all"
            >
              {isSaving ? (
                <span>Saving Credentials...</span>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save API Configuration</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Activity className="w-4 h-4 text-emerald-600" />
              INTEGRATION FEED STATUS
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="text-slate-700 font-medium">ISRO MOSDAC Gateway</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold">
                  {health?.integrations?.mosdac || 'ACTIVE'}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="text-slate-700 font-medium">IMD Weather API Stream</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold">
                  {health?.integrations?.imd || 'CONNECTED'}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="text-slate-700 font-medium">Copernicus ERA5 Reanalysis</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold">
                  {health?.integrations?.era5 || 'ONLINE'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Logs */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Database className="w-4 h-4 text-sky-600" />
                SYSTEM AUDIT LOGS
              </h3>
              <button
                onClick={onRefreshSettings}
                className="p-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {auditLogs.map((log, idx) => (
                <div key={idx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className="text-sky-700 font-bold">{log.action}</span>
                    <span className="text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-slate-800 text-[11px] font-sans">{log.details}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
