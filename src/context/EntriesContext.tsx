import { ReactNode, createContext, useContext, useState } from 'react';
import { SleepEntry } from '../types';

type EntriesContextValue = {
  entries: SleepEntry[];
  addEntry: (entry: SleepEntry) => void;
};

const EntriesContext = createContext<EntriesContextValue | null>(null);

export function EntriesProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<SleepEntry[]>([]);

  const addEntry = (entry: SleepEntry) => {
    setEntries((prev) => [...prev, entry].sort((a, b) => b.start.getTime() - a.start.getTime()));
  };

  return <EntriesContext.Provider value={{ entries, addEntry }}>{children}</EntriesContext.Provider>;
}

export function useEntries() {
  const value = useContext(EntriesContext);
  if (!value) throw new Error('useEntries must be used inside EntriesProvider');
  return value;
}
