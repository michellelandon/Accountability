import React, { useState, useRef, useEffect } from 'react';
import { Camera, Mic, MicOff, Video, VideoOff } from 'lucide-react';

const CameraAndMicCheck: React.FC = () => {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleCamera = async () => {
    if (isCameraOn) {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
      setIsCameraOn(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraOn(true);
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    }
  };

  const toggleMic = async () => {
    if (isMicOn) {
      setIsMicOn(false);
    } else {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setIsMicOn(true);
      } catch (err) {
        console.error("Error accessing microphone:", err);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-semibold mb-4">Camera & Microphone</h2>
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={toggleCamera}
          className={`flex items-center px-4 py-2 rounded-full ${
            isCameraOn ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'
          }`}
        >
          {isCameraOn ? <Video className="mr-2" /> : <VideoOff className="mr-2" />}
          {isCameraOn ? 'Camera On' : 'Camera Off'}
        </button>
        <button
          onClick={toggleMic}
          className={`flex items-center px-4 py-2 rounded-full ${
            isMicOn ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'
          }`}
        >
          {isMicOn ? <Mic className="mr-2" /> : <MicOff className="mr-2" />}
          {isMicOn ? 'Mic On' : 'Mic Off'}
        </button>
      </div>
      <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden">
        <video ref={videoRef} autoPlay playsInline muted className="object-cover w-full h-full" />
      </div>
    </div>
  );
};

export default CameraAndMicCheck;