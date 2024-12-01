import React from 'react';
import { Clock } from 'lucide-react';

interface SessionBookingProps {
  selectedDuration: number;
  setSelectedDuration: (duration: number) => void;
}

const SessionBooking: React.FC<SessionBookingProps> = ({ selectedDuration, setSelectedDuration }) => {
  const durations = [25, 50, 75];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Book a Session</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Duration</label>
        <div className="flex space-x-4">
          {durations.map((duration) => (
            <button
              key={duration}
              className={`flex items-center px-4 py-2 rounded-full ${
                selectedDuration === duration
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
              onClick={() => setSelectedDuration(duration)}
            >
              <Clock className="mr-2" size={18} />
              {duration} min
            </button>
          ))}
        </div>
      </div>
      <button className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300">
        Find a Partner
      </button>
    </div>
  );
};

export default SessionBooking;