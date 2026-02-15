import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Station } from "../../types";
import { StatusBadge } from "./StatusBadge";
import { useStationStore } from "../../stores/stationStore";
import { Colors, FontSize, Spacing, BorderRadius } from "../../constants/theme";

function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

interface Props {
  station: Station;
  distance?: number;
  onPress?: () => void;
}

export function StationCard({ station, distance, onPress }: Props) {
  const { favoriteIds, toggleFavorite } = useStationStore();
  const isFavorite = favoriteIds.includes(station.id);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="flash" size={24} color={Colors.primary} />
        </View>
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>{station.name}</Text>
          <Text style={styles.address} numberOfLines={1}>{station.address}</Text>
        </View>
        <TouchableOpacity
          onPress={() => toggleFavorite(station.id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={22}
            color={isFavorite ? Colors.error : Colors.textSecondary}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.footer}>
        <StatusBadge status={station.status} />
        <View style={styles.footerRight}>
          {distance !== undefined && (
            <Text style={styles.distance}>{formatDistance(distance)}</Text>
          )}
          <Text style={styles.power}>{station.power} kW · {station.connectorType}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.xs,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: FontSize.md,
    fontWeight: "600",
    color: Colors.text,
  },
  address: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing.sm,
  },
  footerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  distance: {
    fontSize: FontSize.xs,
    fontWeight: "600",
    color: Colors.primary,
  },
  power: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
});
