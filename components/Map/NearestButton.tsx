import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Spacing, BorderRadius, FontSize } from "../../constants/theme";
import { useTranslation } from "../../i18n";

interface Props {
  onPress: () => void;
}

export function NearestButton({ onPress }: Props) {
  const t = useTranslation();
  return (
    <TouchableOpacity style={styles.fab} onPress={onPress} activeOpacity={0.8}>
      <Ionicons name="navigate" size={20} color={Colors.textLight} />
      <Text style={styles.label}>{t.map_nearest}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 195,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  label: {
    color: Colors.textLight,
    fontSize: FontSize.sm,
    fontWeight: "700",
  },
});
