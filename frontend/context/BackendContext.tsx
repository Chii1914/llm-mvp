'use client';

import React, { createContext, useContext, useState } from 'react';

export type DatabaseType = 'nosql' | 'mysql' | null;

interface BackendContextType {
  selectedDB: DatabaseType;
  setSelectedDB: (db: DatabaseType) => void;
}

const BackendContext = createContext<BackendContextType | undefined>(undefined);

export function BackendProvider({ children }: { children: React.ReactNode }) {
  const [selectedDB, setSelectedDB] = useState<DatabaseType>(null);

  return (
    <BackendContext.Provider value={{ selectedDB, setSelectedDB }}>
      {children}
    </BackendContext.Provider>
  );
}

export function useBackend() {
  const context = useContext(BackendContext);
  if (!context) {
    throw new Error('useBackend must be used within BackendProvider');
  }
  return context;
}
