import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Colors, Spacing, FontSize, BorderRadius } from "../../constants/theme";

const FILTERS = [
  { label: "Todos", value: null },
  { label: "Disponible", value: "available" },
  { label: "Ocupado", value: "occupied" },
  { label: "Averiado", value: "broken" },
] as const;

interface Props {
  activeFilter: string | null;
  onFilterChange: (status: string | null) => void;
}

export function FilterChips({ activeFilter, onFilterChange }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {FILTERS.map((filter) => {
        const isActive = activeFilter === filter.value;
        return (
          <TouchableOpacity
            key={filter.label}
            style={[styles.chip, isActive && styles.chipActive]}
            onPress={() => onFilterChange(filter.value)}
            activeOpacity={0.7}
          >
            <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: FontSize.sm,
    fontWeight: "500",
    color: Colors.textSecondary,
  },
  chipTextActive: {
    color: Colors.textLight,
  },
});
