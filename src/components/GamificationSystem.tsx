import React, { useState, useEffect } from 'react';
import { Trophy, Star, TrendingUp } from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  progress: number;
  total: number;
}

const GamificationSystem: React.FC = () => {
  const [level, setLevel] = useState(1);
  const [experience, setExperience] = useState(0);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    // Simulating fetching user's gamification data
    setAchievements([
      { id: 'a1', name: 'Early Bird', description: 'Complete 5 morning sessions', icon: Trophy, progress: 3, total: 5 },
      { id: 'a2', name: 'Streak Master', description: 'Maintain a 7-day streak', icon: Star, progress: 5, total: 7 },
      { id: 'a3', name: 'Productivity Guru', description: 'Accumulate 50 hours of work', icon: TrendingUp, progress: 35, total: 50 },
    ]);
  }, []);

  const experienceToNextLevel = level * 100;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-semibold mb-4">Your Progress</h2>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold">Level {level}</span>
          <span>{experience} / {experienceToNextLevel} XP</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${(experience / experienceToNextLevel) * 100}%` }}
          ></div>
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-3">Achievements</h3>
      <div className="space-y-4">
        {achievements.map((achievement) => (
          <div key={achievement.id} className="flex items-center">
            <achievement.icon className="mr-3 text-yellow-500" size={24} />
            <div className="flex-grow">
              <h4 className="font-semibold">{achievement.name}</h4>
              <p className="text-sm text-gray-600">{achievement.description}</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                ></div>
              </div>
            </div>
            <span className="text-sm font-semibold">
              {achievement.progress}/{achievement.total}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GamificationSystem;