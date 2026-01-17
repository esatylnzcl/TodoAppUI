import { create } from "zustand";

interface ThemeState {
  isDarkMode: boolean;
}

// Theme store - Always light mode
export const useThemeStore = create<ThemeState>()(() => ({
  isDarkMode: false, // Always light mode
}));

// Ensure light mode on load
if (typeof window !== "undefined") {
  document.documentElement.classList.remove("dark");
}
