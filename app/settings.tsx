import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSettingsStore, DistanceUnit, Language } from "../stores/settingsStore";
import { useTranslation } from "../i18n";
import { Colors, Spacing, FontSize, BorderRadius } from "../constants/theme";

const LANGUAGES: { value: Language; label: string }[] = [
  { value: "es", label: "Español" },
  { value: "en", label: "English" },
  { value: "pt", label: "Português" },
];

export default function SettingsScreen() {
  const router = useRouter();
  const { distanceUnit, setDistanceUnit, language, setLanguage } = useSettingsStore();
  const t = useTranslation();

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: t.settings_title,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color={Colors.textLight} />
            </TouchableOpacity>
          ),
        }}
      />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t.settings_language}</Text>
        <View style={styles.optionsCard}>
          {LANGUAGES.map((lang, index) => (
            <OptionRow
              key={lang.value}
              label={lang.label}
              selected={language === lang.value}
              onPress={() => setLanguage(lang.value)}
              last={index === LANGUAGES.length - 1}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t.settings_distance_unit}</Text>
        <View style={styles.optionsCard}>
          <OptionRow
            label={t.settings_km}
            selected={distanceUnit === "km"}
            onPress={() => setDistanceUnit("km")}
          />
          <OptionRow
            label={t.settings_mi}
            selected={distanceUnit === "mi"}
            onPress={() => setDistanceUnit("mi")}
            last
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t.settings_info}</Text>
        <View style={styles.optionsCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t.settings_version}</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function OptionRow({
  label,
  selected,
  onPress,
  last,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  last?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[styles.optionRow, !last && styles.rowBorder]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.optionLabel}>{label}</Text>
      {selected && <Ionicons name="checkmark" size={22} color={Colors.primary} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.xl,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.textSecondary,
    textTransform: "uppercase",
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  optionsCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.md,
  },
  optionLabel: {
    fontSize: FontSize.md,
    color: Colors.text,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.md,
  },
  infoLabel: {
    fontSize: FontSize.md,
    color: Colors.text,
  },
  infoValue: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
});
