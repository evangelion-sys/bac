import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import localforage from 'localforage';

localforage.config({
  name: "SerineBACGuide",
  storeName: "bac_data"
});

const storage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await localforage.getItem(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await localforage.setItem(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await localforage.removeItem(name);
  },
};

export interface Mistake {
  id: string;
  subject: string;
  topic: string;
  description: string;
  solution: string;
  date: number;
}

export interface AppSettings {
  theme: 'light' | 'midnight';
  fontSize: number;
  highLegibility: boolean;
  lastBackupDate: number;
  lowBatteryMode: boolean;
}

export interface AppState {
  progress: Record<string, number>;
  mistakes: Mistake[];
  settings: AppSettings;
  addMistake: (mistake: Omit<Mistake, 'id' | 'date'>) => void;
  removeMistake: (id: string) => void;
  updateProgress: (subjectId: string, value: number) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  restoreData: (data: Partial<AppState>) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      progress: {},
      mistakes: [],
      settings: {
        theme: 'light',
        fontSize: 16,
        highLegibility: false,
        lastBackupDate: 0,
        lowBatteryMode: false,
      },
      addMistake: (mistake) => set((state) => ({
        mistakes: [
          ...state.mistakes,
          { ...mistake, id: crypto.randomUUID(), date: Date.now() }
        ]
      })),
      removeMistake: (id) => set((state) => ({
        mistakes: state.mistakes.filter(m => m.id !== id)
      })),
      updateProgress: (subjectId, value) => set((state) => ({
        progress: { ...state.progress, [subjectId]: value }
      })),
      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      })),
      restoreData: (data) => set((state) => ({
        ...state,
        ...data,
      })),
    }),
    {
      name: 'serine-bac-storage',
      storage: createJSONStorage(() => storage),
    }
  )
);

