import React, { useState } from 'react';
import { Music } from 'lucide-react';
import { tracks } from './trackData';
import TrackList from './TrackList';
import VolumeControl from './VolumeControl';
import AudioPlayer from './AudioPlayer';
import toast from 'react-hot-toast';

const MusicLibrary: React.FC = () => {
  const [playingTrack, setPlayingTrack] = useState<number | null>(null);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);

  const getCurrentTrackUrl = () => {
    if (playingTrack === null) return null;
    const track = tracks.find(t => t.id === playingTrack);
    return track?.url || null;
  };

  const preloadAudio = async (url: string): Promise<boolean> => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      console.error('Audio preload error:', error);
      return false;
    }
  };

  const togglePlay = async (trackId: number) => {
    try {
      setAudioError(null);

      if (playingTrack === trackId) {
        setPlayingTrack(null);
        return;
      }

      const track = tracks.find(t => t.id === trackId);
      if (!track) {
        toast.error('Track not found');
        return;
      }

      setIsLoading(true);
      const isAvailable = await preloadAudio(track.url);
      
      if (!isAvailable) {
        toast.error('This track is currently unavailable');
        setIsLoading(false);
        return;
      }

      setPlayingTrack(trackId);
    } catch (error) {
      console.error('Error handling playback:', error);
      toast.error('An error occurred. Please try again.');
      setAudioError('An unexpected error occurred.');
      setPlayingTrack(null);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const categories = Array.from(new Set(tracks.map(track => track.category)));

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold flex items-center">
          <Music className="mr-2" /> Productivity Music
        </h2>
        <VolumeControl
          volume={volume}
          isMuted={isMuted}
          onVolumeChange={handleVolumeChange}
          onToggleMute={toggleMute}
        />
      </div>

      {audioError && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg">
          {audioError}
        </div>
      )}

      {categories.map(category => (
        <TrackList
          key={category}
          tracks={tracks}
          category={category}
          playingTrack={playingTrack}
          onPlayTrack={togglePlay}
        />
      ))}

      <AudioPlayer
        url={getCurrentTrackUrl()}
        volume={volume}
        isMuted={isMuted}
        onError={(error) => {
          setAudioError(error);
          setPlayingTrack(null);
          setIsLoading(false);
        }}
        onEnd={() => setPlayingTrack(null)}
        onLoadStart={() => setIsLoading(true)}
        onCanPlay={() => setIsLoading(false)}
      />

      {isLoading && (
        <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg">
          Loading audio...
        </div>
      )}
    </div>
  );
};

export default MusicLibrary;