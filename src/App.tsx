import React, { useState } from 'react';
import { Brain, Network, Cpu, Radio } from 'lucide-react';
import { NetworkVisualization } from './components/NetworkVisualization';
import { ChipVisualization } from './components/ChipVisualization';
import { StarlinkCommunications } from './components/StarlinkCommunications';
import { DeepSpaceCommunications } from './components/DeepSpaceCommunications';

function App() {
  const [activeNodes, setActiveNodes] = useState(0);
  const [networkLoad, setNetworkLoad] = useState(0);
  const [coherence, setCoherence] = useState(100);
  const [activeView, setActiveView] = useState<'network' | 'chip' | 'starlink' | 'deepspace'>('network');

  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveNodes(prev => Math.floor(Math.random() * 50 + 150));
      setNetworkLoad(prev => Math.min(100, Math.max(0, prev + (Math.random() - 0.5) * 20)));
      setCoherence(prev => Math.min(100, Math.max(0, prev + (Math.random() - 0.5) * 5)));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <header className="border-b border-gray-700 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-8 w-8 text-blue-400" />
              <h1 className="text-xl font-bold">Quantum Network</h1>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Network className="h-5 w-5 text-green-400" />
                <span className="text-sm">{activeNodes} Nodes</span>
              </div>
              <div className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-purple-400" />
                <span className="text-sm">{networkLoad.toFixed(1)}% Load</span>
              </div>
              <div className="flex items-center gap-2">
                <Radio className="h-5 w-5 text-yellow-400" />
                <span className="text-sm">{coherence.toFixed(1)}% Coherence</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
            <h2 className="text-lg font-semibold mb-4">Network Status</h2>
            <div className="space-y-4">
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-300 transition-all duration-500"
                  style={{ width: `${networkLoad}%` }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Active Connections</p>
                  <p className="text-lg font-semibold">{Math.floor(activeNodes * 1.5)}</p>
                </div>
                <div>
                  <p className="text-gray-400">Data Transfer</p>
                  <p className="text-lg font-semibold">{(networkLoad * 1.2).toFixed(1)} MB/s</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
            <h2 className="text-lg font-semibold mb-4">Quantum State</h2>
            <div className="space-y-4">
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-purple-300 transition-all duration-500"
                  style={{ width: `${coherence}%` }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Coherence</p>
                  <p className="text-lg font-semibold">{coherence.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-gray-400">Entangled Pairs</p>
                  <p className="text-lg font-semibold">{Math.floor(activeNodes / 2)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
            <h2 className="text-lg font-semibold mb-4">System Health</h2>
            <div className="space-y-4">
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-green-300 transition-all duration-500"
                  style={{ width: `${Math.min(100, (activeNodes / 200) * 100)}%` }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Memory Usage</p>
                  <p className="text-lg font-semibold">{Math.floor((activeNodes / 200) * 100)}%</p>
                </div>
                <div>
                  <p className="text-gray-400">Processing Units</p>
                  <p className="text-lg font-semibold">{Math.floor(activeNodes / 10)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">System Visualization</h2>
              <div className="flex gap-4">
                <button
                  onClick={() => setActiveView('network')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeView === 'network'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Network View
                </button>
                <button
                  onClick={() => setActiveView('chip')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeView === 'chip'
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  AlphaChip View
                </button>
                <button
                  onClick={() => setActiveView('starlink')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeView === 'starlink'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Starlink Network
                </button>
                <button
                  onClick={() => setActiveView('deepspace')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeView === 'deepspace'
                      ? 'bg-yellow-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Deep Space Network
                </button>
              </div>
            </div>
            <div className="aspect-video bg-black/30 rounded-lg overflow-hidden">
              {activeView === 'network' && <NetworkVisualization />}
              {activeView === 'chip' && <ChipVisualization />}
              {activeView === 'starlink' && <StarlinkCommunications />}
              {activeView === 'deepspace' && <DeepSpaceCommunications />}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;