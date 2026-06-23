"use client";

import { useState, useEffect, useRef, useMemo } from 'react';
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  InfoWindow,
  useMap,
  MapCameraChangedEvent
} from '@vis.gl/react-google-maps';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { Issue } from '@/app/hooks/useIssues';
import { 
  AlertTriangle, 
  ShieldCheck, 
  Trash2, 
  Droplets, 
  LightbulbOff, 
  MapPin,
  Filter
} from 'lucide-react';
import Link from 'next/link';

// Helper component for clustering
const ClusteringMarkers = ({ issues, onMarkerClick }: { issues: Issue[], onMarkerClick: (i: Issue) => void }) => {
  const map = useMap();
  const [markers, setMarkers] = useState<{[key: string]: google.maps.marker.AdvancedMarkerElement}>({});
  const clusterer = useRef<MarkerClusterer | null>(null);

  // Initialize MarkerClusterer
  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({ map });
    }
  }, [map]);

  // Update clusters when markers change
  useEffect(() => {
    clusterer.current?.clearMarkers();
    clusterer.current?.addMarkers(Object.values(markers));
  }, [markers]);

  const setMarkerRef = (marker: google.maps.marker.AdvancedMarkerElement | null, key: string) => {
    if (marker && markers[key]) return;
    if (!marker && !markers[key]) return;
    
    setMarkers(prev => {
      if (marker) {
        return {...prev, [key]: marker};
      } else {
        const newMarkers = {...prev};
        delete newMarkers[key];
        return newMarkers;
      }
    });
  };

  const getMarkerColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return '#ef4444'; // red-500
      case 'High': return '#f97316'; // orange-500
      case 'Medium': return '#f59e0b'; // amber-500
      case 'Low': return '#3b82f6'; // blue-500
      default: return '#737373'; // neutral-500
    }
  };

  return (
    <>
      {issues.map(issue => {
        if (!issue.gpsCoordinates) return null;
        return (
          <AdvancedMarker
            key={issue.id}
            position={{ lat: issue.gpsCoordinates.lat, lng: issue.gpsCoordinates.lng }}
            ref={marker => setMarkerRef(marker, issue.id)}
            onClick={() => onMarkerClick(issue)}
          >
            <div 
              className="w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center transition-transform hover:scale-110"
              style={{ backgroundColor: getMarkerColor(issue.severity || 'Low') }}
            >
              {issue.category.toLowerCase().includes('garbage') && <Trash2 className="w-4 h-4 text-white" />}
              {issue.category.toLowerCase().includes('water') && <Droplets className="w-4 h-4 text-white" />}
              {issue.category.toLowerCase().includes('light') && <LightbulbOff className="w-4 h-4 text-white" />}
              {issue.category.toLowerCase().includes('pothole') && <MapPin className="w-4 h-4 text-white" />}
              {!issue.category.toLowerCase().match(/garbage|water|light|pothole/) && <AlertTriangle className="w-4 h-4 text-white" />}
            </div>
          </AdvancedMarker>
        );
      })}
    </>
  );
};

export default function GeoIntelligenceMap({ issues }: { issues: Issue[] }) {
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [filterSeverity, setFilterSeverity] = useState<string>("All");

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  const filteredIssues = useMemo(() => {
    return issues.filter(i => {
      if (!i.gpsCoordinates) return false;
      const matchCat = filterCategory === "All" || i.category.includes(filterCategory);
      const matchSev = filterSeverity === "All" || i.severity === filterSeverity;
      return matchCat && matchSev;
    });
  }, [issues, filterCategory, filterSeverity]);

  if (!apiKey) {
    return (
      <div className="w-full h-full min-h-[500px] flex flex-col items-center justify-center bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center">
        <AlertTriangle className="w-12 h-12 text-amber-500 mb-4 opacity-50" />
        <h3 className="text-xl font-bold text-white mb-2">Google Maps Integration Requires API Key</h3>
        <p className="text-neutral-400 max-w-md">
          Please add <code className="bg-black px-2 py-1 rounded text-red-400">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to your <code className="bg-black px-2 py-1 rounded text-neutral-300">.env.local</code> file to enable the Geo Intelligence Map.
        </p>
      </div>
    );
  }

  // Default to center of a typical city (e.g. New York) if no issues, or average of issues
  const defaultCenter = useMemo(() => {
    if (filteredIssues.length === 0) return { lat: 40.7128, lng: -74.0060 };
    const valid = filteredIssues.filter(i => i.gpsCoordinates);
    if (valid.length === 0) return { lat: 40.7128, lng: -74.0060 };
    
    const sumLat = valid.reduce((acc, i) => acc + i.gpsCoordinates!.lat, 0);
    const sumLng = valid.reduce((acc, i) => acc + i.gpsCoordinates!.lng, 0);
    return { lat: sumLat / valid.length, lng: sumLng / valid.length };
  }, [filteredIssues]);

  return (
    <div className="w-full h-[700px] relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
      {/* Floating Filters Panel */}
      <div className="absolute top-4 left-4 z-10 bg-neutral-950/80 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-2xl flex flex-col gap-3 min-w-[250px]">
        <div className="flex items-center gap-2 text-white font-medium mb-1">
          <Filter className="w-4 h-4 text-blue-400" /> Map Filters
        </div>
        
        <div>
          <label className="text-xs text-neutral-400 uppercase tracking-wider mb-1 block">Category</label>
          <select 
            className="w-full bg-black border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Infrastructure">Infrastructure (Potholes)</option>
            <option value="Sanitation">Sanitation (Garbage)</option>
            <option value="Traffic">Traffic (Streetlights)</option>
            <option value="Water">Water (Leakages)</option>
          </select>
        </div>

        <div>
          <label className="text-xs text-neutral-400 uppercase tracking-wider mb-1 block">Severity</label>
          <select 
            className="w-full bg-black border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
          >
            <option value="All">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
        
        <div className="mt-2 pt-2 border-t border-white/10 text-xs text-neutral-500 flex justify-between">
          <span>{filteredIssues.length} issues visible</span>
        </div>
      </div>

      <APIProvider apiKey={apiKey}>
        <Map
          defaultZoom={12}
          defaultCenter={defaultCenter}
          mapId="civentra-dark-map" // Optional: Requires Map ID from Google Cloud Console for custom styling
          disableDefaultUI={true}
          zoomControl={true}
          gestureHandling={'greedy'}
        >
          <ClusteringMarkers 
            issues={filteredIssues} 
            onMarkerClick={(issue) => setSelectedIssue(issue)} 
          />

          {selectedIssue && selectedIssue.gpsCoordinates && (
            <InfoWindow
              position={{ lat: selectedIssue.gpsCoordinates.lat, lng: selectedIssue.gpsCoordinates.lng }}
              onCloseClick={() => setSelectedIssue(null)}
              headerContent={
                <div className="font-bold text-gray-900 px-1">{selectedIssue.complaintId}</div>
              }
            >
              <div className="p-1 min-w-[200px]">
                {selectedIssue.media?.images?.[0] && (
                  <img src={selectedIssue.media.images[0]} alt="Issue" className="w-full h-32 object-cover rounded-lg mb-3" />
                )}
                <h4 className="font-bold text-gray-900 text-base mb-1">{selectedIssue.title}</h4>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-medium border border-red-200">
                    {selectedIssue.severity || 'Unrated'}
                  </span>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium border border-blue-200">
                    {selectedIssue.status}
                  </span>
                </div>
                <Link 
                  href={`/dashboard/issues/${selectedIssue.id}`}
                  className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg transition-colors"
                >
                  Inspect Issue
                </Link>
              </div>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>
    </div>
  );
}
