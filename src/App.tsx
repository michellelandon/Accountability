import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { FirestoreProvider } from './contexts/FirestoreContext';
import Header from './components/Header';
import SessionBooking from './components/SessionBooking';
import AccountabilityPartner from './components/AccountabilityPartner';
import MusicPlayer from './components/MusicPlayer';
import Footer from './components/Footer';
import MonthlyCalendar from './components/MonthlyCalendar';
import SessionTypeSelector from './components/SessionTypeSelector';
import CameraAndMicCheck from './components/CameraAndMicCheck';
import Login from './components/Login';
import MusicLibrary from './components/MusicLibrary';
import ReferralPage from './components/ReferralPage';
import UserProfile from './components/UserProfile';
import SessionHistory from './components/SessionHistory';
import CommunityBoard from './components/CommunityBoard';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import NotificationCenter from './components/NotificationCenter';
import RealTimeSession from './components/RealTimeSession';
import ExternalToolsIntegration from './components/ExternalToolsIntegration';
import GamificationSystem from './components/GamificationSystem';

function App() {
  return (
    <AuthProvider>
      <FirestoreProvider>
        <Router>
          <AppContent />
        </Router>
      </FirestoreProvider>
    </AuthProvider>
  );
}

function AppContent() {
  const [selectedDuration, setSelectedDuration] = React.useState(25);
  const [selectedSessionType, setSelectedSessionType] = React.useState('desk');
  const [notifications] = React.useState([
    { id: 1, message: "New session request from Alice", read: false },
    { id: 2, message: "You've earned a productivity badge!", read: false },
    { id: 3, message: "Don't forget your scheduled session today", read: true },
  ]);

  const handleDateClick = (date: Date) => {
    console.log('Selected date:', date);
  };

  const handleBookPartner = (partnerId: number) => {
    console.log('Booking partner:', partnerId);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <NotificationCenter notifications={notifications} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <>
                <h1 className="text-3xl font-bold text-center mb-8">Virtual Coworking Accountability</h1>
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <SessionBooking
                      selectedDuration={selectedDuration}
                      setSelectedDuration={setSelectedDuration}
                    />
                    <SessionTypeSelector
                      selectedSessionType={selectedSessionType}
                      setSelectedSessionType={setSelectedSessionType}
                    />
                    <CameraAndMicCheck />
                  </div>
                  <AccountabilityPartner
                    selectedDuration={selectedDuration}
                    selectedSessionType={selectedSessionType}
                    onBookPartner={handleBookPartner}
                  />
                </div>
                <MonthlyCalendar onDateClick={handleDateClick} />
                <MusicPlayer />
                <MusicLibrary />
                <RealTimeSession />
                <ExternalToolsIntegration />
                <GamificationSystem />
              </>
            }
          />
          <Route path="/referral" element={<ReferralPage />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/history" element={<SessionHistory />} />
          <Route path="/community" element={<CommunityBoard />} />
          <Route path="/analytics" element={<AnalyticsDashboard />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;