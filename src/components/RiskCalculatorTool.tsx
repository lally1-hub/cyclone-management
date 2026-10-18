import React, { useState } from 'react';
import { Cyclone, Shelter, RiskAnalysisResult } from '../types';
import { ShieldAlert, Navigation, MapPin, Activity, PhoneCall, AlertCircle } from 'lucide-react';
import { calculateRisk } from '../services/api';

interface RiskCalculatorToolProps {
  cyclone: Cyclone;
  shelters: Shelter[];
}

export const RiskCalculatorTool: React.FC<RiskCalculatorToolProps> = ({ cyclone, shelters }) => {
  const [lat, setLat] = useState<number>(19.30);
  const [lng, setLng] = useState<number>(84.95);
  const [elevation, setElevation] = useState<number>(6);
  const [windSpeed, setWindSpeed] = useState<number>(cyclone.maxWindKmph);
  const [surge, setSurge] = useState<number>(cyclone.estimatedLandfall.peakSurgeMeters);
  const [population, setPopulation] = useState<number>(1200);

  const [loading, setLoading] = useState(false);
  const [riskResult, setRiskResult] = useState<RiskAnalysisResult | null>(null);

  const handleComputeRisk = async () => {
    setLoading(true);
    const res = await calculateRisk({
      lat,
      lng,
      elevationMeters: elevation,
      windSpeedKmph: windSpeed,
      surgeMeters: surge,
      populationDensity: population
    });
    setRiskResult(res);
    setLoading(false);
  };

  const sortedShelters = [...shelters].sort((a, b) => b.hazardAvoidanceScore - a.hazardAvoidanceScore);

  return (
    <div className="space-y-6 text-slate-800 font-sans">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-bold text-slate-900">
              Hyperlocal Risk Matrix & Evacuation Router
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Fuses coastal ground elevation (35%), wind intensity (25%), storm surge inundation (20%), and population density (20%).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <MapPin className="w-4 h-4 text-sky-600" />
              LOCATION & COASTAL PARAMETERS
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-600 block mb-1 font-medium">Latitude (°N)</label>
                <input
                  type="number"
                  step="0.01"
                  value={lat}
                  onChange={(e) => setLat(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-medium">Longitude (°E)</label>
                <input
                  type="number"
                  step="0.01"
                  value={lng}
                  onChange={(e) => setLng(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-medium">Ground Elevation (m)</label>
                <input
                  type="number"
                  value={elevation}
                  onChange={(e) => setElevation(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-medium">Peak Wind (km/h)</label>
                <input
                  type="number"
                  value={windSpeed}
                  onChange={(e) => setWindSpeed(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-medium">Storm Surge (m)</label>
                <input
                  type="number"
                  step="0.1"
                  value={surge}
                  onChange={(e) => setSurge(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-medium">Population (/km²)</label>
                <input
                  type="number"
                  value={population}
                  onChange={(e) => setPopulation(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleComputeRisk}
              disabled={loading}
              className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-2 shadow-md shadow-sky-600/20 transition-all"
            >
              {loading ? (
                <span>Calculating Risk Score...</span>
              ) : (
                <>
                  <Activity className="w-4 h-4" />
                  <span>Compute Risk Score Matrix</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Calculated Results */}
        <div className="lg:col-span-7 space-y-4">
          {riskResult ? (
            <div className="bg-white p-5 rounded-xl border border-red-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-xs text-slate-500 block font-medium">COMPOSITE RISK SCORE</span>
                  <h3 className="text-2xl font-extrabold text-rose-700 font-mono">
                    {riskResult.compositeRiskScore} <span className="text-sm font-normal text-slate-500">/ 100</span>
                  </h3>
                </div>
                <span className="px-3 py-1 bg-red-100 text-red-800 border border-red-200 rounded-lg text-xs font-extrabold">
                  {riskResult.riskCategory}
                </span>
              </div>

              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs flex items-start gap-2 text-red-900">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-red-950 font-bold">Action Plan:</strong>
                  {riskResult.recommendedAction}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-xs text-slate-500">
              Click &quot;Compute Risk Score Matrix&quot; to calculate.
            </div>
          )}

          {/* Shelters */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Navigation className="w-4 h-4 text-sky-600" />
              RECOMMENDED CYCLONE SHELTERS
            </h3>

            <div className="space-y-3">
              {sortedShelters.map((s, idx) => (
                <div
                  key={s.id}
                  className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-sky-600 text-white font-mono text-[10px] font-bold flex items-center justify-center">
                        #{idx + 1}
                      </span>
                      <strong className="text-slate-900 text-sm font-semibold">{s.name}</strong>
                    </div>
                    <p className="text-slate-600 text-[11px]">
                      {s.district}, {s.state} • Elev: <strong className="text-sky-800">{s.elevationMeters}m</strong> • Road: <span className="text-emerald-700 font-medium">{s.roadStatus}</span>
                    </p>
                  </div>

                  <a
                    href={`tel:${s.contactPhone}`}
                    className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-sky-700 font-semibold rounded-lg flex items-center gap-1.5"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    Call Shelter
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
