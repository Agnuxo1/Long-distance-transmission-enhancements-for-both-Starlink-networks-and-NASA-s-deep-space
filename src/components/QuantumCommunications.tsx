import React, { useEffect, useRef, useState } from 'react';
import { Radio, Send, Signal, Timer, Satellite as SatelliteIcon } from 'lucide-react';
import { SpaceObjectCard } from './SpaceObjectCard';
import { SatelliteService, Satellite, GroundStation } from '../services/SatelliteService';

interface Message {
  id: string;
  content: string;
  timestamp: number;
  direction: 'outbound' | 'inbound';
  status: 'sending' | 'transmitted' | 'received';
  metadata?: {
    satellite?: string;
    groundStation?: string;
    signalStrength?: number;
  };
}

export function QuantumCommunications() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedSatellite, setSelectedSatellite] = useState<Satellite | null>(null);
  const [satellites, setSatellites] = useState<Satellite[]>([]);
  const [groundStations, setGroundStations] = useState<GroundStation[]>([]);
  const [activeStation, setActiveStation] = useState<GroundStation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [transmitting, setTransmitting] = useState(false);
  const satelliteService = new SatelliteService('YOUR_API_KEY');

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch real satellite data
  useEffect(() => {
    const fetchData = async () => {
      const sats = await satelliteService.getStarlinkSatellites();
      const stations = await satelliteService.getGroundStations();
      setSatellites(sats);
      setGroundStations(stations);
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Update optimal ground station when satellite is selected
  useEffect(() => {
    const updateOptimalStation = async () => {
      if (selectedSatellite) {
        const optimal = await satelliteService.calculateOptimalGroundStation(
          selectedSatellite
        );
        setActiveStation(optimal);
      }
    };

    updateOptimalStation();
  }, [selectedSatellite]);

  const calculateSignalQuality = (satellite: Satellite): number => {
    if (!activeStation) return 0;
    
    const distance = Math.sqrt(
      Math.pow(satellite.position.lat - activeStation.location.lat, 2) +
      Math.pow(satellite.position.lng - activeStation.location.lng, 2)
    );
    
    // Normalize distance to signal quality (0-1)
    return Math.max(0, 1 - distance / 180);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !selectedSatellite || !activeStation) return;

    setTransmitting(true);
    const signalQuality = calculateSignalQuality(selectedSatellite);
    
    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      timestamp: Date.now(),
      direction: 'outbound',
      status: 'sending',
      metadata: {
        satellite: selectedSatellite.name,
        groundStation: activeStation.name,
        signalStrength: signalQuality
      }
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');

    // Simulate transmission delay based on distance and signal quality
    const transmissionDelay = 2000 + (1 - signalQuality) * 3000;
    
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, status: 'transmitted' } 
            : msg
        )
      );
      
      // Simulate response
      setTimeout(() => {
        const response: Message = {
          id: Date.now().toString(),
          content: `Quantum-encrypted transmission received via ${selectedSatellite.name}. Signal strength: ${(signalQuality * 100).toFixed(1)}%`,
          timestamp: Date.now(),
          direction: 'inbound',
          status: 'received',
          metadata: {
            satellite: selectedSatellite.name,
            groundStation: activeStation.name,
            signalStrength: signalQuality
          }
        };
        setMessages(prev => [...prev, response]);
        setTransmitting(false);
      }, transmissionDelay);
    }, 2000);
  };

  return (
    <div className="relative w-full h-full flex gap-4 p-4 bg-gray-900/50 overflow-hidden">
      {/* Satellites List */}
      <div className="w-[300px] flex-shrink-0 bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700 flex flex-col">
        <h2 className="text-lg font-semibold mb-4 text-gray-200">Active Satellites</h2>
        <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar">
          {satellites.map(satellite => (
            <div
              key={satellite.id}
              onClick={() => setSelectedSatellite(satellite)}
              className={`p-4 rounded-lg border transition-all cursor-pointer ${
                selectedSatellite?.id === satellite.id
                  ? 'bg-blue-500/20 border-blue-500'
                  : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <SatelliteIcon className="h-5 w-5 text-blue-400" />
                <span className="text-gray-200 font-medium">{satellite.name}</span>
              </div>
              <div className="mt-2 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Altitude:</span>
                  <span className="text-gray-300">
                    {satellite.position.alt.toFixed(1)} km
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Speed:</span>
                  <span className="text-gray-300">
                    {satellite.velocity.speed.toFixed(1)} km/s
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Signal:</span>
                  <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all"
                      style={{
                        width: `${calculateSignalQuality(satellite) * 100}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Communication Interface */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Messages Area */}
        <div className="flex-1 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4 mb-4 overflow-hidden">
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
              <div className="space-y-4">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.direction === 'outbound' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.direction === 'outbound'
                          ? 'bg-blue-500/20 border border-blue-500/50'
                          : 'bg-purple-500/20 border border-purple-500/50'
                      }`}
                    >
                      <p className="text-gray-200">{message.content}</p>
                      <div className="mt-1 flex items-center gap-2 text-xs">
                        <span className="text-gray-400">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </span>
                        {message.metadata && (
                          <span className="text-gray-400">
                            via {message.metadata.satellite}
                          </span>
                        )}
                        {message.direction === 'outbound' && (
                          <span className="flex items-center gap-1 text-gray-400">
                            {message.status === 'sending' && (
                              <>
                                <Signal className="h-3 w-3 animate-pulse" />
                                Sending...
                              </>
                            )}
                            {message.status === 'transmitted' && (
                              <>
                                <Send className="h-3 w-3" />
                                Transmitted
                              </>
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                disabled={!selectedSatellite || transmitting}
                placeholder={
                  !selectedSatellite
                    ? "Select a satellite to begin transmission..."
                    : transmitting
                    ? "Transmission in progress..."
                    : "Enter quantum-encrypted message..."
                }
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
                onKeyDown={e => {
                  if (e.key === 'Enter' && !transmitting) {
                    sendMessage();
                  }
                }}
              />
            </div>
            <button
              onClick={() => sendMessage()}
              disabled={!selectedSatellite || transmitting || !inputMessage.trim()}
              className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-blue-500 text-white rounded-lg px-6 py-2 font-medium transition-colors flex items-center gap-2"
            >
              {transmitting ? (
                <>
                  <Radio className="h-4 w-4 animate-pulse" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="absolute top-6 right-6 flex gap-4">
        {activeStation && (
          <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <Signal className="h-4 w-4 text-green-400" />
            <span className="text-sm text-green-400">
              {activeStation.name} Active
            </span>
          </div>
        )}
        {selectedSatellite && (
          <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <SatelliteIcon className="h-4 w-4 text-blue-400" />
            <span className="text-sm text-blue-400">
              {selectedSatellite.name} Connected
            </span>
          </div>
        )}
      </div>
    </div>
  );
}