import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSettingsStore, DistanceUnit, Language } from "../stores/settingsStore";
import { useTranslation } from "../i18n";
import { Colors, Spacing, FontSize, BorderRadius } from "../constants/theme";
import { CAR_COLORS, ANIMAL_EMOJIS, DEFAULT_AVATAR_ID } from "../constants/avatars";
import { deleteAccount } from "../services/auth";

const LANGUAGES: { value: Language; label: string }[] = [
  { value: "es", label: "Español" },
  { value: "en", label: "English" },
  { value: "pt", label: "Português" },
];

export default function SettingsScreen() {
  const router = useRouter();
  const { distanceUnit, setDistanceUnit, language, setLanguage, avatarId, setAvatarId } =
    useSettingsStore();
  const t = useTranslation();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [deleting, setDeleting] = useState(false);

  const handleDeleteAccount = () => {
    Alert.alert(t.settings_delete_confirm_title, t.settings_delete_confirm_message, [
      { text: t.cancel, style: "cancel" },
      {
        text: t.settings_delete_account,
        style: "destructive",
        onPress: () => setShowPasswordModal(true),
      },
    ]);
  };

  const handleConfirmDelete = async () => {
    if (!password.trim()) return;
    setDeleting(true);
    try {
      await deleteAccount(password);
      setShowPasswordModal(false);
      setPassword("");
    } catch {
      Alert.alert(t.error, t.settings_delete_failed);
    } finally {
      setDeleting(false);
    }
  };

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

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Language */}
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

        {/* Distance unit */}
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

        {/* Avatar */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.settings_map_avatar}</Text>
          <View style={styles.optionsCard}>
            {/* Default option */}
            <TouchableOpacity
              style={[styles.optionRow, styles.rowBorder]}
              onPress={() => setAvatarId(DEFAULT_AVATAR_ID)}
              activeOpacity={0.7}
            >
              <View style={styles.avatarOptionRow}>
                <View style={styles.blueDot} />
                <Text style={styles.optionLabel}>{t.settings_avatar_default}</Text>
              </View>
              {avatarId === DEFAULT_AVATAR_ID && (
                <Ionicons name="checkmark" size={22} color={Colors.primary} />
              )}
            </TouchableOpacity>

            {/* Cars */}
            <View style={[styles.avatarSection, styles.rowBorder]}>
              <Text style={styles.avatarGroupLabel}>{t.settings_avatar_cars}</Text>
              <View style={styles.avatarGrid}>
                {CAR_COLORS.map((car) => (
                  <TouchableOpacity
                    key={car.id}
                    style={[
                      styles.avatarCircle,
                      { backgroundColor: car.color },
                      avatarId === car.id && styles.avatarSelected,
                    ]}
                    onPress={() => setAvatarId(car.id)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="car" size={18} color="#fff" />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Animals */}
            <View style={styles.avatarSection}>
              <Text style={styles.avatarGroupLabel}>{t.settings_avatar_animals}</Text>
              <View style={styles.avatarGrid}>
                {ANIMAL_EMOJIS.map((animal) => (
                  <TouchableOpacity
                    key={animal.id}
                    style={[
                      styles.avatarCircle,
                      styles.animalCircle,
                      avatarId === animal.id && styles.avatarSelected,
                    ]}
                    onPress={() => setAvatarId(animal.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.avatarEmoji}>{animal.emoji}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.settings_info}</Text>
          <View style={styles.optionsCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t.settings_version}</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
          </View>
        </View>

        {/* Delete account */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
            <Ionicons name="trash-outline" size={20} color="#fff" />
            <Text style={styles.deleteButtonText}>{t.settings_delete_account}</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: Spacing.xl }} />
      </ScrollView>

      {/* Password modal */}
      <Modal visible={showPasswordModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t.settings_delete_enter_password}</Text>
            <TextInput
              style={styles.modalInput}
              placeholder={t.settings_delete_password_placeholder}
              placeholderTextColor={Colors.textSecondary}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => {
                  setShowPasswordModal(false);
                  setPassword("");
                }}
              >
                <Text style={styles.modalCancelText}>{t.cancel}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalDelete, deleting && styles.modalDeleteDisabled]}
                onPress={handleConfirmDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.modalDeleteText}>{t.settings_delete_button}</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  // Avatar styles
  avatarOptionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  blueDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#4285F4",
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#4285F4",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  avatarSection: {
    padding: Spacing.md,
  },
  avatarGroupLabel: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  avatarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  avatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "transparent",
  },
  animalCircle: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 2,
  },
  avatarSelected: {
    borderColor: Colors.primary,
    borderWidth: 3,
  },
  avatarEmoji: {
    fontSize: 22,
  },
  // Delete account styles
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F44336",
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: 8,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: FontSize.md,
    fontWeight: "600",
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    width: "100%",
    maxWidth: 340,
  },
  modalTitle: {
    fontSize: FontSize.md,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: Spacing.md,
    textAlign: "center",
  },
  modalInput: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.text,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalCancel: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background,
    alignItems: "center",
  },
  modalCancelText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    fontWeight: "600",
  },
  modalDelete: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: "#F44336",
    alignItems: "center",
  },
  modalDeleteDisabled: {
    opacity: 0.6,
  },
  modalDeleteText: {
    fontSize: FontSize.md,
    color: "#fff",
    fontWeight: "600",
  },
});
