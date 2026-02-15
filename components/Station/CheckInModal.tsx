import { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StationStatus, Station } from "../../types";
import { Colors, Spacing, FontSize, BorderRadius } from "../../constants/theme";

const DURATIONS = [15, 30, 60, 120];
const STATUS_OPTIONS: { value: StationStatus; label: string; icon: string }[] = [
  { value: "available", label: "Disponible", icon: "checkmark-circle" },
  { value: "occupied", label: "Ocupado (estoy cargando)", icon: "time" },
  { value: "broken", label: "Fuera de servicio", icon: "warning" },
];

interface Props {
  visible: boolean;
  station: Station;
  onClose: () => void;
  onCheckIn: (status: StationStatus, duration?: number) => void;
}

export function CheckInModal({ visible, station, onClose, onCheckIn }: Props) {
  const [selectedStatus, setSelectedStatus] = useState<StationStatus>("available");
  const [selectedDuration, setSelectedDuration] = useState<number>(30);

  const handleConfirm = () => {
    onCheckIn(
      selectedStatus,
      selectedStatus === "occupied" ? selectedDuration : undefined
    );
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Check-in</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.stationName}>{station.name}</Text>

          <Text style={styles.sectionTitle}>Estado del cargador</Text>
          {STATUS_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.option,
                selectedStatus === option.value && styles.optionSelected,
              ]}
              onPress={() => setSelectedStatus(option.value)}
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

          {selectedStatus === "occupied" && (
            <>
              <Text style={styles.sectionTitle}>Tiempo estimado de carga</Text>
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

          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
            <Text style={styles.confirmText}>Confirmar Check-in</Text>
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
  confirmText: {
    fontSize: FontSize.lg,
    fontWeight: "700",
    color: Colors.textLight,
  },
});
