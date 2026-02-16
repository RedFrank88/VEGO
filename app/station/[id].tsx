import { useState, useMemo, useRef } from "react";
import { View, Text, TouchableOpacity, TextInput, Modal, StyleSheet, ScrollView, Alert, Linking, Platform } from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import { useStationStore, haversineDistance } from "../../stores/stationStore";
import { useAuthStore } from "../../stores/authStore";
import { useLocation } from "../../hooks/useLocation";
import { updateStationStatus, releaseConnector, reportStationLocation } from "../../services/stations";
import { StatusBadge } from "../../components/Station/StatusBadge";
import { CheckInModal } from "../../components/Station/CheckInModal";
import { Station, StationStatus, Connector } from "../../types";
import { Colors, Spacing, FontSize, BorderRadius } from "../../constants/theme";
import { formatDistance } from "../../utils/formatDistance";
import { useTranslation } from "../../i18n";
import uteStations from "../../data/ute-stations.json";

export default function StationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { stations, favoriteIds, toggleFavorite } = useStationStore();
  const { user } = useAuthStore();
  const location = useLocation();
  const t = useTranslation();
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportText, setReportText] = useState("");
  const notificationIdRef = useRef<string | null>(null);

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
        <Text>{t.station_not_found}</Text>
      </View>
    );
  }

  const userActiveConnector = useMemo(() => {
    if (!user) return null;
    // Buscar en lastCheckin del conector (nuevo formato)
    const fromConnector = station.connectors.find(
      (c) =>
        c.status === "occupied" &&
        c.lastCheckin?.userId === user.uid
    );
    if (fromConnector) return fromConnector;
    // Fallback: buscar via lastCheckin global (datos anteriores al cambio)
    if (
      station.lastCheckin?.userId === user.uid &&
      station.lastCheckin?.status === "occupied" &&
      station.lastCheckin?.connectorId
    ) {
      return station.connectors.find(
        (c) => c.id === station.lastCheckin!.connectorId && c.status === "occupied"
      ) ?? null;
    }
    return null;
  }, [user, station.connectors, station.lastCheckin]);

  const userHasActiveCheckin = !!userActiveConnector;

  const MAX_CHECKIN_DISTANCE_KM = 0.3; // 300 metros
  const isNearStation = distance !== null && distance <= MAX_CHECKIN_DISTANCE_KM;

  const handleCheckIn = async (status: StationStatus, connectorId?: string, duration?: number) => {
    if (!user) {
      Alert.alert(t.error, t.checkin_login_required);
      return;
    }
    if (!isNearStation) {
      Alert.alert(t.checkin_too_far_title, t.checkin_too_far_message);
      return;
    }
    try {
      let updatedConnectors: typeof station.connectors | undefined;
      if (connectorId) {
        updatedConnectors = station.connectors.map((c) =>
          c.id === connectorId ? { ...c, status } : c
        );
      }

      const connectorIdx = connectorId
        ? station.connectors.findIndex((c) => c.id === connectorId) + 1
        : null;

      const checkIn: Record<string, any> = {
        userId: user.uid,
        userName: user.displayName || t.anonymous,
        status,
        timestamp: Date.now(),
      };
      if (connectorId) checkIn.connectorId = connectorId;
      if (connectorIdx) checkIn.connectorLabel = `#${connectorIdx}`;
      if (duration) checkIn.estimatedDuration = duration;

      await updateStationStatus(
        station.id,
        status,
        checkIn as any,
        updatedConnectors
      );
      // Schedule notification when occupying a connector
      if (status === "occupied" && duration) {
        const notifId = await Notifications.scheduleNotificationAsync({
          content: {
            title: t.notification_still_charging,
            body: t.notification_time_up.replace("{station}", station.name),
            sound: true,
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: duration * 60,
          },
        });
        notificationIdRef.current = notifId;
      }

      Alert.alert(t.checkin_success_title, t.checkin_success_message);
    } catch (error: any) {
      Alert.alert(t.error, error.message || t.checkin_failed);
    }
  };

  const handleRelease = async () => {
    if (!userActiveConnector) return;
    try {
      // Cancel scheduled notification
      if (notificationIdRef.current) {
        await Notifications.cancelScheduledNotificationAsync(notificationIdRef.current);
        notificationIdRef.current = null;
      }

      await releaseConnector(
        station.id,
        userActiveConnector.id,
        station.connectors
      );
      Alert.alert(t.release_success_title, t.release_success_message);
    } catch (error: any) {
      Alert.alert(t.error, error.message || t.release_failed);
    }
  };

  const handleReport = async () => {
    if (!user) {
      Alert.alert(t.error, t.report_login_required);
      return;
    }
    if (!reportText.trim()) {
      Alert.alert(t.error, t.report_empty_text);
      return;
    }
    try {
      await reportStationLocation(
        station.id,
        station.name,
        user.uid,
        user.displayName || t.anonymous,
        location.latitude,
        location.longitude,
        reportText.trim()
      );
      setShowReport(false);
      setReportText("");
      Alert.alert(t.report_success_title, t.report_success_message);
    } catch (error: any) {
      Alert.alert(t.error, error.message || t.report_failed);
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
            <Text style={styles.distanceText}>{t.station_distance_from_you.replace("{distance}", formatDistance(distance))}</Text>
          </View>
        )}

        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>{t.station_connectors}</Text>
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
              <DetailRow icon="flash-outline" label={t.station_power} value={`${station.power ?? "—"} kW`} />
              <DetailRow icon="git-branch-outline" label={t.station_connector} value={`${station.connectorCount ?? 1}x ${station.connectorType ?? "—"}`} />
            </>
          )}
          <DetailRow icon="business-outline" label={t.station_operator} value={station.operator} />
        </View>

        {lastCheckin && (
          <View style={styles.detailsCard}>
            <Text style={styles.sectionTitle}>{t.station_last_report}</Text>
            <DetailRow
              icon="person-outline"
              label={t.station_report_by}
              value={lastCheckin.userName}
            />
            <DetailRow
              icon="alert-circle-outline"
              label={t.station_report_status}
              value={
                lastCheckin.status === "available"
                  ? t.station_available
                  : lastCheckin.status === "occupied"
                  ? t.station_occupied
                  : t.station_broken
              }
            />
            {lastCheckin.connectorLabel && (
              <DetailRow
                icon="flash-outline"
                label={t.station_report_connector}
                value={lastCheckin.connectorLabel}
              />
            )}
            <DetailRow
              icon="time-outline"
              label={t.station_report_time}
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
                label={t.station_report_duration}
                value={`${lastCheckin.estimatedDuration} min`}
              />
            )}
          </View>
        )}

        <TouchableOpacity style={styles.directionsButton} onPress={handleDirections}>
          <Ionicons name="navigate" size={20} color={Colors.textLight} />
          <Text style={styles.directionsText}>{t.station_directions}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.reportButton} onPress={() => setShowReport(true)}>
          <Ionicons name="flag-outline" size={18} color={Colors.textSecondary} />
          <Text style={styles.reportButtonText}>{t.station_report_location}</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.bottomBar}>
        {userHasActiveCheckin ? (
          <TouchableOpacity
            style={styles.releaseButton}
            onPress={handleRelease}
          >
            <Ionicons name="log-out-outline" size={20} color={Colors.textLight} />
            <Text style={styles.checkInText}>{t.station_release_connector} {userActiveConnector?.lastCheckin?.connectorLabel ?? station.lastCheckin?.connectorLabel}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.checkInButton, !isNearStation && styles.checkInButtonDisabled]}
            onPress={() => isNearStation ? setShowCheckIn(true) : Alert.alert(
              t.checkin_too_far_title,
              t.checkin_too_far_message
            )}
          >
            <Ionicons name="location" size={20} color={Colors.textLight} />
            <Text style={styles.checkInText}>
              {isNearStation ? t.station_checkin : t.station_checkin_approach}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <CheckInModal
        visible={showCheckIn}
        station={station}
        onClose={() => setShowCheckIn(false)}
        onCheckIn={handleCheckIn}
      />

      <Modal visible={showReport} transparent animationType="slide">
        <View style={styles.reportOverlay}>
          <View style={styles.reportContent}>
            <View style={styles.reportHeader}>
              <Text style={styles.reportTitle}>{t.report_title}</Text>
              <TouchableOpacity onPress={() => { setShowReport(false); setReportText(""); }}>
                <Ionicons name="close" size={24} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <Text style={styles.reportSubtitle}>
              {t.report_subtitle}
            </Text>
            <TextInput
              style={styles.reportInput}
              placeholder={t.report_placeholder}
              placeholderTextColor={Colors.textSecondary}
              multiline
              numberOfLines={4}
              value={reportText}
              onChangeText={setReportText}
              textAlignVertical="top"
            />
            <Text style={styles.reportHint}>
              {t.report_hint}
            </Text>
            <TouchableOpacity
              style={[styles.reportSubmit, !reportText.trim() && styles.reportSubmitDisabled]}
              onPress={handleReport}
              disabled={!reportText.trim()}
            >
              <Text style={styles.reportSubmitText}>{t.report_submit}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  checkInButtonDisabled: {
    backgroundColor: Colors.textSecondary,
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
  reportButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs,
    marginTop: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  reportButtonText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textDecorationLine: "underline",
  },
  reportOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  reportContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  reportHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  reportTitle: {
    fontSize: FontSize.xl,
    fontWeight: "700",
    color: Colors.text,
  },
  reportSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  reportInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.text,
    minHeight: 100,
    marginBottom: Spacing.sm,
  },
  reportHint: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  reportSubmit: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
  },
  reportSubmitDisabled: {
    backgroundColor: Colors.border,
  },
  reportSubmitText: {
    fontSize: FontSize.lg,
    fontWeight: "700",
    color: Colors.textLight,
  },
});
