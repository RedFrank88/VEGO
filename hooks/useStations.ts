import { useEffect } from "react";
import { useStationStore } from "../stores/stationStore";
import { subscribeToStations, seedStations } from "../services/stations";

export function useStations() {
  const { stations, setStations } = useStationStore();

  useEffect(() => {
    // Seed stations on first load
    seedStations().catch(console.error);

    const unsubscribe = subscribeToStations(
      (data) => setStations(data),
      (error) => console.error("Station subscription error:", error)
    );

    return unsubscribe;
  }, [setStations]);

  return stations;
}
