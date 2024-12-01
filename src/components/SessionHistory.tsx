import React from 'react';
import { Clock, Calendar, User } from 'lucide-react';

const SessionHistory: React.FC = () => {
  const sessions = [
    { id: 1, date: '2024-03-15', duration: 25, partner: 'Alice Johnson', type: 'Desk', rating: 4 },
    { id: 2, date: '2024-03-14', duration: 50, partner: 'Bob Smith', type: 'Moving', rating: 5 },
    { id: 3, date: '2024-03-12', duration: 75, partner: 'Carol Williams', type: 'Anything', rating: 3 },
  ];

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6">Session History</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4 text-left">Duration</th>
              <th className="py-3 px-4 text-left">Partner</th>
              <th className="py-3 px-4 text-left">Type</th>
              <th className="py-3 px-4 text-left">Rating</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => (
              <tr key={session.id} className="border-b">
                <td className="py-3 px-4 flex items-center">
                  <Calendar className="mr-2" size={16} />
                  {session.date}
                </td>
                <td className="py-3 px-4 flex items-center">
                  <Clock className="mr-2" size={16} />
                  {session.duration} min
                </td>
                <td className="py-3 px-4 flex items-center">
                  <User className="mr-2" size={16} />
                  {session.partner}
                </td>
                <td className="py-3 px-4">{session.type}</td>
                <td className="py-3 px-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < session.rating ? 'text-yellow-400' : 'text-gray-300'}>
                      ★
                    </span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SessionHistory;