import { useState, useMemo } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StationStatus, Station, Connector } from "../../types";
import { Colors, Spacing, FontSize, BorderRadius } from "../../constants/theme";
import { useTranslation } from "../../i18n";

const DURATIONS = [15, 30, 60, 120];

interface Props {
  visible: boolean;
  station: Station;
  onClose: () => void;
  onCheckIn: (status: StationStatus, connectorId?: string, duration?: number) => void;
}

export function CheckInModal({ visible, station, onClose, onCheckIn }: Props) {
  const t = useTranslation();
  const [selectedStatus, setSelectedStatus] = useState<StationStatus>("available");
  const [selectedDuration, setSelectedDuration] = useState<number>(30);
  const [selectedConnector, setSelectedConnector] = useState<string | null>(null);

  const STATUS_OPTIONS: { value: StationStatus; label: string; icon: string }[] = [
    { value: "available", label: t.station_available, icon: "checkmark-circle" },
    { value: "occupied", label: t.checkin_occupied_label, icon: "time" },
    { value: "broken", label: t.station_broken, icon: "warning" },
  ];

  const selectableConnectors = useMemo(() => {
    if (!station.connectors) return [];
    if (selectedStatus === "available") {
      return station.connectors.filter((c) => c.status !== "available");
    }
    if (selectedStatus === "occupied") {
      return station.connectors.filter((c) => c.status === "available");
    }
    if (selectedStatus === "broken") {
      return station.connectors.filter((c) => c.status !== "broken");
    }
    return [];
  }, [station.connectors, selectedStatus]);

  const needsConnector = selectableConnectors.length > 0;

  const handleConfirm = () => {
    if (needsConnector && !selectedConnector) {
      return;
    }
    onCheckIn(
      selectedStatus,
      selectedConnector ?? undefined,
      selectedStatus === "occupied" ? selectedDuration : undefined
    );
    setSelectedConnector(null);
    setSelectedStatus("available");
    onClose();
  };

  const handleClose = () => {
    setSelectedConnector(null);
    setSelectedStatus("available");
    onClose();
  };

  const connectorIndex = (connectorId: string) => {
    const idx = station.connectors?.findIndex((c) => c.id === connectorId) ?? -1;
    return idx + 1;
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{t.checkin_title}</Text>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="close" size={24} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.stationName}>{station.name}</Text>

          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionTitle}>{t.checkin_charger_status}</Text>
            {STATUS_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.option,
                  selectedStatus === option.value && styles.optionSelected,
                ]}
                onPress={() => {
                  setSelectedStatus(option.value);
                  setSelectedConnector(null);
                }}
              >
                <Ionicons
                  name={option.icon as any}
                  size={20}
                  color={
                    selectedStatus === option.value
                      ? Colors.primary
                      : Colors.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.optionText,
                    selectedStatus === option.value && styles.optionTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}

            {needsConnector && (
              <>
                <Text style={styles.sectionTitle}>
                  {selectedStatus === "available"
                    ? t.checkin_connector_available
                    : selectedStatus === "occupied"
                    ? t.checkin_connector_occupied
                    : t.checkin_connector_broken}
                </Text>
                {selectableConnectors.length > 0 ? (
                  selectableConnectors.map((connector) => (
                    <TouchableOpacity
                      key={connector.id}
                      style={[
                        styles.connectorOption,
                        selectedConnector === connector.id && styles.connectorSelected,
                      ]}
                      onPress={() => setSelectedConnector(connector.id)}
                    >
                      <View style={styles.connectorInfo}>
                        <Text
                          style={[
                            styles.connectorNumber,
                            selectedConnector === connector.id && styles.connectorTextSelected,
                          ]}
                        >
                          #{connectorIndex(connector.id)}
                        </Text>
                        <Text
                          style={[
                            styles.connectorType,
                            selectedConnector === connector.id && styles.connectorTextSelected,
                          ]}
                        >
                          {connector.type}
                        </Text>
                        <Text
                          style={[
                            styles.connectorPower,
                            selectedConnector === connector.id && styles.connectorTextSelected,
                          ]}
                        >
                          {connector.power} kW
                        </Text>
                      </View>
                      <Ionicons
                        name={selectedConnector === connector.id ? "radio-button-on" : "radio-button-off"}
                        size={20}
                        color={selectedConnector === connector.id ? Colors.primary : Colors.textSecondary}
                      />
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={styles.noConnectors}>
                    {t.checkin_no_connectors}
                  </Text>
                )}

                {selectedStatus === "occupied" && (
                <>
                <Text style={styles.sectionTitle}>{t.checkin_estimated_time}</Text>
                <View style={styles.durationsRow}>
                  {DURATIONS.map((d) => (
                    <TouchableOpacity
                      key={d}
                      style={[
                        styles.durationChip,
                        selectedDuration === d && styles.durationChipSelected,
                      ]}
                      onPress={() => setSelectedDuration(d)}
                    >
                      <Text
                        style={[
                          styles.durationText,
                          selectedDuration === d && styles.durationTextSelected,
                        ]}
                      >
                        {d} min
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                </>
                )}
              </>
            )}
          </ScrollView>

          <TouchableOpacity
            style={[
              styles.confirmButton,
              needsConnector && !selectedConnector && styles.confirmDisabled,
            ]}
            onPress={handleConfirm}
            disabled={needsConnector && !selectedConnector}
          >
            <Text style={styles.confirmText}>{t.checkin_confirm}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  content: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: Spacing.xl,
    paddingBottom: Spacing.xxl,
    maxHeight: "85%",
  },
  scrollArea: {
    flexGrow: 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: "700",
    color: Colors.text,
  },
  stationName: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: Spacing.sm,
    marginTop: Spacing.sm,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.sm + 4,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xs,
    gap: Spacing.sm,
  },
  optionSelected: {
    borderColor: Colors.primary,
    backgroundColor: "#E8F5E9",
  },
  optionText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  optionTextSelected: {
    color: Colors.primary,
    fontWeight: "600",
  },
  connectorOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.sm + 4,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xs,
  },
  connectorSelected: {
    borderColor: Colors.primary,
    backgroundColor: "#E8F5E9",
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
  connectorTextSelected: {
    color: Colors.primary,
  },
  noConnectors: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontStyle: "italic",
    padding: Spacing.sm,
  },
  durationsRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  durationChip: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
  },
  durationChipSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  durationText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: "600",
  },
  durationTextSelected: {
    color: Colors.textLight,
  },
  confirmButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    marginTop: Spacing.lg,
  },
  confirmDisabled: {
    backgroundColor: Colors.border,
  },
  confirmText: {
    fontSize: FontSize.lg,
    fontWeight: "700",
    color: Colors.textLight,
  },
});
