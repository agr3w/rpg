import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "APIs/firebaseConfig";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      setUser(u ?? null);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const refreshUser = async () => {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      const currentUser = auth.currentUser;
      const updatedUser = currentUser
        ? Object.assign(Object.create(Object.getPrototypeOf(currentUser)), currentUser)
        : null;
      setUser(updatedUser);
      return updatedUser;
    }
    return null;
  };

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};