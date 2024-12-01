import React from 'react';
import { Star, MessageSquare, Laptop, Activity, HelpCircle } from 'lucide-react';

interface AccountabilityPartnerProps {
  selectedDuration: number;
  selectedSessionType: string;
}

const AccountabilityPartner: React.FC<AccountabilityPartnerProps> = ({ selectedDuration, selectedSessionType }) => {
  const partners = [
    { id: 1, name: 'Alice Johnson', rating: 4.8, reviews: 42, image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=100&q=80', sessionType: 'desk' },
    { id: 2, name: 'Bob Smith', rating: 4.6, reviews: 38, image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=100&q=80', sessionType: 'moving' },
    { id: 3, name: 'Carol Williams', rating: 4.9, reviews: 55, image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=100&q=80', sessionType: 'anything' },
  ];

  const getSessionTypeIcon = (type: string) => {
    switch (type) {
      case 'desk':
        return <Laptop className="text-blue-500" size={16} />;
      case 'moving':
        return <Activity className="text-green-500" size={16} />;
      case 'anything':
        return <HelpCircle className="text-purple-500" size={16} />;
      default:
        return null;
    }
  };

  const handleBookPartner = (partnerId: number) => {
    // Implement booking logic here
    console.log(`Booking partner ${partnerId} for ${selectedDuration} minutes ${selectedSessionType} session`);
  };

  const filteredPartners = partners.filter(
    partner => partner.sessionType === selectedSessionType || selectedSessionType === 'anything'
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Available Partners</h2>
      <p className="mb-4">For {selectedDuration}-minute {selectedSessionType} sessions:</p>
      <div className="space-y-4">
        {filteredPartners.map((partner) => (
          <div key={partner.id} className="flex items-center space-x-4 p-3 border rounded-lg hover:bg-gray-50 transition duration-300">
            <img src={partner.image} alt={partner.name} className="w-12 h-12 rounded-full object-cover" />
            <div className="flex-grow">
              <h3 className="font-semibold">{partner.name}</h3>
              <div className="flex items-center text-sm text-gray-600">
                <Star className="text-yellow-400 mr-1" size={16} />
                <span>{partner.rating}</span>
                <span className="mx-2">•</span>
                <MessageSquare size={16} className="mr-1" />
                <span>{partner.reviews} reviews</span>
                <span className="mx-2">•</span>
                {getSessionTypeIcon(partner.sessionType)}
              </div>
            </div>
            <button 
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
              onClick={() => handleBookPartner(partner.id)}
            >
              Book
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountabilityPartner;