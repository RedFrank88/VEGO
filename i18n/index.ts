import { useSettingsStore } from "../stores/settingsStore";
import { translations, Translations } from "./translations";

export function useTranslation(): Translations {
  const language = useSettingsStore((s) => s.language);
  return translations[language];
}

/** For use outside React components (callbacks, services, etc.) */
export function t(): Translations {
  const language = useSettingsStore.getState().language;
  return translations[language];
}
