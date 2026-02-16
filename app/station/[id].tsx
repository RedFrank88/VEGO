import { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Linking, Platform } from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useStationStore, haversineDistance } from "../../stores/stationStore";
import { useAuthStore } from "../../stores/authStore";
import { useLocation } from "../../hooks/useLocation";
import { updateStationStatus, releaseConnector } from "../../services/stations";
import { StatusBadge } from "../../components/Station/StatusBadge";
import { CheckInModal } from "../../components/Station/CheckInModal";
import { Station, StationStatus, Connector } from "../../types";
import { Colors, Spacing, FontSize, BorderRadius } from "../../constants/theme";
import uteStations from "../../data/ute-stations.json";

function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

export default function StationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { stations, favoriteIds, toggleFavorite } = useStationStore();
  const { user } = useAuthStore();
  const location = useLocation();
  const [showCheckIn, setShowCheckIn] = useState(false);

  const station = useMemo(() => {
    const found = stations.find((s) => s.id === id);
    if (found) return found;
    return (uteStations as Station[]).find((s) => s.id === id) ?? null;
  }, [stations, id]);

  const isFavorite = id ? favoriteIds.includes(id) : false;

  const distance = useMemo(() => {
    if (!station) return null;
    return haversineDistance(
      location.latitude,
      location.longitude,
      station.latitude,
      station.longitude
    );
  }, [station, location.latitude, location.longitude]);

  if (!station) {
    return (
      <View style={styles.center}>
        <Text>Estación no encontrada</Text>
      </View>
    );
  }

  const userHasActiveCheckin = useMemo(() => {
    if (!user || !station.lastCheckin) return false;
    return (
      station.lastCheckin.userId === user.uid &&
      station.lastCheckin.status === "occupied" &&
      station.lastCheckin.connectorId
    );
  }, [user, station.lastCheckin]);

  const handleCheckIn = async (status: StationStatus, connectorId?: string, duration?: number) => {
    if (!user) {
      Alert.alert("Error", "Necesitás iniciar sesión para hacer check-in");
      return;
    }
    try {
      let updatedConnectors = station.connectors;
      if (status === "occupied" && connectorId) {
        updatedConnectors = station.connectors.map((c) =>
          c.id === connectorId ? { ...c, status: "occupied" as StationStatus } : c
        );
      }
      const connectorIdx = connectorId
        ? station.connectors.findIndex((c) => c.id === connectorId) + 1
        : undefined;

      await updateStationStatus(
        station.id,
        status,
        {
          userId: user.uid,
          userName: user.displayName || "Anónimo",
          status,
          connectorId,
          connectorLabel: connectorIdx ? `#${connectorIdx}` : undefined,
          timestamp: Date.now(),
          estimatedDuration: duration,
        },
        updatedConnectors
      );
      Alert.alert("Check-in exitoso", "Gracias por reportar el estado del cargador");
    } catch (error: any) {
      Alert.alert("Error", error.message || "No se pudo realizar el check-in");
    }
  };

  const handleRelease = async () => {
    if (!station.lastCheckin?.connectorId) return;
    try {
      await releaseConnector(
        station.id,
        station.lastCheckin.connectorId,
        station.connectors
      );
      Alert.alert("Conector liberado", "El conector fue marcado como disponible");
    } catch (error: any) {
      Alert.alert("Error", error.message || "No se pudo liberar el conector");
    }
  };

  const handleDirections = () => {
    const scheme = Platform.select({
      ios: `maps:0,0?q=${station.latitude},${station.longitude}`,
      android: `geo:0,0?q=${station.latitude},${station.longitude}(${encodeURIComponent(station.name)})`,
    });
    if (scheme) Linking.openURL(scheme);
  };

  const lastCheckin = station.lastCheckin;
  const timeSinceCheckin = lastCheckin
    ? Math.round((Date.now() - lastCheckin.timestamp) / 60000)
    : null;

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: station.name,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color={Colors.textLight} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => id && toggleFavorite(id)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={24}
                color={isFavorite ? Colors.error : Colors.textLight}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.headerSection}>
          <View style={styles.iconCircle}>
            <Ionicons name="flash" size={32} color={Colors.primary} />
          </View>
          <Text style={styles.name}>{station.name}</Text>
          <Text style={styles.address}>{station.address}</Text>
          <StatusBadge status={station.status} />
        </View>

        {distance !== null && (
          <View style={styles.distanceRow}>
            <Ionicons name="navigate-outline" size={18} color={Colors.primary} />
            <Text style={styles.distanceText}>A {formatDistance(distance)} de tu ubicación</Text>
          </View>
        )}

        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Conectores</Text>
          {station.connectors && station.connectors.length > 0 ? (
            station.connectors.map((connector: Connector, index: number) => (
              <View key={connector.id} style={styles.connectorRow}>
                <View style={styles.connectorInfo}>
                  <Text style={styles.connectorNumber}>#{index + 1}</Text>
                  <Text style={styles.connectorType}>{connector.type}</Text>
                  <Text style={styles.connectorPower}>{connector.power} kW</Text>
                </View>
                <StatusBadge status={connector.status} />
              </View>
            ))
          ) : (
            <>
              <DetailRow icon="flash-outline" label="Potencia" value={`${station.power ?? "—"} kW`} />
              <DetailRow icon="git-branch-outline" label="Conector" value={`${station.connectorCount ?? 1}x ${station.connectorType ?? "—"}`} />
            </>
          )}
          <DetailRow icon="business-outline" label="Operador" value={station.operator} />
        </View>

        {lastCheckin && (
          <View style={styles.detailsCard}>
            <Text style={styles.sectionTitle}>Último reporte</Text>
            <DetailRow
              icon="person-outline"
              label="Por"
              value={lastCheckin.userName}
            />
            {lastCheckin.connectorLabel && (
              <DetailRow
                icon="flash-outline"
                label="Conector"
                value={lastCheckin.connectorLabel}
              />
            )}
            <DetailRow
              icon="time-outline"
              label="Hace"
              value={
                timeSinceCheckin !== null
                  ? timeSinceCheckin < 60
                    ? `${timeSinceCheckin} min`
                    : `${Math.round(timeSinceCheckin / 60)} h`
                  : "—"
              }
            />
            {lastCheckin.estimatedDuration && (
              <DetailRow
                icon="hourglass-outline"
                label="Duración est."
                value={`${lastCheckin.estimatedDuration} min`}
              />
            )}
          </View>
        )}

        <TouchableOpacity style={styles.directionsButton} onPress={handleDirections}>
          <Ionicons name="navigate" size={20} color={Colors.textLight} />
          <Text style={styles.directionsText}>Cómo llegar</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.bottomBar}>
        {userHasActiveCheckin ? (
          <TouchableOpacity
            style={styles.releaseButton}
            onPress={handleRelease}
          >
            <Ionicons name="log-out-outline" size={20} color={Colors.textLight} />
            <Text style={styles.checkInText}>Liberar conector {station.lastCheckin?.connectorLabel}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.checkInButton}
            onPress={() => setShowCheckIn(true)}
          >
            <Ionicons name="location" size={20} color={Colors.textLight} />
            <Text style={styles.checkInText}>Hacer Check-in</Text>
          </TouchableOpacity>
        )}
      </View>

      <CheckInModal
        visible={showCheckIn}
        station={station}
        onClose={() => setShowCheckIn(false)}
        onCheckIn={handleCheckIn}
      />
    </View>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.detailRow}>
      <View style={styles.detailLeft}>
        <Ionicons name={icon as any} size={18} color={Colors.textSecondary} />
        <Text style={styles.detailLabel}>{label}</Text>
      </View>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scroll: {
    padding: Spacing.xl,
    paddingBottom: 100,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  name: {
    fontSize: FontSize.xl,
    fontWeight: "700",
    color: Colors.text,
    textAlign: "center",
  },
  address: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  distanceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs,
    marginBottom: Spacing.lg,
    backgroundColor: "#E8F5E9",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignSelf: "center",
  },
  distanceText: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.primaryDark,
  },
  detailsCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  connectorRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  connectorInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  connectorNumber: {
    fontSize: FontSize.sm,
    fontWeight: "700",
    color: Colors.textSecondary,
    width: 24,
  },
  connectorType: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.text,
  },
  connectorPower: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  detailLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  detailLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  detailValue: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.text,
  },
  directionsButton: {
    backgroundColor: Colors.primaryDark,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  directionsText: {
    fontSize: FontSize.md,
    fontWeight: "700",
    color: Colors.textLight,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  checkInButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.sm,
  },
  checkInText: {
    fontSize: FontSize.lg,
    fontWeight: "700",
    color: Colors.textLight,
  },
  releaseButton: {
    backgroundColor: Colors.warning,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.sm,
  },
});
