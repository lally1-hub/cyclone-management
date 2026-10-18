import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Polygon, Circle, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { Cyclone, Shelter } from '../types';
import { Layers, Shield, Wind, Eye, Navigation } from 'lucide-react';

const cycloneIcon = L.divIcon({
  className: 'custom-cyclone-marker',
  html: `<div style="background: rgba(225, 29, 72, 0.95); border: 2px solid white; box-shadow: 0 0 12px rgba(225, 29, 72, 0.5); width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
          <svg style="width: 18px; height: 18px; color: white; animation: spin 4s linear infinite;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
            <path d="M12 3a9 9 0 0 1 9 9"></path>
            <path d="M12 21a9 9 0 0 1-9-9"></path>
          </svg>
         </div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14]
});

const shelterIcon = L.divIcon({
  className: 'custom-shelter-marker',
  html: `<div style="background: #0284c7; border: 2px solid white; box-shadow: 0 0 8px rgba(2, 132, 199, 0.5); width: 24px; height: 24px; border-radius: 6px; display: flex; align-items: center; justify-content: center;">
          <svg style="width: 14px; height: 14px; color: white;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
         </div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

const landfallIcon = L.divIcon({
  className: 'custom-landfall-marker',
  html: `<div style="background: #d97706; border: 2px solid white; box-shadow: 0 0 10px rgba(217, 119, 6, 0.5); width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
          <span style="color: white; font-weight: 800; font-size: 11px;">LF</span>
         </div>`,
  iconSize: [26, 26],
  iconAnchor: [13, 13]
});

interface MapViewProps {
  cyclone: Cyclone;
  shelters: Shelter[];
  onSelectShelter?: (shelter: Shelter) => void;
}

export const MapView: React.FC<MapViewProps> = ({ cyclone, shelters, onSelectShelter }) => {
  const [mapTile, setMapTile] = useState<'osm' | 'satellite'>('osm');
  const [showCone, setShowCone] = useState(true);
  const [showShelters, setShowShelters] = useState(true);
  const [showSurgeZone, setShowSurgeZone] = useState(true);

  const historicalCoords = cyclone.historicalTrack.map(p => [p.lat, p.lng] as [number, number]);
  const predictedCoords = [
    [cyclone.currentPos.lat, cyclone.currentPos.lng] as [number, number],
    ...cyclone.predictedTrack24h.map(p => [p.lat, p.lng] as [number, number])
  ];
  const polygonCoords = cyclone.uncertaintyConePolygon.map(p => [p.lat, p.lng] as [number, number]);

  return (
    <div className="relative w-full h-[620px] rounded-xl overflow-hidden border border-slate-200 shadow-md bg-white">
      {/* Light Control Bar Overlay */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-wrap items-center gap-2 bg-white/95 p-2 rounded-xl border border-slate-200 backdrop-blur-md text-xs shadow-md">
        <div className="flex items-center gap-1 border-r border-slate-200 pr-2">
          <Layers className="w-3.5 h-3.5 text-sky-600" />
          <button
            onClick={() => setMapTile(mapTile === 'osm' ? 'satellite' : 'osm')}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold"
          >
            {mapTile === 'osm' ? 'Map: OpenStreetMap' : 'Map: Satellite Imagery'}
          </button>
        </div>

        <button
          onClick={() => setShowCone(!showCone)}
          className={`px-2.5 py-1 rounded-lg flex items-center gap-1 font-semibold transition-colors ${
            showCone ? 'bg-sky-100 text-sky-800 border border-sky-300' : 'bg-slate-100 text-slate-500'
          }`}
        >
          <Navigation className="w-3 h-3" />
          Uncertainty Cone
        </button>

        <button
          onClick={() => setShowShelters(!showShelters)}
          className={`px-2.5 py-1 rounded-lg flex items-center gap-1 font-semibold transition-colors ${
            showShelters ? 'bg-blue-100 text-blue-800 border border-blue-300' : 'bg-slate-100 text-slate-500'
          }`}
        >
          <Shield className="w-3 h-3" />
          Shelters ({shelters.length})
        </button>

        <button
          onClick={() => setShowSurgeZone(!showSurgeZone)}
          className={`px-2.5 py-1 rounded-lg flex items-center gap-1 font-semibold transition-colors ${
            showSurgeZone ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-slate-100 text-slate-500'
          }`}
        >
          <Wind className="w-3 h-3" />
          Surge Zone ({cyclone.estimatedLandfall.peakSurgeMeters}m)
        </button>
      </div>

      {/* Leaflet Map Container */}
      <MapContainer
        center={[cyclone.currentPos.lat, cyclone.currentPos.lng]}
        zoom={6}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        {mapTile === 'osm' ? (
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        ) : (
          <TileLayer
            attribution='&copy; Esri World Imagery'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        )}

        {/* 68% Uncertainty Cone */}
        {showCone && polygonCoords.length > 0 && (
          <Polygon
            positions={polygonCoords}
            pathOptions={{
              color: '#0284c7',
              fillColor: '#38bdf8',
              fillOpacity: 0.25,
              weight: 2,
              dashArray: '5, 5'
            }}
          >
            <Tooltip permanent={false}>ConvLSTM 24-48h Track Uncertainty Cone (68% Band)</Tooltip>
          </Polygon>
        )}

        {/* Historical Track */}
        <Polyline
          positions={historicalCoords}
          pathOptions={{ color: '#e11d48', weight: 4 }}
        />

        {/* Forecast Track */}
        <Polyline
          positions={predictedCoords}
          pathOptions={{ color: '#d97706', weight: 3.5, dashArray: '6, 6' }}
        />

        {/* Eye Center Marker */}
        <Marker position={[cyclone.currentPos.lat, cyclone.currentPos.lng]} icon={cycloneIcon}>
          <Popup>
            <div className="p-1 space-y-1 text-slate-800">
              <div className="flex items-center justify-between border-b border-slate-200 pb-1">
                <span className="font-bold text-rose-700 font-sans text-sm">{cyclone.name}</span>
                <span className="px-1.5 py-0.5 bg-rose-100 text-rose-800 rounded text-[10px] font-bold">{cyclone.tNumber}</span>
              </div>
              <p className="text-xs text-slate-600 font-semibold">{cyclone.imdCategory}</p>
              <div className="text-[11px] grid grid-cols-2 gap-1 text-slate-600 pt-1">
                <div>Wind: <strong>{cyclone.maxWindKmph} km/h</strong></div>
                <div>Pressure: <strong>{cyclone.centralPressureHpa} hPa</strong></div>
                <div>RI Score: <strong className="text-amber-700">{cyclone.rapidIntensificationRisk}%</strong></div>
                <div>Heading: <strong className="text-sky-700">{cyclone.headingDegree}° NW</strong></div>
              </div>
            </div>
          </Popup>
        </Marker>

        {/* Landfall Prediction Points */}
        {cyclone.predictedTrack24h.map((pt, idx) => (
          <React.Fragment key={`pred-${idx}`}>
            <Marker position={[pt.lat, pt.lng]} icon={landfallIcon}>
              <Popup>
                <div className="text-xs space-y-1">
                  <strong className="text-amber-800 block">FORECAST +{(idx + 1) * 12}H</strong>
                  <p className="text-slate-700">{pt.grade}</p>
                  <div>Winds: {pt.wind} kts | Pressure: {pt.pressure} hPa</div>
                </div>
              </Popup>
            </Marker>
          </React.Fragment>
        ))}

        {/* Surge Zone */}
        {showSurgeZone && (
          <Circle
            center={[19.6, 84.8]}
            radius={45000}
            pathOptions={{ color: '#e11d48', fillColor: '#e11d48', fillOpacity: 0.12, weight: 2 }}
          >
            <Tooltip permanent={true} direction="top">
              ⚠️ Inundation Zone ({cyclone.estimatedLandfall.peakSurgeMeters}m Surge)
            </Tooltip>
          </Circle>
        )}

        {/* Shelters */}
        {showShelters && shelters.map(s => (
          <Marker key={s.id} position={[s.lat, s.lng]} icon={shelterIcon}>
            <Popup>
              <div className="text-xs space-y-1">
                <div className="font-bold text-sky-800 border-b border-slate-200 pb-1">{s.name}</div>
                <div>{s.district}, {s.state} (Elev: {s.elevationMeters}m)</div>
                <div>Capacity: <strong>{s.currentOccupancy}/{s.capacityPersons}</strong></div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Clean Telemetry Legend Box */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 p-3 rounded-xl border border-slate-200 text-xs shadow-md max-w-sm space-y-1.5 text-slate-800">
        <div className="font-bold text-sky-900 border-b border-slate-200 pb-1 flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-sky-600" />
          TARGET: {cyclone.estimatedLandfall.location}
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
          <div>ETA: <span className="text-amber-800 font-semibold">{new Date(cyclone.estimatedLandfall.etaTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} UTC</span></div>
          <div>Peak Surge: <span className="text-rose-700 font-bold">{cyclone.estimatedLandfall.peakSurgeMeters}m</span></div>
        </div>
      </div>
    </div>
  );
};
