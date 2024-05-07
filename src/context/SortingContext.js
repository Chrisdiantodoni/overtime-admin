import React, { createContext, useContext, useState } from 'react';

const SortingContext = createContext();

export const SortingProvider = ({ children }) => {
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  return (
    <SortingContext.Provider value={{ sortBy, sortOrder, setSortBy, setSortOrder }}>{children}</SortingContext.Provider>
  );
};

export const useSorting = () => {
  return useContext(SortingContext);
};
