import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Laptop, Activity, HelpCircle } from 'lucide-react';
import { format, addMonths, subMonths, isSameDay } from 'date-fns';

interface User {
  id: string;
  name: string;
  avatar: string;
}

interface ScheduledSession {
  id: string;
  date: Date;
  type: 'desk' | 'moving' | 'anything';
  duration: number;
  user: User;
}

interface MonthlyCalendarProps {
  onDateClick?: (date: Date) => void;
}

interface DaySchedule {
  date: number;
  sessions: ScheduledSession[];
}

const MonthlyCalendar: React.FC<MonthlyCalendarProps> = ({ onDateClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [hoveredSession, setHoveredSession] = useState<ScheduledSession | null>(null);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  // Mock data for scheduled sessions with user avatars
  const mockUsers: User[] = [
    {
      id: '1',
      name: 'Alice Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&w=40&h=40&q=80'
    },
    {
      id: '2',
      name: 'Bob Smith',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&w=40&h=40&q=80'
    },
    {
      id: '3',
      name: 'Carol Williams',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&w=40&h=40&q=80'
    },
    {
      id: '4',
      name: 'David Chen',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&w=40&h=40&q=80'
    }
  ];

  const scheduledDays: DaySchedule[] = Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1);
    const numSessions = Math.floor(Math.random() * 4); // 0-3 sessions per day
    
    const sessions: ScheduledSession[] = Array.from({ length: numSessions }, (_, j) => ({
      id: `session-${i}-${j}`,
      date,
      type: ['desk', 'moving', 'anything'][Math.floor(Math.random() * 3)] as 'desk' | 'moving' | 'anything',
      duration: [25, 50, 75][Math.floor(Math.random() * 3)],
      user: mockUsers[Math.floor(Math.random() * mockUsers.length)]
    }));

    return {
      date: i + 1,
      sessions
    };
  });

  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
    setSelectedDate(null);
  };

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
    setSelectedDate(null);
  };

  const handleDayClick = (day: number) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(clickedDate);
    onDateClick?.(clickedDate);
  };

  const getSessionTypeColor = (type: string) => {
    switch (type) {
      case 'desk':
        return 'bg-blue-500';
      case 'moving':
        return 'bg-green-500';
      case 'anything':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getSessionTypeIcon = (type: string) => {
    switch (type) {
      case 'desk':
        return <Laptop size={12} />;
      case 'moving':
        return <Activity size={12} />;
      case 'anything':
        return <HelpCircle size={12} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex space-x-2">
          <button 
            onClick={prevMonth} 
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition duration-300"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={nextMonth} 
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition duration-300"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}

        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} className="h-24"></div>
        ))}

        {scheduledDays.map((day) => {
          const isSelected = selectedDate && isSameDay(
            new Date(currentDate.getFullYear(), currentDate.getMonth(), day.date),
            selectedDate
          );

          return (
            <button
              key={day.date}
              onClick={() => handleDayClick(day.date)}
              className={`h-24 flex flex-col items-stretch p-1 border rounded-lg transition duration-300 ${
                isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'hover:bg-gray-50 border-gray-200'
              }`}
            >
              <span className={`text-sm font-medium ${
                isSelected ? 'text-blue-600' : 'text-gray-700'
              }`}>
                {day.date}
              </span>

              <div className="flex flex-wrap gap-1 mt-1">
                {day.sessions.map((session) => (
                  <div
                    key={session.id}
                    className="relative group"
                    onMouseEnter={() => setHoveredSession(session)}
                    onMouseLeave={() => setHoveredSession(null)}
                  >
                    <div className={`w-6 h-6 rounded-full overflow-hidden border-2 ${
                      getSessionTypeColor(session.type)
                    } border-white`}>
                      <img
                        src={session.user.avatar}
                        alt={session.user.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {hoveredSession?.id === session.id && (
                      <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-white rounded-lg shadow-lg p-2 text-xs">
                        <div className="flex items-center gap-2 mb-1">
                          <img
                            src={session.user.avatar}
                            alt={session.user.name}
                            className="w-6 h-6 rounded-full"
                          />
                          <span className="font-medium">{session.user.name}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          {getSessionTypeIcon(session.type)}
                          <span>{session.type} session</span>
                        </div>
                        <div className="text-gray-600">
                          {session.duration} minutes
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex justify-center space-x-4">
        <div className="flex items-center">
          <span className="w-3 h-3 bg-blue-500 rounded-full mr-1"></span>
          <span className="text-sm">Desk</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 bg-green-500 rounded-full mr-1"></span>
          <span className="text-sm">Moving</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 bg-purple-500 rounded-full mr-1"></span>
          <span className="text-sm">Anything</span>
        </div>
      </div>
    </div>
  );
};

export default MonthlyCalendar;