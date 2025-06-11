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

export interface ServerMarker {
  id: string;
  title: string;
  coords: number[]; // assuming this is [lat, lon] or similar
  order: number;
}

export interface ServerRegionDisplayTitle {
  text: string;
  position: number[]; // assuming this is [lat, lon] or similar
  fontSize: number;
}

export interface ServerRegionInfo {
  id: string;
  title: string;
  displayTitle: ServerRegionDisplayTitle;
  color: string;
}

export interface HistoricalLineCardData {
  id: string;
  title: string;
  markerImage?: string;
  lineColor?: string;
  lineStyle?: string;
  markerLegend?: string;
  isActive: boolean;
  markers?: ServerMarker[];
  addedRegions?: ServerRegionInfo[];
  activeRegions?: ServerRegionInfo[];
  description?: string;
  videoLink?: string;
}

export interface HistoricalObject {
  id: string;
  order: number;
  title: string;
  image?: string;
  description: string;
  videoUrl: string;
  coords: number[];
} 