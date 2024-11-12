import React from 'react';
import { Satellite, Signal } from 'lucide-react';
import { SpaceObject } from './SpaceDataService';

interface SpaceObjectCardProps {
  object: SpaceObject;
  selected: boolean;
  onClick: () => void;
}

export function SpaceObjectCard({ object, selected, onClick }: SpaceObjectCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full p-4 rounded-lg border transition-all ${
        selected
          ? 'bg-blue-500/20 border-blue-500'
          : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
      }`}
    >
      <div className="flex items-center gap-3">
        <Satellite className="h-5 w-5 text-blue-400" />
        <span className="text-gray-200 font-medium">{object.name}</span>
      </div>
      <div className="mt-2 space-y-1">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Distance:</span>
          <span className="text-gray-300">{object.distance}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Location:</span>
          <span className="text-gray-300">{object.location}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Signal:</span>
          <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all"
              style={{ width: `${object.signalStrength * 100}%` }}
            />
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Q-State:</span>
          <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 transition-all"
              style={{ width: `${object.quantumState * 100}%` }}
            />
          </div>
        </div>
        {object.lastUpdate && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Last Update:</span>
            <span className="text-gray-300">
              {new Date(object.lastUpdate).toLocaleTimeString()}
            </span>
          </div>
        )}
      </div>
    </button>
  );
}