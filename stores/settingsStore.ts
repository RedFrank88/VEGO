import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type DistanceUnit = "km" | "mi";
export type Language = "es" | "en" | "pt";

interface SettingsState {
  distanceUnit: DistanceUnit;
  language: Language;
  setDistanceUnit: (unit: DistanceUnit) => void;
  setLanguage: (lang: Language) => void;
  loadSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  distanceUnit: "km",
  language: "es",
  setDistanceUnit: (unit) => {
    set({ distanceUnit: unit });
    AsyncStorage.setItem("settings:distanceUnit", unit);
  },
  setLanguage: (lang) => {
    set({ language: lang });
    AsyncStorage.setItem("settings:language", lang);
  },
  loadSettings: async () => {
    const unit = await AsyncStorage.getItem("settings:distanceUnit");
    if (unit === "km" || unit === "mi") {
      set({ distanceUnit: unit });
    }
    const lang = await AsyncStorage.getItem("settings:language");
    if (lang === "es" || lang === "en" || lang === "pt") {
      set({ language: lang });
    }
  },
}));
