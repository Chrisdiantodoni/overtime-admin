import React, { createContext, useContext, useState } from 'react';

const titleContext = createContext();

export function ContextProvider({ children }) {
  const [title, setTitle] = useState('Staff');

  const updatedTitle = (newTitle) => {
    setTitle(newTitle);
  };
  return <titleContext.Provider value={{ title, updatedTitle }}>{children}</titleContext.Provider>;
}

export function useMyContext() {
  return useContext(titleContext);
}
