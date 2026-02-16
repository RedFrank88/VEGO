import { useMemo } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useStationStore, haversineDistance } from "../../stores/stationStore";
import { useLocation } from "../../hooks/useLocation";
import { StationCard } from "../../components/Station/StationCard";
import { Colors, Spacing, FontSize } from "../../constants/theme";
import { useTranslation } from "../../i18n";

export default function FavoritesScreen() {
  const router = useRouter();
  const location = useLocation();
  const { getFavoriteStations } = useStationStore();

  const t = useTranslation();
  const favorites = getFavoriteStations();

  const favoritesWithDistance = useMemo(() => {
    return favorites
      .map((station) => ({
        station,
        distance: haversineDistance(
          location.latitude,
          location.longitude,
          station.latitude,
          station.longitude
        ),
      }))
      .sort((a, b) => a.distance - b.distance);
  }, [favorites, location.latitude, location.longitude]);

  if (favoritesWithDistance.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Ionicons name="heart-outline" size={64} color={Colors.border} />
          <Text style={styles.emptyTitle}>{t.favorites_empty_title}</Text>
          <Text style={styles.emptySubtitle}>
            {t.favorites_empty_subtitle}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favoritesWithDistance}
        keyExtractor={(item) => item.station.id}
        renderItem={({ item }) => (
          <StationCard
            station={item.station}
            distance={item.distance}
            onPress={() => router.push(`/station/${item.station.id}`)}
          />
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  list: {
    paddingVertical: Spacing.sm,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
  },
  emptyTitle: {
    fontSize: FontSize.lg,
    fontWeight: "600",
    color: Colors.text,
    marginTop: Spacing.md,
  },
  emptySubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: Spacing.sm,
    lineHeight: 20,
  },
});
