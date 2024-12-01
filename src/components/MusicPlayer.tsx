import React, { useState, useRef, useEffect } from 'react';
import { Music, Play, Pause, Volume2, VolumeX, SkipForward, SkipBack } from 'lucide-react';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const tracks = [
    {
      title: 'Calm Focus',
      url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3'
    },
    {
      title: 'Deep Work',
      url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3'
    },
    {
      title: 'Flow State',
      url: 'https://cdn.pixabay.com/download/audio/2022/04/27/audio_c6ccf3232f.mp3'
    }
  ];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      loadTrack(currentTrackIndex);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, [currentTrackIndex]);

  const loadTrack = (index: number) => {
    setIsLoading(true);
    setError(null);
    if (audioRef.current) {
      audioRef.current.src = tracks[index].url;
      audioRef.current.load();
    }
  };

  const handleCanPlay = () => {
    setIsLoading(false);
    setError(null);
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(handlePlayError);
    }
  };

  const handlePlayError = (error: any) => {
    console.error('Playback error:', error);
    setError('Unable to play audio. Please try again.');
    setIsPlaying(false);
  };

  const togglePlay = async () => {
    if (!audioRef.current || isLoading) return;

    try {
      if (isPlaying) {
        await audioRef.current.pause();
      } else {
        await audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
      setError(null);
    } catch (error) {
      handlePlayError(error);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const newMutedState = !isMuted;
    audioRef.current.muted = newMutedState;
    setIsMuted(newMutedState);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const playNextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
  };

  const playPreviousTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Music className="mr-2" /> Focus Music
      </h2>
      
      <div className="mb-4">
        <h3 className="text-lg font-medium">{tracks[currentTrackIndex].title}</h3>
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <button
          onClick={playPreviousTrack}
          className="p-2 hover:bg-gray-100 rounded-full"
          disabled={isLoading}
        >
          <SkipBack size={20} />
        </button>

        <button
          onClick={togglePlay}
          disabled={isLoading}
          className={`flex items-center px-6 py-3 rounded-full ${
            isLoading
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {isPlaying ? <Pause className="mr-2" /> : <Play className="mr-2" />}
          {isLoading ? 'Loading...' : isPlaying ? 'Pause' : 'Play'}
        </button>

        <button
          onClick={playNextTrack}
          className="p-2 hover:bg-gray-100 rounded-full"
          disabled={isLoading}
        >
          <SkipForward size={20} />
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={toggleMute}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="flex-1"
        />
      </div>

      <audio
        ref={audioRef}
        onCanPlay={handleCanPlay}
        onEnded={playNextTrack}
        onError={() => {
          setIsLoading(false);
          setError('Failed to load audio. Please try again.');
        }}
      />
    </div>
  );
};

export default MusicPlayer;