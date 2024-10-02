import React, { createContext, useState } from 'react';

// Create UserContext
export const UserContext = createContext();

// Provider component that will wrap the app and provide access to the user data
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    institutecode: '',
    email: '',
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
