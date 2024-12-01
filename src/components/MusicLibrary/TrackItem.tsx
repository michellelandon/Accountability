import React from 'react';
import { Play, Pause } from 'lucide-react';
import { TrackItemProps } from './types';

const TrackItem: React.FC<TrackItemProps> = ({ track, isPlaying, onPlay }) => {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-300">
      <div>
        <h3 className="font-medium">{track.title}</h3>
        <p className="text-sm text-gray-600">{track.artist}</p>
      </div>
      <div className="flex items-center">
        <span className="text-sm text-gray-500 mr-4">{track.duration}</span>
        <button
          onClick={onPlay}
          className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition duration-300"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>
      </div>
    </div>
  );
};

export default TrackItem;