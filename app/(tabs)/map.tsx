import { useRef, useEffect, useCallback, useMemo } from "react";
import { View, StyleSheet, Alert, Keyboard } from "react-native";
import MapView, { Region } from "react-native-maps";
import { useRouter } from "expo-router";
import { useLocation } from "../../hooks/useLocation";
import { useStations } from "../../hooks/useStations";
import { useStationStore, haversineDistance } from "../../stores/stationStore";
import { StationMarker } from "../../components/Map/StationMarker";
import { NearestButton } from "../../components/Map/NearestButton";
import { MyLocationButton } from "../../components/Map/MyLocationButton";
import { SearchBar } from "../../components/Map/SearchBar";
import { FilterChips } from "../../components/Map/FilterChips";
import { StationListPanel } from "../../components/Map/StationListPanel";
import { Station } from "../../types";
import uteStations from "../../data/ute-stations.json";

const URUGUAY_REGION: Region = {
  latitude: -34.9,
  longitude: -56.2,
  latitudeDelta: 0.15,
  longitudeDelta: 0.15,
};

export default function MapScreen() {
  const mapRef = useRef<MapView>(null);
  const hasAnimated = useRef(false);
  const router = useRouter();
  const location = useLocation();
  const firestoreStations = useStations();
  const {
    getNearestStation,
    filterStatus,
    setFilterStatus,
    searchQuery,
    setSearchQuery,
    setStations,
    getFilteredStations,
  } = useStationStore();

  const allStations = useMemo(() => {
    if (firestoreStations.length > 0) return firestoreStations;
    return uteStations as Station[];
  }, [firestoreStations]);

  useEffect(() => {
    setStations(allStations);
  }, [allStations, setStations]);

  // Animate to user location on first GPS fix
  useEffect(() => {
    if (location.hasInitialFix && !hasAnimated.current) {
      hasAnimated.current = true;
      mapRef.current?.animateToRegion(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        1000
      );
    }
  }, [location.hasInitialFix, location.latitude, location.longitude]);

  const filteredStations = getFilteredStations();

  const stationsWithDistance = useMemo(() => {
    return filteredStations
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
  }, [filteredStations, location.latitude, location.longitude]);

  const handleStationPress = useCallback(
    (station: Station) => {
      router.push(`/station/${station.id}`);
    },
    [router]
  );

  const handleNearestPress = useCallback(() => {
    const nearest = getNearestStation(location.latitude, location.longitude);
    if (!nearest) {
      Alert.alert("Info", "No hay cargadores disponibles en este momento");
      return;
    }
    mapRef.current?.animateToRegion(
      {
        latitude: nearest.latitude,
        longitude: nearest.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      },
      800
    );
    router.push(`/station/${nearest.id}`);
  }, [getNearestStation, location, router]);

  const handleMyLocationPress = useCallback(() => {
    mapRef.current?.animateToRegion(
      {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      },
      800
    );
  }, [location.latitude, location.longitude]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={URUGUAY_REGION}
        showsUserLocation
        showsMyLocationButton={false}
        onPress={() => Keyboard.dismiss()}
      >
        {filteredStations.map((station) => (
          <StationMarker
            key={station.id}
            station={station}
            onPress={handleStationPress}
          />
        ))}
      </MapView>

      <View style={styles.overlay}>
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
        <FilterChips activeFilter={filterStatus} onFilterChange={setFilterStatus} />
      </View>

      <MyLocationButton onPress={handleMyLocationPress} />
      <NearestButton onPress={handleNearestPress} />
      <StationListPanel
        stations={stationsWithDistance}
        onStationPress={handleStationPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
});
