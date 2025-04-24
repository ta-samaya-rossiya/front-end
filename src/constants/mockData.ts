import { MapLayer } from '../types/map';

export const mockLayers: MapLayer[] = [
  {
    id: '1',
    name: 'Основной слой',
    type: 'indicators',
    country: {
      id: 'ru',
      name: 'Россия',
      bounds: [[41.2, 19.9], [81.9, -169.1]],
      regions: []
    },
    points: [
      {
        id: '1',
        name: 'Москва',
        coordinates: [55.7558, 37.6173],
        type: 'city',
        description: 'Столица России'
      },
      {
        id: '2',
        name: 'Санкт-Петербург',
        coordinates: [59.9343, 30.3351],
        type: 'city',
        description: 'Культурная столица'
      }
    ],
    regions: [
    ]
  }
]; 