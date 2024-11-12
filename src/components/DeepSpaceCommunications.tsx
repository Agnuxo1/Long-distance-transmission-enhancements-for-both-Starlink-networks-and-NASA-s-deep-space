import React, { useState, useEffect } from 'react';
import { Rocket, Radio, Zap, Signal, Wifi, Gauge } from 'lucide-react';
import { SolarSystemMap } from './SolarSystemMap';

interface Probe {
  id: string;
  name: string;
  distance: string;
  status: string;
  signalStrength: number;
  lastContact: string;
  quantumMetrics: {
    baselineLatency: number;
    quantumLatency: number;
    baselineBandwidth: number;
    quantumBandwidth: number;
    errorRate: number;
    quantumCoherence: number;
    entanglementRate: number;
  };
}

interface Station {
  id: string;
  name: string;
  location: string;
  status: 'active' | 'standby' | 'maintenance';
  capabilities: string[];
}

const DSN_STATIONS: Station[] = [
  {
    id: 'canberra',
    name: 'Canberra Deep Space Communication Complex',
    location: 'Canberra, Australia',
    status: 'active',
    capabilities: ['X-band', 'Ka-band', 'Quantum Entanglement']
  },
  {
    id: 'madrid',
    name: 'Madrid Deep Space Communication Complex',
    location: 'Madrid, Spain',
    status: 'active',
    capabilities: ['S-band', 'X-band', 'Ka-band', 'Quantum Entanglement']
  },
  {
    id: 'goldstone',
    name: 'Goldstone Deep Space Communication Complex',
    location: 'California, USA',
    status: 'active',
    capabilities: ['S-band', 'X-band', 'Ka-band', 'Quantum Entanglement']
  }
];

export function DeepSpaceCommunications() {
  const [selectedProbe, setSelectedProbe] = useState<Probe | null>(null);
  const [selectedStation, setSelectedStation] = useState<Station | null>(DSN_STATIONS[0]);
  const [realTimeMetrics, setRealTimeMetrics] = useState({
    quantumGain: 0,
    signalImprovement: 0,
    dataRate: 0,
    coherenceLevel: 0
  });

  const [probes, setProbes] = useState<Probe[]>([
    {
      id: 'voyager1',
      name: 'Voyager 1',
      distance: '23200000000',
      status: 'Active',
      signalStrength: 0.65,
      lastContact: '2024-02-28T15:30:00Z',
      quantumMetrics: {
        baselineLatency: 38.6, // hours
        quantumLatency: 12.8, // hours with quantum enhancement
        baselineBandwidth: 160, // bits per second
        quantumBandwidth: 1600, // bits per second with quantum enhancement
        errorRate: 0.02, // 2% error rate with quantum correction
        quantumCoherence: 0.85,
        entanglementRate: 1000 // pairs per second
      }
    },
    {
      id: 'voyager2',
      name: 'Voyager 2',
      distance: '19400000000',
      status: 'Active',
      signalStrength: 0.70,
      lastContact: '2024-02-28T14:45:00Z',
      quantumMetrics: {
        baselineLatency: 32.3,
        quantumLatency: 10.7,
        baselineBandwidth: 160,
        quantumBandwidth: 1800,
        errorRate: 0.015,
        quantumCoherence: 0.88,
        entanglementRate: 1200
      }
    },
    {
      id: 'newhorizons',
      name: 'New Horizons',
      distance: '7500000000',
      status: 'Active',
      signalStrength: 0.85,
      lastContact: '2024-02-28T16:15:00Z',
      quantumMetrics: {
        baselineLatency: 12.5,
        quantumLatency: 4.2,
        baselineBandwidth: 1000,
        quantumBandwidth: 4000,
        errorRate: 0.008,
        quantumCoherence: 0.92,
        entanglementRate: 2000
      }
    }
  ]);

  useEffect(() => {
    if (!selectedProbe) return;

    // Simulate real-time metric updates
    const interval = setInterval(() => {
      const baseSignal = selectedProbe.signalStrength;
      const quantumEnhancement = selectedProbe.quantumMetrics.quantumCoherence;
      const distance = parseInt(selectedProbe.distance);

      // Calculate real-time improvements
      setRealTimeMetrics({
        quantumGain: (quantumEnhancement * 100) * (1 + Math.random() * 0.1),
        signalImprovement: (quantumEnhancement / baseSignal * 100) * (1 + Math.random() * 0.05),
        dataRate: (selectedProbe.quantumMetrics.quantumBandwidth / selectedProbe.quantumMetrics.baselineBandwidth * 100) * (1 + Math.random() * 0.08),
        coherenceLevel: selectedProbe.quantumMetrics.quantumCoherence * 100 * (1 + Math.random() * 0.03)
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedProbe]);

  const calculateLatencyImprovement = (probe: Probe) => {
    return ((probe.quantumMetrics.baselineLatency - probe.quantumMetrics.quantumLatency) / probe.quantumMetrics.baselineLatency * 100).toFixed(1);
  };

  return (
    <div className="grid grid-cols-3 gap-4 h-full p-4">
      {/* Probe list section */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Deep Space Probes</h2>
        <div className="space-y-4">
          {probes.map(probe => (
            <button
              key={probe.id}
              onClick={() => setSelectedProbe(probe)}
              className={`w-full p-4 rounded-lg border transition-all text-left ${
                selectedProbe?.id === probe.id
                  ? 'bg-blue-500/20 border-blue-500'
                  : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">{probe.name}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  probe.status === 'Active' 
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {probe.status}
                </span>
              </div>
              <div className="mt-2 space-y-1 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Distance:</span>
                  <span>{(parseInt(probe.distance) / 1000000000).toFixed(1)} billion km</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Signal:</span>
                  <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all"
                      style={{ width: `${probe.signalStrength * 100}%` }}
                    />
                  </div>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Quantum Enhancement:</span>
                  <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 transition-all"
                      style={{ width: `${probe.quantumMetrics.quantumCoherence * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Real-time Metrics and Solar System Map */}
      <div className="col-span-2 space-y-4">
        {selectedProbe ? (
          <>
            {/* Real-time Performance Metrics */}
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
                      <span className="text-gray-200">{selectedProbe.quantumMetrics.baselineLatency.toFixed(1)} hours</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Quantum-Enhanced Latency:</span>
                      <span className="text-green-400">{selectedProbe.quantumMetrics.quantumLatency.toFixed(1)} hours</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 transition-all"
                        style={{ width: `${calculateLatencyImprovement(selectedProbe)}%` }}
                      />
                    </div>
                    <div className="text-right text-xs text-green-400 mt-1">
                      {calculateLatencyImprovement(selectedProbe)}% improvement
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Baseline Bandwidth:</span>
                      <span className="text-gray-200">{selectedProbe.quantumMetrics.baselineBandwidth} bps</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Quantum-Enhanced Bandwidth:</span>
                      <span className="text-green-400">{selectedProbe.quantumMetrics.quantumBandwidth} bps</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all"
                        style={{ width: `${(selectedProbe.quantumMetrics.quantumBandwidth / selectedProbe.quantumMetrics.baselineBandwidth) * 100}%` }}
                      />
                    </div>
                    <div className="text-right text-xs text-blue-400 mt-1">
                      {((selectedProbe.quantumMetrics.quantumBandwidth / selectedProbe.quantumMetrics.baselineBandwidth) * 100).toFixed(1)}x improvement
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
                      <span className="text-purple-400">{(selectedProbe.quantumMetrics.quantumCoherence * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 transition-all"
                        style={{ width: `${selectedProbe.quantumMetrics.quantumCoherence * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Error Rate:</span>
                      <span className="text-green-400">{(selectedProbe.quantumMetrics.errorRate * 100).toFixed(2)}%</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 transition-all"
                        style={{ width: `${(1 - selectedProbe.quantumMetrics.errorRate) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Entanglement Rate:</span>
                      <span className="text-blue-400">{selectedProbe.quantumMetrics.entanglementRate} pairs/s</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all"
                        style={{ width: `${(selectedProbe.quantumMetrics.entanglementRate / 2000) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Real-time Improvements */}
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

            {/* Solar System Map */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Deep Space Network Status</h3>
              <SolarSystemMap
                probes={probes.map(probe => ({
                  id: probe.id,
                  name: probe.name,
                  distance: parseFloat(probe.distance) / 149597870.7, // Convert km to AU
                  angle: Math.random() * Math.PI * 2, // Random initial angle
                }))}
                selectedId={selectedProbe.id}
              />
            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <Rocket className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p>Select a deep space probe to begin quantum enhancement</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}