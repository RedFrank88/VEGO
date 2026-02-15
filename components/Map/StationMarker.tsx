import { Marker, Callout } from "react-native-maps";
import { View, Text, StyleSheet } from "react-native";
import { Station } from "../../types";
import { Colors, FontSize, Spacing, BorderRadius } from "../../constants/theme";
import { Ionicons } from "@expo/vector-icons";

const statusColors: Record<string, string> = {
  available: Colors.statusAvailable,
  occupied: Colors.statusOccupied,
  broken: Colors.statusBroken,
};

const statusLabels: Record<string, string> = {
  available: "Disponible",
  occupied: "Ocupado",
  broken: "Fuera de servicio",
};

interface Props {
  station: Station;
  onPress: (station: Station) => void;
}

export function StationMarker({ station, onPress }: Props) {
  const color = statusColors[station.status] || Colors.textSecondary;

  return (
    <Marker
      coordinate={{
        latitude: station.latitude,
        longitude: station.longitude,
      }}
      onPress={() => onPress(station)}
    >
      <View style={[styles.marker, { backgroundColor: color }]}>
        <Ionicons name="flash" size={16} color="#fff" />
      </View>
      <Callout tooltip>
        <View style={styles.callout}>
          <Text style={styles.calloutTitle}>{station.name}</Text>
          <Text style={styles.calloutStatus}>
            {statusLabels[station.status]} · {station.power} kW
          </Text>
        </View>
      </Callout>
    </Marker>
  );
}

const styles = StyleSheet.create({
  marker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  callout: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    minWidth: 160,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  calloutTitle: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.text,
  },
  calloutStatus: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
