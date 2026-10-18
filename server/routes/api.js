import express from 'express';
import { db } from '../db.js';
import { processSatelliteImage, calculateHyperlocalRisk } from '../aiEngine.js';
import { generateCycloneBulletin } from '../geminiService.js';

const router = express.Router();

// System Health & DB Connection
router.get('/health', (req, res) => {
  const settings = db.getSettings();
  res.json({
    status: 'OK',
    systemName: 'CORIOLIS AI Cyclone Identification & Risk Prediction API',
    database: 'CONNECTED (SQLite/JSON Persistence)',
    timestamp: new Date().toISOString(),
    geminiKeyConfigured: Boolean(settings.geminiApiKey || process.env.GEMINI_API_KEY),
    integrations: {
      mosdac: settings.mosdacApiStatus,
      imd: settings.imdApiStatus,
      era5: settings.era5ApiStatus,
      aiEngine: settings.aiEngineVersion
    }
  });
});

// Cyclones REST Endpoints
router.get('/cyclones', (req, res) => {
  const cyclones = db.getCyclones();
  res.json({ count: cyclones.length, cyclones });
});

router.get('/cyclones/:id', (req, res) => {
  const cyclone = db.getCycloneById(req.params.id);
  if (!cyclone) {
    return res.status(404).json({ error: 'Cyclone not found' });
  }
  res.json(cyclone);
});

// AI Satellite Image Processing & Grad-CAM Analysis
router.post('/analyze-satellite', (req, res) => {
  const { imageUrl, filename } = req.body || {};
  const analysis = processSatelliteImage({ imageUrl, filename });
  db.addAuditLog('SATELLITE_IMAGE_ANALYZED', 'AI_ENGINE', `Analyzed satellite frame: ${filename || 'INSAT-3D_IR_band.png'}`);
  res.json(analysis);
});

// Evacuation Shelters & Routing
router.get('/shelters', (req, res) => {
  const shelters = db.getShelters();
  res.json({ count: shelters.length, shelters });
});

router.post('/risk-score', (req, res) => {
  const { lat, lng, elevationMeters, windSpeedKmph, surgeMeters, populationDensity } = req.body || {};
  if (lat === undefined || lng === undefined) {
    return res.status(400).json({ error: 'Latitude (lat) and Longitude (lng) are required' });
  }
  const result = calculateHyperlocalRisk({
    lat: Number(lat),
    lng: Number(lng),
    elevationMeters: Number(elevationMeters || 10),
    windSpeedKmph: Number(windSpeedKmph || 150),
    surgeMeters: Number(surgeMeters || 3.5),
    populationDensity: Number(populationDensity || 800)
  });
  res.json(result);
});

// Alerts Management & Forecaster Verification
router.get('/alerts', (req, res) => {
  const alerts = db.getAlerts();
  res.json({ count: alerts.length, alerts });
});

router.post('/alerts', (req, res) => {
  const { cycloneId, stage, severity, translations } = req.body;
  const cyclone = db.getCycloneById(cycloneId);
  const newAlert = {
    id: `ALT-${Math.floor(1000 + Math.random() * 9000)}`,
    cycloneId,
    cycloneName: cyclone ? cyclone.name : 'CORIOLIS-SYSTEM',
    stage: stage || 'ORANGE WARNING',
    severity: severity || 'HIGH',
    status: 'PENDING_FORECASTER_APPROVAL',
    forecasterApprovedBy: null,
    forecasterNotes: null,
    dispatchTimestamp: new Date().toISOString(),
    channels: ['FCM Push', 'SMS Broadcast'],
    translations: translations || {
      en: 'Warning: Cyclone approaching coastal areas. Stay tuned for official advisories.',
      hi: 'चेतावनी: चक्रवात तटीय क्षेत्रों की ओर बढ़ रहा है। आधिकारिक सलाह का पालन करें।'
    }
  };
  db.addAlert(newAlert);
  res.status(201).json(newAlert);
});

router.post('/alerts/:id/approve', (req, res) => {
  const { officerName, forecasterNotes } = req.body || {};
  const updatedAlert = db.approveAlert(req.params.id, officerName, forecasterNotes);
  if (!updatedAlert) {
    return res.status(404).json({ error: 'Alert not found' });
  }
  res.json({ success: true, alert: updatedAlert });
});

router.post('/alerts/dispatch', (req, res) => {
  const { alertId, channels } = req.body;
  db.addAuditLog('ALERT_DISPATCHED', 'DISASTER_OPS', `Dispatched alert ${alertId} across channels: ${(channels || []).join(', ')}`);
  res.json({
    success: true,
    dispatchId: `DISP-${Date.now()}`,
    deliveredChannels: channels || ['FCM Push', 'Emergency SMS Broadcast', 'Coastal Siren Relay'],
    dispatchedCount: 142500, // Simulated subscribers reached
    timestamp: new Date().toISOString()
  });
});

// Gemini AI Bulletin Generation
router.post('/gemini/generate-bulletin', async (req, res) => {
  const { cycloneId, language, userApiKey } = req.body || {};
  const cyclone = db.getCycloneById(cycloneId || 'CY-2026-01');
  if (!cyclone) {
    return res.status(404).json({ error: 'Cyclone not found' });
  }

  const result = await generateCycloneBulletin(userApiKey, cyclone, language || 'en');
  res.json(result);
});

// System Settings & API Keys Vault
router.get('/settings', (req, res) => {
  const settings = db.getSettings();
  res.json(settings);
});

router.post('/settings', (req, res) => {
  const updated = db.updateSettings(req.body);
  db.addAuditLog('SETTINGS_UPDATED', 'ADMIN', 'Updated API configuration keys & settings');
  res.json({ success: true, settings: updated });
});

// Audit Logs
router.get('/audit-logs', (req, res) => {
  res.json({ logs: db.getAuditLogs() });
});

export default router;
