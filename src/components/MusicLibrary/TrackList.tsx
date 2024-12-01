import React from 'react';
import { TrackListProps } from './types';
import TrackItem from './TrackItem';

const TrackList: React.FC<TrackListProps> = ({
  tracks,
  category,
  playingTrack,
  onPlayTrack,
}) => {
  const categoryTracks = tracks.filter(track => track.category === category);

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">{category}</h3>
      <div className="space-y-2">
        {categoryTracks.map(track => (
          <TrackItem
            key={track.id}
            track={track}
            isPlaying={playingTrack === track.id}
            onPlay={() => onPlayTrack(track.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default TrackList;