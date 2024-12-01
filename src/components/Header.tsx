import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Music, UserPlus, LogOut, User, BarChart2, MessageSquare, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <Users className="mr-2" />
          <span className="text-xl font-bold">CoWork Buddy</span>
        </Link>
        <nav>
          <ul className="flex space-x-4">
            {currentUser ? (
              <>
                <li><Link to="/" className="hover:underline">Home</Link></li>
                <li><Link to="/profile" className="hover:underline flex items-center"><User size={18} className="mr-1" /> Profile</Link></li>
                <li><Link to="/history" className="hover:underline flex items-center"><Clock size={18} className="mr-1" /> History</Link></li>
                <li><Link to="/community" className="hover:underline flex items-center"><MessageSquare size={18} className="mr-1" /> Community</Link></li>
                <li><Link to="/analytics" className="hover:underline flex items-center"><BarChart2 size={18} className="mr-1" /> Analytics</Link></li>
                <li><Link to="/referral" className="hover:underline flex items-center"><UserPlus size={18} className="mr-1" /> Refer</Link></li>
                <li><button onClick={handleLogout} className="hover:underline flex items-center"><LogOut size={18} className="mr-1" /> Logout</button></li>
              </>
            ) : (
              <li><Link to="/login" className="hover:underline">Login</Link></li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;