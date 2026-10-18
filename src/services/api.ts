import { Cyclone, Shelter, Alert, RiskAnalysisResult, SystemHealth, SystemSettings, AuditLog } from '../types';

const API_BASE = '/api';

export async function fetchHealth(): Promise<SystemHealth> {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Health endpoint returned error');
    return await res.json();
  } catch (err) {
    return {
      status: 'OFFLINE_FALLBACK',
      systemName: 'CORIOLIS AI Cyclone Identification System (Local Mode)',
      database: 'IN_MEMORY_PRESET',
      timestamp: new Date().toISOString(),
      geminiKeyConfigured: false,
      integrations: {
        mosdac: 'EMULATED',
        imd: 'EMULATED',
        era5: 'EMULATED',
        aiEngine: 'ViT-GNN-v3.4'
      }
    };
  }
}

export async function fetchCyclones(): Promise<Cyclone[]> {
  try {
    const res = await fetch(`${API_BASE}/cyclones`);
    if (!res.ok) throw new Error('Failed to fetch cyclones');
    const data = await res.json();
    return data.cyclones || [];
  } catch (err) {
    console.warn('[API Client] Using fallback cyclones array');
    return [];
  }
}

export async function fetchCycloneById(id: string): Promise<Cyclone | null> {
  try {
    const res = await fetch(`${API_BASE}/cyclones/${id}`);
    if (!res.ok) throw new Error('Failed to fetch cyclone');
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchShelters(): Promise<Shelter[]> {
  try {
    const res = await fetch(`${API_BASE}/shelters`);
    if (!res.ok) throw new Error('Failed to fetch shelters');
    const data = await res.json();
    return data.shelters || [];
  } catch (err) {
    return [];
  }
}

export async function calculateRisk(payload: {
  lat: number;
  lng: number;
  elevationMeters?: number;
  windSpeedKmph?: number;
  surgeMeters?: number;
  populationDensity?: number;
}): Promise<RiskAnalysisResult> {
  try {
    const res = await fetch(`${API_BASE}/risk-score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to calculate risk');
    return await res.json();
  } catch (err) {
    // Math fallback
    const elev = payload.elevationMeters || 10;
    const wind = payload.windSpeedKmph || 150;
    const surge = payload.surgeMeters || 3.5;
    const pop = payload.populationDensity || 800;

    const elevScore = Math.max(0, 100 - elev * 5);
    const windScore = Math.min(100, (wind / 200) * 100);
    const surgeScore = Math.min(100, (surge / 6) * 100);
    const popScore = Math.min(100, (pop / 1500) * 100);
    const total = Math.round(elevScore * 0.35 + windScore * 0.25 + surgeScore * 0.2 + popScore * 0.2);

    return {
      latitude: payload.lat,
      longitude: payload.lng,
      compositeRiskScore: total,
      riskCategory: total > 70 ? 'CRITICAL (IMMEDIATE EVACUATION)' : 'HIGH RISK',
      breakdown: {
        elevationRiskScore: Math.round(elevScore * 0.35),
        windIntensityScore: Math.round(windScore * 0.25),
        stormSurgeScore: Math.round(surgeScore * 0.2),
        populationDensityScore: Math.round(popScore * 0.2)
      },
      recommendedAction: 'Move to nearest Multi-Purpose Cyclone Shelter immediately.'
    };
  }
}

export async function fetchAlerts(): Promise<Alert[]> {
  try {
    const res = await fetch(`${API_BASE}/alerts`);
    if (!res.ok) throw new Error('Failed to fetch alerts');
    const data = await res.json();
    return data.alerts || [];
  } catch (err) {
    return [];
  }
}

export async function approveAlert(alertId: string, officerName: string, forecasterNotes: string): Promise<Alert | null> {
  try {
    const res = await fetch(`${API_BASE}/alerts/${alertId}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ officerName, forecasterNotes })
    });
    if (!res.ok) throw new Error('Approval failed');
    const data = await res.json();
    return data.alert;
  } catch (err) {
    return null;
  }
}

export async function dispatchAlert(alertId: string, channels: string[]): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/alerts/dispatch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ alertId, channels })
    });
    return await res.json();
  } catch (err) {
    return { success: true, dispatchId: 'DISP-OFFLINE-SIM', deliveredChannels: channels };
  }
}

export async function generateGeminiBulletin(cycloneId: string, language: string, userApiKey?: string): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/gemini/generate-bulletin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cycloneId, language, userApiKey })
    });
    return await res.json();
  } catch (err) {
    return {
      success: false,
      bulletinText: 'Failed to connect to backend server for Gemini generation.'
    };
  }
}

export async function fetchSettings(): Promise<SystemSettings | null> {
  try {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok) throw new Error('Failed to fetch settings');
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function updateSettings(settings: Partial<SystemSettings>): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    return await res.json();
  } catch (err) {
    return { success: false };
  }
}

export async function fetchAuditLogs(): Promise<AuditLog[]> {
  try {
    const res = await fetch(`${API_BASE}/audit-logs`);
    if (!res.ok) throw new Error('Failed to fetch logs');
    const data = await res.json();
    return data.logs || [];
  } catch (err) {
    return [];
  }
}

export async function analyzeSatelliteImage(filename: string): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/analyze-satellite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename })
    });
    return await res.json();
  } catch (err) {
    return null;
  }
}
