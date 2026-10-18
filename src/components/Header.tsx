import React, { useState, useEffect } from 'react';
import { Radio, Database, Cpu, Sparkles, AlertTriangle, User as UserIcon, LogOut, Key } from 'lucide-react';
import { SystemHealth, User } from '../types';

interface HeaderProps {
  health: SystemHealth | null;
  activeCycloneName?: string;
  currentUser: User | null;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  health,
  activeCycloneName,
  currentUser,
  onOpenProfile,
  onOpenSettings,
  onLogout
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toUTCString().replace('GMT', 'UTC'));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-50 px-4 py-3 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Team Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center shadow-md shadow-sky-600/20 text-white">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 font-sans">
                CORIOLIS <span className="text-sky-600 text-sm font-semibold">CYCLONE AI</span>
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold bg-sky-100 text-sky-800 rounded-full border border-sky-200">
                SIH 26070
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Team Vireon (SIH26-A0H-T315) • Multi-Source Satellite Identification & Risk System
            </p>
          </div>
        </div>

        {/* Status Indicators & User Profile Button */}
        <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs">
          {/* Active Cyclone Warning */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-700 font-medium">
            <AlertTriangle className="w-4 h-4 text-red-600 animate-bounce" />
            <span>ACTIVE: <strong className="text-red-900">{activeCycloneName || 'CORIOLIS-01'}</strong> (VSCS)</span>
          </div>

          {/* Gemini AI Status */}
          <button
            onClick={onOpenSettings}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-all ${
              health?.geminiKeyConfigured
                ? 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100'
                : 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gemini AI: <strong>{health?.geminiKeyConfigured ? 'READY' : 'SETUP KEY'}</strong></span>
          </button>

          {/* User Details & Profile Avatar Button */}
          {currentUser ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
                title="View User Details"
              >
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover border border-sky-500"
                />
                <div className="text-left hidden sm:block">
                  <span className="font-bold text-slate-900 text-xs block leading-tight">{currentUser.name}</span>
                  <span className="text-[10px] text-slate-500 block leading-tight">{currentUser.role}</span>
                </div>
              </button>

              <button
                onClick={onLogout}
                className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};
