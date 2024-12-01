import React from 'react';
import { Laptop, Activity, HelpCircle } from 'lucide-react';

interface SessionTypeSelectorProps {
  selectedSessionType: string;
  setSelectedSessionType: (type: string) => void;
}

const SessionTypeSelector: React.FC<SessionTypeSelectorProps> = ({
  selectedSessionType,
  setSelectedSessionType,
}) => {
  const sessionTypes = [
    { id: 'desk', name: 'Desk', icon: Laptop, color: 'bg-blue-500', description: 'Perfect for writing, emails, coding, and more' },
    { id: 'moving', name: 'Moving', icon: Activity, color: 'bg-green-500', description: 'Ideal for workouts, chores, and active tasks' },
    { id: 'anything', name: 'Anything', icon: HelpCircle, color: 'bg-purple-500', description: 'When you\'re juggling various tasks or still deciding' }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-semibold mb-4">Session Type</h2>
      <div className="space-y-4">
        {sessionTypes.map((type) => (
          <button
            key={type.id}
            className={`w-full flex items-center p-3 rounded-lg transition duration-300 ${
              selectedSessionType === type.id
                ? `${type.color} text-white`
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            onClick={() => setSelectedSessionType(type.id)}
          >
            <type.icon className="mr-3" size={24} />
            <div className="text-left">
              <h3 className="font-semibold">{type.name}</h3>
              <p className="text-sm">{type.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SessionTypeSelector;