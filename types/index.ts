export interface User {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  ecoPoints: number;
  createdAt: number;
}

export type StationStatus = "available" | "occupied" | "broken";

export type ConnectorType = "Type2" | "CCS" | "CHAdeMO" | "Schuko";

export interface Station {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  status: StationStatus;
  connectorType: ConnectorType;
  connectorCount: number;
  power: number; // kW
  operator: string;
  lastCheckin?: CheckIn;
  isFavorite?: boolean;
}

export interface CheckIn {
  userId: string;
  userName: string;
  status: StationStatus;
  timestamp: number;
  estimatedDuration?: number; // minutes
}
