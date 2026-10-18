import React from 'react';
import { User } from '../types';
import { X, UserCheck, Shield, Building, Phone, Mail, BadgeCheck, LogOut } from 'lucide-react';

interface UserProfileModalProps {
  user: User;
  onClose: () => void;
  onLogout: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ user, onClose, onLogout }) => {
  return (
    <div className="fixed inset-0 z-[2000] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 relative font-sans text-slate-800 space-y-5 animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* User Card Header */}
        <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-14 h-14 rounded-full object-cover border-2 border-sky-500 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-base font-bold text-slate-900">{user.name}</h3>
              <BadgeCheck className="w-4 h-4 text-sky-600" />
            </div>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-sky-100 text-sky-800 rounded-full inline-block mt-0.5">
              {user.role === 'FORECASTER' ? 'IMD SENIOR FORECASTER' : user.role === 'DISASTER_OFFICER' ? 'DISASTER RESPONSE OFFICER' : 'COASTAL CITIZEN'}
            </span>
          </div>
        </div>

        {/* User Details Grid */}
        <div className="space-y-3 text-xs">
          <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <Building className="w-4 h-4 text-slate-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Station & Facility</span>
              <strong className="text-slate-800 font-semibold">{user.station}</strong>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <Shield className="w-4 h-4 text-slate-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Official Badge / ID Number</span>
              <strong className="text-slate-800 font-mono">{user.badgeNumber}</strong>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <Mail className="w-4 h-4 text-slate-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Email Address</span>
              <strong className="text-slate-800 font-mono">{user.email}</strong>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <Phone className="w-4 h-4 text-slate-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Emergency Phone Contact</span>
              <strong className="text-slate-800 font-mono">{user.phone}</strong>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-colors"
          >
            Close Details
          </button>
          <button
            onClick={onLogout}
            className="flex-1 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};
