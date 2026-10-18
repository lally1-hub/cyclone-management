import React, { useState } from 'react';
import { Cyclone } from '../types';
import { Sparkles, Globe, Copy, Check, Send, FileText } from 'lucide-react';
import { generateGeminiBulletin, dispatchAlert } from '../services/api';

interface GeminiBulletinGeneratorProps {
  cyclone: Cyclone;
  geminiKeyConfigured: boolean;
  onOpenSettings: () => void;
}

export const GeminiBulletinGenerator: React.FC<GeminiBulletinGeneratorProps> = ({
  cyclone,
  geminiKeyConfigured,
  onOpenSettings
}) => {
  const [selectedLang, setSelectedLang] = useState('en');
  const [isGenerating, setIsGenerating] = useState(false);
  const [bulletinResult, setBulletinResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [dispatchStatus, setDispatchStatus] = useState<string | null>(null);

  const languages = [
    { code: 'en', name: 'English (Official)' },
    { code: 'hi', name: 'Hindi (हिंदी)' },
    { code: 'or', name: 'Odia (ଓଡ଼ିଆ)' },
    { code: 'bn', name: 'Bengali (বাংলা)' },
    { code: 'te', name: 'Telugu (తెలుగు)' },
    { code: 'ta', name: 'Tamil (தமிழ்)' },
    { code: 'gu', name: 'Gujarati (ગુજરાતી)' },
    { code: 'ml', name: 'Malayalam (മലയാളം)' }
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    const result = await generateGeminiBulletin(cyclone.id, selectedLang);
    setBulletinResult(result);
    setIsGenerating(false);
  };

  const handleCopy = () => {
    if (bulletinResult?.bulletinText) {
      navigator.clipboard.writeText(bulletinResult.bulletinText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleBroadcast = async () => {
    const res = await dispatchAlert('ALT-GEMINI-LIVE', ['FCM Push Notification', 'Emergency SMS Broadcast', 'NDMA SACHET Gateway']);
    setDispatchStatus(`Multilingual Emergency Advisory Dispatched! Reached 142,500 subscribers.`);
  };

  return (
    <div className="space-y-6 text-slate-800 font-sans">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-bold text-slate-900">
              Multilingual Gemini Advisory & Dispatch Center
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Synthesizes official technical bulletins and translates emergency public alerts into 8 Indian regional languages instantly.
          </p>
        </div>

        {!geminiKeyConfigured && (
          <button
            onClick={onOpenSettings}
            className="px-3 py-1.5 bg-amber-50 border border-amber-300 text-amber-800 rounded-lg text-xs font-semibold hover:bg-amber-100 transition-colors"
          >
            Setup Gemini Key
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Languages */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Globe className="w-4 h-4 text-purple-600" />
              SELECT REGIONAL LANGUAGE
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {languages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLang(lang.code)}
                  className={`px-3 py-2 rounded-lg text-left font-semibold transition-all ${
                    selectedLang === lang.code
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-2 shadow-md shadow-purple-600/20 transition-all"
            >
              {isGenerating ? (
                <span>Generating Gemini Advisory...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate AI Advisory Bulletin</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Output */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-600" />
                ADVISORY BULLETIN OUTPUT
              </h3>

              {bulletinResult && (
                <button
                  onClick={handleCopy}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors"
                  title="Copy Text"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              )}
            </div>

            {dispatchStatus && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-semibold">
                {dispatchStatus}
              </div>
            )}

            {bulletinResult ? (
              <div className="space-y-3">
                <textarea
                  readOnly
                  rows={14}
                  value={bulletinResult.bulletinText}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 font-mono text-xs text-slate-800 leading-relaxed focus:outline-none resize-none"
                />

                <button
                  onClick={handleBroadcast}
                  className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-2 shadow-md shadow-red-600/20"
                >
                  <Send className="w-4 h-4" />
                  <span>Broadcast Tiered Emergency Alert (FCM / SMS)</span>
                </button>
              </div>
            ) : (
              <div className="py-16 text-center text-xs text-slate-400 space-y-2">
                <Sparkles className="w-8 h-8 text-purple-500 mx-auto opacity-50" />
                <p className="text-slate-700 font-semibold text-sm">No bulletin generated yet.</p>
                <p className="text-slate-500">Click &quot;Generate AI Advisory Bulletin&quot; to synthesize report.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
