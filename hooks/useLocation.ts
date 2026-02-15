import { useState, useEffect } from "react";
import * as Location from "expo-location";

interface LocationState {
  latitude: number;
  longitude: number;
  loading: boolean;
  error: string | null;
  hasInitialFix: boolean;
}

export function useLocation() {
  const [location, setLocation] = useState<LocationState>({
    latitude: -34.9,
    longitude: -56.2,
    loading: true,
    error: null,
    hasInitialFix: false,
  });

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocation((prev) => ({
          ...prev,
          loading: false,
          error: "Permiso de ubicación denegado",
          hasInitialFix: false,
        }));
        return;
      }

      const current = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
        loading: false,
        error: null,
        hasInitialFix: true,
      });

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          distanceInterval: 50,
        },
        (loc) => {
          setLocation((prev) => ({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            loading: false,
            error: null,
            hasInitialFix: prev.hasInitialFix,
          }));
        }
      );
    })();

    return () => {
      subscription?.remove();
    };
  }, []);

  return location;
}
