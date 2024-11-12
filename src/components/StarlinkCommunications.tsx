import React, { useState, useEffect } from 'react';
import { Satellite, Radio, Zap, Signal, Wifi, Gauge } from 'lucide-react';
import { StarlinkGlobe } from './StarlinkGlobe';
import { SatelliteService, type Satellite as SatelliteType } from '../services/SatelliteService';

export function StarlinkCommunications() {
  const [selectedSatellite, setSelectedSatellite] = useState<SatelliteType | null>(null);
  const [satellites, setSatellites] = useState<SatelliteType[]>([]);
  const [realTimeMetrics, setRealTimeMetrics] = useState({
    quantumGain: 0,
    signalImprovement: 0,
    dataRate: 0,
    coherenceLevel: 0
  });
  const satelliteService = new SatelliteService('YOUR_API_KEY');

  useEffect(() => {
    const fetchSatellites = async () => {
      const data = await satelliteService.getStarlinkSatellites();
      setSatellites(data);
    };

    fetchSatellites();
    const interval = setInterval(fetchSatellites, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!selectedSatellite) return;

    // Simulate real-time metric updates
    const interval = setInterval(() => {
      const metrics = selectedSatellite.quantumMetrics;
      
      // Calculate real-time improvements with small variations
      setRealTimeMetrics({
        quantumGain: (metrics.quantumCoherence * 100) * (1 + Math.random() * 0.1),
        signalImprovement: ((metrics.signalQuality / 0.9) * 100) * (1 + Math.random() * 0.05),
        dataRate: (metrics.quantumBandwidth / metrics.baselineBandwidth * 100) * (1 + Math.random() * 0.08),
        coherenceLevel: metrics.quantumCoherence * 100 * (1 + Math.random() * 0.03)
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedSatellite]);

  const calculateLatencyImprovement = (satellite: SatelliteType) => {
    return ((satellite.quantumMetrics.baselineLatency - satellite.quantumMetrics.quantumLatency) / 
            satellite.quantumMetrics.baselineLatency * 100).toFixed(1);
  };

  return (
    <div className="grid grid-cols-3 gap-4 h-full p-4">
      {/* Satellite list section */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Starlink Satellites</h2>
        <div className="space-y-4">
          {satellites.map(satellite => (
            <button
              key={satellite.id}
              onClick={() => setSelectedSatellite(satellite)}
              className={`w-full p-4 rounded-lg border transition-all text-left ${
                selectedSatellite?.id === satellite.id
                  ? 'bg-blue-500/20 border-blue-500'
                  : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">{satellite.name}</span>
                <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400">
                  Active
                </span>
              </div>
              <div className="mt-2 space-y-1 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Altitude:</span>
                  <span>{satellite.position.alt.toFixed(1)} km</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Speed:</span>
                  <span>{satellite.velocity.speed.toFixed(1)} km/s</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Signal Quality:</span>
                  <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all"
                      style={{ width: `${satellite.quantumMetrics.signalQuality * 100}%` }}
                    />
                  </div>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Quantum Enhancement:</span>
                  <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 transition-all"
                      style={{ width: `${satellite.quantumMetrics.quantumCoherence * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Real-time Metrics and Globe */}
      <div className="col-span-2 space-y-4">
        {selectedSatellite ? (
          <>
            {/* Communication Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Signal className="h-5 w-5 text-blue-400" />
                  Communication Metrics
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Baseline Latency:</span>
                      <span className="text-gray-200">
                        {selectedSatellite.quantumMetrics.baselineLatency.toFixed(1)} ms
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Quantum-Enhanced Latency:</span>
                      <span className="text-green-400">
                        {selectedSatellite.quantumMetrics.quantumLatency.toFixed(1)} ms
                      </span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 transition-all"
                        style={{ width: `${calculateLatencyImprovement(selectedSatellite)}%` }}
                      />
                    </div>
                    <div className="text-right text-xs text-green-400 mt-1">
                      {calculateLatencyImprovement(selectedSatellite)}% improvement
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Baseline Bandwidth:</span>
                      <span className="text-gray-200">
                        {selectedSatellite.quantumMetrics.baselineBandwidth.toFixed(0)} Mbps
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Quantum-Enhanced Bandwidth:</span>
                      <span className="text-green-400">
                        {selectedSatellite.quantumMetrics.quantumBandwidth.toFixed(0)} Mbps
                      </span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all"
                        style={{ 
                          width: `${(selectedSatellite.quantumMetrics.quantumBandwidth / 
                                   selectedSatellite.quantumMetrics.baselineBandwidth) * 100}%` 
                        }}
                      />
                    </div>
                    <div className="text-right text-xs text-blue-400 mt-1">
                      {((selectedSatellite.quantumMetrics.quantumBandwidth / 
                         selectedSatellite.quantumMetrics.baselineBandwidth)).toFixed(1)}x improvement
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-purple-400" />
                  Quantum Enhancement
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Quantum Coherence:</span>
                      <span className="text-purple-400">
                        {(selectedSatellite.quantumMetrics.quantumCoherence * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 transition-all"
                        style={{ width: `${selectedSatellite.quantumMetrics.quantumCoherence * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Error Rate:</span>
                      <span className="text-green-400">
                        {(selectedSatellite.quantumMetrics.errorRate * 100).toFixed(3)}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 transition-all"
                        style={{ width: `${(1 - selectedSatellite.quantumMetrics.errorRate) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Entanglement Rate:</span>
                      <span className="text-blue-400">
                        {(selectedSatellite.quantumMetrics.entanglementRate / 1000).toFixed(1)}k pairs/s
                      </span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all"
                        style={{ width: `${(selectedSatellite.quantumMetrics.entanglementRate / 60000) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Real-time Performance */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Real-time Performance</h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="p-4 bg-gray-900/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Gauge className="h-4 w-4 text-purple-400" />
                    <div className="text-sm text-gray-400">Quantum Gain</div>
                  </div>
                  <div className="text-xl font-semibold text-purple-400">
                    {realTimeMetrics.quantumGain.toFixed(1)}%
                  </div>
                </div>
                <div className="p-4 bg-gray-900/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Signal className="h-4 w-4 text-green-400" />
                    <div className="text-sm text-gray-400">Signal Boost</div>
                  </div>
                  <div className="text-xl font-semibold text-green-400">
                    {realTimeMetrics.signalImprovement.toFixed(1)}%
                  </div>
                </div>
                <div className="p-4 bg-gray-900/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Wifi className="h-4 w-4 text-blue-400" />
                    <div className="text-sm text-gray-400">Data Rate Gain</div>
                  </div>
                  <div className="text-xl font-semibold text-blue-400">
                    {realTimeMetrics.dataRate.toFixed(1)}%
                  </div>
                </div>
                <div className="p-4 bg-gray-900/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Radio className="h-4 w-4 text-yellow-400" />
                    <div className="text-sm text-gray-400">Coherence</div>
                  </div>
                  <div className="text-xl font-semibold text-yellow-400">
                    {realTimeMetrics.coherenceLevel.toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>

            {/* Globe Visualization */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Live Constellation View</h3>
              <StarlinkGlobe
                satellites={satellites.map(sat => ({
                  id: sat.id,
                  latitude: sat.position.lat,
                  longitude: sat.position.lng,
                  altitude: sat.position.alt,
                }))}
                selectedId={selectedSatellite.id}
              />
            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <Satellite className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p>Select a Starlink satellite to begin quantum enhancement</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}