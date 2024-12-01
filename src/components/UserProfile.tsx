import React, { useState } from 'react';
import { User, Edit2, Save } from 'lucide-react';

const UserProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    bio: 'Passionate about productivity and collaboration.',
    preferences: {
      notificationEmail: true,
      notificationPush: false,
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserInfo(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePreferenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setUserInfo(prevState => ({
      ...prevState,
      preferences: {
        ...prevState.preferences,
        [name]: checked,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the updated info to a backend
    console.log('Updated user info:', userInfo);
    setIsEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold flex items-center">
          <User className="mr-2" /> User Profile
        </h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {isEditing ? <Save className="mr-2" /> : <Edit2 className="mr-2" />}
          {isEditing ? 'Save' : 'Edit'}
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={userInfo.name}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={userInfo.email}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bio">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={userInfo.bio}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"
          />
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Notification Preferences</h3>
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="notificationEmail"
              name="notificationEmail"
              checked={userInfo.preferences.notificationEmail}
              onChange={handlePreferenceChange}
              disabled={!isEditing}
              className="mr-2"
            />
            <label htmlFor="notificationEmail">Receive email notifications</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="notificationPush"
              name="notificationPush"
              checked={userInfo.preferences.notificationPush}
              onChange={handlePreferenceChange}
              disabled={!isEditing}
              className="mr-2"
            />
            <label htmlFor="notificationPush">Receive push notifications</label>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UserProfile;