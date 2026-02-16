import { useEffect, useRef } from "react";
import { useStationStore } from "../stores/stationStore";
import { releaseConnector } from "../services/stations";

const CHECK_INTERVAL = 60_000; // Check every 60 seconds
const GRACE_MINUTES = 3;

export function useCheckInExpiry() {
  const { stations } = useStationStore();
  const processingRef = useRef(new Set<string>());

  useEffect(() => {
    const checkExpired = () => {
      const now = Date.now();

      for (const station of stations) {
        const checkin = station.lastCheckin;
        if (!checkin) continue;
        if (checkin.status !== "occupied") continue;
        if (!checkin.estimatedDuration) continue;
        if (!checkin.connectorId) continue;

        // Already processing this station
        if (processingRef.current.has(station.id)) continue;

        const expiresAt =
          checkin.timestamp + (checkin.estimatedDuration + GRACE_MINUTES) * 60_000;

        if (now >= expiresAt) {
          processingRef.current.add(station.id);
          releaseConnector(station.id, checkin.connectorId, station.connectors)
            .catch(console.error)
            .finally(() => processingRef.current.delete(station.id));
        }
      }
    };

    // Check immediately on mount and when stations change
    checkExpired();

    const interval = setInterval(checkExpired, CHECK_INTERVAL);
    return () => clearInterval(interval);
  }, [stations]);
}
