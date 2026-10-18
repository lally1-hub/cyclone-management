import React, { useState, useEffect } from 'react';
import { Cyclone, Shelter, Alert, SystemHealth, SystemSettings, AuditLog, User } from './types';
import {
  fetchHealth,
  fetchCyclones,
  fetchShelters,
  fetchAlerts,
  fetchSettings,
  fetchAuditLogs
} from './services/api';
import { Header } from './components/Header';
import { NavigationTabs, TabId } from './components/NavigationTabs';
import { MapView } from './components/MapView';
import { GradCamVisualizer } from './components/GradCamVisualizer';
import { RiskCalculatorTool } from './components/RiskCalculatorTool';
import { ForecasterApprovalPanel } from './components/ForecasterApprovalPanel';
import { GeminiBulletinGenerator } from './components/GeminiBulletinGenerator';
import { ApiKeysVault } from './components/ApiKeysVault';
import { LoginPage } from './components/LoginPage';
import { UserProfileModal } from './components/UserProfileModal';
import { AlertCircle, RefreshCcw } from 'lucide-react';

export function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('coriolis_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    // Default demo user so app opens cleanly
    return {
      id: 'USR-01',
      name: 'Dr. S. K. Mahapatra',
      email: 'mahapatra@imd.gov.in',
      role: 'FORECASTER',
      badgeNumber: 'IMD-2026-884',
      station: 'IMD Cyclone Warning Center, Bhubaneswar',
      phone: '+91 94370 12345',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    };
  });

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('gis');
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [cyclones, setCyclones] = useState<Cyclone[]>([]);
  const [selectedCycloneId, setSelectedCycloneId] = useState<string>('CY-2026-01');
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('coriolis_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('coriolis_user');
    setShowProfileModal(false);
  };

  const loadData = async () => {
    try {
      const [h, c, s, a, st, logs] = await Promise.all([
        fetchHealth(),
        fetchCyclones(),
        fetchShelters(),
        fetchAlerts(),
        fetchSettings(),
        fetchAuditLogs()
      ]);

      setHealth(h);
      setCyclones(c);
      setShelters(s);
      setAlerts(a);
      setSettings(st);
      setAuditLogs(logs);

      if (c.length > 0 && !c.find(item => item.id === selectedCycloneId)) {
        setSelectedCycloneId(c[0].id);
      }
    } catch (err) {
      console.error('[App] Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 15000);
    return () => clearInterval(interval);
  }, []);

  const activeCyclone = cyclones.find(c => c.id === selectedCycloneId) || cyclones[0] || null;
  const pendingAlertsCount = alerts.filter(a => a.status === 'PENDING_FORECASTER_APPROVAL').length;

  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans">
      {/* Header */}
      <Header
        health={health}
        activeCycloneName={activeCyclone?.name}
        currentUser={currentUser}
        onOpenProfile={() => setShowProfileModal(true)}
        onOpenSettings={() => setActiveTab('vault')}
        onLogout={handleLogout}
      />

      {/* User Details Modal */}
      {showProfileModal && (
        <UserProfileModal
          user={currentUser}
          onClose={() => setShowProfileModal(false)}
          onLogout={handleLogout}
        />
      )}

      {/* Navigation Tabs */}
      <NavigationTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        pendingAlertsCount={pendingAlertsCount}
      />

      {/* Active Cyclone Bar */}
      {cyclones.length > 0 && (
        <div className="bg-white border-b border-slate-200 px-4 py-2 text-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium whitespace-nowrap">Active Storm Systems:</span>
              {cyclones.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCycloneId(c.id)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    selectedCycloneId === c.id
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping"></span>
                  {c.name} ({c.imdCategory})
                </button>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-4 text-slate-600 text-[11px] font-medium">
              <span>Basin: <strong className="text-slate-900">{activeCyclone?.basin}</strong></span>
              <span>Speed: <strong className="text-slate-900">{activeCyclone?.maxWindKmph} km/h</strong></span>
              <span>RI Risk: <strong className="text-amber-700 font-bold">{activeCyclone?.rapidIntensificationRisk}%</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm font-semibold text-sky-700">Connecting to CORIOLIS Backend API Services...</p>
          </div>
        ) : !activeCyclone ? (
          <div className="py-16 text-center text-slate-500 space-y-3 bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
            <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
            <p className="text-base text-slate-900 font-semibold">Connecting to Server...</p>
            <button
              onClick={loadData}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-lg inline-flex items-center gap-1.5"
            >
              <RefreshCcw className="w-4 h-4" /> Retry Connection
            </button>
          </div>
        ) : (
          <>
            {activeTab === 'gis' && (
              <MapView
                cyclone={activeCyclone}
                shelters={shelters}
                onSelectShelter={() => setActiveTab('risk')}
              />
            )}

            {activeTab === 'xai' && (
              <GradCamVisualizer cyclone={activeCyclone} />
            )}

            {activeTab === 'risk' && (
              <RiskCalculatorTool cyclone={activeCyclone} shelters={shelters} />
            )}

            {activeTab === 'forecaster' && (
              <ForecasterApprovalPanel
                alerts={alerts}
                cyclones={cyclones}
                onRefreshAlerts={loadData}
              />
            )}

            {activeTab === 'bulletin' && (
              <GeminiBulletinGenerator
                cyclone={activeCyclone}
                geminiKeyConfigured={Boolean(health?.geminiKeyConfigured)}
                onOpenSettings={() => setActiveTab('vault')}
              />
            )}

            {activeTab === 'vault' && (
              <ApiKeysVault
                health={health}
                settings={settings}
                auditLogs={auditLogs}
                onRefreshSettings={loadData}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          <span>
            Smart India Hackathon 2026 • Problem Statement <strong className="text-slate-800 font-mono">SIH26070</strong>
          </span>
          <span className="font-medium text-[11px] text-slate-600">
            CORIOLIS Architecture • Team Vireon (SIH26-A0H-T315)
          </span>
        </div>
      </footer>
    </div>
  );
}
