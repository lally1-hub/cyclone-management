import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'coriolis_database.json');

// Initial seed dataset reflecting SIH26070 requirements & real tropical cyclone data
const initialData = {
  systemSettings: {
    geminiApiKey: process.env.GEMINI_API_KEY || '',
    mosdacApiStatus: 'ACTIVE (ISRO MOSDAC Satellite Gateway)',
    imdApiStatus: 'CONNECTED (IMD Data Stream v2.4)',
    era5ApiStatus: 'ONLINE (Copernicus Climate Data Store)',
    aiEngineVersion: 'ViT-GNN-ConvLSTM v3.4-INT8',
    lastSyncTimestamp: new Date().toISOString()
  },
  cyclones: [
    {
      id: 'CY-2026-01',
      name: 'CORIOLIS-01',
      basin: 'Bay of Bengal',
      imdCategory: 'Very Severe Cyclonic Storm (VSCS)',
      tNumber: 'T4.5',
      centralPressureHpa: 965,
      maxWindKnots: 85,
      maxWindKmph: 157,
      rapidIntensificationRisk: 84, // %
      eyeStatus: 'Distinct Eye Wall Formed',
      currentPos: { lat: 15.4, lng: 85.2 },
      movementSpeedKmph: 18,
      headingDegree: 325, // NW
      lastUpdated: new Date().toISOString(),
      satelliteImagery: {
        insat3d_ir: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
        insat3dr_wv: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
        vis_color: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1200&q=80'
      },
      vitAttentionMap: [
        [0.1, 0.2, 0.4, 0.3, 0.1],
        [0.2, 0.7, 0.9, 0.6, 0.2],
        [0.3, 0.9, 1.0, 0.8, 0.3], // High attention around eye wall
        [0.2, 0.6, 0.8, 0.5, 0.2],
        [0.1, 0.2, 0.3, 0.2, 0.1]
      ],
      physicsMetrics: {
        sst: 30.2, // °C
        verticalWindShear: 8.5, // knots (low shear favours RI)
        oceanHeatContent: 88, // kJ/cm2
        vorticity850: 18.4 // 10^-5 s^-1
      },
      historicalTrack: [
        { lat: 11.2, lng: 89.5, pressure: 1002, wind: 30, timestamp: '2026-09-27T06:00:00Z', grade: 'Depression' },
        { lat: 12.5, lng: 88.1, pressure: 994, wind: 45, timestamp: '2026-09-28T00:00:00Z', grade: 'Deep Depression' },
        { lat: 13.8, lng: 86.8, pressure: 982, wind: 60, timestamp: '2026-09-28T18:00:00Z', grade: 'Cyclonic Storm' },
        { lat: 14.8, lng: 85.9, pressure: 974, wind: 75, timestamp: '2026-09-29T06:00:00Z', grade: 'Severe Cyclonic Storm' },
        { lat: 15.4, lng: 85.2, pressure: 965, wind: 85, timestamp: '2026-09-29T18:00:00Z', grade: 'Very Severe Cyclonic Storm' }
      ],
      predictedTrack24h: [
        { lat: 16.5, lng: 84.4, pressure: 955, wind: 95, timestamp: '2026-09-30T06:00:00Z', coneRadiusKm: 35, grade: 'VSCS' },
        { lat: 17.8, lng: 83.8, pressure: 948, wind: 105, timestamp: '2026-09-30T18:00:00Z', coneRadiusKm: 55, grade: 'Extremely Severe Cyclonic Storm' },
        { lat: 19.1, lng: 84.2, pressure: 952, wind: 95, timestamp: '2026-10-01T06:00:00Z', coneRadiusKm: 85, grade: 'Landfall near Gopalpur / Puri' },
        { lat: 20.3, lng: 84.8, pressure: 978, wind: 65, timestamp: '2026-10-01T18:00:00Z', coneRadiusKm: 120, grade: 'Severe Cyclonic Storm (Inland)' }
      ],
      uncertaintyConePolygon: [
        { lat: 15.4, lng: 85.2 },
        { lat: 16.7, lng: 84.0 },
        { lat: 18.2, lng: 83.1 },
        { lat: 19.6, lng: 83.4 },
        { lat: 20.8, lng: 84.0 },
        { lat: 20.6, lng: 85.6 },
        { lat: 19.4, lng: 85.2 },
        { lat: 17.9, lng: 84.5 },
        { lat: 16.4, lng: 84.9 }
      ],
      estimatedLandfall: {
        location: 'Between Gopalpur and Puri, Odisha Coast',
        etaTime: '2026-10-01T08:30:00Z',
        peakSurgeMeters: 3.8,
        coastalDistrictsAtRisk: ['Ganjam', 'Puri', 'Jajpur', 'Kendrapara', 'Srikakulam']
      }
    },
    {
      id: 'CY-2026-02',
      name: 'ASNA-02',
      basin: 'Arabian Sea',
      imdCategory: 'Severe Cyclonic Storm (SCS)',
      tNumber: 'T3.5',
      centralPressureHpa: 984,
      maxWindKnots: 60,
      maxWindKmph: 110,
      rapidIntensificationRisk: 42,
      eyeStatus: 'Developing Central Dense Overcast (CDO)',
      currentPos: { lat: 21.8, lng: 67.2 },
      movementSpeedKmph: 14,
      headingDegree: 260, // WSW away from Gujarat
      lastUpdated: new Date().toISOString(),
      satelliteImagery: {
        insat3d_ir: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1200&q=80',
        insat3dr_wv: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
        vis_color: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
      },
      vitAttentionMap: [
        [0.1, 0.1, 0.2, 0.2, 0.1],
        [0.1, 0.4, 0.6, 0.4, 0.1],
        [0.2, 0.6, 0.8, 0.6, 0.2],
        [0.1, 0.3, 0.5, 0.3, 0.1],
        [0.1, 0.1, 0.2, 0.1, 0.1]
      ],
      physicsMetrics: {
        sst: 28.5,
        verticalWindShear: 16.2, // High shear inhibits RI
        oceanHeatContent: 62,
        vorticity850: 12.1
      },
      historicalTrack: [
        { lat: 20.1, lng: 69.8, pressure: 1004, wind: 25, timestamp: '2026-09-28T00:00:00Z', grade: 'Depression' },
        { lat: 21.2, lng: 68.5, pressure: 996, wind: 40, timestamp: '2026-09-28T18:00:00Z', grade: 'Deep Depression' },
        { lat: 21.8, lng: 67.2, pressure: 984, wind: 60, timestamp: '2026-09-29T18:00:00Z', grade: 'Severe Cyclonic Storm' }
      ],
      predictedTrack24h: [
        { lat: 22.1, lng: 65.5, pressure: 980, wind: 65, timestamp: '2026-09-30T06:00:00Z', coneRadiusKm: 40, grade: 'SCS' },
        { lat: 22.3, lng: 63.8, pressure: 988, wind: 55, timestamp: '2026-09-30T18:00:00Z', coneRadiusKm: 70, grade: 'Cyclonic Storm' }
      ],
      uncertaintyConePolygon: [
        { lat: 21.8, lng: 67.2 },
        { lat: 22.6, lng: 65.3 },
        { lat: 23.0, lng: 63.5 },
        { lat: 21.6, lng: 63.8 },
        { lat: 21.2, lng: 65.7 }
      ],
      estimatedLandfall: {
        location: 'Recurving into Northern Arabian Sea (Open Waters)',
        etaTime: 'No direct Indian mainland landfall predicted',
        peakSurgeMeters: 1.2,
        coastalDistrictsAtRisk: ['Kutch (High Waves)', 'Dwarka (Fishermen Warning)']
      }
    }
  ],
  shelters: [
    {
      id: 'SH-OD-01',
      name: 'Gopalpur Multi-Purpose Cyclone Shelter',
      district: 'Ganjam',
      state: 'Odisha',
      lat: 19.26,
      lng: 84.90,
      elevationMeters: 14.5,
      capacityPersons: 2500,
      currentOccupancy: 420,
      roadStatus: 'CLEAR (NH-516A Operational)',
      amenities: ['Solar Microgrid', 'Medical Bay', 'Clean Water Plant', 'Satellite Comms'],
      contactPhone: '+91-680-2244101',
      hazardAvoidanceScore: 92 // High safety rating
    },
    {
      id: 'SH-OD-02',
      name: 'Puri Swargadwar Coastal Relief Hub',
      district: 'Puri',
      state: 'Odisha',
      lat: 19.79,
      lng: 85.81,
      elevationMeters: 11.2,
      capacityPersons: 4000,
      currentOccupancy: 1150,
      roadStatus: 'MONITORED (Puri Bypass Clear)',
      amenities: ['Helipad Access', 'Diesel Generators', 'Community Kitchen', 'RDRF Station'],
      contactPhone: '+91-6752-222045',
      hazardAvoidanceScore: 88
    },
    {
      id: 'SH-AP-01',
      name: 'Srikakulam Kalingapatnam Disaster Shelter',
      district: 'Srikakulam',
      state: 'Andhra Pradesh',
      lat: 18.34,
      lng: 84.12,
      elevationMeters: 18.0,
      capacityPersons: 1800,
      currentOccupancy: 310,
      roadStatus: 'CLEAR (State Highway 84)',
      amenities: ['Emergency First Aid', 'Purified Water Tank', 'Ham Radio Station'],
      contactPhone: '+91-8942-240100',
      hazardAvoidanceScore: 95
    },
    {
      id: 'SH-WB-01',
      name: 'Digha Sea Front Relief Complex',
      district: 'Purba Medinipur',
      state: 'West Bengal',
      lat: 21.62,
      lng: 87.51,
      elevationMeters: 9.8,
      capacityPersons: 3200,
      currentOccupancy: 950,
      roadStatus: 'RESTRICTED (Heavy Vehicles Blocked)',
      amenities: ['NDRF Base', 'High Capacity Pumps', 'Maternity Unit'],
      contactPhone: '+91-3220-266222',
      hazardAvoidanceScore: 81
    }
  ],
  alerts: [
    {
      id: 'ALT-1092',
      cycloneId: 'CY-2026-01',
      cycloneName: 'CORIOLIS-01',
      stage: 'RED ALERT (EVACUATION ORDER)',
      severity: 'CRITICAL',
      status: 'VERIFIED_BY_FORECASTER',
      forecasterApprovedBy: 'Dr. S. K. Mahapatra (Senior IMD Duty Officer)',
      forecasterNotes: 'ViT and ConvLSTM consensus predicts landfall between Gopalpur and Puri on Oct 01 AM with 3.8m storm surge. Red alert approved for Ganjam and Puri districts.',
      dispatchTimestamp: new Date().toISOString(),
      channels: ['FCM Push', 'Emergency SMS Broadcast', 'Coastal Siren Relay'],
      translations: {
        en: 'RED ALERT: Very Severe Cyclonic Storm CORIOLIS-01 approaching Odisha coast. Evacuate low-lying areas in Ganjam and Puri immediately to designated shelters.',
        hi: 'रेड अलर्ट: अति गंभीर चक्रवातीय तूफान CORIOLIS-01 ओडिशा तट के करीब। गंजम और पूरी के निचले क्षेत्रों से तुरंत नामित आश्रयों में स्थानांतरित हों।',
        or: 'ରେଡ୍ ଆଲର୍ଟ: ଅତି ଭୟଙ୍କର ବାତ୍ୟା CORIOLIS-01 ଓଡ଼ିଶା ଉପକୂଳ ମୁହାଁ। ଗଞ୍ଜାମ ଓ ପୁରୀର ତଳିଆ ଅଞ୍ଚଳବାସୀ ତୁରନ୍ତ ଆଶ୍ରୟସ୍ଥଳୀକୁ ଯାଆନ୍ତୁ।',
        bn: 'রেড অ্যালার্ট: অতি ভয়াবহ ঘূর্ণিঝড় CORIOLIS-01 ওড়িশা উপকূলের দিকে অগ্রসর হচ্ছে। নিম্নভূমির অধিবাসীদের অবিলম্বে সাইক্লোন শেল্টারে যাওয়ার নির্দেশ।',
        te: 'రెడ్ అలర్ట్: అత్యంత తీవ్రమైన తుఫాను CORIOLIS-01 ఒడిశా తీరం వైపు పయనిస్తోంది. లోతట్టు ప్రాంత ప్రజలు వెంటనే సురక్షిత ప్రాంతాలకు వెళ్లండి.'
      }
    }
  ],
  auditLogs: [
    {
      timestamp: new Date().toISOString(),
      action: 'SYSTEM_BOOT',
      user: 'SYSTEM',
      details: 'CORIOLIS AI Cyclone Identification & Risk Infrastructure Online'
    }
  ]
};

class LocalDB {
  constructor() {
    this.data = initialData;
    this.init();
  }

  init() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(fileContent);
        console.log('[DB] Loaded existing JSON database successfully.');
      } else {
        this.save();
        console.log('[DB] Initialized fresh JSON database file.');
      }
    } catch (err) {
      console.error('[DB] Failed to load DB file, using in-memory fallbacks:', err.message);
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('[DB] Failed to persist database:', err.message);
    }
  }

  // Helper Methods
  getCyclones() {
    return this.data.cyclones;
  }

  getCycloneById(id) {
    return this.data.cyclones.find(c => c.id === id);
  }

  updateCyclone(id, patch) {
    const idx = this.data.cyclones.findIndex(c => c.id === id);
    if (idx !== -1) {
      this.data.cyclones[idx] = { ...this.data.cyclones[idx], ...patch, lastUpdated: new Date().toISOString() };
      this.save();
      return this.data.cyclones[idx];
    }
    return null;
  }

  getShelters() {
    return this.data.shelters;
  }

  getAlerts() {
    return this.data.alerts;
  }

  addAlert(alert) {
    this.data.alerts.unshift(alert);
    this.addAuditLog('ALERT_CREATED', 'FORECASTER', `Created new alert ${alert.id} for ${alert.cycloneName}`);
    this.save();
    return alert;
  }

  approveAlert(alertId, officerName, notes) {
    const alert = this.data.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.status = 'VERIFIED_BY_FORECASTER';
      alert.forecasterApprovedBy = officerName || 'Duty Senior Meteorologist';
      alert.forecasterNotes = notes || 'Verified with multi-source radar and satellite consensus.';
      alert.approvedTimestamp = new Date().toISOString();
      this.addAuditLog('ALERT_APPROVED', officerName, `Approved alert ${alertId}`);
      this.save();
      return alert;
    }
    return null;
  }

  getSettings() {
    return this.data.systemSettings;
  }

  updateSettings(patch) {
    this.data.systemSettings = { ...this.data.systemSettings, ...patch };
    this.save();
    return this.data.systemSettings;
  }

  getAuditLogs() {
    return this.data.auditLogs;
  }

  addAuditLog(action, user, details) {
    this.data.auditLogs.unshift({
      timestamp: new Date().toISOString(),
      action,
      user,
      details
    });
    // Keep max 100 log entries
    if (this.data.auditLogs.length > 100) {
      this.data.auditLogs = this.data.auditLogs.slice(0, 100);
    }
    this.save();
  }
}

export const db = new LocalDB();
