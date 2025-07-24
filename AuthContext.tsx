import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  AuthError,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import {
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    email: string,
    password: string,
    displayName?: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (displayName: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const signup = async (
    email: string,
    password: string,
    displayName?: string,
  ) => {
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      if (displayName && user) {
        await updateProfile(user, { displayName });
      }

      // Create user document in Firestore for tracking
      if (user) {
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          displayName: displayName || user.displayName || "",
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          subscriptionStatus: "trial",
          plan: "individual",
          trialStarted: serverTimestamp(),
          totalSOAPGenerated: 0,
          lastActivity: serverTimestamp(),
        });
      }
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(getAuthErrorMessage(authError.code));
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      // Update last login time
      if (user) {
        try {
          await updateDoc(doc(db, "users", user.uid), {
            lastLogin: serverTimestamp(),
            lastActivity: serverTimestamp(),
          });
        } catch (firestoreError) {
          // If user document doesn't exist, create it
          await setDoc(doc(db, "users", user.uid), {
            email: user.email,
            displayName: user.displayName || "",
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp(),
            subscriptionStatus: "trial",
            plan: "individual",
            totalSOAPGenerated: 0,
            lastActivity: serverTimestamp(),
          });
        }
      }
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(getAuthErrorMessage(authError.code));
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(getAuthErrorMessage(authError.code));
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(getAuthErrorMessage(authError.code));
    }
  };

  const updateUserProfile = async (displayName: string) => {
    if (currentUser) {
      try {
        await updateProfile(currentUser, { displayName });
      } catch (error) {
        const authError = error as AuthError;
        throw new Error(getAuthErrorMessage(authError.code));
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    loading,
    signup,
    login,
    logout,
    resetPassword,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Helper function to convert Firebase error codes to user-friendly messages
function getAuthErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case "auth/user-not-found":
      return "No account found with this email address.";
    case "auth/wrong-password":
      return "Incorrect password. Please try again.";
    case "auth/email-already-in-use":
      return "An account with this email address already exists.";
    case "auth/weak-password":
      return "Password should be at least 6 characters long.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/user-disabled":
      return "This account has been disabled. Please contact support.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later.";
    case "auth/operation-not-allowed":
      return "This sign-in method is not enabled. Please contact support.";
    default:
      return "An error occurred during authentication. Please try again.";
  }
}
