import React from 'react';
import { Map, Eye, ShieldAlert, CheckCircle2, Megaphone, Key } from 'lucide-react';

export type TabId = 'gis' | 'xai' | 'risk' | 'forecaster' | 'bulletin' | 'vault';

interface NavigationTabsProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  pendingAlertsCount?: number;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  onTabChange,
  pendingAlertsCount = 0
}) => {
  const tabs = [
    { id: 'gis', label: 'GIS Track & Map', icon: Map },
    { id: 'xai', label: 'AI Classification & Grad-CAM', icon: Eye },
    { id: 'risk', label: 'Risk Matrix & Shelters', icon: ShieldAlert },
    {
      id: 'forecaster',
      label: 'Forecaster Sign-Off',
      icon: CheckCircle2,
      badge: pendingAlertsCount > 0 ? pendingAlertsCount : null
    },
    { id: 'bulletin', label: 'Multilingual Gemini Alerts', icon: Megaphone },
    { id: 'vault', label: 'API Keys & System Logs', icon: Key }
  ];

  return (
    <nav className="bg-white border-b border-slate-200 px-4 py-2 sticky top-[65px] z-40">
      <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id as TabId)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded-full animate-pulse">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
