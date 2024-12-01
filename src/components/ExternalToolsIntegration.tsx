import React, { useState, useEffect } from 'react';
import { Calendar, CheckSquare, Clock, Check, X, Loader } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface ToolStatus {
  [key: string]: {
    connected: boolean;
    loading: boolean;
    error: string | null;
  };
}

const ExternalToolsIntegration: React.FC = () => {
  const { currentUser } = useAuth();
  const [toolStatus, setToolStatus] = useState<ToolStatus>({
    calendar: { connected: false, loading: false, error: null },
    tasks: { connected: false, loading: false, error: null },
    time: { connected: false, loading: false, error: null }
  });

  const tools = [
    { 
      id: 'calendar', 
      name: 'Google Calendar', 
      icon: Calendar,
      description: 'Sync your sessions with Google Calendar'
    },
    { 
      id: 'tasks', 
      name: 'Todoist', 
      icon: CheckSquare,
      description: 'Track your tasks and goals'
    },
    { 
      id: 'time', 
      name: 'Toggl', 
      icon: Clock,
      description: 'Track time spent on sessions'
    },
  ];

  useEffect(() => {
    const fetchIntegrationStatus = async () => {
      if (!currentUser) return;

      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        const integrations = userDoc.data()?.integrations || {};
        
        setToolStatus(prevStatus => {
          const newStatus: ToolStatus = { ...prevStatus };
          Object.keys(newStatus).forEach(toolId => {
            newStatus[toolId] = {
              ...newStatus[toolId],
              connected: integrations[toolId]?.connected || false
            };
          });
          return newStatus;
        });
      } catch (error) {
        console.error('Error fetching integration status:', error);
      }
    };

    fetchIntegrationStatus();
  }, [currentUser]);

  const handleIntegration = async (toolId: string) => {
    if (!currentUser) return;

    // If already connected, handle disconnection
    if (toolStatus[toolId].connected) {
      await handleDisconnect(toolId);
      return;
    }

    setToolStatus(prev => ({
      ...prev,
      [toolId]: { ...prev[toolId], loading: true, error: null }
    }));

    try {
      // Simulate OAuth flow
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Update Firestore
      await updateDoc(doc(db, 'users', currentUser.uid), {
        [`integrations.${toolId}`]: {
          connected: true,
          connectedAt: new Date().toISOString()
        }
      });

      setToolStatus(prev => ({
        ...prev,
        [toolId]: { connected: true, loading: false, error: null }
      }));
    } catch (error) {
      console.error(`Error connecting to ${toolId}:`, error);
      setToolStatus(prev => ({
        ...prev,
        [toolId]: { 
          ...prev[toolId], 
          loading: false, 
          error: 'Failed to connect. Please try again.' 
        }
      }));
    }
  };

  const handleDisconnect = async (toolId: string) => {
    if (!currentUser) return;

    setToolStatus(prev => ({
      ...prev,
      [toolId]: { ...prev[toolId], loading: true, error: null }
    }));

    try {
      // Simulate disconnection
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update Firestore
      await updateDoc(doc(db, 'users', currentUser.uid), {
        [`integrations.${toolId}`]: {
          connected: false,
          disconnectedAt: new Date().toISOString()
        }
      });

      setToolStatus(prev => ({
        ...prev,
        [toolId]: { connected: false, loading: false, error: null }
      }));
    } catch (error) {
      console.error(`Error disconnecting ${toolId}:`, error);
      setToolStatus(prev => ({
        ...prev,
        [toolId]: { 
          ...prev[toolId], 
          loading: false, 
          error: 'Failed to disconnect. Please try again.' 
        }
      }));
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-semibold mb-4">External Tools Integration</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <div
            key={tool.id}
            className="border rounded-lg p-4 hover:shadow-md transition duration-300"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <tool.icon className="mr-2 h-5 w-5" />
                <h3 className="font-semibold">{tool.name}</h3>
              </div>
              {toolStatus[tool.id].connected && (
                <Check className="h-5 w-5 text-green-500" />
              )}
            </div>
            <p className="text-sm text-gray-600 mb-4">{tool.description}</p>
            <button
              onClick={() => handleIntegration(tool.id)}
              disabled={toolStatus[tool.id].loading}
              className={`w-full flex items-center justify-center px-4 py-2 rounded-lg transition duration-300 ${
                toolStatus[tool.id].connected
                  ? 'bg-red-100 text-red-600 hover:bg-red-200'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {toolStatus[tool.id].loading ? (
                <Loader className="h-5 w-5 animate-spin" />
              ) : toolStatus[tool.id].connected ? (
                'Disconnect'
              ) : (
                'Connect'
              )}
            </button>
            {toolStatus[tool.id].error && (
              <p className="text-sm text-red-500 mt-2">{toolStatus[tool.id].error}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExternalToolsIntegration;