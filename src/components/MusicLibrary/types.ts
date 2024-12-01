export interface Track {
  id: number;
  title: string;
  artist: string;
  duration: string;
  category: string;
  url: string;
}

export interface TrackListProps {
  tracks: Track[];
  category: string;
  playingTrack: number | null;
  onPlayTrack: (trackId: number) => Promise<void>;
}

export interface TrackItemProps {
  track: Track;
  isPlaying: boolean;
  onPlay: () => Promise<void>;
}

export interface VolumeControlProps {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleMute: () => void;
}