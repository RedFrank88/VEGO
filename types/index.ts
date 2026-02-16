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

export interface Connector {
  id: string;
  type: ConnectorType;
  power: number; // kW
  status: StationStatus;
}

export interface Station {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  status: StationStatus; // derived: available if any connector available
  connectors: Connector[];
  operator: string;
  lastCheckin?: CheckIn;
  isFavorite?: boolean;
  // Legacy fields for backwards compat
  connectorType?: ConnectorType;
  connectorCount?: number;
  power?: number;
}

export interface CheckIn {
  userId: string;
  userName: string;
  status: StationStatus;
  connectorId?: string;
  connectorLabel?: string;
  timestamp: number;
  estimatedDuration?: number; // minutes
}
