import React, { createContext, useState, useCallback } from "react";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Memoized to prevent unstable references in useUserAuth's useEffect dependency array
  const updateUser = useCallback((userData) => {
    setUser(userData);
  }, []);

  // Memoized to prevent unstable references in useUserAuth's useEffect dependency array
  const clearUser = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <UserContext.Provider value={{ user, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;