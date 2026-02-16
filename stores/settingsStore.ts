import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DEFAULT_AVATAR_ID } from "../constants/avatars";

export type DistanceUnit = "km" | "mi";
export type Language = "es" | "en" | "pt";

interface SettingsState {
  distanceUnit: DistanceUnit;
  language: Language;
  avatarId: string;
  setDistanceUnit: (unit: DistanceUnit) => void;
  setLanguage: (lang: Language) => void;
  setAvatarId: (id: string) => void;
  loadSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  distanceUnit: "km",
  language: "es",
  avatarId: DEFAULT_AVATAR_ID,
  setDistanceUnit: (unit) => {
    set({ distanceUnit: unit });
    AsyncStorage.setItem("settings:distanceUnit", unit);
  },
  setLanguage: (lang) => {
    set({ language: lang });
    AsyncStorage.setItem("settings:language", lang);
  },
  setAvatarId: (id) => {
    set({ avatarId: id });
    AsyncStorage.setItem("settings:avatarId", id);
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
    const avatarId = await AsyncStorage.getItem("settings:avatarId");
    if (avatarId) {
      set({ avatarId });
    }
  },
}));
