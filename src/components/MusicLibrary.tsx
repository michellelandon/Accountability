import React, { useState, useRef, useEffect } from 'react';
import { Music, Play, Pause, Volume2, VolumeX } from 'lucide-react';

const MusicLibrary: React.FC = () => {
  const [playingTrack, setPlayingTrack] = useState<number | null>(null);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const tracks = [
    {
      id: 1,
      title: 'Deep Focus',
      artist: 'Ambient Waves',
      duration: '4:15',
      category: 'Focus',
      url: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_1b2cb3bae7.mp3'
    },
    {
      id: 2,
      title: 'Zen Garden',
      artist: 'Nature Sounds',
      duration: '5:30',
      category: 'Meditation',
      url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3'
    },
    {
      id: 3,
      title: 'Productivity Flow',
      artist: 'Beta Waves',
      duration: '3:45',
      category: 'Focus',
      url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3'
    },
    {
      id: 4,
      title: 'Ocean Breeze',
      artist: 'Nature Sounds',
      duration: '6:00',
      category: 'Relaxation',
      url: 'https://cdn.pixabay.com/download/audio/2022/04/27/audio_c6ccf3232f.mp3'
    },
    {
      id: 5,
      title: 'Alpha State',
      artist: 'Brain Waves',
      duration: '5:00',
      category: 'Focus',
      url: 'https://cdn.pixabay.com/download/audio/2022/08/02/audio_884fe5e433.mp3'
    }
  ];

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  const togglePlay = async (trackId: number) => {
    try {
      if (!audioRef.current) return;

      if (playingTrack === trackId) {
        audioRef.current.pause();
        setPlayingTrack(null);
      } else {
        const track = tracks.find(t => t.id === trackId);
        if (!track) return;

        audioRef.current.src = track.url;
        audioRef.current.volume = isMuted ? 0 : volume;
        audioRef.current.load();
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
          await playPromise;
          setPlayingTrack(trackId);
        }
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      setPlayingTrack(null);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : newVolume;
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? volume : 0;
    }
  };

  const categories = Array.from(new Set(tracks.map(track => track.category)));

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold flex items-center">
          <Music className="mr-2" /> Productivity Music
        </h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleMute}
            className="p-2 rounded-full hover:bg-gray-100 transition duration-300"
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
            className="w-24"
          />
        </div>
      </div>

      {categories.map(category => (
        <div key={category} className="mb-6">
          <h3 className="text-lg font-semibold mb-3">{category}</h3>
          <div className="space-y-3">
            {tracks
              .filter(track => track.category === category)
              .map(track => (
                <div
                  key={track.id}
                  className={`flex items-center justify-between p-3 rounded-lg transition duration-300 ${
                    playingTrack === track.id
                      ? 'bg-blue-50 border border-blue-200'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex-1">
                    <h4 className="font-medium">{track.title}</h4>
                    <p className="text-sm text-gray-600">{track.artist}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">{track.duration}</span>
                    <button
                      onClick={() => togglePlay(track.id)}
                      className={`p-2 rounded-full ${
                        playingTrack === track.id
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      } transition duration-300`}
                      aria-label={playingTrack === track.id ? 'Pause' : 'Play'}
                    >
                      {playingTrack === track.id ? <Pause size={18} /> : <Play size={18} />}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}

      <audio
        ref={audioRef}
        onError={() => setPlayingTrack(null)}
        onEnded={() => setPlayingTrack(null)}
        preload="auto"
      />
    </div>
  );
};

export default MusicLibrary;