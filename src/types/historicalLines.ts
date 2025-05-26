export interface PointData {
  id?: string;
  name: string;
  coordinates: [number, number];
  type: 'city' | 'region';
  icon: string;
  description: string;
}

export interface HistoricalEventData {
  id?: string;
  date: string;
  description: string;
  points: string[];
  connections: [string, string][];
}

export interface HistoricalLineCardData {
  id: string;
  name: string;
  isActive: boolean;
  color?: string;
  style?: string;
  legend?: string;
  regions?: string[];
  points?: PointData[];
  historicalEvents?: HistoricalEventData[];
  description?: string;
  videoLink?: string;
  marker?: string;
} 