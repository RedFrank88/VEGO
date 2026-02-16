import { View, Text, StyleSheet } from "react-native";
import { StationStatus } from "../../types";
import { Colors, FontSize, Spacing, BorderRadius } from "../../constants/theme";
import { useTranslation } from "../../i18n";

interface Props {
  status: StationStatus;
}

export function StatusBadge({ status }: Props) {
  const t = useTranslation();

  const config: Record<StationStatus, { label: string; color: string; bg: string }> = {
    available: { label: t.station_available, color: Colors.statusAvailable, bg: "#E8F5E9" },
    occupied: { label: t.station_occupied, color: Colors.statusOccupied, bg: "#FFF3E0" },
    broken: { label: t.station_broken, color: Colors.statusBroken, bg: "#FFEBEE" },
  };

  const cfg = config[status] ?? config.available;
  const { label, color, bg } = cfg;
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.label, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.sm + 4,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
    alignSelf: "flex-start",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: "600",
  },
});
