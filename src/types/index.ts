export interface User {
  id: string;
  name: string;
  email: string;
  role: 'FORECASTER' | 'DISASTER_OFFICER' | 'PUBLIC_CITIZEN';
  badgeNumber: string;
  station: string;
  phone: string;
  avatarUrl: string;
}

export interface LatLng {
  lat: number;
  lng: number;
}

export interface TrackPoint extends LatLng {
  pressure: number;
  wind: number;
  timestamp: string;
  grade: string;
  coneRadiusKm?: number;
}

export interface LandfallInfo {
  location: string;
  etaTime: string;
  peakSurgeMeters: number;
  coastalDistrictsAtRisk: string[];
}

export interface SatelliteImagery {
  insat3d_ir: string;
  insat3dr_wv: string;
  vis_color: string;
}

export interface PhysicsMetrics {
  sst: number;
  verticalWindShear: number;
  oceanHeatContent: number;
  vorticity850: number;
}

export interface Cyclone {
  id: string;
  name: string;
  basin: string;
  imdCategory: string;
  tNumber: string;
  centralPressureHpa: number;
  maxWindKnots: number;
  maxWindKmph: number;
  rapidIntensificationRisk: number;
  eyeStatus: string;
  currentPos: LatLng;
  movementSpeedKmph: number;
  headingDegree: number;
  lastUpdated: string;
  satelliteImagery: SatelliteImagery;
  vitAttentionMap: number[][];
  physicsMetrics: PhysicsMetrics;
  historicalTrack: TrackPoint[];
  predictedTrack24h: TrackPoint[];
  uncertaintyConePolygon: LatLng[];
  estimatedLandfall: LandfallInfo;
}

export interface Shelter {
  id: string;
  name: string;
  district: string;
  state: string;
  lat: number;
  lng: number;
  elevationMeters: number;
  capacityPersons: number;
  currentOccupancy: number;
  roadStatus: string;
  amenities: string[];
  contactPhone: string;
  hazardAvoidanceScore: number;
}

export interface Alert {
  id: string;
  cycloneId: string;
  cycloneName: string;
  stage: string;
  severity: string;
  status: 'PENDING_FORECASTER_APPROVAL' | 'VERIFIED_BY_FORECASTER' | 'DISPATCHED';
  forecasterApprovedBy?: string | null;
  forecasterNotes?: string | null;
  approvedTimestamp?: string;
  dispatchTimestamp: string;
  channels: string[];
  translations: Record<string, string>;
}

export interface RiskAnalysisResult {
  latitude: number;
  longitude: number;
  compositeRiskScore: number;
  riskCategory: string;
  breakdown: {
    elevationRiskScore: number;
    windIntensityScore: number;
    stormSurgeScore: number;
    populationDensityScore: number;
  };
  recommendedAction: string;
}

export interface SystemHealth {
  status: string;
  systemName: string;
  database: string;
  timestamp: string;
  geminiKeyConfigured: boolean;
  integrations: {
    mosdac: string;
    imd: string;
    era5: string;
    aiEngine: string;
  };
}

export interface SystemSettings {
  geminiApiKey: string;
  mosdacApiStatus: string;
  imdApiStatus: string;
  era5ApiStatus: string;
  aiEngineVersion: string;
  lastSyncTimestamp: string;
}

export interface AuditLog {
  timestamp: string;
  action: string;
  user: string;
  details: string;
}
