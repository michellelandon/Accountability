import React, { useState, useEffect } from 'react';
import { Bell, Check, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import useNotificationStore from '../stores/notificationStore';
import { format } from 'date-fns';

const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser } = useAuth();
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead,
    fetchUserNotifications 
  } = useNotificationStore();

  useEffect(() => {
    if (currentUser) {
      const unsubscribe = fetchUserNotifications(currentUser.uid);
      return () => unsubscribe();
    }
  }, [currentUser]);

  const handleMarkAsRead = async (notificationId: string) => {
    await markAsRead(notificationId);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition duration-300"
      >
        <Bell />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-xs text-white w-5 h-5 flex items-center justify-center rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed top-16 right-4 w-96 bg-white rounded-lg shadow-xl overflow-hidden z-50">
          <div className="flex items-center justify-between p-4 bg-blue-500 text-white">
            <h3 className="font-bold">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-gray-500 text-center">No notifications</p>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 border-b ${
                    notification.read ? 'bg-gray-50' : 'bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className={`${notification.read ? 'text-gray-600' : 'text-black font-semibold'}`}>
                        {notification.message}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {format(notification.createdAt, 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="ml-2 p-1 hover:bg-gray-100 rounded-full"
                      >
                        <Check size={16} className="text-blue-500" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-2 right-2 p-2 text-white hover:bg-blue-600 rounded-full"
          >
            <X size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;