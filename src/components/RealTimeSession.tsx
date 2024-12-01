import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import SessionTimer from './SessionTimer';
import { Send, Clock, Monitor, MonitorOff, Camera, CameraOff } from 'lucide-react';

interface Message {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: any;
}

const RealTimeSession: React.FC = () => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sessionDuration] = useState(25);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const screenShareRef = useRef<HTMLVideoElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !currentUser) return;

    setLoading(true);
    try {
      const messagesRef = collection(db, 'sessions', currentUser.uid, 'messages');
      await addDoc(messagesRef, {
        userId: currentUser.uid,
        userName: currentUser.email?.split('@')[0] || 'Anonymous',
        text: inputMessage,
        timestamp: serverTimestamp()
      });
      setInputMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const stream = await navigator.mediaDevices.getDisplayMedia({ 
          video: true,
          audio: true 
        });
        
        if (screenShareRef.current) {
          screenShareRef.current.srcObject = stream;
          setIsScreenSharing(true);
          stream.getVideoTracks()[0].onended = () => stopScreenShare();
        }
      } else {
        stopScreenShare();
      }
    } catch (error) {
      console.error('Error sharing screen:', error);
    }
  };

  const stopScreenShare = () => {
    if (screenShareRef.current?.srcObject) {
      const tracks = (screenShareRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      screenShareRef.current.srcObject = null;
      setIsScreenSharing(false);
    }
  };

  const toggleCamera = async () => {
    try {
      if (!isCameraOn) {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true,
          audio: false 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsCameraOn(true);
        }
      } else {
        stopCamera();
      }
    } catch (error) {
      console.error('Error toggling camera:', error);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraOn(false);
    }
  };

  const handleTimerEnd = () => {
    setIsSessionActive(false);
    stopScreenShare();
    stopCamera();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Real-Time Session</h2>
        <div className="flex items-center space-x-4">
          <Clock className="mr-2" />
          <span>{sessionDuration} minutes</span>
        </div>
      </div>

      {!isSessionActive ? (
        <div className="text-center py-8">
          <button
            onClick={() => setIsSessionActive(true)}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Start Session
          </button>
        </div>
      ) : (
        <>
          <SessionTimer duration={sessionDuration} onTimerEnd={handleTimerEnd} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <video
                ref={screenShareRef}
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              />
              <button
                onClick={toggleScreenShare}
                className={`absolute top-2 right-2 p-2 rounded-full ${
                  isScreenSharing ? 'bg-red-500' : 'bg-blue-500'
                } text-white hover:opacity-90 transition duration-300`}
              >
                {isScreenSharing ? <MonitorOff size={20} /> : <Monitor size={20} />}
              </button>
              {!isScreenSharing && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  No screen being shared
                </div>
              )}
            </div>

            <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <button
                onClick={toggleCamera}
                className={`absolute top-2 right-2 p-2 rounded-full ${
                  isCameraOn ? 'bg-red-500' : 'bg-blue-500'
                } text-white hover:opacity-90 transition duration-300`}
              >
                {isCameraOn ? <CameraOff size={20} /> : <Camera size={20} />}
              </button>
              {!isCameraOn && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  Camera is off
                </div>
              )}
            </div>
          </div>

          <div className="mt-6">
            <form onSubmit={sendMessage} className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !inputMessage.trim()}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 disabled:opacity-50"
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default RealTimeSession;