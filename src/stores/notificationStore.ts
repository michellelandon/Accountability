import { create } from 'zustand';
import { db } from '../firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot,
  serverTimestamp,
  updateDoc,
  doc 
} from 'firebase/firestore';

interface Notification {
  id: string;
  userId: string;
  type: 'session_request' | 'session_accepted' | 'session_started' | 'session_ended';
  message: string;
  read: boolean;
  createdAt: Date;
}

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  addNotification: (notification: Partial<Notification>) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  fetchUserNotifications: (userId: string) => void;
}

const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,

  addNotification: async (notification) => {
    set({ loading: true, error: null });
    try {
      await addDoc(collection(db, 'notifications'), {
        ...notification,
        read: false,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      set({ error: 'Failed to create notification' });
    } finally {
      set({ loading: false });
    }
  },

  markAsRead: async (notificationId) => {
    try {
      await updateDoc(doc(db, 'notifications', notificationId), {
        read: true
      });
    } catch (error) {
      set({ error: 'Failed to mark notification as read' });
    }
  },

  markAllAsRead: async () => {
    const { notifications } = get();
    try {
      await Promise.all(
        notifications
          .filter(n => !n.read)
          .map(n => updateDoc(doc(db, 'notifications', n.id), { read: true }))
      );
    } catch (error) {
      set({ error: 'Failed to mark all notifications as read' });
    }
  },

  fetchUserNotifications: (userId) => {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Notification[];
      
      set({ 
        notifications,
        unreadCount: notifications.filter(n => !n.read).length
      });
    });

    return unsubscribe;
  }
}));

export default useNotificationStore;