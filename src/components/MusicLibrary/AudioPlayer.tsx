import React, { useRef, useEffect } from 'react';
import toast from 'react-hot-toast';

interface AudioPlayerProps {
  url: string | null;
  volume: number;
  isMuted: boolean;
  onError: (error: string) => void;
  onEnd: () => void;
  onLoadStart: () => void;
  onCanPlay: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  url,
  volume,
  isMuted,
  onError,
  onEnd,
  onLoadStart,
  onCanPlay,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    const audio = audioRef.current;
    
    // Cleanup function
    return () => {
      if (audio) {
        audio.pause();
        audio.src = '';
        audio.load();
      }
    };
  }, []);

  useEffect(() => {
    if (!url || !audioRef.current) return;

    const audio = audioRef.current;
    
    // Reset the audio element when URL changes
    audio.pause();
    audio.currentTime = 0;
    audio.src = url;
    audio.load();
    
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.error('Playback error:', error);
        handleError('Failed to play audio');
      });
    }
  }, [url]);

  const handleError = (message: string) => {
    console.error('Audio error:', message);
    toast.error('Error playing audio. Please try another track.');
    onError(message);
  };

  return (
    <audio
      ref={audioRef}
      onError={() => handleError('Error loading audio')}
      onEnded={onEnd}
      onLoadStart={onLoadStart}
      onCanPlay={onCanPlay}
      preload="auto"
    />
  );
};

export default AudioPlayer;