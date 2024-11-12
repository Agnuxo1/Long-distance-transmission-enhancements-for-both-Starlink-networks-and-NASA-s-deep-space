import { Signal } from 'lucide-react';

export interface SpaceObject {
  id: string;
  name: string;
  type: 'satellite' | 'probe' | 'station' | 'rover';
  distance: string;
  location: string;
  signalStrength: number;
  quantumState: number;
  lastUpdate?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

// NASA Open APIs endpoints
const NASA_API = 'https://api.nasa.gov/DONKI';
const N2YO_API = 'https://api.n2yo.com/rest/v1/satellite';

// Use public APIs to fetch real space object data
export async function fetchSpaceObjectData(apiKey: string): Promise<SpaceObject[]> {
  try {
    // Simulate API call since we don't have real API keys
    return [
      {
        id: 'iss',
        name: 'ISS',
        type: 'station',
        distance: '408 km',
        location: 'Low Earth Orbit',
        signalStrength: 0.98,
        quantumState: 0.99,
        lastUpdate: new Date().toISOString(),
        coordinates: {
          lat: 51.5074,
          lng: -0.1278
        }
      },
      {
        id: 'starlink-2345',
        name: 'Starlink-2345',
        type: 'satellite',
        distance: '550 km',
        location: 'Low Earth Orbit',
        signalStrength: 0.95,
        quantumState: 0.97,
        lastUpdate: new Date().toISOString()
      },
      {
        id: 'perseverance',
        name: 'Perseverance',
        type: 'rover',
        distance: '225 million km',
        location: 'Mars Surface',
        signalStrength: 0.82,
        quantumState: 0.85,
        lastUpdate: new Date().toISOString()
      },
      {
        id: 'voyager1',
        name: 'Voyager 1',
        type: 'probe',
        distance: '23.3 billion km',
        location: 'Interstellar Space',
        signalStrength: 0.85,
        quantumState: 0.92,
        lastUpdate: new Date().toISOString()
      }
    ];
  } catch (error) {
    console.error('Error fetching space object data:', error);
    return [];
  }
}

export function calculateLatency(distance: string): number {
  const [value, unit] = distance.split(' ');
  const numValue = parseFloat(value);
  
  switch (unit) {
    case 'km':
      return numValue * 0.00333; // ~3.33ms per 1000km
    case 'million':
      return numValue * 3.33; // seconds for million km
    case 'billion':
      return numValue * 3330; // seconds for billion km
    default:
      return 0;
  }
}

export function formatLatency(seconds: number): string {
  if (seconds < 1) {
    return `${(seconds * 1000).toFixed(2)}ms`;
  } else if (seconds < 60) {
    return `${seconds.toFixed(2)}s`;
  } else if (seconds < 3600) {
    return `${(seconds / 60).toFixed(2)}min`;
  } else {
    return `${(seconds / 3600).toFixed(2)}h`;
  }
}