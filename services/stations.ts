import {
  collection,
  doc,
  deleteDoc,
  getDocs,
  onSnapshot,
  setDoc,
  updateDoc,
  query,
  Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";
import { Station, CheckIn, StationStatus } from "../types";
import uteStations from "../data/ute-stations.json";

const STATIONS_COL = "stations";

export function subscribeToStations(
  onData: (stations: Station[]) => void,
  onError: (error: Error) => void
): Unsubscribe {
  const q = query(collection(db, STATIONS_COL));
  return onSnapshot(
    q,
    (snapshot) => {
      const stations = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Station[];
      onData(stations);
    },
    onError
  );
}

export async function getStations(): Promise<Station[]> {
  const snapshot = await getDocs(collection(db, STATIONS_COL));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Station[];
}

export async function updateStationStatus(
  stationId: string,
  status: StationStatus,
  checkIn: CheckIn
) {
  const ref = doc(db, STATIONS_COL, stationId);
  await updateDoc(ref, { status, lastCheckin: checkIn });
}

export async function seedStations() {
  const existing = await getDocs(collection(db, STATIONS_COL));
  const stations = uteStations as Station[];

  // Delete old stations that are no longer in the local data
  const localIds = new Set(stations.map((s) => s.id));
  for (const d of existing.docs) {
    if (!localIds.has(d.id)) {
      await deleteDoc(doc(db, STATIONS_COL, d.id));
    }
  }

  // Upsert all stations from local data (always sync coordinates/details)
  for (const station of stations) {
    await setDoc(doc(db, STATIONS_COL, station.id), station, { merge: true });
  }
}
