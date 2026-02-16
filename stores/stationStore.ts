import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Station } from "../types";

interface StationState {
  stations: Station[];
  selectedStation: Station | null;
  filterStatus: string | null;
  searchQuery: string;
  favoriteIds: string[];
  setStations: (stations: Station[]) => void;
  setSelectedStation: (station: Station | null) => void;
  setFilterStatus: (status: string | null) => void;
  setSearchQuery: (query: string) => void;
  toggleFavorite: (stationId: string) => void;
  getNearestStation: (lat: number, lng: number) => Station | null;
  getFilteredStations: () => Station[];
  getFavoriteStations: () => Station[];
}

export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const useStationStore = create<StationState>()(
  persist(
    (set, get) => ({
      stations: [],
      selectedStation: null,
      filterStatus: null,
      searchQuery: "",
      favoriteIds: [],
      setStations: (stations) => set({ stations }),
      setSelectedStation: (station) => set({ selectedStation: station }),
      setFilterStatus: (status) => set({ filterStatus: status }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      toggleFavorite: (stationId) => {
        const { favoriteIds } = get();
        if (favoriteIds.includes(stationId)) {
          set({ favoriteIds: favoriteIds.filter((id) => id !== stationId) });
        } else {
          set({ favoriteIds: [...favoriteIds, stationId] });
        }
      },
      getNearestStation: (lat, lng) => {
        const { stations } = get();
        const available = stations.filter((s) => s.status === "available");
        if (available.length === 0) return null;

        let nearest = available[0];
        let minDist = haversineDistance(lat, lng, nearest.latitude, nearest.longitude);

        for (let i = 1; i < available.length; i++) {
          const dist = haversineDistance(lat, lng, available[i].latitude, available[i].longitude);
          if (dist < minDist) {
            minDist = dist;
            nearest = available[i];
          }
        }
        return nearest;
      },
      getFilteredStations: () => {
        const { stations, filterStatus, searchQuery } = get();
        let filtered = stations;

        if (filterStatus) {
          filtered = filtered.filter((s) => {
            if (s.connectors && s.connectors.length > 0) {
              return s.connectors.some((c) => c.status === filterStatus);
            }
            return s.status === filterStatus;
          });
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          filtered = filtered.filter(
            (s) =>
              s.name.toLowerCase().includes(q) ||
              s.address.toLowerCase().includes(q)
          );
        }

        return filtered;
      },
      getFavoriteStations: () => {
        const { stations, favoriteIds } = get();
        return stations.filter((s) => favoriteIds.includes(s.id));
      },
    }),
    {
      name: "vego-station-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ favoriteIds: state.favoriteIds }),
    }
  )
);
