import { useState, useEffect } from "react";
import * as Location from "expo-location";
import { t } from "../i18n";

interface LocationState {
  latitude: number;
  longitude: number;
  heading: number | null;
  loading: boolean;
  error: string | null;
  hasInitialFix: boolean;
}

export function useLocation() {
  const [location, setLocation] = useState<LocationState>({
    latitude: -34.9,
    longitude: -56.2,
    heading: null,
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
          error: t().location_permission_denied,
          hasInitialFix: false,
        }));
        return;
      }

      const current = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
        heading: current.coords.heading ?? null,
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
            heading: loc.coords.heading ?? prev.heading,
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
