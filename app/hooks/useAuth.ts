import { useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase/config';
import { useAppStore, User, UserRole } from '../store/useAppStore';

export const useAuth = () => {
  const { user, setUser, setIsAuthLoading } = useAppStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch or create user document in Firestore
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        let role: UserRole = 'citizen';

        if (userSnap.exists()) {
          role = userSnap.data().role as UserRole;
        } else {
          // Check if there is a pending role from signup
          const pendingRole = useAppStore.getState().pendingRole;
          if (pendingRole) role = pendingRole;

          // Create new user profile
          await setDoc(userRef, {
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            role: role,
            createdAt: new Date().toISOString(),
          });
        }

        const userData: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          role: role,
        };

        // Get ID token and set session cookie
        const idToken = await firebaseUser.getIdToken();
        await fetch('/api/auth/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken, role }),
        });

        setUser(userData);
      } else {
        // Clear session cookie
        await fetch('/api/auth/session', { method: 'DELETE' });
        setUser(null);
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setIsAuthLoading]);

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in with Google', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out', error);
      throw error;
    }
  };

  return { user, signInWithGoogle, signOut };
};
