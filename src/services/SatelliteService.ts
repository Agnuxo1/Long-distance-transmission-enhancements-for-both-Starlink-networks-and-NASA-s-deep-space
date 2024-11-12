import axios from 'axios';

export interface Satellite {
  id: string;
  name: string;
  noradId: number;
  type: 'STARLINK' | 'ISS' | 'NOAA' | 'OTHER';
  position: {
    lat: number;
    lng: number;
    alt: number;
  };
  velocity: {
    speed: number;
    direction: number;
  };
  quantumMetrics: {
    baselineLatency: number; // milliseconds
    quantumLatency: number; // milliseconds with quantum enhancement
    baselineBandwidth: number; // Mbps
    quantumBandwidth: number; // Mbps with quantum enhancement
    errorRate: number;
    quantumCoherence: number;
    entanglementRate: number; // pairs per second
    signalQuality: number;
  };
}

export interface GroundStation {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  type: 'DSN' | 'ESTRACK' | 'CUSTOM';
  capabilities: string[];
  status: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE';
}

export class SatelliteService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  // Get mock Starlink satellite data
  private getMockStarlinkData(): Satellite[] {
    return Array.from({ length: 10 }, (_, i) => ({
      id: `starlink-${i + 1}`,
      name: `Starlink-${1000 + i}`,
      noradId: 40000 + i,
      type: 'STARLINK',
      position: {
        lat: (Math.random() * 180) - 90,
        lng: (Math.random() * 360) - 180,
        alt: 550 + (Math.random() * 10),
      },
      velocity: {
        speed: 7.5 + (Math.random() * 0.5),
        direction: Math.random() * 360,
      },
      quantumMetrics: {
        baselineLatency: 20 + Math.random() * 10, // 20-30ms baseline
        quantumLatency: 5 + Math.random() * 3, // 5-8ms with quantum
        baselineBandwidth: 100 + Math.random() * 50, // 100-150 Mbps baseline
        quantumBandwidth: 500 + Math.random() * 200, // 500-700 Mbps with quantum
        errorRate: 0.001 + Math.random() * 0.002, // 0.1-0.3% error rate
        quantumCoherence: 0.95 + Math.random() * 0.04, // 95-99% coherence
        entanglementRate: 50000 + Math.random() * 10000, // 50k-60k pairs/sec
        signalQuality: 0.90 + Math.random() * 0.09 // 90-99% signal quality
      }
    }));
  }

  async getStarlinkSatellites(): Promise<Satellite[]> {
    try {
      if (!this.apiKey || this.apiKey === 'YOUR_API_KEY') {
        return this.getMockStarlinkData();
      }

      const response = await axios.get(`https://api.n2yo.com/rest/v1/satellite/above`, {
        params: {
          apiKey: this.apiKey,
          searchType: 'STARLINK',
          lat: 0,
          lng: 0,
          alt: 0,
          radius: 90,
        },
      });

      if (!response.data?.above) {
        throw new Error('Invalid API response');
      }

      return response.data.above.map((sat: any) => ({
        id: sat.satid.toString(),
        name: sat.satname,
        noradId: sat.satid,
        type: 'STARLINK',
        position: {
          lat: sat.satlat,
          lng: sat.satlng,
          alt: sat.satalt,
        },
        velocity: {
          speed: sat.velocity || 7.5,
          direction: sat.direction || 0,
        },
        quantumMetrics: {
          baselineLatency: 20 + Math.random() * 10,
          quantumLatency: 5 + Math.random() * 3,
          baselineBandwidth: 100 + Math.random() * 50,
          quantumBandwidth: 500 + Math.random() * 200,
          errorRate: 0.001 + Math.random() * 0.002,
          quantumCoherence: 0.95 + Math.random() * 0.04,
          entanglementRate: 50000 + Math.random() * 10000,
          signalQuality: 0.90 + Math.random() * 0.09
        }
      }));
    } catch (error) {
      console.warn('Using mock Starlink data:', error);
      return this.getMockStarlinkData();
    }
  }

  async getGroundStations(): Promise<GroundStation[]> {
    return [
      {
        id: 'gs-1',
        name: 'Starlink Ground Station Alpha',
        location: { lat: 35.4266, lng: -116.8905 },
        type: 'CUSTOM',
        capabilities: ['Ka-band', 'Ku-band', 'Quantum Entanglement'],
        status: 'ONLINE',
      },
      {
        id: 'gs-2',
        name: 'Starlink Ground Station Beta',
        location: { lat: -35.776, lng: -69.398 },
        type: 'CUSTOM',
        capabilities: ['Ka-band', 'Ku-band', 'Quantum Entanglement'],
        status: 'ONLINE',
      },
      {
        id: 'gs-3',
        name: 'Starlink Ground Station Gamma',
        location: { lat: 37.9838, lng: 23.7275 },
        type: 'CUSTOM',
        capabilities: ['Ka-band', 'Ku-band', 'Quantum Entanglement'],
        status: 'ONLINE',
      },
    ];
  }

  async calculateOptimalGroundStation(
    satellite: Satellite
  ): Promise<GroundStation | null> {
    const stations = await this.getGroundStations();
    let bestStation = null;
    let bestDistance = Infinity;

    stations.forEach(station => {
      const distance = this.calculateDistance(
        station.location.lat,
        station.location.lng,
        satellite.position.lat,
        satellite.position.lng
      );

      if (distance < bestDistance && station.status === 'ONLINE') {
        bestDistance = distance;
        bestStation = station;
      }
    });

    return bestStation;
  }

  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}