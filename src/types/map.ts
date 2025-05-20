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