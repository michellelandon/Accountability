import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../firebase';
import { useAuth } from './AuthContext';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';

interface FirestoreContextType {
  getUserData: (userId: string) => Promise<any>;
  createUserProfile: (userId: string, data: any) => Promise<void>;
  updateUserProfile: (userId: string, data: any) => Promise<void>;
}

const FirestoreContext = createContext<FirestoreContextType | undefined>(undefined);

export const useFirestore = () => {
  const context = useContext(FirestoreContext);
  if (!context) {
    throw new Error('useFirestore must be used within a FirestoreProvider');
  }
  return context;
};

export const FirestoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeUserData = async () => {
      if (currentUser) {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (!userDoc.exists()) {
          // Create initial user document if it doesn't exist
          await setDoc(userDocRef, {
            email: currentUser.email,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          });
        }
      }
      setIsInitialized(true);
    };

    initializeUserData().catch(console.error);
  }, [currentUser]);

  const getUserData = async (userId: string) => {
    try {
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      return userDoc.exists() ? userDoc.data() : null;
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  };

  const createUserProfile = async (userId: string, data: any) => {
    try {
      const userDocRef = doc(db, 'users', userId);
      await setDoc(userDocRef, {
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  };

  const updateUserProfile = async (userId: string, data: any) => {
    try {
      const userDocRef = doc(db, 'users', userId);
      await setDoc(userDocRef, {
        ...data,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  };

  if (!isInitialized) {
    return null; // Or a loading spinner
  }

  return (
    <FirestoreContext.Provider value={{
      getUserData,
      createUserProfile,
      updateUserProfile
    }}>
      {children}
    </FirestoreContext.Provider>
  );
};