import React, { useState, useEffect, useCallback } from 'react';
import { Clock, Pause, Play, RotateCcw } from 'lucide-react';

interface SessionTimerProps {
  duration: number;
  onTimerEnd: () => void;
}

const SessionTimer: React.FC<SessionTimerProps> = ({ duration, onTimerEnd }) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isRunning, setIsRunning] = useState(true);
  const [showAlert, setShowAlert] = useState(false);

  const formatTime = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval);
            onTimerEnd();
            return 0;
          }
          return prevTime - 1;
        });

        // Show alert when 5 minutes remaining
        if (timeLeft === 300) {
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 5000);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onTimerEnd]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setTimeLeft(duration * 60);
    setIsRunning(false);
  };

  const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100;

  return (
    <div className="relative">
      {showAlert && (
        <div className="absolute top-0 left-0 right-0 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg mb-4">
          5 minutes remaining!
        </div>
      )}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold flex items-center">
            <Clock className="mr-2" />
            Session Timer
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={toggleTimer}
              className={`p-2 rounded-full ${
                isRunning ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
              }`}
            >
              {isRunning ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <button
              onClick={resetTimer}
              className="p-2 rounded-full bg-gray-100 text-gray-600"
            >
              <RotateCcw size={20} />
            </button>
          </div>
        </div>
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div className="text-3xl font-bold">{formatTime(timeLeft)}</div>
            <div className="text-sm text-gray-600">
              {Math.round((timeLeft / (duration * 60)) * 100)}%
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
            <div
              style={{ width: `${progress}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionTimer;