import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, DocumentData } from 'firebase/firestore';

interface FirestoreHookOptions {
  collection: string;
  where?: [string, string, any][];
}

interface FirestoreHookReturn {
  data: DocumentData[];
  loading: boolean;
  error: Error | null;
}

export const useFirestore = ({ collection: collectionName, where: whereConditions }: FirestoreHookOptions): FirestoreHookReturn => {
  const [data, setData] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let unsubscribe: () => void;

    try {
      const collectionRef = collection(db, collectionName);
      let queryRef = query(collectionRef);

      // Add where conditions if they exist
      if (whereConditions) {
        whereConditions.forEach(([field, operator, value]) => {
          queryRef = query(queryRef, where(field, operator, value));
        });
      }

      unsubscribe = onSnapshot(
        queryRef,
        (snapshot) => {
          const documents = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setData(documents);
          setLoading(false);
        },
        (err) => {
          console.error('Firestore error:', err);
          setError(err);
          setLoading(false);
        }
      );
    } catch (err) {
      console.error('Error setting up Firestore listener:', err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      setLoading(false);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [collectionName, JSON.stringify(whereConditions)]);

  return { data, loading, error };
};

export default useFirestore;