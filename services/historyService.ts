import { HistoryItem, AnalysisResult } from '../types';

const STORAGE_KEY = 'vibecheck_history';

export const getHistory = (): HistoryItem[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to load history", e);
    return [];
  }
};

export const saveToHistory = (result: AnalysisResult): HistoryItem[] => {
  try {
    const history = getHistory();
    const newItem: HistoryItem = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
      result
    };
    
    // Prepend new item and limit to 20 to prevent localStorage from getting too full
    // We do NOT save the image base64 here to save space/privacy.
    const updated = [newItem, ...history].slice(0, 20);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error("Failed to save history", e);
    return getHistory();
  }
};

export const deleteHistoryItem = (id: string): HistoryItem[] => {
  try {
    const history = getHistory();
    const updated = history.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error("Failed to delete history item", e);
    return [];
  }
};

export const clearAllHistory = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
