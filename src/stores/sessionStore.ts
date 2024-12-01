import { create } from 'zustand';
import { db } from '../firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  where, 
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';

interface Session {
  id: string;
  hostId: string;
  partnerId?: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  type: string;
  duration: number;
  startTime?: Date;
  endTime?: Date;
}

interface SessionStore {
  currentSession: Session | null;
  sessions: Session[];
  loading: boolean;
  error: string | null;
  createSession: (sessionData: Partial<Session>) => Promise<void>;
  joinSession: (sessionId: string, partnerId: string) => Promise<void>;
  endSession: (sessionId: string) => Promise<void>;
  fetchUserSessions: (userId: string) => void;
}

const useSessionStore = create<SessionStore>((set, get) => ({
  currentSession: null,
  sessions: [],
  loading: false,
  error: null,

  createSession: async (sessionData) => {
    set({ loading: true, error: null });
    try {
      const docRef = await addDoc(collection(db, 'sessions'), {
        ...sessionData,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      set({ currentSession: { id: docRef.id, ...sessionData } as Session });
    } catch (error) {
      set({ error: 'Failed to create session' });
    } finally {
      set({ loading: false });
    }
  },

  joinSession: async (sessionId, partnerId) => {
    set({ loading: true, error: null });
    try {
      await updateDoc(doc(db, 'sessions', sessionId), {
        partnerId,
        status: 'active',
        startTime: new Date()
      });
    } catch (error) {
      set({ error: 'Failed to join session' });
    } finally {
      set({ loading: false });
    }
  },

  endSession: async (sessionId) => {
    set({ loading: true, error: null });
    try {
      await updateDoc(doc(db, 'sessions', sessionId), {
        status: 'completed',
        endTime: new Date()
      });
      set({ currentSession: null });
    } catch (error) {
      set({ error: 'Failed to end session' });
    } finally {
      set({ loading: false });
    }
  },

  fetchUserSessions: (userId) => {
    const q = query(
      collection(db, 'sessions'),
      where('hostId', '==', userId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const sessions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Session[];
      set({ sessions });
    });

    return unsubscribe;
  }
}));

export default useSessionStore;