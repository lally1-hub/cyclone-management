import React, { useState } from 'react';
import { Cyclone } from '../types';
import { Cpu, Eye, Sparkles, Layers, Sliders, CheckCircle, Flame } from 'lucide-react';
import { analyzeSatelliteImage } from '../services/api';

interface GradCamVisualizerProps {
  cyclone: Cyclone;
}

export const GradCamVisualizer: React.FC<GradCamVisualizerProps> = ({ cyclone }) => {
  const [activeBand, setActiveBand] = useState<'insat3d_ir' | 'insat3dr_wv' | 'vis_color'>('insat3d_ir');
  const [showGradCamOverlay, setShowGradCamOverlay] = useState(true);
  const [opacity, setOpacity] = useState(0.65);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);

  const handleRunAiScan = async () => {
    setIsScanning(true);
    const result = await analyzeSatelliteImage(`INSAT-3D_${activeBand}.png`);
    setScanResult(result);
    setIsScanning(false);
  };

  const currentResult = scanResult || {
    classificationResult: {
      tNumber: cyclone.tNumber,
      imdCategory: cyclone.imdCategory,
      estimatedWindKmph: cyclone.maxWindKmph,
      estimatedPressureHpa: cyclone.centralPressureHpa,
      eyeWallConfidencePercent: 96.8,
      symmetryScore: 0.91
    },
    rapidIntensificationXGB: {
      riProbabilityPercent: cyclone.rapidIntensificationRisk,
      riskLevel: cyclone.rapidIntensificationRisk > 75 ? 'HIGH (Rapid Intensification Warning)' : 'MODERATE'
    }
  };

  const attentionGrid = cyclone.vitAttentionMap || [
    [0.1, 0.2, 0.4, 0.3, 0.1],
    [0.2, 0.7, 0.9, 0.6, 0.2],
    [0.3, 0.9, 1.0, 0.8, 0.3],
    [0.2, 0.6, 0.8, 0.5, 0.2],
    [0.1, 0.2, 0.3, 0.2, 0.1]
  ];

  return (
    <div className="space-y-6 text-slate-800 font-sans">
      {/* Top Light Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-sky-600" />
            <h2 className="text-lg font-bold text-slate-900">
              Vision Transformer (ViT) & Grad-CAM Visualizer
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Satellite eye wall pattern detection, Dvorak T-number classification, and XAI Grad-CAM convective heatmap overlay.
          </p>
        </div>

        <button
          onClick={handleRunAiScan}
          disabled={isScanning}
          className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-lg flex items-center gap-2 shadow-md shadow-sky-600/20 transition-all disabled:opacity-50"
        >
          {isScanning ? (
            <span>Processing ViT Model...</span>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Run AI Deep Scan</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Satellite Frame */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold text-slate-700">Spectral Band:</span>
                <button
                  onClick={() => setActiveBand('insat3d_ir')}
                  className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                    activeBand === 'insat3d_ir' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  INSAT-3D IR (10.8 µm)
                </button>
                <button
                  onClick={() => setActiveBand('insat3dr_wv')}
                  className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                    activeBand === 'insat3dr_wv' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  Water Vapor (6.8 µm)
                </button>
              </div>

              <button
                onClick={() => setShowGradCamOverlay(!showGradCamOverlay)}
                className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  showGradCamOverlay ? 'bg-purple-100 text-purple-800 border border-purple-300' : 'bg-slate-100 text-slate-500'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-purple-600" />
                Grad-CAM: {showGradCamOverlay ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Satellite Frame & Heatmap Overlay */}
            <div className="relative w-full h-[380px] rounded-lg overflow-hidden border border-slate-200 bg-slate-900 flex items-center justify-center">
              <img
                src={cyclone.satelliteImagery[activeBand]}
                alt="INSAT Satellite Frame"
                className="w-full h-full object-cover filter brightness-95"
              />

              {showGradCamOverlay && (
                <div
                  className="absolute inset-0 grid grid-cols-5 grid-rows-5 pointer-events-none transition-opacity duration-300"
                  style={{ opacity: opacity }}
                >
                  {attentionGrid.flatMap((row, rIdx) =>
                    row.map((val, cIdx) => {
                      let bg = 'rgba(56, 189, 248, 0.1)';
                      if (val > 0.8) bg = 'rgba(225, 29, 72, 0.75)';
                      else if (val > 0.5) bg = 'rgba(217, 119, 6, 0.6)';
                      else if (val > 0.3) bg = 'rgba(16, 185, 129, 0.4)';

                      return (
                        <div
                          key={`cell-${rIdx}-${cIdx}`}
                          className="border border-white/20 flex items-center justify-center text-[11px] font-mono font-bold text-white shadow-inner"
                          style={{ backgroundColor: bg }}
                        >
                          {val > 0.6 ? `${Math.round(val * 100)}%` : ''}
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {showGradCamOverlay && (
                <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-2 text-xs z-10 shadow-md">
                  <Sliders className="w-3.5 h-3.5 text-sky-600" />
                  <span className="text-slate-700 text-[11px] font-medium">Heatmap Opacity:</span>
                  <input
                    type="range"
                    min="0.2"
                    max="0.9"
                    step="0.05"
                    value={opacity}
                    onChange={(e) => setOpacity(parseFloat(e.target.value))}
                    className="w-20 accent-sky-600 cursor-pointer"
                  />
                  <span className="font-mono text-sky-700 text-[11px] font-bold">{Math.round(opacity * 100)}%</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: AI Metrics */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-sky-600" />
                ViT CLASSIFICATION RESULTS
              </h3>
              <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold">
                {currentResult.classificationResult.eyeWallConfidencePercent}% CONFIDENCE
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[11px] text-slate-500 block font-medium">Dvorak T-Number</span>
                <span className="text-xl font-extrabold text-sky-700 font-mono">
                  {currentResult.classificationResult.tNumber}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[11px] text-slate-500 block font-medium">Sustained Winds</span>
                <span className="text-xl font-extrabold text-slate-800 font-mono">
                  {currentResult.classificationResult.estimatedWindKmph} <span className="text-xs font-normal text-slate-500">km/h</span>
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[11px] text-slate-500 block font-medium">Central Pressure</span>
                <span className="text-xl font-extrabold text-slate-800 font-mono">
                  {currentResult.classificationResult.estimatedPressureHpa} <span className="text-xs font-normal text-slate-500">hPa</span>
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[11px] text-slate-500 block font-medium">Eye Symmetry</span>
                <span className="text-xl font-extrabold text-emerald-700 font-mono">
                  {(currentResult.classificationResult.symmetryScore * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-sky-50 border border-sky-200 text-xs space-y-1">
              <div className="font-bold text-sky-900 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-sky-600" />
                IMD Classification Grade:
              </div>
              <p className="text-slate-900 font-extrabold text-sm">
                {currentResult.classificationResult.imdCategory}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
