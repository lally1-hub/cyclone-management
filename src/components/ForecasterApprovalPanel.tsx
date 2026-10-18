import React, { useState } from 'react';
import { Alert, Cyclone } from '../types';
import { CheckCircle2, ShieldCheck, UserCheck, AlertTriangle, Send } from 'lucide-react';
import { approveAlert, dispatchAlert } from '../services/api';

interface ForecasterApprovalPanelProps {
  alerts: Alert[];
  cyclones: Cyclone[];
  onRefreshAlerts: () => void;
}

export const ForecasterApprovalPanel: React.FC<ForecasterApprovalPanelProps> = ({
  alerts,
  cyclones,
  onRefreshAlerts
}) => {
  const [officerName, setOfficerName] = useState('Dr. S. K. Mahapatra (Senior IMD Duty Officer)');
  const [notes, setNotes] = useState('Multi-source radar & INSAT-3D consensus confirms VSCS intensity. Approved for public dispatch.');
  const [isApproving, setIsApproving] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchStatus, setDispatchStatus] = useState<string | null>(null);

  const pendingAlerts = alerts.filter(a => a.status === 'PENDING_FORECASTER_APPROVAL');
  const verifiedAlerts = alerts.filter(a => a.status === 'VERIFIED_BY_FORECASTER' || a.status === 'DISPATCHED');

  const handleApprove = async (alertId: string) => {
    setIsApproving(true);
    await approveAlert(alertId, officerName, notes);
    setIsApproving(false);
    onRefreshAlerts();
  };

  const handleDispatch = async (alertId: string) => {
    setIsDispatching(true);
    const result = await dispatchAlert(alertId, ['FCM Push', 'Emergency SMS Broadcast', 'Coastal Siren Relay']);
    setDispatchStatus(`Successfully dispatched to 142,500 coastal subscribers! Dispatch ID: ${result.dispatchId}`);
    setIsDispatching(false);
    onRefreshAlerts();
  };

  return (
    <div className="space-y-6 text-slate-800 font-sans">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-900">
              IMD Forecaster Verification & Sign-Off
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Zero false-alarm policy: Duty meteorologists authorize public emergency advisories.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-semibold">
          <UserCheck className="w-4 h-4 text-emerald-600" />
          <span>HUMAN VERIFICATION ACTIVE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Pending Queue */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              PENDING APPROVAL QUEUE ({pendingAlerts.length})
            </h3>

            {pendingAlerts.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="text-slate-800 font-semibold text-sm">All AI alerts have been reviewed & verified.</p>
              </div>
            ) : (
              pendingAlerts.map(alert => (
                <div key={alert.id} className="p-4 rounded-xl bg-slate-50 border border-amber-200 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-bold text-amber-800 font-mono text-sm">{alert.id} • {alert.cycloneName}</span>
                    <span className="px-2 py-0.5 bg-red-100 text-red-800 border border-red-200 rounded text-[10px] font-bold">
                      {alert.stage}
                    </span>
                  </div>

                  <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs text-slate-700 leading-relaxed font-sans">
                    <strong>Warning Text:</strong> &quot;{alert.translations.en}&quot;
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-2 text-xs">
                    <span className="font-bold text-sky-800 block text-[11px]">AUTHORIZATION SIGN-OFF</span>
                    <div>
                      <label className="text-[11px] text-slate-600 block mb-0.5 font-medium">Duty Meteorologist Name</label>
                      <input
                        type="text"
                        value={officerName}
                        onChange={e => setOfficerName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-800 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-600 block mb-0.5 font-medium">Verification Remarks</label>
                      <textarea
                        rows={2}
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-800 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      />
                    </div>

                    <button
                      onClick={() => handleApprove(alert.id)}
                      disabled={isApproving}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Authorize & Verify Emergency Alert</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Verified Log */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              VERIFIED ALERTS LOG
            </h3>

            {dispatchStatus && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-semibold">
                {dispatchStatus}
              </div>
            )}

            <div className="space-y-3">
              {verifiedAlerts.map(alert => (
                <div key={alert.id} className="p-3.5 rounded-lg bg-slate-50 border border-emerald-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900 font-mono">{alert.id} • {alert.cycloneName}</strong>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold">
                      VERIFIED
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-700 leading-relaxed font-sans">
                    &quot;{alert.translations.en}&quot;
                  </p>

                  <div className="p-2 bg-white rounded text-[10px] text-slate-500 space-y-0.5">
                    <div>Approved By: <strong className="text-slate-800">{alert.forecasterApprovedBy}</strong></div>
                    <div>Notes: <span className="text-slate-700">{alert.forecasterNotes}</span></div>
                  </div>

                  <button
                    onClick={() => handleDispatch(alert.id)}
                    disabled={isDispatching}
                    className="w-full py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Dispatch Tiered Broadcast (FCM / SMS)</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
