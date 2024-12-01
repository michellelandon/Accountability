import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { VolumeControlProps } from './types';

const VolumeControl: React.FC<VolumeControlProps> = ({
  volume,
  isMuted,
  onVolumeChange,
  onToggleMute,
}) => {
  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={onToggleMute}
        className="p-2 rounded-full hover:bg-gray-100"
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={onVolumeChange}
        className="w-24"
        aria-label="Volume"
      />
    </div>
  );
};

export default VolumeControl;