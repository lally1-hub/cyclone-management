import React, { useState } from 'react';
import { User } from '../types';
import { ShieldCheck, UserCheck, Lock, Mail, Building, Phone, Radio, ArrowRight, Sparkles } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('mahapatra@imd.gov.in');
  const [password, setPassword] = useState('••••••••');
  const [name, setName] = useState('Dr. S. K. Mahapatra');
  const [role, setRole] = useState<'FORECASTER' | 'DISASTER_OFFICER' | 'PUBLIC_CITIZEN'>('FORECASTER');
  const [station, setStation] = useState('IMD Cyclone Warning Center, Bhubaneswar');
  const [badgeNumber, setBadgeNumber] = useState('IMD-2026-884');
  const [phone, setPhone] = useState('+91 94370 12345');

  // Quick preset accounts for easy demo sign in
  const demoUsers: User[] = [
    {
      id: 'USR-01',
      name: 'Dr. S. K. Mahapatra',
      email: 'mahapatra@imd.gov.in',
      role: 'FORECASTER',
      badgeNumber: 'IMD-2026-884',
      station: 'IMD Cyclone Warning Center, Bhubaneswar',
      phone: '+91 94370 12345',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 'USR-02',
      name: 'Major Rajesh Kumar',
      email: 'rajesh.ndrf@gov.in',
      role: 'DISASTER_OFFICER',
      badgeNumber: 'NDRF-3RD-BN',
      station: 'NDRF 3rd Battalion Base, Cuttack',
      phone: '+91 98610 99887',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 'USR-03',
      name: 'Priya Das (Local Citizen)',
      email: 'priya.gopalpur@gmail.com',
      role: 'PUBLIC_CITIZEN',
      badgeNumber: 'CITIZEN-PURI-09',
      station: 'Gopalpur Coastal District, Ganjam',
      phone: '+91 70081 54321',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user: User = {
      id: `USR-${Date.now()}`,
      name: name || 'Duty Official',
      email: email || 'official@sih.gov.in',
      role,
      badgeNumber: badgeNumber || 'SIH-2026-T315',
      station: station || 'Disaster Control Hub',
      phone: phone || '+91 98000 00000',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
    };
    onLoginSuccess(user);
  };

  const handleQuickLogin = (demo: User) => {
    onLoginSuccess(demo);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans text-slate-800">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden grid grid-cols-1 md:grid-cols-12">
        {/* Left Side: Clean Branding & Quick Demo Login */}
        <div className="md:col-span-5 bg-gradient-to-br from-sky-600 to-blue-800 text-white p-6 md:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Radio className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">CORIOLIS AI</h1>
                <p className="text-xs text-sky-200">SIH 26070 • Team Vireon</p>
              </div>
            </div>

            <h2 className="text-2xl font-extrabold mb-2 leading-tight">
              Tropical Cyclone Early Warning System
            </h2>
            <p className="text-xs text-sky-100 leading-relaxed mb-6">
              Multi-source satellite pattern recognition, ViT XAI Grad-CAM attention visualizer, and hyperlocal evacuation shelter routing.
            </p>

            {/* Quick Demo Selector */}
            <div className="space-y-2 pt-4 border-t border-white/20">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-sky-200 block">
                ⚡ One-Click Demo Sign In:
              </span>
              <div className="space-y-2">
                {demoUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => handleQuickLogin(u)}
                    className="w-full text-left p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all flex items-center gap-3 text-xs"
                  >
                    <img src={u.avatarUrl} alt={u.name} className="w-8 h-8 rounded-full object-cover border border-white/40" />
                    <div>
                      <strong className="block text-white font-medium">{u.name}</strong>
                      <span className="text-[10px] text-sky-200 block">{u.station}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 text-[10px] text-sky-200">
            Secure Government & Disaster Operational Authorization
          </div>
        </div>

        {/* Right Side: Simple Sign-In / Register Form */}
        <div className="md:col-span-7 p-6 md:p-8 bg-white flex flex-col justify-center">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                {isRegister ? 'Create Official Account' : 'Sign In to Command Center'}
              </h3>
              <p className="text-xs text-slate-500">
                {isRegister ? 'Register your official station details' : 'Enter your credentials to access live satellite telemetry'}
              </p>
            </div>
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-xs font-semibold text-sky-600 hover:text-sky-700 underline"
            >
              {isRegister ? 'Sign In Instead' : 'Register New'}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. S. K. Mahapatra"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">Official Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="officer@imd.gov.in"
                  className="w-full pl-9 pr-3.5 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">Operational Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-800 bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
              >
                <option value="FORECASTER">IMD Senior Duty Meteorologist (Alert Verifier)</option>
                <option value="DISASTER_OFFICER">Disaster Response Officer (NDRF / SDMA)</option>
                <option value="PUBLIC_CITIZEN">Coastal Resident / General Citizen</option>
              </select>
            </div>

            {isRegister && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">Station Location</label>
                  <input
                    type="text"
                    value={station}
                    onChange={(e) => setStation(e.target.value)}
                    placeholder="Bhubaneswar HQ"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">Badge ID Number</label>
                  <input
                    type="text"
                    value={badgeNumber}
                    onChange={(e) => setBadgeNumber(e.target.value)}
                    placeholder="IMD-884"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-2 shadow-md shadow-sky-600/20 transition-all mt-2"
            >
              <span>{isRegister ? 'Register Account & Sign In' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
