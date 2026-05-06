import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  auth, 
  db, 
  googleProvider, 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  User
} from '../lib/firebase';
import { doc, getDoc, getDocFromServer } from 'firebase/firestore';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        try {
          const adminEmail = 'midusab@gmail.com';
          const isPrimaryAdmin = user.email === adminEmail;
          
          console.log('Auth State Changed - User:', user.email);
          console.log('Is Primary Admin:', isPrimaryAdmin);

          // Try to check Firestore, but don't let it block if it fails
          let isSecondaryAdmin = false;
          try {
            const adminDoc = await getDocFromServer(doc(db, 'admins', user.uid));
            isSecondaryAdmin = adminDoc.exists();
          } catch (e) {
            console.warn('Firestore admin check skipped or failed:', e);
          }

          const finalAdminStatus = isPrimaryAdmin || isSecondaryAdmin;
          console.log('Final Admin Status:', finalAdminStatus);
          setIsAdmin(finalAdminStatus);
        } catch (error) {
          console.error('Error in admin verification:', error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success('AUTHENTICATED', { description: 'Welcome to the collective.' });
    } catch (error: any) {
      toast.error('AUTH FAILED', { description: error.message });
      throw error;
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      toast.success('ACCESS GRANTED');
    } catch (error: any) {
      toast.error('AUTH FAILED', { description: error.message });
      throw error;
    }
  };

  const registerWithEmail = async (email: string, pass: string, name: string) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(user, { displayName: name });
      toast.success('ACCOUNT CREATED', { description: 'Welcome to Finall 11.' });
    } catch (error: any) {
      toast.error('REGISTRATION FAILED', { description: error.message });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success('TERMINAL EXIT', { description: 'You have been logged out.' });
    } catch (error: any) {
      toast.error('LOGOUT FAILED');
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('KEY RESET SENT', { description: 'Check your email for reset instructions.' });
    } catch (error: any) {
      toast.error('RESET FAILED', { description: error.message });
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAdmin, 
      loading, 
      loginWithGoogle, 
      logout, 
      loginWithEmail, 
      registerWithEmail, 
      resetPassword 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
