export interface Point {
  id: string;
  name: string;
  coordinates: [number, number];
  type: 'city' | 'region';
  icon?: string;
  description?: string;
}

export interface Region {
  id: string;
  title: string;
  displayTitle: {
    text: string;
    position: [number, number];
    fontSize: number;
  };
  color: string;
  isActive: boolean;
  showIndicators: boolean;
  indicators: {
    coatOfArms: string;
    excursions: number;
    partners: number;
    participants: number;
    tourists: number;
    revenue: number;
  };
  border: [number, number][];
  description?: string;
}

export interface HistoricalEvent {
  id: string;
  date: string;
  points: Point[];
  description: string;
  connections: [string, string][]; // массив пар ID точек, которые нужно соединить
}

export interface Country {
  id: string;
  name: string;
  bounds: [[number, number], [number, number]]; // [[lat1, lng1], [lat2, lng2]]
  regions: Region[];
}

export interface MapLayer {
  id: string;
  name: string;
  type: 'indicators' | 'historical';
  country: Country;
  points: Point[];
  regions: Region[];
  historicalEvents?: HistoricalEvent[];
} 